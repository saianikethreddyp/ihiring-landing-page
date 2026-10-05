# ihiring.ai redesign plan

Source of truth for copy and assets: `site.config.json`. Screenshots of the current site: `screenshots/`.

## 1. Decisions locked in
- **Audience:** B2B. Primary buyer is the **founder** (startups with no HR, founder hires). Secondary buyer is **HR / talent leads** at larger companies.
- **Pricing:** none shown. Single conversion: **Book a demo / Get a call**.
- **Proof:** logo strip, but see "Open risk" below.
- **Look:** Y Combinator-startup style: plain, fast, text-first, product visible, no decoration for its own sake.

## 2. Open risk: the logo strip
Using real YC companies' logos as if they were ihiring customers is fabricated social proof and a trademark problem. Plan:
- Build the strip as a component fed by a `customers[]` array in config.
- Ship it with **neutral placeholder slots** ("Your logo here" greyed pills), clearly not real brands.
- Fill it only with companies that have agreed to be shown. If ihiring has real YC customers, send names and permission and they go in.
- Alternative that is fully honest today: "Built for YC-stage teams" as a text claim, no logos.

## 3. Message (rewrite, not just restyle)
Today the site talks to candidates and says "Meet Sam". New story for founders:
- **Hero:** "Hire your next engineer this week, not this quarter." Sub: "Sam is an AI interviewer that screens, schedules, interviews and writes the report. 24/7, while you build."
- **Primary CTA:** "Book a demo". Secondary: "Watch Sam interview" (the existing hero video).
- **Proof points kept from the site (do not invent more):** 7.4x team productivity, "minutes not weeks", 24/7, ATS and job-board integrations.
- Founder angle to test, not state as fact: hiring students and junior or fresher talent fast and cheaply. Needs a number from ihiring before it goes live.

## 4. Page structure (one long home page, 9 sections)
1. **Nav** – logo, Product, How it works, FAQ, Blog, Log in, **Book a demo** (solid button). Sticky, shrinks on scroll.
2. **Hero** – headline, sub, two CTAs, the live-interview video as a framed product shot (candidate + transcript).
3. **Logo strip** – see section 2.
4. **The problem / before-after** – "Human-led hiring: weeks. With Sam: minutes." Simple two-column comparison, real figures only.
5. **How it works** – 4 steps: Source → Screen → Schedule → Interview → Report. Reuses the flow diagram as clean SVG.
6. **Product proof** – three cards with the existing GIFs: Productivity, Smart Proctoring, Decision-ready reports.
7. **Works with your stack** – ATS and job boards (Workday, Greenhouse, Lever, Ashby, Bullhorn, LinkedIn, Indeed, Glassdoor). Static grid, replaces the animated dark section.
8. **Founders vs HR** – two short tabs: "For founders" (no HR, hire without losing build time) and "For HR teams" (volume, consistency, ATS sync).
9. **Candidate experience** – the 7 existing candidate quotes, kept but relabelled "What candidates say", as a trust signal, not as buyer proof.
10. **FAQ** – 9 existing Q&As, accordion, two tabs merged into one list.
11. **Final CTA + footer** – "Book a demo" and a short form; footer with Privacy and copyright.

Pages kept: `/demo` (form: name, company, job title, work email, phone, how you heard), `/privacy`, `/blog` (existing candidate-tips post, moved under a "Candidates" label so it does not confuse buyers).

## 5. Visual system
- **Type:** one grotesk for everything (Inter or Geist) plus a mono for labels and numbers. Large, tight headlines, 16-18px body.
- **Color:** off-white page (#fafaf7), near-black text, **one** accent (keep ihiring blue #1d4ed8 for continuity). Drop the pink gradient and the black section.
- **Layout:** 12-col grid, max width 1120px, generous vertical rhythm, 1px hairline borders instead of shadows.
- **Motion:** minimal. Fade-up on scroll, hover states, FAQ expand. Respect reduced-motion.
- **Components:** Button, Nav, Section header, Card, Logo strip, Step, Accordion, Form field, Footer.

## 6. UX requirements
- One conversion path: every CTA goes to the same demo form. Form is 5 fields, inline validation, clear success state.
- Mobile first. Tap targets 44px+. Remove the `user-scalable=no` viewport setting.
- Accessibility: WCAG AA contrast, visible focus, semantic headings, alt text, keyboard-accessible accordion and tabs.
- Performance: replace multi-MB GIFs with compressed video (MP4/WebM) or lazy-loaded GIFs; lazy-load the hero video behind a poster; target Lighthouse 95+.
- SEO fixes: unique title and description per page, a real 1200x630 OG image, correct manifest name, sitemap.

## 7. Build approach
- Static site: plain HTML, CSS and a little JS, no framework needed for a marketing page. Reads copy from `site.config.json` through a small build step so content stays editable in one place.
- Output in `site/` (folder), previewed locally, then published as a private page for review.
- Reuse: logos, SVGs, GIFs, favicons, fonts from `assets/`.

## 8. Milestones
1. Approve this plan and the logo-strip approach.
2. Design tokens + component sheet (type, color, buttons) for sign-off.
3. Build home page desktop, then mobile.
4. Build demo, blog and privacy pages.
5. QA: Lighthouse, accessibility, mobile screenshots, copy check against config.
6. Handoff: deployable folder.

## 9. Needed from you
- Real customer names/logos with permission, or confirm we ship placeholders.
- A real hiring-speed number for founders (e.g. time-to-hire before/after).
- Where "Log in" goes (the existing app URL).
- Where the demo form submits (email, CRM, or a form service).
