"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RoadmapStep } from "@/lib/api";

interface RoadmapViewProps {
  steps: RoadmapStep[] | null;
}

const DOT_COLORS: Record<string, string> = {
  low: "bg-green-500",
  medium: "bg-[var(--color-amber)]",
  high: "bg-red-500",
};

export function RoadmapView({ steps }: RoadmapViewProps) {
  if (!steps || steps.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        No roadmap available for this bill.
      </Card>
    );
  }

  return (
    <div className="relative pl-6">
      {/* vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            {/* dot */}
            <div
              className={`absolute -left-6 top-1.5 w-[10px] h-[10px] rounded-full border-2 border-white ${
                DOT_COLORS[step.escalation] || DOT_COLORS.low
              }`}
            />

            <Card className="p-5 ml-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="font-serif font-medium text-base">{step.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{step.detail}</p>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 text-xs"
                >
                  {step.deadline}
                </Badge>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
