import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Article() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <article className="max-w-2xl mx-auto">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Learn
          </Link>

          <h1 className="font-serif text-3xl font-medium mb-2">
            How to read your hospital bill (and spot errors most people miss)
          </h1>
          <p className="text-sm text-muted-foreground mb-8">8 min read</p>

          <div className="prose-caregap space-y-6 text-foreground/90 leading-relaxed">
            <p>
              Hospital bills are confusing on purpose. That might sound cynical, but the billing system wasn&apos;t designed for patients. It was designed for insurers, government auditors, and billing departments. The codes, abbreviations, and formatting assume you already know what you&apos;re looking at. Most people don&apos;t.
            </p>

            <p>
              This guide breaks down what each part of your bill means, how to spot the most common errors, and what to do when something looks wrong.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              The summary bill vs. the itemized bill
            </h2>
            <p>
              Most hospitals send you a &ldquo;summary bill&rdquo; first. It shows a total amount, maybe a few line items, and a due date. This is not the document you need.
            </p>
            <p>
              What you want is the <strong>itemized bill</strong>. This lists every individual charge: every procedure, every medication, every supply. Federal law gives you the right to request an itemized bill at no charge. Call the billing department and say: &ldquo;I&apos;d like an itemized statement with CPT codes and individual charges for each service rendered.&rdquo; They must provide it within 30 days.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              What are CPT codes?
            </h2>
            <p>
              CPT stands for Current Procedural Terminology. Every medical procedure has a 5-digit code assigned by the American Medical Association. When your doctor sees you for a moderate-complexity office visit, the billing system records it as <span className="font-mono text-sm bg-muted px-1 rounded">99214</span>. A chest X-ray with two views is <span className="font-mono text-sm bg-muted px-1 rounded">71046</span>. A blood draw is <span className="font-mono text-sm bg-muted px-1 rounded">36415</span>.
            </p>
            <p>
              These codes are how the billing system tracks what was done. They&apos;re also how you can compare what you were charged to what Medicare pays for the same procedure. Medicare rates aren&apos;t secret. The Centers for Medicare and Medicaid Services publishes a fee schedule with prices for thousands of procedures, updated annually.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              The five most common billing errors
            </h2>

            <h3 className="font-medium mt-6 mb-2">1. Duplicate charges</h3>
            <p>
              The same procedure appears twice on the same date of service. This happens more often than you&apos;d expect, especially when a bill passes through multiple departments. Look for the same CPT code appearing on two or more lines for the same date.
            </p>

            <h3 className="font-medium mt-6 mb-2">2. Upcoding</h3>
            <p>
              Upcoding means billing for a more expensive version of the service you received. The most common example: your doctor sees you for a straightforward 15-minute checkup (CPT 99213, around $110 on average), but the bill shows a complex 40-minute visit (CPT 99215, around $250). If your visit was routine, that&apos;s upcoding.
            </p>

            <h3 className="font-medium mt-6 mb-2">3. Unbundling</h3>
            <p>
              Some procedures are supposed to be billed together as a single &ldquo;bundled&rdquo; code at a lower price. Unbundling means billing them separately to charge more. A common example: billing each lab test in a metabolic panel individually instead of using the panel code (CPT 80053), which costs less than the sum of the parts.
            </p>

            <h3 className="font-medium mt-6 mb-2">4. Phantom charges</h3>
            <p>
              Charges for services, supplies, or procedures you never received. Look for line items you don&apos;t recognize. If you were in the hospital for two days, check whether you were charged for three days of room and board. If you had one IV, check whether you were billed for two.
            </p>

            <h3 className="font-medium mt-6 mb-2">5. Pharmacy markups</h3>
            <p>
              Hospitals routinely mark up medications by 200 to 1,000 percent or more. A dose of acetaminophen (Tylenol) that costs $0.05 at a pharmacy might appear as $15 on a hospital bill. While markups on their own aren&apos;t &ldquo;errors,&rdquo; extreme markups on common drugs are worth flagging in a dispute.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              How to compare a charge to Medicare rates
            </h2>
            <p>
              Medicare publishes what it pays for every CPT code through the Physician Fee Schedule. This gives you a baseline for what the government considers a fair price. While hospitals aren&apos;t required to charge Medicare rates to uninsured patients, a charge that&apos;s 5x or 10x the Medicare rate is a strong starting point for a dispute.
            </p>
            <p>
              To look up a rate manually: find the CPT code on your itemized bill, then search the CMS Physician Fee Schedule at cms.gov. Compare the &ldquo;non-facility price&rdquo; (for clinic/office settings) or &ldquo;facility price&rdquo; (for hospitals) to what you were charged.
            </p>

            <Card className="p-5 mt-8 bg-[var(--color-warm-gray)] border-none">
              <p className="text-sm leading-relaxed">
                <strong>CareGap does this automatically.</strong> Upload your bill and we&apos;ll compare every line item against 18,000+ CMS fee schedule codes, flag the overcharges, and generate a dispute letter with the specific dollar amounts and legal citations you need.
              </p>
              <Link
                href="/"
                className="inline-block mt-3 text-sm text-[var(--color-teal)] hover:underline"
              >
                Analyze your bill now
              </Link>
            </Card>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
