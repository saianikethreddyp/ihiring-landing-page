"use client";

import { useState } from "react";
import { ArrowUpRight, Pause, Play } from "lucide-react";
import { InitialAvatar } from "@/components/Avatar";
import { StoryReveal } from "@/components/StoryReveal";
import { candidateThemes, initialsOf, testimonials } from "@/lib/site";

const G2_URL = "https://www.g2.com/products/ihiring-ai/reviews";

type T = (typeof testimonials)[number];

function Card({ t }: { t: T }) {
  return (
    <li className="cv-card">
      <span className="cv-theme">{candidateThemes[t.name]}</span>
      <blockquote>“{t.quote}”</blockquote>
      <div className="cv-who">
        <InitialAvatar initials={initialsOf(t.name)} className="quote-avatar" />
        <span><strong>{t.name}</strong><span>{t.role}</span></span>
      </div>
    </li>
  );
}

/** Two slow rows of candidate cards moving in opposite directions. Pauses on hover, focus or the button. */
function Row({ items, reverse, hidden }: { items: T[]; reverse?: boolean; hidden?: boolean }) {
  return (
    <div className={`cv-row${reverse ? " cv-row-reverse" : ""}`} aria-hidden={hidden || undefined}>
      <div className="cv-track">
        <ul>{items.map(t => <Card key={t.name} t={t} />)}</ul>
        <ul aria-hidden="true">{items.map(t => <Card key={t.name} t={t} />)}</ul>
      </div>
    </div>
  );
}

export function CandidateVoices() {
  const [paused, setPaused] = useState(false);
  const second = [...testimonials.slice(3), ...testimonials.slice(0, 3)];

  return (
    <section className={`cv${paused ? " is-paused" : ""}`} aria-labelledby="cv-title">
      <StoryReveal>
        <header className="cv-head">
          <p className="story-kicker">What candidates say</p>
          <h2 id="cv-title">Heard it from the people<br /><em>SAM interviewed.</em></h2>
          <p>Feedback from candidates interviewed on ihiring, shared with their permission.</p>
        </header>

        <div className="cv-rows" role="region" aria-label="Candidate feedback">
          <Row items={testimonials} />
          <Row items={second} reverse hidden />
        </div>

        <div className="cv-foot">
          <button type="button" className="cv-pause" aria-pressed={paused} onClick={() => setPaused(p => !p)}>
            {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
            {paused ? "Play animation" : "Pause animation"}
          </button>
          <a className="story-text-link cv-link" href={G2_URL} target="_blank" rel="noopener noreferrer">
            Read reviews on G2 <ArrowUpRight size={16} /><span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </StoryReveal>
    </section>
  );
}
