import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Container, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { DEMO_HREF } from "@/lib/site";

const people = [
  {
    tag: "For founders",
    title: "No HR yet? Sam is your recruiter.",
    body: "Hiring lands on the founder when there is no talent team. Sam takes the screening and first-round interviews so you only meet people worth your time.",
    points: [
      "Keep shipping while Sam interviews. Read the scorecard over coffee.",
      "Screen thousands of applicants without a recruiter, so junior and early-career hiring becomes practical.",
      "Hold one bar for every candidate, so your first hires are not decided on gut feel.",
    ],
    tone: "bg-ink text-paper",
    sub: "text-white/65",
    dot: "bg-[#6fa3ff]",
  },
  {
    tag: "For HR teams",
    title: "Volume without losing consistency.",
    body: "Sam runs structured, concurrent interviews and writes each one up the same way, so your team spends its time on decisions and people, not logistics.",
    points: [
      "Syncs with Workday, Greenhouse, Lever, Ashby and Bullhorn. Nothing is double-entered.",
      "Concurrent live interviews with the same structured evaluation, every time.",
      "Video, transcript and a performance summary for every hiring manager, after every stage.",
    ],
    tone: "bg-card text-ink border border-ink/10",
    sub: "text-mute",
    dot: "bg-brand",
  },
];

export function Audience() {
  return (
    <section id="who" className="py-20 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Who it's for"
            title={
              <>
                Built for whoever is <em>doing the hiring.</em>
              </>
            }
          />
        </Reveal>
        <div className="mt-16 grid gap-5 lg:grid-cols-2">
          {people.map((p, i) => (
            <Reveal key={p.tag} delay={i * 0.1}>
              <article className={`flex h-full flex-col rounded-[28px] p-8 sm:p-11 ${p.tone}`}>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] opacity-60">{p.tag}</p>
                <h3 className="display mt-6 text-4xl leading-[1.05] sm:text-5xl">{p.title}</h3>
                <p className={`mt-5 text-lg leading-relaxed ${p.sub}`}>{p.body}</p>
                <ul className="mt-8 space-y-4">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-3 leading-relaxed">
                      <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.dot}`} aria-hidden />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={DEMO_HREF}
                  className="mt-10 inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5 text-sm font-medium"
                >
                  Book a demo <ArrowUpRight size={16} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
