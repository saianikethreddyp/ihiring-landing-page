import { Container, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import { integrations, roles } from "@/lib/site";

export function Integrations() {
  const groups = [
    { label: "Applicant tracking systems", items: integrations.filter((i) => i.kind === "ATS") },
    { label: "Job boards", items: integrations.filter((i) => i.kind === "Job board") },
  ];

  return (
    <section id="stack" className="py-20 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="Integrations"
            title={
              <>
                Plugs into the tools <em>you already run.</em>
              </>
            }
            sub="Designed to fit every need, for teams of any size. Sam works with any enterprise, staffing or recruitment model and ATS, and writes results straight back."
          />
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          {groups.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 0.08}>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">{g.label}</p>
              <ul className={`mt-4 grid gap-3 ${gi === 0 ? "sm:grid-cols-3" : "grid-cols-1"}`}>
                {g.items.map((it) => (
                  <li
                    key={it.name}
                    className="group flex items-center gap-3.5 rounded-2xl border border-ink/10 bg-card px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_12px_30px_-16px_rgba(14,93,252,0.5)]"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-white">
                      <Image
                        src={`/brands/${it.name.toLowerCase()}.${it.name === "Workday" ? "svg" : "png"}`}
                        alt=""
                        width={26}
                        height={26}
                        unoptimized
                        className="h-[26px] w-[26px] object-contain"
                      />
                    </span>
                    <span>
                      <span className="block font-semibold tracking-tight">{it.name}</span>
                      <span className="block font-mono text-[11px] text-mute">{it.kind}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 rounded-[28px] border border-ink/10 bg-card p-8 sm:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">Real roles, real interviews</p>
            <h3 className="display mt-4 max-w-2xl text-balance text-4xl leading-[1.05] sm:text-5xl">
              From entry-level analysts to <em>senior engineers.</em>
            </h3>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {roles.map((r) => (
                <li
                  key={r}
                  className="rounded-full border border-ink/10 bg-paper px-4 py-2 text-sm text-ink/80 transition-colors hover:border-brand/40 hover:text-brand"
                >
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-mute">Candidates interviewed by Sam, by role.</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
