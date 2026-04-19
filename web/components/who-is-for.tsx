import { Check, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";

export function WhoIsFor() {
  return (
    <section className="py-16 px-4 bg-[var(--color-warm-gray)]">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-serif text-2xl font-medium text-center mb-10">
          Is CareGap right for your situation?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-none bg-white">
            <h3 className="font-medium text-sm uppercase tracking-wide text-[var(--color-teal)] mb-4">
              CareGap is for you if:
            </h3>
            <ul className="space-y-3">
              {[
                "You\u2019re uninsured, underinsured, or paying a bill out of pocket",
                "You got a surprise ER or out-of-network charge",
                "Your hospital bill seems unusually high and you don\u2019t know why",
                "You were charged for services you don\u2019t remember receiving",
                "Your bill went to collections and you want to push back",
                "You qualify (or might qualify) for hospital charity care that wasn\u2019t offered",
                "You just want to understand what a fair price would be before paying",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                  <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 border-none bg-white">
            <h3 className="font-medium text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Not built for (yet):
            </h3>
            <ul className="space-y-3">
              {[
                "Active insurance appeals or EOB disputes",
                "Medicaid coverage denials",
                "Dental or vision-only bills",
                "Single charges under $50 where a dispute isn\u2019t worth your time",
                "Emergency medical legal situations (if you\u2019re being sued or garnished, please see a lawyer)",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                  <Minus className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-6">
          If you&apos;re not sure whether your situation fits, upload the bill anyway. Our analyzer will tell you what it found and flag if the scope is outside CareGap&apos;s current coverage.
        </p>
      </div>
    </section>
  );
}
