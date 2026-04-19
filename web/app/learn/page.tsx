import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    slug: "how-to-read-your-hospital-bill",
    title: "How to read your hospital bill (and spot errors most people miss)",
    description: "A plain-English guide to CPT codes, itemized bills, and the five most common billing errors.",
    readTime: "8 min read",
  },
  {
    slug: "charity-care-hospitals-legally-have-to-offer-it",
    title: "Charity care: hospitals legally have to offer it, and most won\u2019t tell you",
    description: "What 501(r) requires, who qualifies, and how to apply for financial assistance at nonprofit hospitals.",
    readTime: "7 min read",
  },
];

export default function Learn() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-serif text-3xl font-medium mb-2">Learn</h1>
          <p className="text-muted-foreground mb-10">
            Plain-English guides to a system that makes plain English hard to come by.
          </p>
          <div className="space-y-4">
            {ARTICLES.map((article) => (
              <Link key={article.slug} href={`/learn/${article.slug}`}>
                <Card className="p-6 hover:bg-[var(--color-warm-gray)] transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif font-medium text-lg group-hover:text-[var(--color-teal)] transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">{article.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">{article.readTime}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1 group-hover:text-[var(--color-teal)] transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
