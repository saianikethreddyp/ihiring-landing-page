"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Animate once on arrival; content stays readable without JavaScript. */
export function StoryReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || preference.matches) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      animation = element.animate([
        { opacity: .3, transform: "translateY(18px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 650, delay, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" });
      observer.disconnect();
    }, { threshold: .15 });
    const stop = () => { if (preference.matches) { animation?.cancel(); observer.disconnect(); } };
    observer.observe(element);
    preference.addEventListener("change", stop);
    return () => { observer.disconnect(); animation?.cancel(); preference.removeEventListener("change", stop); };
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}
