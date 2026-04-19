import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, FileText } from "lucide-react";

export function SampleAnalysis() {
  return (
    <section id="sample" className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-2xl font-medium text-center mb-2">
          See a real analysis
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Here&apos;s what CareGap finds on a typical emergency room bill.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* left: sample bill */}
          <Card className="p-0 overflow-hidden border-border/80">
            <div className="bg-[var(--color-teal)] text-white px-6 py-4">
              <p className="font-serif font-medium text-lg">Riverside General Medical Center</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm opacity-80 mt-1">
                <span>Patient: J. Alvarez</span>
                <span>Account #RGM-4419</span>
                <span>Service date: Feb 14, 2026</span>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-sm text-muted-foreground">Balance due</span>
                <span className="font-serif text-2xl font-bold">$4,231.00</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60">
                    <th className="text-left py-2 font-medium text-muted-foreground">CPT</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { code: "99283", desc: "ER visit \u2014 moderate complexity", amount: "$812.00", flagged: false },
                    { code: "99284", desc: "ER visit \u2014 high complexity", amount: "$3,200.00", flagged: true },
                    { code: "71046", desc: "Chest X-ray, 2 views", amount: "$219.00", flagged: false },
                    { code: "36415", desc: "Routine venipuncture", amount: "$187.00", flagged: true },
                    { code: "J1885", desc: "Ketorolac 30mg IV", amount: "$13.00", flagged: false },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className={`border-b border-border/40 ${row.flagged ? "bg-[var(--color-amber)]/5" : ""}`}
                    >
                      <td className="py-2.5 font-mono text-xs">{row.code}</td>
                      <td className="py-2.5">
                        {row.desc}
                        {row.flagged && (
                          <AlertTriangle className="inline h-3.5 w-3.5 text-[var(--color-amber)] ml-1.5 -mt-0.5" />
                        )}
                      </td>
                      <td className="py-2.5 text-right font-mono">{row.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 pb-4">
              <p className="text-xs text-muted-foreground italic">
                Sample bill. Patient name and hospital redacted; CPT codes and amounts are representative.
              </p>
            </div>
          </Card>

          {/* right: analysis output */}
          <div className="space-y-4">
            {/* flagged charges */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[var(--color-amber)]" />
                <h3 className="font-medium text-sm">Charges we flagged</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm">
                      <span className="font-mono text-xs">CPT 99284</span>
                      {" \u2014 "}Billed <strong>$3,200.00</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">CMS benchmark $405.20</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10 shrink-0">
                    4.8x over
                  </Badge>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm">
                      <span className="font-mono text-xs">CPT 36415</span>
                      {" \u2014 "}Billed <strong>$187.00</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">CMS benchmark $8.76</p>
                  </div>
                  <Badge variant="outline" className="text-xs border-[var(--color-amber)] text-[var(--color-amber)] bg-[var(--color-amber)]/10 shrink-0">
                    21x over
                  </Badge>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total disputable</span>
                <span className="font-serif text-xl font-bold text-[var(--color-teal)]">$2,847.00</span>
              </div>
            </Card>

            {/* protection matched */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-[var(--color-teal)]" />
                <h3 className="font-medium text-sm">Protection matched</h3>
              </div>
              <Badge className="mb-2 bg-[var(--color-teal)]/10 text-[var(--color-teal)] border-[var(--color-teal)]/30" variant="outline">
                No Surprises Act
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Emergency services at an out-of-network facility. Patient is protected from balance billing beyond in-network cost-sharing under 42 U.S.C. &sect;300gg-111.
              </p>
            </Card>

            {/* letter excerpt */}
            <Card className="p-5 bg-[var(--color-warm-gray)] border-none">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-medium text-sm">Dispute letter excerpt</h3>
              </div>
              <blockquote className="font-serif text-sm leading-relaxed text-foreground/80 italic">
                &ldquo;I am writing to formally dispute charges on Account #RGM-4419. CPT code 99284 was billed at $3,200.00, compared to the CMS national benchmark of $405.20 &mdash; a markup of 4.8x. Under the No Surprises Act (42 U.S.C. &sect;300gg-111), I am entitled to protection from excessive out-of-network emergency charges...&rdquo;
              </blockquote>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
