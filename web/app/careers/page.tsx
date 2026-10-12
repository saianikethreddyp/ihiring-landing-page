import type { Metadata } from "next";
import { Container, Eyebrow } from "@/components/ui";
import { StoryReveal } from "@/components/StoryReveal";
import { Globe2, Users, Target, Sprout } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  alternates: { canonical: "/careers" },
  description: "Explore roles at ihiring and help build better interview experiences.",
};

const openRoles = [
  {
    title: "Senior AI / Multi-Modal ML Engineer",
    team: "Core SAM Intelligence",
    location: "Remote",
    type: "Full-time",
    description: "Architect low-latency conversational speech-to-speech agents, real-time reasoning loops, and adaptive question generation.",
  },
  {
    title: "Fullstack Streaming & Systems Engineer",
    team: "Platform Infrastructure",
    location: "Remote",
    type: "Full-time",
    description: "Scale high-concurrency WebRTC video sessions, global calendar synchronization, and enterprise ATS bi-directional pipelines.",
  },
  {
    title: "Senior Product Designer (Design Systems & Audio-Visual UX)",
    team: "Product & Experience",
    location: "Remote",
    type: "Full-time",
    description: "Design conversational, low-anxiety interview experiences for candidates and crisp, decision-ready analytics dashboards for hiring teams.",
  },
  {
    title: "Enterprise Solutions & Account Executive",
    team: "Growth & Partnerships",
    location: "Remote",
    type: "Full-time",
    description: "Partner with high-growth startup founders, technical recruiters, and staffing leaders looking to modernize their hiring pipeline.",
  },
];

const culture = [
  { icon: Users, title: "Candidate-first", body: "We start with the candidate’s experience, because a calm, fair interview makes better hiring for everyone." },
  { icon: Target, title: "Ownership", body: "Everyone owns a real problem from idea to result, and is trusted to make the call." },
  { icon: Sprout, title: "Keep learning", body: "We test ideas, learn from feedback and improve the details together." },
  { icon: Globe2, title: "Remote-first", body: "Our team works remotely, so we hire for talent and impact wherever you are." },
];

export default function CareersPage() {
  return (
    <Container className="py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Eyebrow>Careers at ihiring · Remote</Eyebrow>
        <h1 className="display mt-5 text-balance text-5xl leading-[1.05] sm:text-7xl">Build a better <em>first interview.</em></h1>
        <p className="mt-8 text-xl leading-relaxed text-ink/80">Help us build conversational AI that makes hiring easier for teams and candidates. We work across machine learning, engineering, product design, and customer partnerships.</p>
        <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft px-4 py-2 text-sm font-medium text-brand-ink">
          <Globe2 size={16} aria-hidden="true" /> We’re a remote team. Every role below is remote.
        </div>
        <div className="mt-16">
          <h2 className="display text-3xl sm:text-4xl">Our culture</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">How we work, and what you can expect when you join.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {culture.map(({ icon: Icon, title, body }) => (
              <StoryReveal key={title} className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand"><Icon size={20} aria-hidden="true" /></span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-base leading-relaxed text-mute">{body}</p>
              </StoryReveal>
            ))}
          </div>
        </div>
        <div className="mt-16">
          <h2 className="display text-3xl sm:text-4xl">Open roles</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">All positions are remote.</p>
          <div className="mt-6 space-y-4">
            {openRoles.map(role => (
              <StoryReveal key={role.title} className="rounded-3xl border border-ink/10 bg-card p-6 sm:p-7">
                <p className="text-xs font-medium text-brand">{role.team} · {role.type}</p>
                <h3 className="mt-2 text-xl font-semibold">{role.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-mute">{role.description}</p>
                <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex items-center gap-1.5 text-sm text-mute"><Globe2 size={14} aria-hidden="true" />{role.location}</span>
                  <a href={`mailto:careers@ihiring.ai?subject=${encodeURIComponent(`Application for ${role.title}`)}`} className="inline-flex min-h-11 shrink-0 items-center rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-ink">Apply by email &rarr;</a>
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
