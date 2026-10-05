import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import { DemoForm } from "@/components/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "See Sam, the AI interviewer, run a live interview for a real role. Book a personalized ihiring.ai demo.",
};

const expect = [
  "Sam interviews live for a role like yours",
  "The report you would get: video, transcript, summary",
  "How it connects to your ATS and job boards",
];

export default function DemoPage() {
  return (
    <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
      <div>
        <Eyebrow>Book a demo</Eyebrow>
        <h1 className="display mt-5 text-balance text-6xl leading-[0.98] sm:text-7xl">
          See Sam <em>in action.</em>
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-mute">
          Schedule your personalized demo and discover how we can transform your hiring process.
        </p>
        <ul className="mt-8 space-y-4">
          {expect.map((e) => (
            <li key={e} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <Check size={13} strokeWidth={3} />
              </span>
              {e}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-2">
          {["Screening", "Scheduling", "Interviewing", "Analyzed reports", "ATS integration"].map((c) => (
            <span key={c} className="rounded-full border border-ink/10 bg-card px-3 py-1 font-mono text-[11px] text-mute">
              {c}
            </span>
          ))}
        </div>
      </div>
      <DemoForm />
    </Container>
  );
}
