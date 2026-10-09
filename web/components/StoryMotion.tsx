"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

function QuoteWord({ word, index, total, progress, reduced }: { word: string; index: number; total: number; progress: MotionValue<number>; reduced: boolean }) {
  const color = useTransform(progress, [index / total, Math.min(1, (index + 2) / total)], ["#a0b3ce", "#ffffff"]);
  return <motion.span style={{ color: reduced ? "#ffffff" : color }}>{word}{" "}</motion.span>;
}

export function ScrollQuote({ quote }: { quote: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const words = `“${quote}”`.split(/\s+/);
  return <blockquote ref={ref} className="scroll-quote"><span className="sr-only">{quote}</span><span aria-hidden="true">{words.map((word, index) => <QuoteWord key={`${index}-${word}`} word={word} index={index} total={words.length} progress={scrollYProgress} reduced={!!reduced} />)}</span></blockquote>;
}
