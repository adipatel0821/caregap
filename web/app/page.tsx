"use client";

import { useState, useCallback } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { UploadCard } from "@/components/upload-card";
import { Analyzing } from "@/components/analyzing";
import { ResultsView } from "@/components/results-view";
import { SampleAnalysis } from "@/components/sample-analysis";
import { TrustSection } from "@/components/trust-section";
import { LegalProtections } from "@/components/legal-protections";
import { StatsBand } from "@/components/stats-band";
import { WhoIsFor } from "@/components/who-is-for";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Shield, ArrowRight, AlertCircle, Upload, Pencil,
  CheckCircle2, Scale, FileText,
} from "lucide-react";
import { runPipeline, type PipelineResult, type BillExtract } from "@/lib/api";

type AppState = "landing" | "analyzing" | "results" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("landing");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(async (file: File) => {
    setState("analyzing");
    setError(null);
    try {
      const data = await runPipeline(file);
      setResult(data);
      setState("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setState("error");
    }
  }, []);

  const handleDemoBill = useCallback(async () => {
    setState("analyzing");
    setError(null);
    try {
      const res = await fetch("/demo/bill_02.jpg");
      const blob = await res.blob();
      const file = new File([blob], "bill_02.jpg", { type: "image/jpeg" });
      const data = await runPipeline(file);
      setResult(data);
      setState("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo bill failed to load");
      setState("error");
    }
  }, []);

  const handleManualSubmit = useCallback(async (extract: BillExtract) => {
    setState("analyzing");
    setError(null);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const analyzeRes = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extract),
      });
      const analysis = await analyzeRes.json();

      const legalRes = await fetch(`${API_URL}/api/legal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ extract, anomalies: analysis.anomalies }),
      });
      const legal = await legalRes.json();

      const genRes = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extract,
          anomalies: analysis.anomalies,
          legal_matches: legal.matches,
        }),
      });
      const gen = await genRes.json();

      setResult({
        extract,
        analysis,
        legal_matches: legal.matches,
        letter: gen.letter,
        roadmap: gen.roadmap,
        summary: gen.summary,
        warnings: [],
        cached: false,
        elapsed_seconds: 0,
      });
      setState("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Manual analysis failed");
      setState("error");
    }
  }, []);

  const reset = () => {
    setState("landing");
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1">
        {state === "landing" && (
          <Landing
            onFile={handleFile}
            onDemo={handleDemoBill}
            onManual={handleManualSubmit}
          />
        )}
        {state === "analyzing" && (
          <div className="max-w-2xl mx-auto px-4 py-12">
            <Analyzing />
          </div>
        )}
        {state === "results" && result && (
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
              <div>
                <h1 className="font-serif text-2xl font-medium">Your Bill Analysis</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.extract?.provider_name || "Unknown provider"}
                  {result.extract?.date_of_service && ` \u2014 ${result.extract.date_of_service}`}
                  {result.cached && (
                    <span className="ml-2 text-xs text-[var(--color-teal)]">(demo)</span>
                  )}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                Analyze another bill
              </Button>
            </div>
            <ResultsView data={result} />
          </div>
        )}
        {state === "error" && (
          <div className="max-w-xl mx-auto px-4 py-16">
            <Card className="p-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
              <h2 className="font-serif text-xl font-medium mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={reset}>
                  Try again
                </Button>
                <Button
                  onClick={handleDemoBill}
                  className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
                >
                  Try the demo bill
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function Landing({
  onFile,
  onDemo,
  onManual,
}: {
  onFile: (f: File) => void;
  onDemo: () => void;
  onManual: (e: BillExtract) => void;
}) {
  return (
    <>
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight leading-tight animate-fade-up">
            Know what you <span className="text-gradient">really</span> owe
          </h1>
          <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed animate-fade-up delay-200">
            Upload a medical bill. CareGap compares every charge against Medicare rates,
            matches your legal protections, and writes a dispute letter for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8 animate-fade-up delay-400">
            <Button
              size="lg"
              className="bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90 gap-2 btn-glow"
              onClick={() =>
                document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Upload className="h-4 w-4" /> Upload a bill
            </Button>
            <Button variant="outline" size="lg" onClick={onDemo} className="gap-2 btn-glow">
              Try the demo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <SampleAnalysis />

      <TrustSection />

      <section id="how-it-works" className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-medium text-center mb-10">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Upload,
                title: "Upload your bill",
                desc: "Take a photo or upload a PDF of your medical bill. We read every line item.",
              },
              {
                icon: Scale,
                title: "Compare against fair rates",
                desc: "We check each charge against 18,000+ Medicare rates and flag anything suspicious.",
              },
              {
                icon: FileText,
                title: "Get your dispute letter",
                desc: "A ready-to-send letter with specific charges, legal citations, and next steps.",
              },
            ].map((step, i) => (
              <Card key={i} className="p-6 text-center border-none bg-[var(--color-warm-gray)] shadow-sm card-hover">
                <step.icon className="h-8 w-8 mx-auto mb-3 text-[var(--color-teal)] icon-hover" />
                <h3 className="font-serif font-medium text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <LegalProtections />

      <StatsBand />

      <WhoIsFor />

      <section id="upload-section" className="py-12 px-4">
        <div className="max-w-xl mx-auto space-y-4">
          <UploadCard onFile={onFile} />
          <div className="text-center">
            <ManualEntryDialog onSubmit={onManual} />
          </div>
        </div>
      </section>

      {/* TODO(user): Item 11 — Social proof / testimonials.
          Do NOT fabricate testimonials. Leave this commented out entirely
          until real quotes are collected. When ready, add 2-3 quotes with:
          first name + last initial + city + month/year + one specific outcome.
          Place between the FAQ and the footer. */}
    </>
  );
}

function ManualEntryDialog({ onSubmit }: { onSubmit: (e: BillExtract) => void }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("99215");
  const [desc, setDesc] = useState("Office visit - Level 5");
  const [amount, setAmount] = useState("316.00");
  const [provider, setProvider] = useState("");

  const handleSubmit = () => {
    onSubmit({
      provider_name: provider || null,
      provider_address: null,
      provider_npi: null,
      patient_name: null,
      date_of_service: null,
      account_number: null,
      insurance: null,
      total_charged: parseFloat(amount) || 0,
      line_items: [
        {
          code: code || null,
          code_type: "CPT",
          description: desc,
          units: 1,
          charged_amount: parseFloat(amount) || 0,
          place_of_service: "non_facility",
        },
      ],
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        <Pencil className="h-3 w-3" /> Can&apos;t upload? Enter manually
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Enter bill details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label className="text-sm font-medium">Provider name</label>
            <input
              className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g. Riverside Medical Associates"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">CPT code</label>
              <input
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm font-mono bg-white"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="99215"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Amount charged</label>
              <input
                className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm font-mono bg-white"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="316.00"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <input
              className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Office visit - Level 5"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
          >
            Analyze this charge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
