"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { Container, SectionHeader } from "@/components/ui";

// One illustrative candidate journey. Clearly labelled as an example.
const beats = [
  {
    time: "11:48 pm",
    title: "Ethan applies.",
    body: "He finds your role on a job board and submits his resume. You are asleep.",
    chip: "New applicant · via LinkedIn",
  },
  {
    time: "11:49 pm",
    title: "Sam reads every line.",
    body: "Sam screens his resume against the role, ranks him against everyone else and decides he is worth an interview.",
    chip: "Match 94% · invited",
  },
  {
    time: "11:52 pm",
    title: "She books herself in.",
    body: "No email chain, no timezone maths. Ethan picks a slot from Sam's calendar and can move it any time.",
    chip: "Booked · Tue 7:00 am",
  },
  {
    time: "7:00 am",
    title: "Sam interviews him, live.",
    body: "A real 1:1 video conversation with follow-up questions that test depth. Proctoring runs in the background.",
    chip: "Live · proctoring on",
  },
  {
    time: "7:38 am",
    title: "You wake up to a decision.",
    body: "Video, transcript and a scorecard land in your ATS. You spend ten minutes on a call that used to take a week.",
    chip: "Report ready · synced to your ATS",
  },
];

export function NightShift() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <section id="how" className="py-20 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              eyebrow="One night, one hire"
              title={
                <>
                  Hiring used to take months. Here it takes <em>one night.</em>
                </>
              }
              sub="Follow a single candidate through ihiring. Every step Sam handles is a step you no longer do."
            />
            <p className="mt-8 inline-flex rounded-full border border-ink/10 bg-card px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-mute">
              Illustrative example
            </p>
          </div>

          <ol ref={ref} className="relative space-y-12 pl-10 sm:pl-14">
            <span className="absolute bottom-2 left-[15px] top-2 w-px bg-ink/10 sm:left-[23px]" aria-hidden />
            <motion.span
              aria-hidden
              className="absolute left-[15px] top-2 w-px origin-top bg-brand sm:left-[23px]"
              style={{ bottom: "0.5rem", scaleY: reduce ? 1 : progress }}
            />
            {beats.map((b, i) => (
              <motion.li
                key={b.time}
                className="relative"
                initial={reduce ? false : { opacity: 0.25, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-35% 0px -35% 0px" }}
                transition={{ duration: 0.45 }}
              >
                <span
                  className="absolute -left-10 top-1.5 flex h-[31px] w-[31px] items-center justify-center rounded-full border border-ink/10 bg-paper font-mono text-[10px] text-mute sm:-left-14 sm:h-[47px] sm:w-[47px] sm:text-xs"
                  aria-hidden
                >
                  0{i + 1}
                </span>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-brand">{b.time}</p>
                <h3 className="display mt-2 text-3xl sm:text-4xl">{b.title}</h3>
                <p className="mt-3 max-w-md leading-relaxed text-mute">{b.body}</p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-3 py-1.5 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-good" aria-hidden />
                  {b.chip}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
