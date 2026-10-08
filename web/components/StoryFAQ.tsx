"use client";

import { Plus } from "lucide-react";

export function StoryFAQ({ questions }: { questions: { q: string; a: string }[] }) {
  return (
    <div className="story-faq-list">
      {questions.map(item => (
        <details key={item.q} onToggle={event => {
          if (!event.currentTarget.open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          const answer = event.currentTarget.querySelector("p");
          answer?.getAnimations().forEach(animation => animation.cancel());
          answer?.animate([
            { opacity: 0, transform: "translateY(-6px)" },
            { opacity: 1, transform: "translateY(0)" },
          ], { duration: 260, easing: "ease-out" });
        }}>
          <summary>{item.q}<Plus size={19} aria-hidden="true" /></summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
