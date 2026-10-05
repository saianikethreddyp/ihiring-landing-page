"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Video } from "lucide-react";
import clsx from "clsx";
import { Container, SectionHeader } from "@/components/ui";

/* ---------- mock product panels (all built in code, all sample data) ---------- */

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101117] shadow-2xl" aria-hidden>
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[11px] text-white/50">
        <span>{title}</span>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">sample data</span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

function ScreenPanel() {
  const rows = [
    { n: "Priya N.", s: 94, tag: "Invited" },
    { n: "Marcus L.", s: 91, tag: "Invited" },
    { n: "Aiko T.", s: 88, tag: "Invited" },
    { n: "Daniel R.", s: 76, tag: "Review" },
    { n: "Sofia M.", s: 71, tag: "Review" },
    { n: "Jonas K.", s: 54, tag: "Declined" },
  ];
  return (
    <Frame title="Senior Backend Engineer · ranked applicants">
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.n} className="flex items-center gap-4 rounded-xl bg-white/[0.04] px-4 py-3">
            <span className="w-4 font-mono text-xs text-white/35">{i + 1}</span>
            <span className="w-24 text-sm text-white">{r.n}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand to-[#6fa3ff]"
                initial={{ width: 0 }}
                animate={{ width: `${r.s}%` }}
                transition={{ duration: 0.8, delay: i * 0.06 }}
              />
            </div>
            <span className="w-8 text-right font-mono text-sm tabular-nums text-white/80">{r.s}</span>
            <span
              className={clsx(
                "w-16 rounded-full px-2 py-0.5 text-center text-[10px]",
                r.tag === "Invited" && "bg-emerald-400/15 text-emerald-300",
                r.tag === "Review" && "bg-amber-400/15 text-amber-200",
                r.tag === "Declined" && "bg-white/10 text-white/40",
              )}
            >
              {r.tag}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function SchedulePanel() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const slots = ["7:00", "9:30", "1:00", "4:30"];
  return (
    <Frame title="Sam's calendar · candidate view">
      <div className="grid grid-cols-5 gap-2">
        {days.map((d, di) => (
          <div key={d} className="space-y-2">
            <p className="text-center font-mono text-[11px] text-white/45">{d}</p>
            {slots.map((s, si) => {
              const picked = di === 1 && si === 0;
              const taken = (di + si) % 3 === 0 && !picked;
              return (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (di + si) * 0.04 }}
                  className={clsx(
                    "rounded-lg py-2.5 text-center font-mono text-xs",
                    picked && "bg-brand text-white shadow-[0_0_30px_rgba(14,93,252,0.6)]",
                    taken && "bg-white/[0.03] text-white/20 line-through",
                    !picked && !taken && "border border-white/10 text-white/70",
                  )}
                >
                  {s}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 rounded-xl bg-white/[0.04] px-4 py-3 text-xs text-white/65">
        <Check size={14} className="text-emerald-300" /> Priya moved her interview to Tue 7:00 am · 2:14 am
      </p>
    </Frame>
  );
}

function InterviewPanel() {
  const checks = ["Face matches ID", "Single screen in view", "No second voice detected", "No AI assistance detected"];
  return (
    <Frame title="Live interview · integrity monitor">
      <div className="grid gap-5 sm:grid-cols-[1.1fr_1fr]">
        <div className="space-y-2.5">
          <p className="rounded-2xl rounded-tl-md bg-white/[0.07] px-4 py-3 text-[13px] leading-relaxed text-white/85">
            You mentioned sharding. What would make you regret that decision a year later?
          </p>
          <p className="ml-6 rounded-2xl rounded-tr-md bg-brand px-4 py-3 text-[13px] leading-relaxed text-white">
            Cross-shard queries. I would keep the shard key aligned with how we read, and plan resharding early.
          </p>
          <p className="flex items-center gap-2 pl-1 font-mono text-[11px] text-white/45">
            <Video size={13} /> follow-up generated from her answer
          </p>
        </div>
        <ul className="space-y-2">
          {checks.map((c, i) => (
            <motion.li
              key={c}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 px-3.5 py-2.5 text-[13px] text-white/80"
            >
              <Check size={14} className="shrink-0 text-emerald-300" /> {c}
            </motion.li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

function ReportPanel() {
  const crit = [
    ["Technical depth", 84],
    ["Communication", 78],
    ["Problem solving", 81],
    ["Collaboration", 72],
  ] as const;
  return (
    <Frame title="Scorecard · Priya N.">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-white/45">Overall</p>
          <p className="display text-7xl leading-none text-white">87</p>
        </div>
        <p className="rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs text-emerald-300">Recommend: advance to final</p>
      </div>
      <div className="mt-6 space-y-3">
        {crit.map(([k, v], i) => (
          <div key={k}>
            <div className="mb-1 flex justify-between text-xs text-white/60">
              <span>{k}</span>
              <span className="font-mono tabular-nums">{v}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand to-[#6fa3ff]"
                initial={{ width: 0 }}
                animate={{ width: `${v}%` }}
                transition={{ duration: 0.8, delay: i * 0.08 }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2 text-xs">
        {["Watch key moment · 02:14", "Full transcript", "Synced to ATS"].map((t) => (
          <span key={t} className="rounded-full border border-white/10 px-3 py-1.5 text-white/70">
            {t}
          </span>
        ))}
      </div>
    </Frame>
  );
}

const chapters = [
  {
    id: "screen",
    label: "Screen",
    title: "Every applicant gets read.",
    body: "Sam analyses resumes with AI and ML, ranks every profile against the role and surfaces the best fits, from every source. No one is skipped because a recruiter ran out of day.",
    Panel: ScreenPanel,
  },
  {
    id: "schedule",
    label: "Schedule",
    title: "Booked by the candidate, any hour.",
    body: "Candidates schedule and reschedule themselves through Sam's smart calendar, evenings and weekends included. Your calendar stays yours.",
    Panel: SchedulePanel,
  },
  {
    id: "interview",
    label: "Interview",
    title: "A real conversation, kept honest.",
    body: "Live 1:1 video interviews with follow-up questions, anywhere in the world, many at once. Real-time monitoring keeps the playing field level.",
    Panel: InterviewPanel,
  },
  {
    id: "report",
    label: "Decide",
    title: "A scorecard you can act on.",
    body: "Detailed, unbiased reports after each stage: interview video, transcript and a performance summary, delivered into your ATS so decisions are quick and merit-based.",
    Panel: ReportPanel,
  },
];

export function Chapters() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const ActivePanel = chapters[active].Panel;

  return (
    <section id="product" className="relative bg-ink py-28 text-paper sm:py-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />
      <Container>
        <SectionHeader
          light
          eyebrow="Inside the product"
          title={
            <>
              Four jobs a recruiter does. <em>Done before breakfast.</em>
            </>
          }
          sub="Scroll through what Sam handles, from the first resume to the final scorecard."
        />

        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            {chapters.map((c, i) => (
              <article
                key={c.id}
                data-i={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex min-h-0 flex-col justify-center py-10 lg:min-h-[72vh]"
              >
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#6fa3ff]">
                  0{i + 1} · {c.label}
                </p>
                <h3
                  className={clsx(
                    "display mt-4 text-4xl leading-[1.05] transition-opacity duration-300 sm:text-5xl",
                    active === i ? "opacity-100" : "lg:opacity-35",
                  )}
                >
                  {c.title}
                </h3>
                <p
                  className={clsx(
                    "mt-5 max-w-md text-lg leading-relaxed text-white/65 transition-opacity duration-300",
                    active === i ? "opacity-100" : "lg:opacity-35",
                  )}
                >
                  {c.body}
                </p>
                <div className="mt-8 lg:hidden">
                  <c.Panel />
                </div>
              </article>
            ))}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? undefined : { opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                >
                  <ActivePanel />
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex justify-center gap-2" aria-hidden>
                {chapters.map((c, i) => (
                  <span
                    key={c.id}
                    className={clsx("h-1 rounded-full transition-all", i === active ? "w-8 bg-[#6fa3ff]" : "w-3 bg-white/20")}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
