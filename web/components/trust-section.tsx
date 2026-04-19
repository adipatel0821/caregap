"use client";

import { Card } from "@/components/ui/card";
import { Server, Clock, Eye, Brain } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

export function TrustSection() {
  const { ref, visible } = useInView();

  return (
    <section className="py-16 px-4 bg-[var(--color-warm-gray)]" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <h2
          className={`font-serif text-2xl font-medium text-center mb-2 ${
            visible ? "animate-fade-up" : "opacity-0"
          }`}
        >
          Your bill is sensitive. We treat it that way.
        </h2>
        <p
          className={`text-center text-muted-foreground mb-10 ${
            visible ? "animate-fade-up delay-100" : "opacity-0"
          }`}
        >
          Four plain-English answers before you upload.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Server,
              q: "Where does my file go?",
              a: "Your file is uploaded over TLS to our analysis server, processed in memory, and the extracted data is stored for your session only. We do not sync to third-party cloud storage, analytics platforms, or ad networks.",
            },
            {
              icon: Clock,
              q: "How long is it kept?",
              a: "We automatically delete uploaded files within 24 hours unless you create an account and save them. Extracted analysis data (line items, codes, flags) is kept only as long as you keep your account.",
            },
            {
              icon: Eye,
              q: "Do humans see it?",
              a: "No. Analysis is fully automated via AI vision and Claude. A human reviewer only sees your bill if you explicitly open a support ticket and attach it.",
            },
            {
              icon: Brain,
              q: "Do you train models on my data?",
              a: "No. We do not use your bills to train, fine-tune, or improve any AI model \u2014 ours or anyone else\u2019s.",
            },
          ].map((item, i) => (
            <Card
              key={i}
              className={`p-5 border-none bg-white card-hover ${
                visible ? "animate-fade-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <item.icon className="h-4 w-4 text-[var(--color-teal)] icon-hover" />
                <h3 className="font-medium text-sm">{item.q}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </Card>
          ))}
        </div>
        <p
          className={`text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto leading-relaxed ${
            visible ? "animate-fade-in delay-600" : "opacity-0"
          }`}
        >
          CareGap is not a covered entity under HIPAA. We operate under a HIPAA-conscious design standard \u2014 we treat your data with the same care a covered entity would, but you retain your own protected health information and are not a &ldquo;patient&rdquo; of ours in the clinical sense.
        </p>
      </div>
    </section>
  );
}
