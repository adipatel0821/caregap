"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  {
    q: "Is CareGap free to use?",
    a: "Bill analysis is free. We may offer paid extras in the future (like certified-mail delivery of your dispute), but the core analysis and letter generation will always be free for patients.",
  },
  {
    q: "Do I need to give you my insurance information?",
    a: "No. CareGap is built for uninsured, underinsured, and self-pay bills. We don\u2019t need your insurance info to analyze a bill or generate a dispute letter.",
  },
  {
    q: "What if I already paid the bill?",
    a: "You may still be able to recover money. Hospitals routinely issue refunds when they\u2019re shown a documented overcharge. The dispute letter works the same way \u2014 you\u2019re just asking for a refund instead of a reduction.",
  },
  {
    q: "I only have the one-page summary, not the itemized bill. Can CareGap still help?",
    a: "Partially. We can still flag obvious issues, but a full analysis needs the itemized statement. Every hospital is required by federal law to provide one free of charge \u2014 we\u2019ll give you a short script to request it.",
  },
  {
    q: "What if my dispute fails?",
    a: "You\u2019ve lost nothing but time. Sending a dispute letter doesn\u2019t waive any of your other rights \u2014 you can still negotiate, apply for charity care, appeal, or pay the original bill if you choose.",
  },
  {
    q: "Can I use CareGap for an EOB (Explanation of Benefits) from my insurance?",
    a: "Not yet. CareGap is currently built for provider bills (hospital/clinic charges). EOB disputes involve insurance-specific logic we\u2019re planning to support in a future release.",
  },
  {
    q: "Does CareGap work for dental or vision bills?",
    a: "Partially. Our CMS fee-schedule comparison is calibrated for medical procedures. Dental and vision use different coding systems (CDT for dental). We\u2019ll flag obvious issues but accuracy is lower than for medical bills.",
  },
  {
    q: "Do I need a lawyer?",
    a: "No \u2014 and CareGap is not a law firm. The dispute letters we generate are consumer-written letters citing real statutes. You send them yourself. If you receive legal threats or a court summons from a hospital, that\u2019s when you should consult a lawyer.",
  },
  {
    q: "What states does CareGap support?",
    a: "All 50 U.S. states. Federal protections (No Surprises Act, 501(r), FDCPA) apply everywhere. State-specific protections are matched based on where the care was delivered.",
  },
  {
    q: "Is CareGap affiliated with my hospital or insurance?",
    a: "No. We\u2019re an independent consumer tool. We don\u2019t receive payments, referrals, or data from any hospital, insurer, or provider.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl font-medium text-center mb-10">
          Questions people actually ask
        </h2>
        <div className="space-y-2">
          {ITEMS.map((item, i) => (
            <div key={i} className="border border-border/60 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-warm-gray)]/50 transition-colors"
              >
                <span className="font-medium text-sm pr-4">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
