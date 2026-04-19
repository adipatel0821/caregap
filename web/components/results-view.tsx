"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle, ChevronDown, ChevronUp, DollarSign, FileText,
  Scale, Shield, MapPin,
} from "lucide-react";
import type { PipelineResult, Anomaly, LegalMatch } from "@/lib/api";
import { LetterView } from "./letter-view";
import { RoadmapView } from "./roadmap-view";

interface ResultsViewProps {
  data: PipelineResult;
}

export function ResultsView({ data }: ResultsViewProps) {
  const { analysis, extract, legal_matches, summary } = data;
  if (!analysis || !extract) return null;

  return (
    <div className="space-y-8">
      {/* summary */}
      {summary && (
        <Card className="p-6 bg-[var(--color-warm-gray)] border-none">
          <p className="font-serif text-lg leading-relaxed text-foreground/90">
            {summary}
          </p>
        </Card>
      )}

      {/* savings hero */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6 text-center border-none bg-[var(--color-teal)] text-white">
          <DollarSign className="h-6 w-6 mx-auto mb-2 opacity-80" />
          <p className="font-serif text-3xl font-bold">
            ${analysis.estimated_savings.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm opacity-80 mt-1">estimated savings</p>
        </Card>
        <Card className="p-6 text-center">
          <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-[var(--color-amber)]" />
          <p className="font-serif text-3xl font-bold">
            {analysis.flagged_count}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            flagged charge{analysis.flagged_count !== 1 ? "s" : ""}
          </p>
        </Card>
        <Card className="p-6 text-center">
          <FileText className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
          <p className="font-serif text-3xl font-bold">
            ${analysis.total_charged.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground mt-1">total billed</p>
        </Card>
      </div>

      {/* tabs */}
      <Tabs defaultValue="charges" className="space-y-4">
        <TabsList className="bg-[var(--color-warm-gray)]">
          <TabsTrigger value="charges" className="gap-1.5">
            <Scale className="h-4 w-4" /> Charges
          </TabsTrigger>
          <TabsTrigger value="letter" className="gap-1.5">
            <FileText className="h-4 w-4" /> Letter
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-1.5">
            <MapPin className="h-4 w-4" /> Roadmap
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charges">
          <ChargesTable
            items={extract.line_items}
            anomalies={analysis.anomalies}
            legalMatches={legal_matches || {}}
          />
        </TabsContent>

        <TabsContent value="letter">
          <LetterView letter={data.letter} />
        </TabsContent>

        <TabsContent value="roadmap">
          <RoadmapView steps={data.roadmap} />
        </TabsContent>
      </Tabs>

      {/* warnings */}
      {data.warnings.length > 0 && (
        <Card className="p-4 border-[var(--color-amber)]/30 bg-[var(--color-amber)]/5">
          <p className="text-sm font-medium text-[var(--color-amber)]">
            Some steps had issues:
          </p>
          <ul className="text-sm text-muted-foreground mt-1 list-disc pl-5">
            {data.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

function ChargesTable({
  items,
  anomalies,
  legalMatches,
}: {
  items: PipelineResult["extract"] extends null ? never : NonNullable<PipelineResult["extract"]>["line_items"];
  anomalies: Anomaly[];
  legalMatches: Record<string, LegalMatch[]>;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const anomalyMap = new Map(anomalies.map((a) => [a.line_index, a]));

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Charged</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Medicare</TableHead>
            <TableHead className="text-right hidden sm:table-cell">Multiplier</TableHead>
            <TableHead className="w-[100px]">Flag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, i) => {
            const anomaly = anomalyMap.get(i);
            const isExpanded = expanded === i;
            const matchKey = `${i}:${item.code || "none"}`;
            const matches = legalMatches[matchKey] || [];

            return (
              <>
                <TableRow
                  key={i}
                  className={`cursor-pointer transition-colors ${
                    anomaly ? "bg-[var(--color-amber)]/5 hover:bg-[var(--color-amber)]/10" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : i)}
                >
                  <TableCell className="font-mono text-sm">
                    {item.code || "—"}
                  </TableCell>
                  <TableCell className="text-sm">{item.description}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    ${item.charged_amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                    {anomaly?.medicare_rate
                      ? `$${anomaly.medicare_rate.toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                    {anomaly?.multiplier ? `${anomaly.multiplier}x` : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {anomaly && (
                        <Badge
                          variant="outline"
                          className="text-xs border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10"
                        >
                          {anomaly.flag === "overcharge"
                            ? `${anomaly.multiplier}x`
                            : anomaly.flag}
                        </Badge>
                      )}
                      {anomaly && matches.length > 0 && (
                        isExpanded
                          ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                          : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && matches.length > 0 && (
                  <TableRow key={`${i}-legal`}>
                    <TableCell colSpan={6} className="bg-[var(--color-warm-gray)] p-4">
                      <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5" /> Legal Protections
                        </p>
                        {matches.map((m, j) => (
                          <div key={j} className="pl-5 border-l-2 border-[var(--color-teal)]/30">
                            <p className="text-sm font-medium">{m.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 italic">
                              &ldquo;{m.citation}&rdquo;
                            </p>
                            <p className="text-sm text-foreground/80 mt-1">
                              {m.why_it_applies}
                            </p>
                            <Badge
                              variant="outline"
                              className="mt-1 text-xs"
                            >
                              {m.confidence} confidence
                            </Badge>
                            {m.source_url && (
                              <a
                                href={m.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-xs text-[var(--color-teal)] underline"
                              >
                                web source
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
