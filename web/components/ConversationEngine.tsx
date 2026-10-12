"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Pause, Play, RotateCcw, ArrowRight } from "lucide-react";

const chapters = [
  { name: "The application", title: "A profile is just the start.", quote: "Backend engineer. Python, APIs, distributed systems.", speaker: "ON PAPER" },
  { name: "The conversation", title: "Now, ask the next question.", quote: "What changed in your design, and why did you choose it?", speaker: "SAM ASKS" },
  { name: "The context", title: "Give your team more to go on.", quote: "Experience discussed. Decisions explained. A report to review.", speaker: "YOUR NEXT STEP" },
];

/** A visible, looping product story. All artwork and animation are native SVG/CSS. */
export function ConversationEngine() {
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [cycle, setCycle] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  const id = useId().replace(/:/g, "");
  const moving = playing && inView && !reduce;

  useEffect(() => {
    if (!moving) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setChapter(value => (value + 1) % chapters.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [moving, cycle]);

  const current = chapters[chapter];
  return (
    <div ref={ref} className="conversation-engine" data-playing={moving} data-chapter={chapter}>
      <div className="engine-topline">
        <span><i /> THE CONVERSATION ENGINE</span>
        <span>POWERED BY SAM</span>
      </div>

      <svg key={cycle} className="engine-art" viewBox="0 0 620 375" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Applications become conversations, and conversations become interview context.</title>
        <desc id={`${id}-desc`}>Applicant documents flow into an animated SAM interviewer. A conversational waveform and detailed report illustrate the next stages.</desc>
        <defs>
          <linearGradient id={`${id}-thread`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#a6bdff" /><stop offset=".55" stopColor="#6084ff" /><stop offset="1" stopColor="#d7efa3" />
          </linearGradient>
          <pattern id={`${id}-grid`} width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".6" fill="#8da0d0" opacity=".22" /></pattern>
        </defs>
        <rect width="620" height="375" fill={`url(#${id}-grid)`} />
        <path d="M20 54 H600 M20 325 H600" stroke="#a7b9e8" strokeOpacity=".15" />
        <g fill="#aab9dc" fontFamily="var(--font-geist-mono), monospace" fontSize="9" letterSpacing="1">
          <text x="28" y="39">01 / APPLICATION</text>
          <text x="267" y="39">02 / INTERVIEW</text>
          <text x="439" y="39">03 / INSIGHTS</text>
        </g>

        <g transform="translate(27 88)">
          <g className="engine-papers">
            <rect x="-8" y="9" width="146" height="204" rx="5" fill="#344779" stroke="#7388b6" transform="rotate(-8 73 102)" />
            <rect x="8" y="3" width="146" height="204" rx="5" fill="#526393" stroke="#93a4ce" transform="rotate(5 73 102)" />
            <rect width="146" height="204" rx="5" fill="#f1efe5" />
            <circle cx="26" cy="34" r="13" fill="#d7ddcb" />
            <text x="26" y="38" textAnchor="middle" fontFamily="var(--font-mukta), sans-serif" fontSize="13" fill="#475145">P</text>
            <text x="48" y="31" fontFamily="var(--font-mukta), sans-serif" fontWeight="600" fontSize="13" fill="#24334b">Ethan T.</text>
            <text x="48" y="46" fontFamily="var(--font-mukta), sans-serif" fontSize="9" fill="#73796b">Backend engineer</text>
            <path d="M17 66 H127" stroke="#cfcec2" />
            <g stroke="#b7bbae" strokeWidth="3" strokeLinecap="round"><path d="M18 84 H120" /><path d="M18 95 H109" /><path d="M18 106 H118" /><path d="M18 117 H82" /></g>
            <rect x="16" y="139" width="114" height="26" rx="2" fill="#e2e6d9" />
            <text x="73" y="156" textAnchor="middle" fontFamily="var(--font-mukta), sans-serif" fontSize="10" fill="#57634c">Python · APIs · Systems</text>
            <text x="18" y="187" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#85897c">THERE’S MORE TO THE STORY.</text>
            <rect className="engine-scan" x="8" y="70" width="130" height="3" rx="1" fill="#b74731" />
          </g>
        </g>

        <g fill="none" strokeLinecap="round">
          <path d="M176 193 C203 193 216 179 241 179" stroke="#7d93c6" strokeOpacity=".4" />
          <path d="M176 193 C203 193 216 179 241 179" className="engine-packet engine-input-packet" stroke="#d7efa3" strokeWidth="4" pathLength="100" strokeDasharray="12 88" />
          <path d="M376 179 C402 179 407 193 433 193" stroke="#7d93c6" strokeOpacity=".4" />
          <path d="M376 179 C402 179 407 193 433 193" className="engine-packet engine-output-packet" stroke="#d7efa3" strokeWidth="4" pathLength="100" strokeDasharray="12 88" />
        </g>

        <g transform="translate(309 180)">
          <circle r="95" fill="none" stroke="#6b82bf" strokeOpacity=".25" strokeDasharray="2 9" />
          <g className="engine-rosette" fill="none" stroke={`url(#${id}-thread)`} strokeWidth="1.35">
            {Array.from({ length: 18 }, (_, i) => <ellipse key={i} rx="37" ry="82" transform={`rotate(${i * 10})`} opacity={.42 + i * .025} />)}
          </g>
          <g className="engine-orbit"><circle cx="0" cy="-95" r="4" fill="#d7efa3" /><circle cx="0" cy="95" r="3" fill="#f0ad8d" /></g>
          <circle r="48" fill="#18294c" stroke="#8ba5ed" strokeOpacity=".65" />
          <text x="0" y="-4" textAnchor="middle" fill="#f3f0e9" fontFamily="var(--font-halant), Georgia, serif" fontSize="30">SAM</text>
          <g className="engine-voice" fill="#d7efa3">
            {[10, 18, 30, 21, 13, 26, 16, 8, 21, 28, 15].map((height, i) => <rect key={i} x={-29 + i * 5.5} y={17 - height / 2} width="2.7" height={height} rx="1.35" style={{ animationDelay: `${i * -.11}s` }} />)}
          </g>
        </g>

        <g transform="translate(437 88)">
          <g className="engine-report">
            <rect width="155" height="204" rx="5" fill="#243b55" stroke="#a6bf86" strokeOpacity=".7" />
            <text x="17" y="27" fill="#d7efa3" fontFamily="var(--font-geist-mono), monospace" fontSize="8" letterSpacing=".7">INTERVIEW CONTEXT</text>
            <text x="17" y="51" fill="#f0f2e7" fontFamily="var(--font-mukta), sans-serif" fontSize="16">More to go on.</text>
            <path d="M16 66 H138" stroke="#729279" strokeOpacity=".5" />
            {[
              { y: 87, label: "EXPERIENCE", value: "Building & scaling APIs" },
              { y: 126, label: "DISCUSSION", value: "Decisions & trade-offs" },
            ].map(item => <g key={item.label}><text x="17" y={item.y} fill="#a5bea4" fontFamily="var(--font-geist-mono), monospace" fontSize="7">{item.label}</text><text x="17" y={item.y + 16} fill="#edf0e5" fontFamily="var(--font-mukta), sans-serif" fontSize="11">{item.value}</text></g>)}
            <rect x="15" y="159" width="124" height="28" rx="3" fill="#d7efa3" />
            <path className="engine-check" d="M25 173 l4 4 8-9" fill="none" stroke="#31472c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength="1" />
            <text x="44" y="177" fill="#31472c" fontFamily="var(--font-mukta), sans-serif" fontSize="10">Your team decides.</text>
          </g>
        </g>
        <g fill="#b9c7e2" fontFamily="var(--font-mukta), sans-serif" fontSize="11">
          <text x="101" y="350" textAnchor="middle">Read the experience.</text>
          <text x="309" y="350" textAnchor="middle">Ask a better question.</text>
          <text x="514" y="350" textAnchor="middle">Understand the answer.</text>
        </g>
      </svg>

      <div className="engine-story-caption">
        <span>{current.speaker}</span>
        <p>{current.quote}</p>
      </div>
      <div className="engine-controls">
        <div role="group" aria-label="Explore the conversation engine">
          {chapters.map((item, i) => <button key={item.name} type="button" aria-pressed={chapter === i} onClick={() => { setChapter(i); setPlaying(false); }}><span>0{i + 1}</span>{item.name.replace("The ", "")}</button>)}
        </div>
        <button className="engine-play" type="button" aria-label={playing ? "Pause hero animation" : "Play hero animation"} onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={14} /> : <Play size={14} />}</button>
        <button className="engine-replay" type="button" aria-label="Replay hero animation" onClick={() => { setChapter(0); setCycle(value => value + 1); setPlaying(true); }}><RotateCcw size={14} /></button>
      </div>
      <p className="engine-footnote"><span>{current.title}</span><span>ILLUSTRATIVE PRODUCT STORY <ArrowRight size={10} /></span></p>
    </div>
  );
}
