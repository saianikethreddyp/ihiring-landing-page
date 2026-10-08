import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import { DemoForm } from "@/components/DemoForm";
import { StoryReveal } from "@/components/StoryReveal";

export const metadata: Metadata = {
  title: "Contact & Book a Demo",
  alternates: { canonical: "/contact" },
  description: "Book a walkthrough of SAM or get in touch with the iHiring team.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <Eyebrow>Contact & demo</Eyebrow>
        <h1 className="display mt-4 max-w-3xl text-balance text-5xl leading-[1.05] sm:text-7xl">Meet your next <em>interviewer.</em></h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">Book a walkthrough of SAM’s interview experience and reports, or email us with a question.</p>
        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-start">
          <StoryReveal className="order-2 space-y-8 lg:order-1 lg:col-span-5">
            <div className="rounded-3xl border border-ink/10 bg-card p-7">
              <h2 className="text-xl font-semibold">Get in touch</h2>
              <div className="mt-6 space-y-6 text-base">
                <div className="flex items-start gap-3.5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  <div><p className="text-sm text-mute">General enquiries</p><a href="mailto:info@ihiring.ai" className="hover:text-brand">info@ihiring.ai</a></div>
                </div>
                <div className="flex items-start gap-3.5">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
                  <div><p className="text-sm text-mute">Mailing address</p><p className="mt-1 leading-relaxed">ihiring Inc.<br />2261 Market Street, #85525<br />San Francisco, CA 94114, USA</p></div>
                </div>
              </div>
            </div>
            <div className="px-2">
              <h2 className="text-lg font-semibold">Invited to an interview?</h2>
              <p className="mt-2 text-base leading-relaxed text-mute">Use the link in your invitation to schedule your interview. Our candidate guide explains how to prepare.</p>
              <Link href="/blog" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline">Read the candidate guide <ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </StoryReveal>
          <div className="order-1 lg:order-2 lg:col-span-7"><DemoForm /></div>
        </div>
      </div>
    </Container>
  );
}
