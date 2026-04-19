import { Nav } from "@/components/nav";
import { Card } from "@/components/ui/card";
import { Mail, GitBranch } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="font-serif text-3xl font-medium mb-4">Get in touch</h1>
          <p className="text-muted-foreground mb-8">
            Questions, feedback, or partnership inquiries? Reach out.
          </p>
          <div className="space-y-4">
            <Card className="p-5 flex items-center gap-4">
              <Mail className="h-5 w-5 text-[var(--color-teal)]" />
              <div className="text-left">
                <p className="font-medium text-sm">Email</p>
                <p className="text-sm text-muted-foreground">
                  adityapatel280104@gmail.com
                </p>
              </div>
            </Card>
            <Card className="p-5 flex items-center gap-4">
              <GitBranch className="h-5 w-5 text-[var(--color-teal)]" />
              <div className="text-left">
                <p className="font-medium text-sm">GitHub</p>
                <a
                  href="https://github.com/adipatel0821/caregap"
                  className="text-sm text-[var(--color-teal)] hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/adipatel0821/caregap
                </a>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
