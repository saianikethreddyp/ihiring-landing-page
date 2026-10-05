"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container, Eyebrow } from "@/components/ui";
import { testimonials } from "@/lib/site";

export function Voices() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = testimonials.length;
  const t = testimonials[i];

  useEffect(() => {
    if (paused || reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % n), 7000);
    return () => clearInterval(id);
  }, [paused, reduce, n]);

  return (
    <section
      className="border-y border-ink/10 bg-card py-20 sm:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Container>
        <Eyebrow>What candidates say</Eyebrow>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <div className="min-h-[18rem] sm:min-h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.figure
                key={i}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <blockquote className="display text-balance text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft font-medium text-brand"
                  >
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-medium">{t.name}</span>
                    <span className="block text-sm text-mute">{t.role}, interviewed by Sam</span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => setI((v) => (v - 1 + n) % n)}
              aria-label="Previous quote"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-ink"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => setI((v) => (v + 1) % n)}
              aria-label="Next quote"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper transition-colors hover:bg-ink-2"
            >
              <ArrowRight size={18} />
            </button>
            <p className="ml-2 font-mono text-xs text-mute tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
