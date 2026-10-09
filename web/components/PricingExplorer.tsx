"use client";

import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { featureRows, money, perInterview, plans } from "@/lib/pricing";
import { DEMO_HREF } from "@/lib/site";

/** One question, one answer: pick a monthly volume, see the plan that covers it. */
const options = [
  ...plans.filter(p => p.interviews).map(p => ({ id: p.id, label: `Up to ${p.interviews!.toLocaleString("en-US")}` })),
  { id: "enterprise", label: "More than 2,000" },
];

export function PricingExplorer() {
  const [selected, setSelected] = useState("basic");
  const plan = plans.find(p => p.id === selected)!;
  const per = perInterview(plan);
  const extras = featureRows.filter(f => plan.has.includes(f.id)).map(f => f.label);

  return (
    <div className="explorer">
      <fieldset className="volume">
        <legend>How many interviews will you run each month?</legend>
        <div className="volume-options">
          {options.map(o => (
            <label key={o.id} className={o.id === selected ? "is-selected" : ""}>
              <input type="radio" name="volume" value={o.id} checked={o.id === selected} onChange={() => setSelected(o.id)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <section className="answer" aria-live="polite" aria-label={`${plan.name} plan`}>
        <div className="answer-price">
          <p className="answer-plan">{plan.name}</p>
          {plan.price ? (
            <>
              <p className="answer-amount">{money(plan.price)}<small>a month</small></p>
              <p className="answer-per">{per ? `$${per.toFixed(2)} per interview when you use all ${plan.interviews!.toLocaleString("en-US")}` : null}</p>
            </>
          ) : (
            <>
              <p className="answer-amount">Custom</p>
              <p className="answer-per">Priced to your volume</p>
            </>
          )}
          <Link className="story-button" href={DEMO_HREF}>{plan.price ? "Book a demo" : "Talk to sales"}</Link>
          <Link className="answer-trial" href="/contact">Ask about the free trial</Link>
        </div>

        <div className="answer-detail">
          <dl className="answer-facts">
            <div><dt>Interviews a month</dt><dd>{plan.interviews ? plan.interviews.toLocaleString("en-US") : "Custom"}</dd></div>
            <div><dt>Team members</dt><dd>{plan.seats}</dd></div>
            <div><dt>Active job posts</dt><dd>{plan.jobPosts}</dd></div>
            <div><dt>Videos kept</dt><dd>{plan.retentionDays} days</dd></div>
          </dl>
          {extras.length > 0 && (
            <>
              <p className="answer-extras-title">Also in this plan</p>
              <ul className="answer-extras">
                {extras.map(e => <li key={e}><Check size={16} aria-hidden="true" />{e}</li>)}
              </ul>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
