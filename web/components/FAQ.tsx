import { Plus } from "lucide-react";
import Link from "next/link";
import { Container, SectionHeader } from "@/components/ui";
import { faqs } from "@/lib/site";

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeader
            eyebrow="FAQ"
            title={
              <>
                Good <em>questions.</em>
              </>
            }
            sub={
              <>
                Something else on your mind?{" "}
                <Link href="/demo" className="text-ink underline decoration-brand underline-offset-4">
                  Book a call
                </Link>
                .
              </>
            }
          />
        </div>
        <div className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((f, i) => (
            <details key={f.q} className="group py-6" open={i === 0}>
              <summary className="flex cursor-pointer items-start justify-between gap-6 text-left text-xl font-medium">
                {f.q}
                <Plus size={22} className="faq-icon mt-1 shrink-0 text-brand transition-transform" aria-hidden />
              </summary>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
