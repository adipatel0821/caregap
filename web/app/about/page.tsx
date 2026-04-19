import { Nav } from "@/components/nav";
import { Card } from "@/components/ui/card";
import { Shield, Brain, Scale, FileText } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-medium mb-4">About CareGap</h1>
          <p className="text-muted-foreground leading-relaxed mb-8">
            80% of medical bills contain errors. Americans carry over $210 billion in
            medical debt. CareGap exists because navigating a medical bill shouldn&apos;t
            require a law degree.
          </p>

          <div className="space-y-4 mb-10">
            {[
              {
                icon: Brain,
                title: "Gemini Vision OCR",
                desc: "Reads your bill image and extracts every CPT code, charge, and provider detail using Google's Gemini 2.0 Flash.",
              },
              {
                icon: Scale,
                title: "CMS Medicare Comparison",
                desc: "Compares each charge against 18,000+ procedure codes from the CMS Physician Fee Schedule to flag overcharges.",
              },
              {
                icon: Shield,
                title: "Legal Protection Matching",
                desc: "Matches your situation to federal and state protections like the No Surprises Act, using Claude for legal reasoning.",
              },
              {
                icon: FileText,
                title: "Dispute Letter Generation",
                desc: "Generates a specific, citation-backed dispute letter with real statute references and dollar amounts.",
              },
            ].map((item, i) => (
              <Card key={i} className="p-5 flex gap-4 items-start">
                <item.icon className="h-6 w-6 text-[var(--color-teal)] shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-serif font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>

          <p className="text-xs text-muted-foreground">
            Built at HackPrinceton Spring 2026. Powered by Gemini, Claude, and the CMS
            Physician Fee Schedule. Deployed on DigitalOcean and Vercel.
          </p>
        </div>
      </main>
    </div>
  );
}
