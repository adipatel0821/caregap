"use client";

import { Card } from "@/components/ui/card";
import { Shield, Heart, Building2, Scale, MapPin, CreditCard } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function LegalProtections() {
  const { ref, visible } = useInView();

  return (
    <section className="py-16 px-4" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <h2
          className={`font-serif text-2xl font-medium text-center mb-2 ${
            visible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          Laws most patients don&apos;t know exist
        </h2>
        <p
          className={`text-center text-muted-foreground mb-10 ${
            visible ? "animate-fade-up delay-100" : "opacity-0"
          }`}
        >
          CareGap checks every bill against these protections automatically.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "No Surprises Act",
              text: "Protects you from \u2018balance billing\u2019 for emergency services and certain out-of-network services at in-network facilities. In effect since 2022.",
            },
            {
              icon: Heart,
              title: "501(r) Charity Care",
              text: "Nonprofit hospitals (most U.S. hospitals) are federally required to offer financial assistance to qualifying patients. Most won\u2019t tell you about it unless you ask.",
            },
            {
              icon: Building2,
              title: "Hospital Price Transparency Rule",
              text: "Hospitals must publish their standard charges and negotiated rates. If they don\u2019t, the bill you received may be unenforceable.",
            },
            {
              icon: Scale,
              title: "Fair Debt Collection Practices Act",
              text: "Limits what debt collectors can do when pursuing a medical debt, including banning harassment, false statements, and contacting your employer.",
            },
            {
              icon: MapPin,
              title: "State-specific programs",
              text: "Every state has additional protections. New Jersey\u2019s IHCAP, California\u2019s Hospital Fair Pricing Act, Maryland\u2019s all-payer rate system, and others create extra leverage.",
            },
            {
              icon: CreditCard,
              title: "Medical Debt Credit Reporting Rules",
              text: "Paid medical debts and medical debts under $500 generally can\u2019t appear on your credit report. If yours does, you can force its removal.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className={`p-5 border-none bg-[var(--color-warm-gray)] card-hover group ${
                visible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${200 + i * 80}ms` }}
            >
              <item.icon className="h-5 w-5 text-[var(--color-teal)] mb-3 transition-transform duration-200 group-hover:scale-110" />
              <h3 className="font-serif font-medium text-base mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
