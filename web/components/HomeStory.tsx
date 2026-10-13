import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { CandidateVoices } from "@/components/CandidateVoices";
import { IntegrationFlow } from "@/components/IntegrationFlow";
import { StoryFAQ } from "@/components/StoryFAQ";
import { StoryReveal } from "@/components/StoryReveal";
import { HowItWorks } from "@/components/HowItWorks";
import { TaskHandoff } from "@/components/TaskHandoff";
import { ClientLogos } from "@/components/ClientLogos";
import { GlobalClock } from "@/components/GlobalClock";
import { HiringFunnel } from "@/components/HiringFunnel";
import { integrations } from "@/lib/site";

const interviewUrl = "https://play.gumlet.io/embed/67c14d5d3e62e5390999631b?autoplay=false";
const questions = [
  { q: "What does SAM do?", a: "SAM is ihiring’s AI interviewer. It screens resumes, helps candidates schedule interviews, conducts conversations and delivers detailed reports for your team to review." },
  { q: "Who is ihiring built for?", a: "Staffing and recruitment firms, enterprise talent teams, and startups and growing teams that want more time for the people behind the applications." },
  { q: "Can we keep using our ATS?", a: "ihiring integrates with Workday, Greenhouse, Lever, Ashby and Bullhorn, so interview insights can fit into your existing hiring process." },
  { q: "What is the candidate experience like?", a: "Candidates book a time and have a live conversation with SAM, with a transcript alongside. You can watch a sample interview using the link above." },
  { q: "Does SAM make the final hiring decision?", a: "Your hiring team stays in control. SAM provides interview reports and insights, and people decide who moves forward." },
];

export function HomeStory() {
  return (
    <div className="story-home">
      <section className="story-hero" aria-labelledby="story-title">
        <div className="hero-layout story-wrap">
          <div className="hero-copy">

            <p className="story-kicker">Meet SAM · The AI interviewer</p>
            <h1 id="story-title"><span className="hero-line"><span>Less time screening.</span></span><span className="hero-line"><em>More time hiring.</em></span></h1>
            <p className="hero-description">SAM handles screening, scheduling and first interviews in one workflow.<br className="wide-break" /> <strong>Get the report.</strong> Decide who moves forward.</p>
            <div className="story-actions">
              <a href="#how" className="story-button"><span className="button-label"><span>See how SAM works</span><span aria-hidden="true">See how SAM works</span></span> <ArrowDown size={17} /></a>
              <a href={interviewUrl} className="story-button story-button-outline" target="_blank" rel="noopener noreferrer">Watch an interview <ArrowUpRight size={17} /><span className="sr-only"> (opens in a new tab)</span></a>
            </div>
            <p className="hero-assurance">24/7 scheduling <span aria-hidden="true">·</span> ATS integrations <span aria-hidden="true">·</span> Human hiring decisions</p>

            {/* Upper Social Proof: G2 & Capterra Official Badges & Ratings */}
            <div className="hero-reviews-strip">
              <a
                href="https://www.g2.com/products/ihiring-ai/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="review-pill-card"
              >
                <div className="review-pill-logo">
                  <Image src="/brands/g2-badge.svg" alt="G2" width={95} height={30} className="h-6 w-auto object-contain" />
                </div>
                <div className="review-pill-text">
                  <div className="review-pill-stars">
                    <span className="stars-gold" aria-hidden="true">★★★★★</span>
                    <strong className="rating-num">4.9/5</strong>
                  </div>
                  <span className="review-pill-count">16+ Verified Reviews<span className="sr-only"> (opens in a new tab)</span></span>
                </div>
              </a>

              <span className="review-pill-divider" aria-hidden="true" />

              <a
                href="https://www.capterra.com/p/10031866/ihiring/reviews/"
                target="_blank"
                rel="noopener noreferrer"
                className="review-pill-card"
              >
                <div className="review-pill-logo">
                  <Image src="/brands/capterra-badge.svg" alt="Capterra" width={110} height={30} className="h-6 w-auto object-contain" />
                </div>
                <div className="review-pill-text">
                  <div className="review-pill-stars">
                    <span className="stars-gold" aria-hidden="true">★★★★★</span>
                    <strong className="rating-num">5.0/5</strong>
                  </div>
                  <span className="review-pill-count">Top Rated AI Interviewer<span className="sr-only"> (opens in a new tab)</span></span>
                </div>
              </a>
            </div>
          </div>
        </div>
        <ClientLogos />
      </section>

      <section id="how" className="story-journey story-wrap">
        <StoryReveal className="section-heading"><p className="story-kicker">How it works</p><h2>From application<br /><em>to interview report.</em></h2><p>From the first application to the next conversation. Your team stays in control.</p></StoryReveal>
        <HowItWorks />
        <p className="sample-caption">An illustrative preview of the SAM workflow.</p>
      </section>

      <section id="product" className="story-handoff story-wrap">
        <StoryReveal className="benefits-intro section-heading"><p className="story-kicker">Make room for better hiring</p><h2>Less coordination.<br /><em>More conversation.</em></h2><p>Scroll to see which tasks move from your team to SAM.</p></StoryReveal>
        <TaskHandoff />
      </section>

      <section id="stack" className="story-stack">
        <div className="story-wrap stack-layout"><StoryReveal className="section-heading"><p className="story-kicker">Integrations</p><h2>Works with<br /><em>your hiring tools.</em></h2><p>Your hiring process, with less admin.<br />Bring ihiring’s interview insights into the tools your team already uses.</p><a href="#how" className="story-text-link">Explore the workflow <ArrowUpRight size={17} /></a></StoryReveal><StoryReveal className="integration-network"><IntegrationFlow items={[...integrations.filter(item => item.kind === "ATS").map(item => ({ name: item.name, logo: `/brands/${item.name.toLowerCase()}.png` })), { name: "Others" }]} /></StoryReveal></div>
      </section>

      <section id="funnel" className="story-funnel">
        <StoryReveal className="section-heading story-wrap"><p className="story-kicker">From applicants to shortlist</p><h2>500 applications in,<br /><em>5 reports out.</em></h2><p>Follow a sample role as SAM turns a pile of applications into a shortlist your team can act on.</p></StoryReveal>
        <HiringFunnel />
      </section>

      <section id="who" className="story-audience story-wrap"><StoryReveal className="section-heading"><p className="story-kicker">Who it’s for</p><h2>Built for teams<br /><em>ready to grow.</em></h2></StoryReveal><div className="audience-grid">{[
        { label: "Staffing and recruitment firms", title: "Interview every candidate for every client.", body: "Run screening, scheduling and first interviews across client roles, then send each client a report with video, transcript and summary. Syncs with Bullhorn." },
        { label: "Startups and growing teams", title: "First rounds without a recruiting team.", body: "Let SAM handle screening and first interviews while you stay focused on building, and step in only for the final conversations." },
        { label: "Enterprise talent teams", title: "One consistent first round at scale.", body: "Give every applicant the same structured interview, with results synced to Workday, Greenhouse or Lever for your recruiters to review." },
      ].map((item, i) => <article key={item.label}><span className="audience-number">0{i + 1}</span><div className="audience-title"><p className="audience-label">{item.label}</p><h3>{item.title}</h3></div><p>{item.body}</p></article>)}</div></section>

      <CandidateVoices />

      <section id="global" className="story-global story-wrap">
        <StoryReveal className="section-heading"><p className="story-kicker">Global, around the clock</p><h2>Always on shift,<br /><em>in every time zone.</em></h2><p>Candidates pick a time in their own time zone, and SAM is ready whenever they are. Your pipeline never waits on your calendar.</p></StoryReveal>
        <GlobalClock />
      </section>

      <section id="faq" className="story-faq story-wrap"><StoryReveal className="section-heading"><p className="story-kicker">Frequently asked questions</p><h2>A few things<br /><em>you might ask.</em></h2><p>Getting ready to meet SAM?<br /><Link href="/blog/candidate-interview-guide" className="story-text-link">Read the candidate guide <ArrowUpRight size={16} /></Link></p></StoryReveal><StoryFAQ questions={questions} /></section>

      <section className="story-final"><div className="story-wrap"><p className="story-kicker">See SAM in action</p><h2>Your next hire starts<br /><em>with a better first round.</em></h2><p>See the questions, follow-ups and candidate experience for yourself.</p><a className="interview-watch-card" href={interviewUrl} target="_blank" rel="noopener noreferrer"><span className="watch-play"><Play size={19} fill="currentColor" aria-hidden="true" /></span><span><strong>Watch SAM in action</strong><span>A conversation with a candidate</span></span><ArrowUpRight size={22} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></div></section>
    </div>
  );
}
