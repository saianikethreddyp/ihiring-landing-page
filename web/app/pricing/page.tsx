import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { PricingExplorer } from "@/components/PricingExplorer";
import { StoryFAQ } from "@/components/StoryFAQ";
import { DEMO_HREF } from "@/lib/site";
import { G2, everyPlan, featureRows, money, perInterview, perInterviewRange, plans, pricingFaqs } from "@/lib/pricing";
import "../story.css";
import "./pricing.css";

export const metadata: Metadata = {
  title: "Pricing",
  alternates: { canonical: "/pricing" },
  description: "Plans from $152 a month for 25 interviews. Pick your monthly volume and see your price.",
};

const range = perInterviewRange();

function Cell({ on }: { on: boolean }) {
  return on
    ? <><Check size={18} className="yes" aria-hidden="true" /><span className="sr-only">Included</span></>
    : <><Minus size={18} className="no" aria-hidden="true" /><span className="sr-only">Not included</span></>;
}

export default function PricingPage() {
  return (
    <div className="story-home pricing-page">
      <div className="story-wrap">
        <header className="pricing-hero">
          <p className="story-kicker">Pricing</p>
          <h1>From ${range.min.toFixed(2)} to ${range.max.toFixed(2)} <em>per AI interview.</em></h1>
          <p>Tell us how many interviews you run. We will show you the plan.</p>
        </header>

        <PricingExplorer />

        <p className="every-plan">
          <strong>Every plan includes</strong> {everyPlan.map(f => f.title.toLowerCase()).join(", ")}.
          {" "}Rated {G2.rating} out of 5 from {G2.reviews} reviews on <a href={G2.url} target="_blank" rel="noopener noreferrer">G2<span className="sr-only"> (opens in a new tab)</span></a>.
        </p>

        <section className="glance" aria-labelledby="glance">
          <h2 id="glance">All plans at a glance</h2>
          <table>
            <thead>
              <tr><th scope="col">Plan</th><th scope="col">Interviews a month</th><th scope="col">Price a month</th><th scope="col">Per interview</th></tr>
            </thead>
            <tbody>
              {plans.map(p => {
                const per = perInterview(p);
                return (
                  <tr key={p.id}>
                    <th scope="row">{p.name}</th>
                    <td>{p.interviews ? p.interviews.toLocaleString("en-US") : "Custom"}</td>
                    <td>{p.price ? money(p.price) : "Custom"}</td>
                    <td>{per ? `$${per.toFixed(2)}` : "Custom"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="glance-note">Prices are in US dollars. Per interview is the monthly price divided by the monthly interviews.</p>
        </section>

        <details className="compare-details">
          <summary>Compare every feature</summary>
          <div className="compare-scroll" tabIndex={0} role="region" aria-label="Feature comparison, scrolls sideways on small screens">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col"><span className="sr-only">Feature</span></th>
                  {plans.map(p => <th key={p.id} scope="col">{p.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><th scope="row">Resume screens with report</th>{plans.map(p => <td key={p.id}>{p.resumeScreens ?? "Custom"}</td>)}</tr>
                <tr><th scope="row">Support</th>{plans.map(p => <td key={p.id}>{p.support}</td>)}</tr>
                {featureRows.map(f => (
                  <tr key={f.id}><th scope="row">{f.label}</th>{plans.map(p => <td key={p.id}><Cell on={p.has.includes(f.id)} /></td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <section id="faq" className="pricing-faq" aria-labelledby="pricing-faq">
          <h2 id="pricing-faq">Common questions</h2>
          <StoryFAQ questions={pricingFaqs} />
        </section>
      </div>

      <section className="story-final">
        <div className="story-wrap">
          <h2>Not sure which plan fits?<br /><em>Tell us your volume.</em></h2>
          <p>Share how many roles and candidates you handle and we will recommend a plan.</p>
          <a className="story-button" href={DEMO_HREF}>Book a demo</a>
        </div>
      </section>
    </div>
  );
}
