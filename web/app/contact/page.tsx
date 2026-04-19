"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, GitBranch, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";

const TOPICS = [
  "I need help with a dispute",
  "I think I found a bug",
  "Media or press inquiry",
  "Partnership or integration",
  "Something else",
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 20) {
      toast.error("Message must be at least 20 characters.");
      return;
    }
    setSending(true);
    // mailto fallback since we don't have an email-sending backend
    {/* TODO(user): Replace with POST to /api/contact when email endpoint is ready */}
    const subject = encodeURIComponent(`[CareGap Contact] ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
    window.open(`mailto:adityapatel280104@gmail.com?subject=${subject}&body=${body}`, "_blank");
    toast.success("Opening your email client...");
    setSending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl font-medium mb-2">Get in touch</h1>
          <p className="text-muted-foreground mb-10">
            Questions, feedback, partnership inquiries. We actually read every message.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
                <input
                  required
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
                <input
                  required
                  type="email"
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Topic</label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Message <span className="text-destructive">*</span></label>
                <textarea
                  required
                  minLength={20}
                  rows={5}
                  className="w-full mt-1 px-3 py-2 border border-border rounded-md text-sm bg-white resize-y"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need..."
                />
              </div>
              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[var(--color-teal)] hover:bg-[var(--color-teal)]/90"
              >
                {sending ? "Sending..." : "Send message"}
              </Button>
            </form>

            {/* info cards */}
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="h-4 w-4 text-[var(--color-teal)]" />
                  <h3 className="font-medium text-sm">Direct lines</h3>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  {/* TODO(user): confirm which email addresses are real */}
                  <p>General: adityapatel280104@gmail.com</p>
                  <p>Press: press@caregap.co</p>
                  <p>Partnerships: partners@caregap.co</p>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-[var(--color-teal)]" />
                  <h3 className="font-medium text-sm">Response times</h3>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p>Support emails: within 1 business day</p>
                  <p>Urgent disputes: same day</p>
                  <p>Press inquiries: 24-48 hours</p>
                  <p>Partnerships: 2-3 business days</p>
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-[var(--color-teal)]" />
                  <h3 className="font-medium text-sm">Find us</h3>
                </div>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    <a href="https://github.com/adipatel0821/caregap" target="_blank" rel="noopener noreferrer" className="text-[var(--color-teal)] hover:underline">
                      github.com/adipatel0821/caregap
                    </a>
                  </p>
                  {/* TODO(user): confirm which social channels actually exist */}
                  <p>LinkedIn: /company/caregap</p>
                  <p>Instagram: @caregap.co</p>
                  <p>Princeton, NJ (remote-first)</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
