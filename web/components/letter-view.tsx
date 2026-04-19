"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import type { Letter } from "@/lib/api";

interface LetterViewProps {
  letter: Letter | null;
}

export function LetterView({ letter }: LetterViewProps) {
  if (!letter) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        Letter generation wasn&apos;t available for this bill.
      </Card>
    );
  }

  const handleCopy = async () => {
    const full = `${letter.recipient_block}\n\nSubject: ${letter.subject}\n\n${letter.body}`;
    await navigator.clipboard.writeText(full);
    toast.success("Letter copied to clipboard");
  };

  const handleDownload = () => {
    const full = `${letter.recipient_block}\n\nSubject: ${letter.subject}\n\n${letter.body}`;
    const blob = new Blob([full], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caregap-dispute-letter.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Letter downloaded");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
          <Copy className="h-4 w-4" /> Copy
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
          <Download className="h-4 w-4" /> Download
        </Button>
      </div>

      <Card className="p-8 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-4">
            Recipient
          </p>
          <p className="text-sm whitespace-pre-line mb-6 text-muted-foreground">
            {letter.recipient_block}
          </p>

          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Subject
          </p>
          <p className="font-serif text-lg font-medium mb-6">
            {letter.subject}
          </p>

          <div className="border-t border-border pt-6">
            <div className="letter-body text-sm text-foreground/90">
              {letter.body}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
