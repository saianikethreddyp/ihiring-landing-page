"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export type FlowItem = { name: string; logo?: string };

/**
 * ihiring at the top, one card per ATS below. Lines draw in on scroll, then small pulses travel
 * from the logo to each card, like a report being delivered. Static for reduced-motion visitors.
 */
export function IntegrationFlow({ items }: { items: FlowItem[] }) {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  // Phones swap the fanned lines for a vertical spine; this starts its draw-in when the section is on screen.
  const inView = useInView(root, { once: true, amount: 0.25 });
  const n = items.length;
  // Card centres at the 900px design width (14px gaps), so each line lands on its card.
  const gap = 14, w = (900 - gap * (n - 1)) / n;
  const xs = items.map((_, i) => i * (w + gap) + w / 2);

  return (
    <div className="flow" ref={root} data-in={inView}>
      <div className="flow-hub">
        <span className="flow-hub-ring" aria-hidden="true" />
        <Image src="/logo/ihiring.svg" alt="ihiring" width={100} height={33} className="flow-hub-logo" priority={false} />
      </div>

      <svg className="flow-lines" viewBox="0 0 900 90" preserveAspectRatio="none" aria-hidden="true">
        {xs.map((x, i) => {
          const d = `M450 0 C450 52 ${x} 34 ${x} 90`;
          return (
            <g key={i}>
              <motion.path
                d={d} fill="none" stroke="#b7cdf1" strokeWidth="1.3" vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : i * 0.08, ease: "easeInOut" }}
              />
              <circle r="3.4" fill="#2469f3" className="flow-pulse">
                  <animateMotion dur="3.6s" begin={`${1.2 + i * 0.5}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines="0.45 0 0.55 1" />
                  <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur="3.6s" begin={`${1.2 + i * 0.5}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      <ul className="flow-grid" style={{ ["--flow-cols" as string]: n }} aria-label="Supported ATS integrations">
        {items.map((item, i) => (
          <motion.li
            key={item.name}
            className={item.logo ? "flow-card" : "flow-card flow-card-other"}
            style={{ ["--i" as string]: i }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.5 + i * 0.07, ease: "easeOut" }}
          >
            {item.logo
              ? <Image src={item.logo} alt="" width={48} height={48} className="flow-logo" />
              : <span className="flow-plus" aria-hidden="true"><Plus size={22} strokeWidth={1.6} /></span>}
            <span className="flow-name">{item.name}</span>
            {!item.logo && <span className="flow-sub">and more</span>}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
