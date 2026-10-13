"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup, MotionConfig, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, CalendarDays, Check, FileText, MessageCircle, NotebookPen, RefreshCw, UserCheck, Users } from "lucide-react";
import { SamAvatar } from "@/components/Avatar";

const tasks = [
  { icon: FileText, title: "Analyses every resume", before: "Application by application, in the order they arrive", after: "Screened and ranked against the role" },
  { icon: CalendarDays, title: "Chasing calendars", before: "Emails back and forth to find a time", after: "Candidates book and reschedule themselves, any hour" },
  { icon: MessageCircle, title: "First-round calls", before: "One recruiter, one call at a time", after: "Interviews run in parallel, with follow-up questions" },
  { icon: NotebookPen, title: "Writing up notes", before: "Notes typed up after each call", after: "A report with video,recommendation, transcript and summary" },
  { icon: RefreshCw, title: "Updating your ATS", before: "Copying results from tool to tool", after: "Results sync to Workday, Greenhouse, Lever, Ashby, Bullhorn" },
];
const N = tasks.length;
type Mode = "auto" | "without" | "with";
const spring = { type: "spring", stiffness: 260, damping: 30 } as const;

function TaskCard({ i, inSam }: { i: number; inSam: boolean }) {
  const t = tasks[i];
  const Icon = t.icon;
  return (
    <motion.li layout="position" layoutId={`hx-${i}`} transition={spring} className={`hx-card${inSam ? " is-sam" : ""}`}>
      <span className="hx-tile"><Icon size={18} aria-hidden="true" />{inSam && <span className="hx-check" aria-hidden="true"><Check size={10} strokeWidth={3.2} /></span>}</span>
      <span className="hx-copy">
        <strong>{t.title}</strong>
        <small key={inSam ? "a" : "b"} className="hx-desc">{inSam ? t.after : t.before}</small>
      </span>
    </motion.li>
  );
}

/**
 * Two lanes. As the board scrolls through the viewport, task cards move from "Your team" into "SAM".
 * The segmented control overrides scrolling, so either state can be seen without scrolling.
 */
export function TaskHandoff() {
  const board = useRef<HTMLDivElement>(null);
  const lanes = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Keep the board at its tallest height so the page never jumps while cards move between lanes.
  // It starts with every task in "Your team" (the tallest state), and re-measures only when the width changes.
  useEffect(() => {
    const el = lanes.current;
    if (!el) return;
    let width = window.innerWidth;
    const lock = () => { el.style.minHeight = `${Math.max(el.offsetHeight, parseFloat(el.style.minHeight) || 0)}px`; };
    const observer = new ResizeObserver(lock);
    observer.observe(el);
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      el.style.minHeight = "";
      requestAnimationFrame(lock);
    };
    window.addEventListener("resize", onResize);
    return () => { observer.disconnect(); window.removeEventListener("resize", onResize); };
  }, []);
  const [scrollDone, setScrollDone] = useState(0);
  const [mode, setMode] = useState<Mode>("auto");
  const { scrollYProgress } = useScroll({ target: board, offset: ["start 0.8", "end 0.7"] });
  // Reduced motion: jump straight to the finished board instead of moving cards with the scroll.
  useMotionValueEvent(scrollYProgress, "change", v => setScrollDone(reduce ? N : Math.max(0, Math.min(N, Math.round(v * N)))));

  const done = mode === "with" ? N : mode === "without" ? 0 : scrollDone;
  const pick = (m: Exclude<Mode, "auto">) => setMode(cur => (cur === m ? "auto" : m));
  const team = tasks.map((_, i) => i).filter(i => i >= done);
  const sam = tasks.map((_, i) => i).filter(i => i < done);

  return (
    <MotionConfig reducedMotion="user">
      <div className="hx" ref={board}>
        <div className="hx-controls">
          <div className="hx-seg" role="group" aria-label="Compare how the work is done">
            {(["without", "with"] as const).map(m => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => pick(m)}>
                {mode === m && <motion.span layoutId="hx-seg-pill" className="hx-seg-pill" transition={spring} />}
                <span>{m === "without" ? "Without SAM" : "With SAM"}</span>
              </button>
            ))}
          </div>
          <p className="hx-hint">{mode === "auto" ? "Scroll to hand work over, or switch views." : "Showing a fixed view. Tap again to return to scrolling."}</p>
        </div>

        <LayoutGroup>
          <div className="hx-lanes" ref={lanes}>
            <section className="hx-lane hx-team" aria-labelledby="hx-team-title">
              <header className="hx-lane-head">
                <span className="hx-lane-icon"><Users size={18} aria-hidden="true" /></span>
                <h3 id="hx-team-title">Your team</h3>
                <span className="hx-count">{team.length + 1} {team.length + 1 === 1 ? "task" : "tasks"}</span>
              </header>
              <ul className="hx-stack">
                {team.map(i => <TaskCard key={i} i={i} inSam={false} />)}
                <motion.li layout="position" transition={spring} className="hx-card hx-keep">
                  <span className="hx-tile"><UserCheck size={18} aria-hidden="true" /></span>
                  <span className="hx-copy"><strong>Choosing who moves forward</strong><small className="hx-desc">SAM provides the report. Your team makes the decision.</small></span>
                  <em className="hx-badge">Always yours</em>
                </motion.li>
              </ul>
            </section>

            <div className="hx-bridge" aria-hidden="true">
              <span className="hx-bridge-line" />
              <span key={done} className="hx-bridge-dot"><ArrowRight size={16} /></span>
              <span className="hx-bridge-line" />
            </div>

            <section className="hx-lane hx-sam" aria-labelledby="hx-sam-title">
              <header className="hx-lane-head">
                <span className="hx-lane-icon is-sam"><SamAvatar /></span>
                <h3 id="hx-sam-title">SAM</h3>
                <span className="hx-count">{done} of {N} tasks</span>
              </header>
              <div className="hx-meter" aria-hidden="true"><i style={{ width: `${(done / N) * 100}%` }} /></div>
              <ul className="hx-stack">
                {sam.map(i => <TaskCard key={i} i={i} inSam />)}
                {done === 0 && <li className="hx-empty">Tasks land here as SAM takes them over</li>}
              </ul>
            </section>
          </div>
        </LayoutGroup>
      </div>
    </MotionConfig>
  );
}
