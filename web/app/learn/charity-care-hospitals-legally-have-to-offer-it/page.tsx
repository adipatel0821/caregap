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
            Charity care: hospitals legally have to offer it, and most won&apos;t tell you
          </h1>
          <p className="text-sm text-muted-foreground mb-8">7 min read</p>

          <div className="prose-caregap space-y-6 text-foreground/90 leading-relaxed">
            <p>
              If you received a large hospital bill and you&apos;re uninsured or low-income, there&apos;s a federal law that most hospitals hope you never learn about. It&apos;s called Section 501(r) of the Internal Revenue Code, and it requires every nonprofit hospital in the United States to offer financial assistance to patients who can&apos;t afford their care.
            </p>

            <p>
              Most hospitals are nonprofit. According to the American Hospital Association, roughly 56% of all community hospitals in the U.S. have nonprofit status. That means the majority of hospitals you might visit are legally required to have a charity care program. And yet most patients never hear about it.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              What 501(r) requires
            </h2>
            <p>
              Under 501(r), nonprofit hospitals must:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Establish a written <strong>Financial Assistance Policy (FAP)</strong> that describes who qualifies, how to apply, and what discounts are available.</li>
              <li>Make the FAP <strong>widely available</strong> to the public. This means posting it on their website, providing it in the billing office, and including information about it on billing statements.</li>
              <li>Not engage in <strong>extraordinary collection actions</strong> (lawsuits, wage garnishment, credit reporting, selling debt to collectors) until they&apos;ve made reasonable efforts to determine whether the patient qualifies for assistance.</li>
              <li>Limit charges for eligible patients to <strong>no more than the amount generally billed</strong> to insured patients (the &ldquo;AGB&rdquo; limitation). In practice, this means charity care patients can&apos;t be charged more than what Medicare or private insurance would pay.</li>
            </ul>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              Who qualifies
            </h2>
            <p>
              Eligibility varies by hospital, but most charity care programs use the Federal Poverty Level (FPL) as a baseline. Common thresholds:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Under 200% FPL:</strong> Many hospitals offer 100% write-off (free care). For a single person in 2026, this is roughly $30,000/year or less.</li>
              <li><strong>200-400% FPL:</strong> Sliding scale discounts, often 40-80% off. For a single person, this means income between $30,000 and $60,000.</li>
              <li><strong>Over 400% FPL:</strong> Some hospitals still offer payment plans or partial discounts. It&apos;s always worth asking.</li>
            </ul>
            <p>
              Family size matters. A family of four at 200% FPL has a household income of roughly $62,000. Many middle-income families qualify for significant discounts without realizing it.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              Why hospitals don&apos;t advertise it
            </h2>
            <p>
              The law says hospitals must make their FAP &ldquo;widely available.&rdquo; In practice, this often means a PDF buried three clicks deep on their website and a small-print notice on the back of a billing statement. The information is technically available. It&apos;s just not designed to be found.
            </p>
            <p>
              The financial incentive is simple: every dollar written off through charity care is a dollar not collected. Even though nonprofit hospitals receive tax exemptions worth billions collectively, the business offices still operate with revenue targets. Nobody in the billing department is rewarded for telling patients they might qualify for free care.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              Real examples of discounts
            </h2>
            <p>
              Charity care discounts are not token gestures. They can be substantial:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>A $45,000 surgery bill reduced to $0 for a patient earning $28,000/year at a major academic medical center.</li>
              <li>A $12,000 ER bill reduced by 75% (to $3,000) for a family of three earning $55,000/year.</li>
              <li>A $8,000 radiology bill written off entirely after the hospital discovered the patient had been eligible all along but was never informed.</li>
            </ul>
            <p>
              These aren&apos;t hypotheticals. They happen every day at hospitals that comply with 501(r). The difference between getting a discount and not getting one is almost always whether the patient asked.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              How to apply: the four-step process
            </h2>
            <p>
              <strong>Step 1: Find the Financial Assistance Policy.</strong> Search the hospital&apos;s website for &ldquo;financial assistance,&rdquo; &ldquo;charity care,&rdquo; or &ldquo;FAP.&rdquo; If you can&apos;t find it, call the billing department and ask for a copy. They&apos;re required to provide one.
            </p>
            <p>
              <strong>Step 2: Check the income thresholds.</strong> The FAP will list the income levels and family sizes that qualify for different levels of assistance. Compare your household income to the FPL chart for your family size.
            </p>
            <p>
              <strong>Step 3: Complete the application.</strong> Most hospitals have a one-page or two-page application form. You&apos;ll typically need to provide proof of income (a recent pay stub, tax return, or a letter if you&apos;re unemployed). Some hospitals accept a self-attestation for patients with very low income.
            </p>
            <p>
              <strong>Step 4: Follow up.</strong> Don&apos;t assume the application is being processed. Call the billing department 7-10 days after submitting it. Ask for a confirmation number and the name of the person handling your case. If you haven&apos;t heard back in 30 days, call again and escalate to a supervisor.
            </p>

            <h2 className="font-serif text-xl font-medium mt-10 mb-3">
              A note on for-profit hospitals
            </h2>
            <p>
              For-profit hospitals are not subject to 501(r). They have no federal obligation to offer charity care. However, many states have their own requirements. California&apos;s Hospital Fair Pricing Act, New Jersey&apos;s IHCAP, and similar state programs extend financial assistance requirements to all hospitals, regardless of tax status. Check your state&apos;s rules, or use CareGap to see which protections apply to your bill automatically.
            </p>

            <Card className="p-5 mt-8 bg-[var(--color-warm-gray)] border-none">
              <p className="text-sm leading-relaxed">
                <strong>Not sure if your hospital is nonprofit?</strong> Upload your bill to CareGap. We identify the facility type and match your situation to applicable charity care programs and other protections automatically.
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
