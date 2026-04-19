"use client";

import Link from "next/link";
import { Shield } from "lucide-react";

export function Nav() {
  return (
    <nav className="border-b border-border/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="h-6 w-6 text-[var(--color-teal)]" />
          <span className="font-serif text-xl font-medium tracking-tight">
            CareGap
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground transition-colors">
            Learn
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
