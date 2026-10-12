"use client";

import { useEffect, useRef, useState } from "react";
import dots from "@/content/world-dots.json";

// Equirectangular projection onto a 360 x 138 viewBox (lat 80 .. -58), same as the dot data.
const W = 360;
const H = 138;
const px = (lon: number) => lon + 180;
const py = (lat: number) => 80 - lat;

// Illustrative cities, one per major region. These are examples, not customer locations.
const cities = [
  { name: "San Francisco", lat: 37.77, lon: -122.42, tz: "America/Los_Angeles" },
  { name: "New York", lat: 40.71, lon: -74.0, tz: "America/New_York" },
  { name: "London", lat: 51.5, lon: -0.12, tz: "Europe/London" },
  { name: "Dubai", lat: 25.2, lon: 55.27, tz: "Asia/Dubai" },
  { name: "Bengaluru", lat: 12.97, lon: 77.59, tz: "Asia/Kolkata" },
  { name: "Singapore", lat: 1.35, lon: 103.82, tz: "Asia/Singapore" },
  { name: "Sydney", lat: -33.87, lon: 151.21, tz: "Australia/Sydney" },
];

const SIM_SECONDS_PER_HOUR = 1.4; // one simulated day takes about 34 seconds

const rad = (d: number) => (d * Math.PI) / 180;

/** Sun position for a UTC date: subsolar longitude and declination, in degrees. */
function sunAt(date: Date) {
  const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - start) / 86400000;
  return {
    lon: 180 - utcHours * 15,
    dec: 23.44 * Math.sin(rad((360 / 365) * (dayOfYear - 81))),
  };
}

function localHour(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "numeric", hour12: false }).formatToParts(date);
  const h = Number(parts.find(p => p.type === "hour")?.value) % 24;
  const m = Number(parts.find(p => p.type === "minute")?.value);
  return { h, m };
}

const fmt = (h: number, m: number) => {
  const suffix = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${suffix}`;
};

const isWorking = (h: number) => h >= 8 && h < 20;

export function GlobalClock() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const origin = Date.now();
    let visible = true;
    let raf = 0;
    let lastState = 0;
    let size = { w: 0, h: 0, dpr: 1 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = box.clientWidth;
      const h = (w * H) / W;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      cv.style.height = `${h}px`;
      size = { w, h, dpr };
    };

    const draw = (date: Date) => {
      const { w, h, dpr } = size;
      if (!w) return;
      const sun = sunAt(date);
      const sinD = Math.sin(rad(sun.dec));
      const cosD = Math.cos(rad(sun.dec));
      const r = Math.max(0.9, (w / W) * 0.6) * dpr;
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (const [lon, lat] of dots as [number, number][]) {
        const altitude = Math.sin(rad(lat)) * sinD + Math.cos(rad(lat)) * cosD * Math.cos(rad(lon - sun.lon));
        // Smooth edge across the terminator.
        const day = Math.min(1, Math.max(0, altitude * 6 + 0.5));
        ctx.fillStyle = day > 0.5 ? `rgba(14,93,252,${0.25 + 0.4 * day})` : "rgba(120,139,170,0.38)";
        ctx.beginPath();
        ctx.arc((px(lon) / W) * w * dpr, (py(lat) / H) * h * dpr, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const dateAt = (t: number) => new Date(origin + ((t - 0) / 1000 / SIM_SECONDS_PER_HOUR) * 3600000);

    resize();
    const ro = new ResizeObserver(() => { resize(); draw(dateAt(performance.now())); });
    ro.observe(box);

    if (reduce) {
      const d = new Date();
      draw(d);
      setNow(d);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(box);

    const start = performance.now();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const d = dateAt(t - start);
      draw(d);
      if (t - lastState > 250) { lastState = t; setNow(d); }
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, []);

  const utc = now ? `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}` : "--:--";
  const rows = cities.map(c => {
    const t = now ? localHour(now, c.tz) : null;
    return { ...c, time: t ? fmt(t.h, t.m) : "", live: t ? isWorking(t.h) : false };
  });

  return (
    <div className="global-clock">
      <div className="global-map" ref={wrap}>
        <canvas ref={canvas} role="img" aria-label="World map showing day and night moving across example cities in every time zone" />
        {rows.map(c => (
          <span
            key={c.name}
            className={`global-pin${c.live ? " is-live" : ""}`}
            style={{ left: `${(px(c.lon) / W) * 100}%`, top: `${(py(c.lat) / H) * 100}%` }}
          >
            <i aria-hidden="true" />
            <span className="global-pin-label"><b>{c.name}</b>{c.time}</span>
          </span>
        ))}
        <div className="global-utc" aria-hidden="true">UTC {utc}</div>
      </div>

      <ul className="global-list">
        {rows.map(c => (
          <li key={c.name} className={c.live ? "is-live" : ""}>
            <i aria-hidden="true" />
            <span><b>{c.name}</b><small>{c.time || " "}</small></span>
            <em>{c.live ? "Interviewing" : "Booking open"}</em>
          </li>
        ))}
      </ul>
      <p className="sample-caption">An illustrative preview. Cities and times are examples on a simulated clock.</p>
    </div>
  );
}
