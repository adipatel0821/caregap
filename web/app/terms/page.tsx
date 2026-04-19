import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

{/* TODO(user): Replace this stub with real terms of service before
    any real user data collection goes into production. */}

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-medium mb-6">Terms of Service</h1>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Last updated:</strong> April 2026</p>
            <p>
              By using CareGap, you agree to the following terms.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">What CareGap is</h2>
            <p>
              CareGap is an educational consumer tool that analyzes medical bills and generates dispute letters. It is not a law firm, medical provider, insurance company, or financial advisor. The information provided is for educational purposes only and does not constitute legal, medical, or financial advice.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">What CareGap is not</h2>
            <p>
              We do not guarantee that any dispute will succeed. We do not file disputes on your behalf. We do not represent you in any legal proceeding. The dispute letters we generate are templates that you send yourself, at your own discretion.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Accuracy</h2>
            <p>
              We make reasonable efforts to ensure our CMS fee-schedule data and legal citations are current and accurate. However, medical billing is complex and state laws vary. You should verify any information before relying on it in a dispute.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Your responsibilities</h2>
            <p>
              You are responsible for the accuracy of the information you provide, including any bill images you upload. You are responsible for reviewing any generated dispute letter before sending it. You agree not to use CareGap for fraudulent purposes.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Limitation of liability</h2>
            <p>
              CareGap is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to the outcome of any billing dispute.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
