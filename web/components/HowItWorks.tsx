"use client";

import { useEffect, useRef, useState, type CSSProperties, type ComponentType, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownUp, Check, MousePointer2, Pause, Play, ShieldCheck } from "lucide-react";
import { InitialAvatar, SamAvatar } from "@/components/Avatar";

/** Moves its children along one axis as the element crosses the viewport. Disabled by CSS for reduced motion. */
function Layer({ from, to, axis = "y", className = "", style, children }: { from: number; to: number; axis?: "x" | "y"; className?: string; style?: CSSProperties; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const v = useTransform(scrollYProgress, [0, 1], [from, to]);
  // The offset goes through a CSS variable so the stylesheet can scale it down on small screens.
  return <motion.div ref={ref} className={`px-layer ${className}`} style={{ ...style, [axis === "y" ? "--py" : "--px"]: v } as never}>{children}</motion.div>;
}

/**
 * One card in a chapter's stack. All cards drift the same way at different speeds (deeper = faster),
 * so they read as layered depth but never cross each other.
 */
function Frag({ children, depth = 0, delay = 0, side = "l", fit = false, className = "" }: { children: ReactNode; depth?: number; delay?: number; side?: "l" | "r"; fit?: boolean; className?: string }) {
  const travel = 10 + depth * 8;
  return (
    <Layer from={travel} to={-travel} className={`px-pos is-${side}${fit ? " is-fit" : ""}`}>
      <div className={`px-frag ${className}`} style={{ ["--d" as string]: `${delay}s` }}>{children}</div>
    </Layer>
  );
}

type ArtProps = { seen: boolean };

/** Counts up once when the chapter comes into view. Shows the final value straight away for reduced motion. */
function Count({ to, seen, ms = 1500 }: { to: number; seen: boolean; ms?: number }) {
  const [v, setV] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!seen || reduce) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, ms, reduce]);
  return <>{seen && reduce ? to : v}</>;
}

const candidates = [
  { id: "alex", initials: "MC", name: "Michael C.", skills: "Node.js · PostgreSQL", fit: "Lower match", w: 46 },
  { id: "arjun", initials: "JB", name: "Jessica B.", skills: "Java · Microservices", fit: "Possible match", w: 68 },
  { id: "priya", initials: "ET", name: "Ethan T.", skills: "Python · Cloud APIs", fit: "Strong match", w: 94, top: true },

];

function ScreenArt({ seen }: ArtProps) {
  const reduce = useReducedMotion();
  const [timed, setTimed] = useState(false);
  useEffect(() => {
    if (!seen || reduce) return;
    const t = setTimeout(() => setTimed(true), 2300);
    return () => clearTimeout(t);
  }, [seen, reduce]);
  const sorted = timed || (seen && !!reduce);
  const rows = sorted ? [...candidates].reverse() : candidates;
  return (
    <>
      <Frag depth={0} side="l" className="px-card px-funnel">
        <span className="px-label">Sr. Backend Engineer</span>
        <div className="px-funnel-row">
          <span><b><Count to={120} seen={seen} /></b><small>applications received</small></span>
          <span className="px-funnel-arrow" aria-hidden="true">→</span>
          <span><b className="is-blue"><Count to={8} seen={seen} ms={2200} /></b><small>ready to interview</small></span>
        </div>
      </Frag>
      <Frag depth={1} delay={0.14} side="r" className="px-card px-rank">
        <div className="px-rank-head"><ArrowDownUp size={14} aria-hidden="true" /><span>{sorted ? "Best match first" : "In the order received"}</span></div>
        <div className="px-ranklist">
          {rows.map(c => (
            <motion.div key={c.id} layout transition={{ type: "spring", stiffness: 230, damping: 30 }} className={`px-rankrow${sorted && c.top ? " is-top" : ""}`}>
              <InitialAvatar initials={c.initials} />
              <span className="px-rank-id"><strong>{c.name}</strong><small>{c.skills}</small></span>
              <span className="px-rank-fit">
                <em className={`px-pill${sorted && c.top ? " is-ready" : ""}`}>{sorted ? (c.top ? <><Check size={13} aria-hidden="true" />Ready to interview</> : c.fit) : "Resume received"}</em>
                <span className="px-bar" aria-hidden="true"><i style={{ ["--w" as string]: `${c.w}%` }} data-on={sorted} /></span>
              </span>
            </motion.div>
          ))}
        </div>
      </Frag>
      <Frag depth={2} delay={0.3} side="l" fit className="px-chip">Sorted automatically</Frag>
    </>
  );
}

const slotTimes = [
  { t: "09:30 AM", taken: false }, { t: "11:00 AM", taken: true }, { t: "01:00 PM", taken: true },
  { t: "02:00 PM", chosen: true }, { t: "04:00 PM", taken: false }, { t: "06:30 PM", taken: false },
];

function ScheduleArt() {
  return (
    <>
      <Frag depth={0} side="l" className="px-card px-sched">
        <div className="px-sched-head"><strong>Interview scheduler</strong><small>Backend engineer · Candidate view</small></div>
        <div className="px-days">
          {["MON", "TUE", "WED", "THU", "FRI"].map((d, i) => (
            <span key={d} className={i === 2 ? "is-chosen" : ""} style={{ ["--i" as string]: i }}><small>{d}</small><b>{12 + i}</b></span>
          ))}
        </div>
        <div className="px-slotgrid">
          {slotTimes.map((s, i) => (
            <span key={s.t} className={`${s.chosen ? "is-chosen " : ""}${s.taken ? "is-taken" : ""}`} style={{ ["--i" as string]: i }}>{s.t}{s.chosen && <Check size={13} aria-hidden="true" />}</span>
          ))}
          <span className="px-cursor" aria-hidden="true"><MousePointer2 size={22} fill="#1b2f4d" strokeWidth={1.4} /><i /></span>
        </div>
      </Frag>
      <Frag depth={1} delay={0.1} side="r" className="px-card px-booked">
        <span className="px-booked-icon"><Check size={16} aria-hidden="true" /></span>
        <span><strong>Interview booked</strong><small>Ethan T. · Wed 14 · 2:00 PM</small></span>
      </Frag>
      <Frag depth={2} delay={0.2} side="l" fit className="px-chiprow"><span className="px-chip">No email back-and-forth</span><span className="px-chip is-soft">Reschedule any time, 24/7</span></Frag>
    </>
  );
}

function InterviewArt() {
  return (
    <>
      <Frag depth={0} side="l" className="px-card px-head">
        <SamAvatar /><span><strong> Video Interview with SAM</strong><small>Backend engineer · Live transcript</small></span>
        <em className="px-live"><i aria-hidden="true" />Live<span className="px-wave" aria-hidden="true">{[0, 1, 2, 3, 4].map(n => <b key={n} style={{ animationDelay: `${n * 0.12}s` }} />)}</span></em>
      </Frag>
      <Frag depth={1} delay={0.12} side="l" className="px-card px-bubble px-sam">
        <span className="px-label">SAM</span><p>Your order API started timing out under peak load. How did you find the bottleneck, and what did you change?</p>
      </Frag>
      <Frag depth={2} delay={0.26} side="r" className="px-card px-bubble px-cand">
        <span className="px-label">Ethan</span><p>Traces showed slow synchronous PDF and email work blocking requests. I moved it to Celery workers on Redis, added idempotency keys and cut p95 latency from 1.8s to 320ms.</p>
      </Frag>
      <Frag depth={3} delay={0.4} side="l" className="px-card px-bubble px-sam">
        <span className="px-label">SAM</span><p>Queues add eventual consistency. How did you handle retries, duplicate jobs and failures?</p>
      </Frag>
    </>
  );
}

function ReportArt() {
  return (
    <>
      <Frag depth={0} side="l" className="px-card px-reporthead">
        <InitialAvatar initials="ET" /><span><strong>Ethan T.</strong><small>Backend engineer</small></span>
        <span className="px-chips">{["Video", "Transcript", "Summary","Recommendation"].map(c => <em key={c} className="px-pill is-ready"><Check size={12} aria-hidden="true" />{c}</em>)}</span>
      </Frag>
      <Frag depth={1} delay={0.14} side="r" className="px-card px-summary">
        <span className="px-label">INTERVIEW SUMMARY</span><p>Moved slow synchronous work to Celery and Redis workers, with idempotency keys. Reported p95 latency falling from 1.8s to 320ms.</p>
      </Frag>
      <Frag depth={2} delay={0.28} side="l" className="px-card px-finding">
        <span className="px-label">FOR THE NEXT CONVERSATION</span><strong>Probe retry and dead-letter handling</strong>
      </Frag>
      <Frag depth={3} delay={0.42} side="r" fit className="px-chip is-green"><Check size={14} aria-hidden="true" /> Synced to your ATS</Frag>
    </>
  );
}

const chapters: { ghost: string; title: string; body: string; detail: string; outcomes: string[]; Art: ComponentType<ArtProps> }[] = [
  { ghost: "Screen", title: "SAM Analyses every Application.", body: "Resumes are Analysed and ranked against the role itself, not just keyword matches, so your team starts with the strongest candidates.", detail: "Resume screening", outcomes: ["Ranked against your job criteria", "Your team reviews a shortlist, not an inbox"], Art: ScreenArt },
  { ghost: "Schedule", title: "Candidates book their own time.", body: "They schedule and reschedule with SAM, at any hour of the day, and receive notifications by email and phone.", detail: "24/7 scheduling", outcomes: ["Candidates self-book and reschedule, any hour", "No email back-and-forth for your recruiters"], Art: ScheduleArt },
  { ghost: "Interview", title: "SAM runs the first interview.", body: "A live one-to-one video conversation, with follow-up questions based on each answer.", detail: "AI interviews", outcomes: ["The same structured conversation for every candidate", "Interviews run in parallel, so volume does not queue"], Art: InterviewArt },
  { ghost: "Report", title: "You get the report.", body: "Video, recommendation, transcript and summary in one place. Your team decides who moves forward.", detail: "Your team decides", outcomes: ["Video, recommendation, transcript and summary in one place", "Your team makes the call on who moves forward"], Art: ReportArt },
];

function Chapter({ index, flip, ghost, title, body, detail, outcomes, Art }: (typeof chapters)[number] & { index: number; flip: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  // Three signals: the chapter reached (lights the marker), the preview itself on screen (starts its animation),
  // and the chapter currently on screen (ambient motion only runs while it is).
  const seen = useInView(ref, { amount: 0.35, once: true });
  const vis = useInView(visualRef, { amount: 0.3, once: true });
  const live = useInView(ref);
  return (
    <div ref={ref} className={`px-chapter${flip ? " is-flip" : ""}`} data-in={seen} data-vis={vis} data-live={live}>
      <span className="px-node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      <div className="px-text">
        <Layer axis="x" from={0} to={flip ? -24 : 24} className="px-ghost-wrap"><span className="px-ghost" aria-hidden="true" data-word={ghost} /></Layer>
        <span className="px-chapno">Step {index + 1} of {chapters.length}</span>
        <h3>{title}</h3>
        <p>{body}</p>
        <span className="px-detail"><ShieldCheck size={15} aria-hidden="true" />{detail}</span>
        <div className="px-outcomes"><span>What your team gets</span><ul>{outcomes.map(o => <li key={o}><Check size={15} aria-hidden="true" />{o}</li>)}</ul></div>
      </div>
      <div ref={visualRef} className="px-visual" role="img" aria-label={`Illustrative preview: ${title}`}><div aria-hidden="true" className="px-art"><Art seen={vis} /></div></div>
    </div>
  );
}

export function HowItWorks() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { scrollYProgress } = useScroll({ target: root, offset: ["start 0.6", "end 0.6"] });
  return (
    <div ref={root} className="px" data-paused={paused}>
      <div className="px-controls">
        <button type="button" className="px-pause" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
          {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          {paused ? "Play idle motion" : "Pause idle motion"}
        </button>
      </div>
      <div className="px-spine" aria-hidden="true"><span className="px-spine-track" /><motion.span className="px-spine-fill" style={{ scaleY: scrollYProgress }} /></div>
      {chapters.map((c, i) => <Chapter key={c.ghost} index={i} flip={i % 2 === 1} {...c} />)}
    </div>
  );
}
