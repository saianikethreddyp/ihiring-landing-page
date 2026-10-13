import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarCheck, MonitorPlay, Send, Star } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import { DemoForm } from "@/components/DemoForm";
import { StoryReveal } from "@/components/StoryReveal";
import { G2 } from "@/lib/pricing";
import "./contact.css";

export const metadata: Metadata = {
  title: "Contact & Book a Demo",
  alternates: { canonical: "/contact" },
  description: "Book a walkthrough of SAM or get in touch with the ihiring team.",
};

const next = [
  { icon: Send, title: "Send your details", body: "Tell us a little about your team." },
  { icon: CalendarCheck, title: "We get in touch", body: "We reach out to find a time that suits you." },
  { icon: MonitorPlay, title: "See SAM in action", body: "A walkthrough built around your hiring process." },
];

export default function ContactPage() {
  return (
    <div className="contact-page relative overflow-hidden">
      <div className="contact-glow" aria-hidden="true" />
      <Container className="relative py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <StoryReveal className="lg:col-span-5">
            <Eyebrow>Contact & demo</Eyebrow>
            <h1 className="display mt-5 text-balance text-5xl leading-[1.05] sm:text-6xl">Meet your next <em>interviewer.</em></h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">Book a walkthrough of SAM’s interview experience and reports. We’ll show you how it fits your hiring process.</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={G2.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-brand"
              >
                <Star size={16} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                Rated {G2.rating}/5 on G2<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <section className="contact-next" aria-labelledby="contact-next-title">
              <h2 id="contact-next-title">What happens next</h2>
              <ol className="contact-steps">
                {next.map(({ icon: Icon, title, body }, i) => (
                  <li key={title}>
                    <span className="contact-step-icon"><Icon size={18} aria-hidden="true" /></span>
                    <span className="contact-step-copy">
                      <small>Step {i + 1}</small>
                      <strong>{title}</strong>
                      <span>{body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <p className="mt-12 border-t border-ink/10 pt-6 text-[15px] leading-relaxed text-mute">
              Invited to an interview? Use the link in your invitation to schedule it.{" "}
              <Link href="/blog/candidate-interview-guide" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">Read the candidate guide <ArrowRight size={14} aria-hidden="true" /></Link>
            </p>
          </StoryReveal>

          <div className="lg:sticky lg:top-28 lg:col-span-7"><DemoForm /></div>
        </div>
      </Container>
    </div>
  );
}
