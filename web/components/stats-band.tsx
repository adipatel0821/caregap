"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

function AnimatedNumber({ target, suffix = "" }: { target: string; suffix?: string }) {
  const { ref, visible } = useInView(0.3);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target.replace(/[^0-9]/g, ""));
    if (isNaN(num)) { setDisplay(target); return; }

    const duration = 1200;
    const steps = 40;
    const increment = num / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), num);

      if (target.startsWith("$")) {
        setDisplay(`$${current.toLocaleString()}B+`);
      } else if (target.startsWith("~$")) {
        setDisplay(`~$${current.toLocaleString()}`);
      } else if (target.startsWith("~")) {
        setDisplay(`~${current}M`);
      } else {
        setDisplay(`${current}%`);
      }

      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [visible, target]);

  return (
    <span ref={ref} className={visible ? "animate-scale-in" : "opacity-0"}>
      {display}{suffix}
    </span>
  );
}

export function StatsBand() {
  const { ref, visible } = useInView();

  return (
    <section className="py-16 px-4 bg-white section-glow" ref={ref}>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          {
            number: "80",
            display: "80%",
            text: "of U.S. medical bills contain at least one billing error.",
            source: "Medical Billing Advocates of America",
            url: "https://www.medicalbillingadvocates.com/",
          },
          {
            number: "220",
            display: "$220B+",
            text: "in medical debt is held by Americans.",
            source: "KFF, 2020 SIPP analysis",
            url: "https://www.kff.org/health-costs/issue-brief/the-burden-of-medical-debt-in-the-united-states/",
          },
          {
            number: "1300",
            display: "~$1,300",
            text: "average overcharge on hospital bills over $10,000.",
            source: "Medical billing industry analyses, 2024\u20132025",
            url: "https://www.medicalbillingadvocates.com/",
          },
          {
            number: "100",
            display: "~100M",
            text: "Americans have some form of healthcare debt.",
            source: 'KFF Health News "Diagnosis: Debt"',
            url: "https://kffhealthnews.org/diagnosis-debt/",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`${visible ? "animate-fade-up" : "opacity-0"} delay-${(i + 1) * 100}`}
          >
            <p className="font-serif text-3xl md:text-4xl font-bold text-gradient">
              <AnimatedNumber target={stat.display} />
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {stat.text}
            </p>
            <a
              href={stat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--color-teal)]/70 hover:text-[var(--color-teal)] mt-1 inline-block nav-link"
            >
              {stat.source}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
