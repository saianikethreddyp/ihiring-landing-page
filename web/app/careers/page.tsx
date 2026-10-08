import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { StoryReveal } from "@/components/StoryReveal";

export const metadata: Metadata = {
  title: "Careers",
  alternates: { canonical: "/careers" },
  description: "Explore roles at iHiring and help build better interview experiences.",
};

const openRoles = [
  {
    title: "Senior AI / Multi-Modal ML Engineer",
    team: "Core SAM Intelligence",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Architect low-latency conversational speech-to-speech agents, real-time reasoning loops, and adaptive question generation.",
  },
  {
    title: "Fullstack Streaming & Systems Engineer",
    team: "Platform Infrastructure",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Scale high-concurrency WebRTC video sessions, global calendar synchronization, and enterprise ATS bi-directional pipelines.",
  },
  {
    title: "Senior Product Designer (Design Systems & Audio-Visual UX)",
    team: "Product & Experience",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Design conversational, low-anxiety interview experiences for candidates and crisp, decision-ready analytics dashboards for hiring teams.",
  },
  {
    title: "Enterprise Solutions & Account Executive",
    team: "Growth & Partnerships",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    description: "Partner with high-growth startup founders, technical recruiters, and staffing leaders looking to modernize their hiring pipeline.",
  },
];

export default function CareersPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-3xl">
        <Eyebrow>Careers at iHiring</Eyebrow>
        <h1 className="display mt-5 text-balance text-5xl leading-[1.05] sm:text-7xl">Build a better <em>first interview.</em></h1>
        <p className="mt-8 text-xl leading-relaxed text-ink/80">Help us build conversational AI that makes hiring easier for teams and candidates. We work across machine learning, engineering, product design, and customer partnerships.</p>
        <StoryReveal className="mt-12 rounded-3xl border border-ink/10 bg-card p-7">
          <h2 className="display text-3xl">How we work</h2>
          <p className="mt-3 text-base leading-relaxed text-mute">Start with the candidate’s experience. Take ownership of the problem. Test ideas, learn from feedback, and improve the details together.</p>
        </StoryReveal>
        <div className="mt-14">
          <h2 className="display text-3xl sm:text-4xl">Explore roles</h2>
          <div className="mt-6 space-y-4">
            {openRoles.map(role => (
              <StoryReveal key={role.title} className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-7">
                <p className="text-xs font-medium text-brand">{role.team} · {role.type}</p>
                <h3 className="mt-2 text-xl font-semibold">{role.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-mute">{role.description}</p>
                <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-mute">{role.location}</span>
                  <a href={`mailto:careers@ihiring.ai?subject=${encodeURIComponent(`Application for ${role.title}`)}`} className="inline-flex min-h-11 shrink-0 items-center rounded-full bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink-2">Apply by email &rarr;</a>
                </div>
              </StoryReveal>
            ))}
          </div>
        </div>
        <p className="mt-8 text-base leading-relaxed text-mute">Have a different background? Send your portfolio or résumé to <a href="mailto:careers@ihiring.ai" className="text-brand underline underline-offset-2">careers@ihiring.ai</a>.</p>
      </article>
    </Container>
  );
}
