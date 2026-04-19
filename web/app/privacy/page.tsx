import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

{/* TODO(user): Replace this stub with a real privacy policy before any
    real user data collection goes into production. */}

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-medium mb-6">Privacy Policy</h1>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p><strong>Last updated:</strong> April 2026</p>
            <p>
              CareGap (&ldquo;we,&rdquo; &ldquo;us&rdquo;) is committed to protecting your privacy. This policy describes what information we collect, how we use it, and your choices.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">What we collect</h2>
            <p>
              When you upload a medical bill, we process the image to extract billing codes, charges, and provider information. This data is used solely to generate your analysis and dispute letter. We do not collect your name, address, or insurance information unless you manually enter it.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">What we do not do</h2>
            <p>
              We do not sell your data. We do not share it with advertisers, data brokers, or any third party. We do not use your bills to train AI models. We do not track you across other websites.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Data retention</h2>
            <p>
              Uploaded files are deleted within 24 hours. Analysis results are stored temporarily for your session. We do not maintain a permanent database of patient bills.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Third-party services</h2>
            <p>
              We use Anthropic (Claude) for AI analysis. Your bill data is sent to these services for processing under their data processing agreements. We do not send identifiable patient information beyond what appears on the bill itself.
            </p>
            <h2 className="font-serif text-lg font-medium text-foreground mt-6">Contact</h2>
            <p>
              Questions about this policy? Email adityapatel280104@gmail.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
