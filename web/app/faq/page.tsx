import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FAQ } from "@/components/faq";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1">
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
