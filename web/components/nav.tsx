"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`border-b sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-border/60 bg-white/90 backdrop-blur-md shadow-sm"
          : "border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="h-6 w-6 text-[var(--color-teal)] transition-transform duration-200 group-hover:scale-110" />
          <span className="font-serif text-xl font-medium tracking-tight">
            CareGap
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {[
            { href: "/learn", label: "Learn" },
            { href: "/faq", label: "FAQ" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
