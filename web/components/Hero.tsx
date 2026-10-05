"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { LiveInterview } from "@/components/LiveInterview";
import { TrustedBy } from "@/components/TrustedBy";
import { DEMO_HREF } from "@/lib/site";

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.21, 0.6, 0.35, 1] as const },
        };

  return (
    <section className="relative overflow-hidden pb-10">
      {/* soft violet dawn */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18%] h-[720px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(14,93,252,0.28), rgba(39,51,55,0.10) 55%, transparent 80%)" }}
      />
      <Container className="relative pt-14 sm:pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <motion.p
            {...rise(0)}
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card/70 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-mute backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="motion-safe-anim absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
            </span>
            Sam is interviewing right now
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="display mt-7 text-balance text-[clamp(3.25rem,9vw,8rem)] leading-[0.95]"
          >
            Your first ten hires, <em>interviewed overnight.</em>
          </motion.h1>

          <motion.p {...rise(0.18)} className="mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed text-mute sm:text-xl">
            Sam is the AI interviewer for founders and hiring teams. It screens applicants, books the calls, runs live
            video interviews and leaves a scorecard on your desk by morning.
          </motion.p>

          <motion.div {...rise(0.26)} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={DEMO_HREF} size="lg">
              Book a demo <ArrowRight size={17} />
            </Button>
            <a
              href="#how"
              className="inline-flex h-13 items-center gap-2 rounded-full px-6 text-[15px] font-medium text-ink/80 transition-colors hover:text-ink"
            >
              See how it works <ArrowDown size={16} />
            </a>
          </motion.div>
        </div>

        <motion.div {...rise(0.38)} className="mx-auto mt-16 max-w-5xl">
          <LiveInterview />
          <p className="mt-3 text-center font-mono text-[11px] text-mute">
            Sample interview, played back live. Real reports include video, transcript and scorecard.
          </p>
        </motion.div>
      </Container>

      <Container>
        <TrustedBy />
      </Container>
    </section>
  );
}
