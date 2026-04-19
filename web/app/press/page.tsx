import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function Press() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-serif text-3xl font-medium mb-4">Press Kit</h1>
          <p className="text-muted-foreground mb-6">
            Press kit coming soon. For media inquiries, email press@caregap.co.
          </p>
          {/* TODO(user): Add press kit assets (logo, screenshots, one-pager) when ready */}
        </div>
      </main>
      <Footer />
    </div>
  );
}
