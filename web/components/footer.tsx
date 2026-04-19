import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-[var(--color-teal)]" />
              <span className="font-serif text-lg font-medium">CareGap</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Know what you really owe.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Built at HackPrinceton Spring &apos;26.
            </p>
          </div>

          {/* product */}
          <div>
            <h4 className="font-medium text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Analyze a bill</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="/#sample" className="hover:text-foreground transition-colors">Sample analysis</Link></li>
              <li><Link href="/learn" className="hover:text-foreground transition-colors">Learn</Link></li>
            </ul>
          </div>

          {/* company */}
          <div>
            <h4 className="font-medium text-sm mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/press" className="hover:text-foreground transition-colors">Press kit</Link></li>
            </ul>
          </div>

          {/* legal */}
          <div>
            <h4 className="font-medium text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of service</Link></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              CareGap is not a law firm, medical provider, or insurance company. Information is educational and does not constitute legal or medical advice.
            </p>
          </div>
        </div>

        <div className="border-t border-border/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 CareGap. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/adipatel0821/caregap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/caregap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com/caregap.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
