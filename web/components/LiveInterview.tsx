"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { ShieldCheck } from "lucide-react";
import { SamOrb } from "@/components/SamOrb";

// A scripted sample interview. Entirely illustrative; no real candidate.
const script = [
  { who: "sam", text: "Walk me through how you'd design a rate limiter for a public API." },
  { who: "cand", text: "Token bucket per API key, kept in Redis so limits hold across instances. I'd return remaining quota in headers." },
  { who: "sam", text: "Good. What happens to your limiter when Redis goes down?" },
  { who: "cand", text: "Fail open for reads, fail closed for writes, alert on it, and fall back to a local bucket per node." },
  { who: "sam", text: "Now tell me about a time you disagreed with a teammate on a technical call." },
] as const;

// Scores after each candidate answer: technical, communication, problem solving
const scoreAt = [
  [0, 0, 0],
  [0, 0, 0],
  [62, 70, 58],
  [62, 70, 58],
  [84, 78, 81],
  [84, 78, 81],
];

const metrics = ["Technical depth", "Communication", "Problem solving"];

export function LiveInterview() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(reduce ? script.length - 1 : 0);
  const [chars, setChars] = useState(reduce ? 999 : 0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) return;
    const msg = script[Math.min(idx, script.length - 1)];
    if (chars < msg.text.length) {
      timer.current = setTimeout(() => setChars((c) => c + 2), 22);
    } else {
      const last = idx >= script.length - 1;
      timer.current = setTimeout(
        () => {
          if (last) {
            setIdx(0);
            setChars(0);
          } else {
            setIdx((i) => i + 1);
            setChars(0);
          }
        },
        last ? 4200 : 900,
      );
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [idx, chars, reduce]);

  const current = script[Math.min(idx, script.length - 1)];
  const scores = scoreAt[Math.min(idx + (chars >= current.text.length ? 1 : 0), scoreAt.length - 1)];
  const secs = 252 + idx * 41;
  const clock = `00:0${Math.floor(secs / 60) % 10}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div
      className="overflow-hidden rounded-[28px] border border-ink/10 bg-ink text-paper shadow-[0_40px_100px_-30px_rgba(14,93,252,0.45)]"
      role="img"
      aria-label="Sample live interview: Sam asks backend engineering questions, the candidate answers, and a live scorecard fills in."
    >
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[11px] text-white/60">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-live motion-safe-anim animate-pulse" /> LIVE · {clock}
        </span>
        <span className="hidden sm:inline">Senior Backend Engineer · sample interview</span>
        <span className="flex items-center gap-1.5 text-emerald-300">
          <ShieldCheck size={13} /> proctoring on
        </span>
      </div>

      <div className="grid lg:grid-cols-[5fr_7fr]">
        {/* stage */}
        <div className="relative flex min-h-[260px] flex-col items-center justify-center gap-6 border-b border-white/10 p-8 lg:border-b-0 lg:border-r">
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: "radial-gradient(60% 50% at 50% 35%, rgba(14,93,252,0.35), transparent 70%)" }}
            aria-hidden
          />
          <div className="relative flex flex-col items-center gap-2">
            <SamOrb size={104} speaking={current.who === "sam"} />
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Sam · AI interviewer</p>
          </div>
          <div className="relative flex w-full max-w-[260px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#cfe0ff] to-[#6fa3ff] text-sm font-semibold text-ink">
              PN
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Priya N.</p>
              <p className="truncate font-mono text-[10px] text-white/45">candidate · sample</p>
            </div>
            <div className="flex h-6 items-end gap-0.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={clsx(
                    "w-1 origin-bottom rounded-full bg-white/70",
                    current.who === "cand" ? "motion-safe-anim h-full" : "h-1/4 opacity-40",
                  )}
                  style={current.who === "cand" ? { animation: `bar ${0.7 + i * 0.12}s ease-in-out infinite` } : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* transcript + scores */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-3 p-5 sm:p-6" aria-live="off">
            {script.slice(0, idx + 1).map((m, i) => {
              const text = i === idx ? m.text.slice(0, chars) : m.text;
              return (
                <div key={i} className={clsx("flex", m.who === "cand" && "justify-end")}>
                  <p
                    className={clsx(
                      "max-w-[88%] rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed",
                      m.who === "sam" ? "rounded-tl-md bg-white/[0.07] text-white/90" : "rounded-tr-md bg-brand text-white",
                    )}
                  >
                    {text}
                    {i === idx && chars < m.text.length && (
                      <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-white/80" />
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-px border-t border-white/10 bg-white/10">
            {metrics.map((m, i) => (
              <div key={m} className="bg-ink p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{m}</p>
                <p className="mt-1 text-2xl font-medium tabular-nums">{scores[i] || "–"}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-[#6fa3ff] transition-[width] duration-700"
                    style={{ width: `${scores[i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
