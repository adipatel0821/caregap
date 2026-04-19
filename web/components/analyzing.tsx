"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading your bill...",
  "Extracting procedure codes...",
  "Looking up Medicare rates...",
  "Checking your legal protections...",
  "Drafting your dispute letter...",
  "Almost there...",
];

export function Analyzing() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* orb */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[var(--color-teal)]/20 orb-ring" />
        <div className="absolute inset-0 rounded-full bg-[var(--color-teal)]/10 orb-ring-delayed" />
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-teal)] to-[var(--color-teal-light)] orb-pulse shadow-lg" />
      </div>

      {/* step text */}
      <div className="text-center">
        <p className="font-serif text-xl font-medium text-foreground transition-all duration-500">
          {STEPS[step]}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          This usually takes 15-30 seconds
        </p>
      </div>

      {/* step indicators */}
      <div className="flex gap-2">
        {STEPS.slice(0, 5).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= step
                ? "w-8 bg-[var(--color-teal)]"
                : "w-4 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
