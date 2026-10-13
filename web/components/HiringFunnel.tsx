"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { type MotionValue, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Check, FileText, MousePointer2, Play, Sparkles } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Sample data. Everything here is illustrative.                       */
/* ------------------------------------------------------------------ */

const TOTAL = 500;
const MATCHED = 120;
const SHORTLIST_COUNT = 5;
const LANES = 9;

const stages = [
  { n: "01", label: "Applications", title: "Applications pour into ihiring.", body: "Every resume lands on one platform, whether it is 50 or 5,000.", unit: "applications" },
  { n: "02", label: "Screen and rank", title: "SAM screens and ranks them.", body: "Each applicant is scored against your role. Strong matches move forward and the rest are set aside.", unit: "strong matches" },
  { n: "03", label: "Interview", title: "Interviews run in parallel.", body: "Every invited candidate gets the same live conversation with SAM, at any hour, all at once.", unit: "interviews in parallel" },
  { n: "04", label: "Report", title: "Every candidate comes with a full report.", body: "Video, transcript, a professional summary and a clear recommendation, ready for your team to review.", unit: "on your shortlist" },
  { n: "05", label: "ATS sync", title: "Everything syncs to your ATS.", body: "Reports flow into Workday, Bullhorn, Greenhouse, Lever and Ashby, so nobody copies results between tools.", unit: "ATS integrations" },
];
// Scroll progress at which each stage begins.
const STAGE_START = [0, 0.144, 0.317, 0.518, 0.8];
// The funnel itself plays over the first part of the scroll; the report and ATS sync follow.
const FUNNEL_END = 0.72;
const ATS = ["Workday", "Bullhorn", "Greenhouse", "Lever", "Ashby"];
const ATS_TOP = [14, 32, 50, 68, 86];

const shortlist = [
  { name: "Ethan T.", score: 94 },
  { name: "Marcus L.", score: 91 },
  { name: "Emily T.", score: 88 },
  { name: "Jessica B.", score: 85 },
  { name: "Daniel R.", score: 82 },
];
const ORB_V = [0.18, 0.34, 0.5, 0.66, 0.82];

/* ------------------------------------------------------------------ */
/* Math helpers                                                        */
/* ------------------------------------------------------------------ */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = (t: number) => { const x = clamp(t); return x * x * (3 - 2 * x); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/* Funnel geometry. u runs along the flow (0..1), v runs across it.    */
/* ------------------------------------------------------------------ */

const GATE_U = 0.34;
const NECK_U = 0.5;
const LANE_START_U = 0.54;
const LANE_END_U = 0.74;

/** Half-width of the funnel at position u. */
function wall(u: number) {
  if (u <= GATE_U) return 0.46 - 0.2 * sm(u / GATE_U);
  if (u <= NECK_U) return lerp(0.26, 0.05, sm((u - GATE_U) / (NECK_U - GATE_U)));
  return 0.05;
}
const laneV = (k: number) => 0.1 + (k / (LANES - 1)) * 0.8;

type Particle = { te: number; td: number; u1: number; v1: number; strong: boolean; lane: number; dir: number; size: number; phase: number };

// Fixed seed, so the server and the browser build the same scene.
function buildParticles(): Particle[] {
  const r = rng(20261012);
  return Array.from({ length: TOTAL }, () => {
    const strong = r() < MATCHED / TOTAL;
    const u1 = 0.02 + r() * 0.28;
    return {
      te: r() * 0.13,
      td: 0.2 + r() * 0.12,
      u1,
      v1: 0.5 + (r() - 0.5) * 2 * wall(u1) * 0.86,
      strong,
      lane: Math.floor(r() * LANES),
      dir: r() < 0.5 ? -1 : 1,
      size: 0.8 + r() * 0.9,
      phase: r() * Math.PI * 2,
    };
  });
}

type Pt = { u: number; v: number; a: number; r: number; burst: number };

/** Where a particle is at scroll progress p. A pure function, so scrolling backwards just works. */
function stateAt(q: Particle, p: number, out: Pt): Pt {
  const arrive = sm((p - q.te) / 0.07);
  let u = lerp(-0.05, q.u1, arrive);
  let v = q.v1;
  let a = 0.15 + 0.6 * arrive;
  let r = q.size;
  let burst = 0;

  const toGate = sm((p - q.td) / 0.1);
  if (toGate > 0) {
    u = lerp(q.u1, GATE_U, toGate);
    v = 0.5 + (q.v1 - 0.5) * (wall(u) / wall(q.u1));
  }
  const after = p - q.td - 0.1;
  if (after > 0) {
    if (!q.strong) {
      // Set aside: the particle flares at the gate and scatters.
      const t = clamp(after / 0.07);
      burst = 1 - t;
      u = GATE_U + 0.035 * t;
      v += q.dir * 0.22 * t;
      a *= 1 - t;
      r *= 1 + (1 - t) * 0.8;
    } else {
      const toNeck = sm((p - q.td - 0.11) / 0.12);
      u = lerp(GATE_U, NECK_U, toNeck);
      v = 0.5 + (v - 0.5) * (wall(u) / wall(GATE_U));
      a = lerp(a, 1, toNeck);
      r *= 1.5;
      const toLane = sm((p - q.td - 0.22) / 0.16);
      if (toLane > 0) {
        u = lerp(NECK_U, LANE_END_U, toLane);
        v = lerp(0.5, laneV(q.lane), sm(clamp(toLane * 1.6)));
        a *= 1 - sm((toLane - 0.88) / 0.12);
      }
    }
  }
  out.u = u; out.v = v; out.a = a; out.r = r; out.burst = burst;
  return out;
}

/* ------------------------------------------------------------------ */
/* DOM labels that sit on top of the canvas                            */
/* ------------------------------------------------------------------ */

function OrbLabel({ k, p, vertical, winner }: { k: number; p: MotionValue<number>; vertical: boolean; winner: boolean }) {
  const start = 0.76 + k * 0.025;
  const opacity = useTransform(p, [start, start + 0.05], [0, 1]);
  const y = useTransform(p, [start, start + 0.05], [8, 0]);
  const person = shortlist[k];
  const pos = vertical ? { left: `${ORB_V[k] * 100}%`, bottom: 6 } : { left: "86%", top: `${ORB_V[k] * 100}%` };
  return (
    <motion.div className={`fx-orb-label${k === 0 && winner ? " is-winner" : ""}`} style={{ ...pos, x: vertical ? "-50%" : 0, y, opacity }}>
      <strong>{person.name}</strong>
      <span><i style={{ width: `${person.score}%` }} />{person.score}</span>
    </motion.div>
  );
}

function Block({ scroll, at, className, children }: { scroll: MotionValue<number>; at: number; className?: string; children: React.ReactNode }) {
  const opacity = useTransform(scroll, [at, at + 0.035], [0, 1]);
  const y = useTransform(scroll, [at, at + 0.035], [10, 0]);
  return <motion.div className={className} style={{ opacity, y }}>{children}</motion.div>;
}

/** The full report for the top candidate: video, transcript, summary and a recommendation. */
/** On phones the summary folds away once the ATS logos arrive, so everything fits on a short screen. */
function Collapse({ scroll, vertical, children }: { scroll: MotionValue<number>; vertical: boolean; children: React.ReactNode }) {
  const maxHeight = useTransform(scroll, [0.8, 0.88], [220, 0]);
  const opacity = useTransform(scroll, [0.8, 0.86], [1, 0]);
  if (!vertical) return <>{children}</>;
  return <motion.div style={{ maxHeight, opacity, overflow: "hidden" }}>{children}</motion.div>;
}

function ReportCard({ scroll, vertical }: { scroll: MotionValue<number>; vertical: boolean }) {
  const opacity = useTransform(scroll, [0.62, 0.68], [0, 1]);
  const scale = useTransform(scroll, [0.62, 0.68], [0.94, 1]);
  const left = useTransform(scroll, [0.8, 0.9], ["52.5%", "6%"]);
  const style = vertical ? { opacity, scale } : { left, top: "50%", y: "-50%", opacity, scale };
  return (
    <motion.div className={`fx-card${vertical ? " is-flow" : ""}`} style={style}>
      <Block scroll={scroll} at={0.64} className="fx-card-head">
        <span className="fx-avatar">ET</span>
        <span className="fx-card-who"><strong>Ethan T.</strong><small>Backend engineer</small></span>
        <span className="fx-badge"><Check size={12} strokeWidth={3} />Recommended</span>
      </Block>
      <Block scroll={scroll} at={0.68} className="fx-artifacts">
        <span><Play size={12} fill="currentColor" />Video <em>12:04</em></span>
        <span><FileText size={12} />Transcript</span>
        <span><Sparkles size={12} />Summary</span>
      </Block>
      <Collapse scroll={scroll} vertical={vertical}>
        <Block scroll={scroll} at={0.71} className="fx-card-block">
          <p className="fx-label">Professional summary</p>
          <p>Backend engineer with strong Python and distributed-systems depth. Explained queueing, retries and idempotency clearly, and cut p95 latency from 1.8s to 320ms.</p>
        </Block>
      </Collapse>
      <Block scroll={scroll} at={0.75} className="fx-card-block fx-rec">
        <p className="fx-label">Recommendation</p>
        <p className="fx-rec-line"><MousePointer2 size={14} fill="currentColor" />Advance to next round<b>94% match</b></p>
        <small>Next conversation: probe retry and dead-letter handling.</small>
      </Block>
    </motion.div>
  );
}

function AtsTile({ i, scroll, vertical }: { i: number; scroll: MotionValue<number>; vertical: boolean }) {
  const at = 0.84 + i * 0.024;
  const opacity = useTransform(scroll, [at, at + 0.04], [0, 1]);
  const x = useTransform(scroll, [at, at + 0.04], [vertical ? 0 : 14, 0]);
  const tick = useTransform(scroll, [at + 0.035, at + 0.06], [0, 1]);
  const name = ATS[i];
  return (
    <motion.li className="fx-ats-tile" style={{ opacity, x, ...(vertical ? {} : { top: `${ATS_TOP[i]}%` }) }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/brands/${name.toLowerCase()}.png`} alt="" />
      <span>{name}</span>
      <motion.span className="fx-ats-check" style={{ scale: tick, opacity: tick }} aria-hidden="true"><Check size={11} strokeWidth={3.4} /></motion.span>
    </motion.li>
  );
}

/** Report flows out to the ATS tools, one beam per integration. */
function AtsSync({ scroll, vertical, size }: { scroll: MotionValue<number>; vertical: boolean; size: { w: number; h: number } }) {
  const label = useTransform(scroll, [0.82, 0.88], [0, 1]);
  return (
    <>
      {!vertical && size.w > 0 && (
        <svg className="fx-beams" width={size.w} height={size.h} aria-hidden="true">
          {ATS_TOP.map((ty, i) => <Beam key={i} i={i} ty={ty} scroll={scroll} w={size.w} h={size.h} />)}
        </svg>
      )}
      <motion.div className="fx-ats" style={{ opacity: label }}>
        <p className="fx-ats-title"><Check size={13} strokeWidth={3} />Synced to your ATS</p>
        <ul>{ATS.map((_, i) => <AtsTile key={i} i={i} scroll={scroll} vertical={vertical} />)}</ul>
      </motion.div>
    </>
  );
}

function Beam({ i, ty, scroll, w, h }: { i: number; ty: number; scroll: MotionValue<number>; w: number; h: number }) {
  const at = 0.83 + i * 0.024;
  const pathLength = useTransform(scroll, [at, at + 0.06], [0, 1]);
  const x0 = w * 0.06 + 304 + 62 + 50;
  const y0 = h * 0.5;
  const x1 = w * 0.63 - 6;
  const y1 = (ty / 100) * h;
  const mid = (x0 + x1) / 2;
  return <motion.path d={`M ${x0} ${y0} C ${mid} ${y0}, ${mid} ${y1}, ${x1} ${y1}`} fill="none" stroke="rgba(140,195,255,0.6)" strokeWidth={1.4} strokeLinecap="round" style={{ pathLength }} />;
}

/** The ihiring platform: where every application arrives and gets screened. */
function PlatformHub({ scroll, vertical }: { scroll: MotionValue<number>; vertical: boolean }) {
  const opacity = useTransform(scroll, [0, 0.04, 0.74, 0.8], [0, 1, 1, 0]);
  const pos = vertical ? { left: "50%", top: "27%" } : { left: "34%", top: "13%" };
  return (
    <motion.div className="fx-hub" style={{ ...pos, x: "-50%", y: "-50%", opacity }} aria-hidden="true">
      <span className="fx-hub-ring" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/ihiring.svg" alt="" />
    </motion.div>
  );
}

/** The same platform badge reappears beside the report, where results leave for the ATS. */
function HubNode({ scroll, size }: { scroll: MotionValue<number>; size: { w: number; h: number } }) {
  const opacity = useTransform(scroll, [0.8, 0.86], [0, 1]);
  return (
    <motion.div className="fx-hub is-node" style={{ left: size.w * 0.06 + 304 + 62, top: "50%", x: "-50%", y: "-50%", opacity }} aria-hidden="true">
      <span className="fx-hub-ring" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/ihiring.svg" alt="" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* The scene                                                           */
/* ------------------------------------------------------------------ */

function Scene({ progress, scroll }: { progress: MotionValue<number>; scroll: MotionValue<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [vertical, setVertical] = useState(false);
  const [sceneSize, setSceneSize] = useState({ w: 0, h: 0 });
  const [flags, setFlags] = useState({ winner: false });
  const particles = useMemo(buildParticles, []);
  const asideOpacity = useTransform(progress, [0.26, 0.34, 0.5, 0.6], [0, 1, 1, 0]);
  const lanesOpacity = useTransform(progress, [0.5, 0.56, 0.7, 0.76], [0, 1, 1, 0]);
  const dim = useTransform(scroll, [0.78, 0.88], [1, 0.12]);

  useMotionValueEvent(progress, "change", v => {
    const winner = v > 0.9;
    setFlags(f => (f.winner === winner ? f : { winner }));
  });

  useEffect(() => {
    const el = box.current;
    const cv = canvas.current;
    if (!el || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let size = { w: 0, h: 0, dpr: 1 };
    let vert = false;
    let visible = true;
    let raf = 0;
    let smooth = progress.get();
    const a: Pt = { u: 0, v: 0, a: 0, r: 0, burst: 0 };
    const b: Pt = { u: 0, v: 0, a: 0, r: 0, burst: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = el.clientWidth;
      const h = el.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      size = { w, h, dpr };
      setSceneSize(prev => (prev.w === w && prev.h === h ? prev : { w, h }));
      const v = w < 900;
      if (v !== vert) { vert = v; setVertical(v); }
    };

    const draw = (p: number, time: number) => {
      const { w, h, dpr } = size;
      if (!w) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      const X = (u: number, v: number) => (vert ? v * w : u * w);
      const Y = (u: number, v: number) => (vert ? u * h : v * h);
      const line = (u0: number, v0: number, u1: number, v1: number) => {
        ctx.beginPath();
        ctx.moveTo(X(u0, v0), Y(u0, v0));
        ctx.lineTo(X(u1, v1), Y(u1, v1));
        ctx.stroke();
      };

      // Funnel walls, drawn as two glowing curves.
      const wallsA = 0.35 + 0.35 * sm(p / 0.1);
      ctx.save();
      ctx.strokeStyle = `rgba(96,150,255,${wallsA})`;
      ctx.shadowColor = "rgba(60,120,255,0.9)";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const u = (i / 60) * (NECK_U + 0.02);
          const v = 0.5 + side * wall(u);
          i === 0 ? ctx.moveTo(X(u, v), Y(u, v)) : ctx.lineTo(X(u, v), Y(u, v));
        }
        ctx.stroke();
      }
      ctx.restore();

      // Screening gate.
      const gateA = sm((p - 0.12) / 0.1) * (1 - 0.5 * sm((p - 0.5) / 0.1));
      if (gateA > 0.01) {
        const pulse = 0.65 + 0.35 * Math.sin(time * 0.004);
        ctx.save();
        ctx.strokeStyle = `rgba(150,200,255,${gateA * pulse})`;
        ctx.shadowColor = "rgba(90,160,255,1)";
        ctx.shadowBlur = 22;
        ctx.lineWidth = 2;
        const half = wall(GATE_U);
        line(GATE_U, 0.5 - half, GATE_U, 0.5 + half);
        ctx.restore();
      }

      // Interview lanes.
      const lanesA = sm((p - 0.4) / 0.12) * (1 - sm((p - 0.7) / 0.06));
      if (lanesA > 0.01) {
        for (let k = 0; k < LANES; k++) {
          const v = laneV(k);
          ctx.strokeStyle = `rgba(96,150,255,${0.22 * lanesA})`;
          ctx.lineWidth = 1;
          line(LANE_START_U, v, LANE_END_U, v);
          // A pulse travels along each lane at its own pace, like a running interview.
          const t = ((time * 0.00035 + k * 0.137) % 1);
          const u = lerp(LANE_START_U, LANE_END_U, t);
          const g = ctx.createRadialGradient(X(u, v), Y(u, v), 0, X(u, v), Y(u, v), 9);
          g.addColorStop(0, `rgba(170,215,255,${0.9 * lanesA})`);
          g.addColorStop(1, "rgba(80,140,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(X(u, v), Y(u, v), 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Applications, drawn as light streaks.
      ctx.globalCompositeOperation = "lighter";
      const lag = 0.016;
      for (let i = 0; i < particles.length; i++) {
        const q = particles[i];
        stateAt(q, p, a);
        if (a.a <= 0.02) continue;
        stateAt(q, p - lag, b);
        const x1 = X(a.u, a.v), y1 = Y(a.u, a.v);
        const x0 = X(b.u, b.v), y0 = Y(b.u, b.v);
        const strongNow = q.strong && p > q.td + 0.09;
        const color = strongNow ? "170,225,255" : q.strong ? "130,175,255" : "150,170,215";
        if (a.burst > 0.02) {
          ctx.fillStyle = `rgba(255,255,255,${a.burst * 0.5})`;
          ctx.beginPath();
          ctx.arc(x1, y1, 7 * a.burst + 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = `rgba(${color},${a.a * (strongNow ? 0.95 : 0.7)})`;
        ctx.lineWidth = Math.max(1, a.r * 1.15);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1 + 0.01, y1);
        ctx.stroke();
        if (strongNow) {
          ctx.fillStyle = `rgba(120,185,255,${a.a * 0.16})`;
          ctx.beginPath();
          ctx.arc(x1, y1, a.r * 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";

      // The five shortlisted candidates resolve into bright orbs.
      for (let k = 0; k < SHORTLIST_COUNT; k++) {
        const start = 0.74 + k * 0.025;
        const grow = sm((p - start) / 0.07);
        if (grow <= 0.01) continue;
        const ou = vert ? clamp((h - 66) / h, 0.55, 0.86) : 0.81;
        const x = lerp(X(LANE_END_U, 0.5), X(ou, ORB_V[k]), grow);
        const y = lerp(Y(LANE_END_U, 0.5), Y(ou, ORB_V[k]), grow);
        // A thin beam links the interview lanes to each orb.
        ctx.save();
        ctx.strokeStyle = `rgba(140,195,255,${0.32 * grow})`;
        ctx.lineWidth = 1;
        const sx = X(LANE_END_U, 0.5);
        const sy = Y(LANE_END_U, 0.5);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.bezierCurveTo(vert ? sx : (sx + x) / 2, vert ? (sy + y) / 2 : sy, vert ? x : (sx + x) / 2, vert ? (sy + y) / 2 : y, x, y);
        ctx.stroke();
        ctx.restore();
        const radius = (k === 0 ? 11 : 8) * grow;
        const g = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        g.addColorStop(0, `rgba(255,255,255,${0.95 * grow})`);
        g.addColorStop(0.25, `rgba(150,205,255,${0.75 * grow})`);
        g.addColorStop(1, "rgba(60,120,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
        if (k === 0 && p > 0.88) {
          const ring = ((time * 0.0008) % 1);
          ctx.strokeStyle = `rgba(170,215,255,${(1 - ring) * 0.7})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, radius * (1.4 + ring * 3), 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); draw(smooth, performance.now()); });
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "200px" });
    io.observe(el);

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      // Ease toward the scroll position so fast flicks still look smooth.
      smooth += (progress.get() - smooth) * 0.2;
      draw(smooth, t);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [particles, progress]);

  const mode = vertical ? "v" : "h";

  return (
    <div ref={box} className={`fx-scene is-${mode}`}>
      <motion.div className="fx-fill" style={{ opacity: dim }}>
        <canvas ref={canvas} aria-hidden="true" />
        <PlatformHub scroll={scroll} vertical={vertical} />
        <motion.span className="fx-note fx-aside" style={{ opacity: asideOpacity }} aria-hidden="true">Not moving forward</motion.span>
        <motion.span className="fx-note fx-lanes" style={{ opacity: lanesOpacity }} aria-hidden="true">{MATCHED} interviews running at once</motion.span>
        {shortlist.map((_, k) => <OrbLabel key={`${mode}${k}`} k={k} p={progress} vertical={vertical} winner={flags.winner} />)}
      </motion.div>
      {vertical ? (
        <div className="fx-stack">
          <ReportCard key="rcv" scroll={scroll} vertical />
          <AtsSync key="atsv" scroll={scroll} vertical size={sceneSize} />
        </div>
      ) : (
        <>
          <ReportCard key="rch" scroll={scroll} vertical={false} />
          {sceneSize.w > 0 && <HubNode scroll={scroll} size={sceneSize} />}
          <AtsSync key="atsh" scroll={scroll} vertical={false} size={sceneSize} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wrapper                                                             */
/* ------------------------------------------------------------------ */

export function HiringFunnel() {
  const reducedMotion = useReducedMotion();
  const [short, setShort] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-height: 500px)");
    const sync = () => setShort(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // Landscape phones are too short to pin a scene, so they get the static version.
  const reduce = reducedMotion || short;
  const outer = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const giantOpacity = useTransform(scrollYProgress, [0.78, 0.88], [1, 0.1]);
  const funnelProgress = useTransform(scrollYProgress, [0, FUNNEL_END], [0, 1], { clamp: true });

  useMotionValueEvent(scrollYProgress, "change", p => {
    let s = 0;
    STAGE_START.forEach((start, i) => { if (p >= start) s = i; });
    setStage(prev => (prev === s ? prev : s));

    const fp = clamp(p / FUNNEL_END);
    let n: number;
    if (fp < 0.2) n = TOTAL * sm(fp / 0.18);
    else if (fp < 0.44) n = lerp(TOTAL, MATCHED, clamp((fp - 0.2) / 0.24));
    else if (fp < 0.72) n = MATCHED;
    else n = lerp(MATCHED, SHORTLIST_COUNT, sm((fp - 0.72) / 0.18));
    if (counter.current) counter.current.textContent = String(Math.round(n));
    pin.current?.style.setProperty("--fxp", String(clamp(p)));
  });

  const jump = (i: number) => {
    const el = outer.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    const target = Math.min(0.995, STAGE_START[i] + (i === 0 ? 0 : 0.015));
    window.scrollTo({ top: top + travel * target, behavior: "smooth" });
  };

  if (reduce) {
    return (
      <div className="fx-static story-wrap">
        <ol>
          {stages.map((s, i) => (
            <li key={s.n}>
              <span className="fx-static-n">{s.n}</span>
              <strong>{[TOTAL, MATCHED, MATCHED, SHORTLIST_COUNT, ATS.length][i]}</strong>
              <em>{s.unit}</em>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="sample-caption">An illustrative preview. Names and numbers are samples.</p>
      </div>
    );
  }

  const current = stages[stage];
  return (
    <div className="fx" ref={outer}>
      <div className="fx-pin" ref={pin}>
        <motion.div className="fx-giant" style={{ opacity: giantOpacity }} aria-hidden="true"><span ref={counter}>0</span></motion.div>

        <div className="fx-head story-wrap">
          <div className="fx-copy" key={stage}>
            <p className="fx-unit">{current.n} · {current.unit}</p>
            <h3>{current.title}</h3>
            <p>{current.body}</p>
          </div>
        </div>

        <Scene progress={funnelProgress} scroll={scrollYProgress} />

        <div className="fx-steps-wrap story-wrap">
          <ol className="fx-steps" aria-label="Funnel stages">
            {stages.map((s, i) => (
              <li key={s.n}>
                <button type="button" onClick={() => jump(i)} className={i === stage ? "is-active" : i < stage ? "is-done" : ""} aria-current={i === stage ? "step" : undefined}>
                  <span>{s.n}</span>{s.label}
                </button>
              </li>
            ))}
          </ol>
          <p className="fx-caption">An illustrative preview. Names and numbers are samples.</p>
        </div>
      </div>
    </div>
  );
}
