# ihiring-landing-page

Redesigned marketing site for [ihiring.ai](https://ihiring.ai), the AI interviewer for founders and hiring teams.

- `web/` — the new site (Next.js 16, Tailwind v4, Framer Motion). See `web/README.md` to run it.
- `site.config.json` — all content scraped from the original site (copy, FAQ, testimonials, SEO, design tokens).
- `assets/`, `raw/`, `screenshots/` — scraped assets, raw HTML and before/after screenshots.
- `research/` — screenshots and notes from reference sites used for the design system.
- `scripts/` — the Playwright scrapers and review scripts.
- `PLAN.md` — the redesign plan.

## Run the site

    cd web
    npm install
    npm run dev
