import { Container, Eyebrow } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { traction } from "@/lib/site";

const pillars = [
  {
    k: "Why now",
    t: "AI can finally hold a real conversation.",
    b: "Interviews were the one step in hiring that could not scale: they need a live, thinking counterpart. That has changed, and candidates say it feels natural.",
  },
  {
    k: "Why it wins",
    t: "Same rubric, every candidate.",
    b: "Structured questions, unbiased scorecards with video and transcript, and native ATS sync. It fits the process companies already run instead of replacing it.",
  },
  {
    k: "What it unlocks",
    t: "Interviews for everyone who applies.",
    b: "Early-career and high-volume hiring was too costly to screen properly. When an interview costs minutes instead of hours, nobody gets filtered out by a resume alone.",
  },
];

export function Thesis() {
  return (
    <section id="why" className="py-20 sm:py-32">
      <Container>
        <Reveal>
          <Eyebrow>The thesis</Eyebrow>
          <p className="display mt-6 max-w-5xl text-balance text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            The interview was the last step in hiring that couldn&apos;t scale.{" "}
            <em>Now it can.</em>
          </p>
        </Reveal>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.k} delay={i * 0.08} className="bg-card">
              <div className="h-full p-8 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{p.k}</p>
                <h3 className="display mt-5 text-3xl leading-[1.1] sm:text-4xl">{p.t}</h3>
                <p className="mt-4 leading-relaxed text-mute">{p.b}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {traction.length > 0 && (
          <div className="mt-16">
            <Eyebrow>By the numbers</Eyebrow>
            <dl className="mt-6 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {traction.map((t) => (
                <div key={t.label} className="border-t border-ink/15 pt-5">
                  <dt className="display text-6xl leading-none">{t.value}</dt>
                  <dd className="mt-3 text-sm text-mute">
                    {t.label}
                    {t.note && <span className="block font-mono text-[11px] opacity-70">{t.note}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>
    </section>
  );
}
