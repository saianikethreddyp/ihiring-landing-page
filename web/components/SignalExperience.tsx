"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { InitialAvatar, SamAvatar } from "@/components/Avatar";
import { ArrowRight, CalendarDays, Check, FileText, MessageCircle, ShieldCheck } from "lucide-react";

export function StackFlow() {
  const [playing, setPlaying] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: .5 });
  const reduce = useReducedMotion();
  const moving = playing && inView && !reduce;
  return <div ref={ref} className="stack-flow"><button type="button" onClick={() => setPlaying(value => !value)} aria-pressed={playing} aria-label={playing ? "Pause integration flow" : "Animate integration flow"}>REPORTS TO YOUR ATS <ArrowRight size={12} /></button><svg viewBox="0 0 400 72" aria-hidden="true" className={moving ? "flow-moving" : ""}><g fill="none" strokeLinecap="round">{[40, 120, 200, 280, 360].map(x => <g key={x}><path d={`M200 3 V18 Q200 32 ${x} 32 V66`} stroke="#c8cdc0" strokeWidth="1" /><path className="flow-packet" d={`M200 3 V18 Q200 32 ${x} 32 V66`} stroke="#b73c28" strokeWidth="3.5" pathLength="100" strokeDasharray="14 86" /></g>)}</g></svg></div>;
}

const stages = [
  { name: "Screen", icon: FileText, title: "Screen the applications.", body: "SAM screens resumes so your team can focus its attention on the interviews ahead.", detail: "RESUME SCREENING" },
  { name: "Schedule", icon: CalendarDays, title: "Let candidates choose a time.", body: "Candidates can schedule and reschedule their interviews with SAM, 24/7.", detail: "CANDIDATE SCHEDULING" },
  { name: "Interview", icon: MessageCircle, title: "Conduct the first interview.", body: "SAM interviews the candidate and asks follow-up questions about their experience.", detail: "AI INTERVIEWS" },
  { name: "Understand", icon: FileText, title: "Review the interview report.", body: "Review SAM’s detailed interview report and decide where to take the conversation next.", detail: "YOUR TEAM MAKES THE DECISION" },
];

export function InterviewJourney() {
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const outer = track.current;
    const inner = preview.current;
    if (!outer || !inner) return;
    let enabled = false;
    let frame = 0;
    const update = () => {
      if (!enabled) return;
      const travel = outer.offsetHeight - inner.offsetHeight;
      const progress = (96 - outer.getBoundingClientRect().top) / travel;
      setActive(current => {
        const next = Math.min(3, Math.max(0, Math.floor(progress * 4)));
        // A small buffer prevents trackpad jitter from flipping adjacent steps.
        if (next > current && progress < (current + 1) / 4 + .012) return current;
        if (next < current && progress > current / 4 - .012) return current;
        return next;
      });
    };
    const scroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const resize = () => {
      enabled = window.innerWidth >= 768 && window.innerHeight >= inner.offsetHeight + 120 && !reduce;
      setPinned(enabled);
      scroll();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(inner);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);
  const selectStage = (index: number) => {
    setActive(index);
    if (pinned && track.current && preview.current) {
      const outer = track.current;
      const travel = outer.offsetHeight - preview.current.offsetHeight;
      window.scrollTo({ top: window.scrollY + outer.getBoundingClientRect().top - 96 + travel * ((index + .5) / 4), behavior: reduce ? "instant" : "smooth" });
    }
  };
  const stage = stages[active];
  return (
    <div ref={track} className="journey-scroll-track" data-pinned={pinned}>
    <div ref={preview} className="journey-experience">
      <div className="journey-tabs" role="tablist" aria-label="SAM hiring workflow">{stages.map((item, i) => <button key={item.name} role="tab" id={`journey-tab-${i}`} aria-selected={active === i} aria-controls="journey-panel" tabIndex={active === i ? 0 : -1} onClick={() => selectStage(i)} onKeyDown={event => { let next = active; if (event.key === "ArrowRight") next = (active + 1) % stages.length; else if (event.key === "ArrowLeft") next = (active + stages.length - 1) % stages.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = stages.length - 1; else return; event.preventDefault(); selectStage(next); document.getElementById(`journey-tab-${next}`)?.focus(); }}><span>0{i + 1}</span>{item.name}<ArrowRight size={16} />{active === i && <motion.span className="journey-active-line" layoutId="journey-active-line" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }} />}</button>)}</div>
      <motion.div className="journey-panel" id="journey-panel" role="tabpanel" aria-labelledby={`journey-tab-${active}`} tabIndex={0} key={active} initial={reduce ? false : { opacity: .25, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .32, ease: [0.22, 1, 0.36, 1] }}>
        <div className="journey-panel-copy"><span className="journey-chapter">0{active + 1} / {stage.name}</span><h3>{stage.title}</h3><p>{stage.body}</p><div className="journey-panel-note"><ShieldCheck size={17} /><span>{stage.detail}</span></div></div>
        <motion.div className="journey-demo" key={active} initial={false} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : .18 }}>
          <div className="demo-top"><span><i /> SAM workspace</span><span>Product preview</span></div>
          {active === 0 && <div className="screen-example"><div className="demo-role"><span>OPEN ROLE</span><strong>Backend engineer</strong><small>Applications, ready for screening</small></div>{["Priya N.", "Arjun M.", "Alex R."].map((name, i) => <div className="applicant-row" key={name}><InitialAvatar initials={name.split(" ").map(part => part.charAt(0)).join("")} /><div><strong>{name}</strong><span>{["Python · APIs", "Java · Systems", "Node.js · Databases"][i]}</span></div><span className="applicant-status">{i === 0 ? "Ready to interview" : "Resume received"}</span></div>)}</div>}
          {active === 1 && <div className="calendar-example"><div className="calendar-head"><span>CANDIDATE SCHEDULING</span><strong>Choose an interview time.</strong></div><div className="calendar-days">{["MON", "TUE", "WED", "THU", "FRI"].map((day, i) => <span className={i === 2 ? "chosen-day" : ""} key={day}><small>{day}</small><b>{12 + i}</b></span>)}</div><div className="time-slots"><span>09:30 AM</span><span className="selected-time">02:00 PM <Check size={13} /></span><span>06:30 PM</span></div><p><Check size={14} /> Interview scheduled with SAM</p></div>}
          {active === 2 && <div className="interview-example"><div className="conversation-header"><SamAvatar /><div><strong>Interview with SAM</strong><span>Backend engineer · Interview transcript</span></div></div><div className="conversation-bubble sam-bubble"><span>SAM</span><p>Tell me about a system you built that had to handle unexpected growth.</p></div><div className="conversation-bubble candidate-bubble"><span>Priya</span><p>Our API traffic grew quickly. I moved the expensive jobs to a queue so requests could stay fast.</p></div><div className="conversation-bubble sam-bubble"><span>SAM</span><p>What trade-offs did you make, and how did you measure the impact?</p></div></div>}
          {active === 3 && <div className="report-example"><div className="report-heading"><InitialAvatar initials="PN" /><div><strong>Priya N.</strong><span>Backend engineer · Example report</span></div><FileText size={24} /></div><div className="report-rule" /><span className="report-label">INTERVIEW SUMMARY</span><p>Described moving expensive API jobs to an asynchronous queue to handle growth.</p><div className="report-finding"><span>EXPERIENCE DISCUSSED</span><strong>System design & scaling</strong></div><div className="report-finding"><span>FOR THE NEXT CONVERSATION</span><strong>Explore the trade-offs in more detail</strong></div><div className="report-end"><Check size={13} /> Ready for your team to review</div></div>}
        </motion.div>
      </motion.div>
    </div>
    </div>
  );
}
