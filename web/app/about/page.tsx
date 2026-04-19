import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Brain, Scale, Shield, FileText } from "lucide-react";

const TEAM = [
  {
    name: "Saket",
    initials: "S",
    gradient: "from-[var(--color-teal)] to-[var(--color-teal-light)]",
    role: "Data analytics & project optimization",
    bio: "Keeps us honest about what the numbers actually say. Built the CMS fee-schedule matcher and the pricing-anomaly logic.",
  },
  {
    name: "Jeel",
    initials: "J",
    gradient: "from-[var(--color-amber)] to-[var(--color-amber-light)]",
    role: "Frontend & user experience",
    bio: "Obsesses over how things feel. Rewrites flows until the next click is obvious.",
  },
  {
    name: "Aditya",
    initials: "A",
    gradient: "from-[var(--color-teal-light)] to-[var(--color-teal)]",
    role: "Backend & AI systems",
    bio: "Does the technical heavy lifting. OCR pipeline, document parsing, legal-protection matching, dispute reasoning.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          {/* founder story */}
          <h1 className="font-serif text-3xl font-medium mb-6">Why we built this</h1>

          {/* TODO(user): Replace this placeholder with the real founder story.
              Guidelines:
              - Two short paragraphs, first person ("I" or "we")
              - Be specific: name the bill amount, the procedure, the hospital type
              - No "disrupting healthcare" language. No "passionate about."
              - Para 1: the trigger moment (a specific bill, a specific person)
              - Para 2: what happened next, the realization, the decision to build
              Ask Saket, Jeel, or Aditya for their real moment. */}
          <div className="space-y-4 mb-12">
            <p className="text-muted-foreground leading-relaxed">
              The first version of CareGap was a weekend hack born from a simple observation: someone in our lives got a bill that didn&apos;t make sense, and no matter how many times we called the hospital, nobody would explain why a routine procedure cost 20x the Medicare rate.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We realized the billing office wasn&apos;t confused. They knew exactly what they were doing. They were just counting on us not to know the rules. So we built the tool we wished we&apos;d had that week.
            </p>
          </div>

          {/* team */}
          <h2 className="font-serif text-2xl font-medium mb-6">Built by</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {TEAM.map((member) => (
              <Card key={member.name} className="p-5 text-center border-none bg-[var(--color-warm-gray)]">
                {/* TODO(user): Replace gradient-initial avatar with real photos when ready */}
                <div
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center mx-auto mb-3`}
                >
                  <span className="text-white font-serif text-xl font-medium">
                    {member.initials}
                  </span>
                </div>
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-xs text-[var(--color-teal)] mt-0.5">{member.role}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mb-12">
            Built at HackPrinceton Spring &apos;26.
          </p>

          {/* tech stack */}
          <h2 className="font-serif text-2xl font-medium mb-6">How it works under the hood</h2>
          <div className="space-y-4 mb-10">
            {[
              {
                icon: Brain,
                title: "AI Vision OCR",
                desc: "Reads your bill image and extracts every CPT code, charge, and provider detail using Claude\u2019s vision capabilities.",
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
