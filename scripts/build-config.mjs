// Merges raw scrape output into one clean, redesign-ready site.config.json
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const raw = JSON.parse(fs.readFileSync('raw/scrape-raw.json', 'utf8'));
const o = JSON.parse(fs.readFileSync('raw/interactive.json', 'utf8'));
const h = raw.pages.home;
const list = (d) => execSync(`find assets/${d} -type f | sort`).toString().trim().split('\n').filter(Boolean);

const cfg = {
  meta: { source: 'https://ihiring.ai/', scrapedAt: raw.site.scrapedAt, tool: 'playwright-chromium', pages: Object.keys(raw.pages) },

  brand: {
    name: 'ihiring.ai',
    legalName: 'ihiring Inc.',
    persona: 'SAM, the AI interviewer',
    tagline: 'Meet Sam! The Only AI Interviewer That Thinks Beyond Intelligence',
    twitter: '@ihiring',
    reviews: { g2: 'https://www.g2.com/products/ihiring-ai/reviews', capterra: 'https://www.capterra.com/p/10031866/ihiring/reviews/' },
    logos: {
      wordmark: 'assets/logos/main-logo.svg',
      wordmarkAlt: 'assets/logos/Logo.svg',
      mark96: 'assets/logos/ihiring-mark-96.png',
      mark512: 'assets/logos/ihiring-mark-512.png',
      favicon: 'assets/icons/favicon.ico',
      appleTouch: 'assets/icons/apple-touch-icon.png',
      linkedin: 'assets/logos/linkedin-logo.svg',
      g2Badge: 'assets/svg/G2_ihiring_website.svg',
      capterraBadge: 'assets/svg/fbf7dad7-3830-4620-a9ea-e91c23a1a245.svg',
    },
  },

  seo: {
    title: h.title,
    description: h.meta.description,
    keywords: h.meta.keywords,
    social: Object.fromEntries(Object.entries(h.meta).filter(([k]) => /^(og|twitter)/.test(k))),
    themeColor: h.meta['theme-color'],
    robots: raw.extras['/robots.txt'],
    sitemap: raw.extras['/sitemap.xml'],
    issues: [
      'og:image points to a 96px favicon but declares 1200x630',
      'Web manifest still says name "MyWebSite"',
      'Viewport disables zoom (user-scalable=no) - accessibility problem',
      'Same <title> on every subpage',
    ],
  },

  navigation: {
    header: [
      { label: 'Features', href: '/#Features' },
      { label: 'Actionable Insights', href: '/#Actionable_Insights' },
      { label: 'Functionality', href: '/#Functionality' },
      { label: 'Blog', href: '/tips-for-interview' },
      { label: 'Pricing', href: '/contact-us', note: 'Pricing links to the demo form; no pricing page exists' },
    ],
    actions: [{ label: 'Login', kind: 'button' }, { label: 'Get a Demo', kind: 'button', goesTo: '/contact-us' }],
    footer: [
      { label: 'Features', href: '/#Features' },
      { label: 'Actionable Insights', href: '/#Actionable_Insights' },
      { label: 'Functionality', href: '/#Functionality' },
      { label: "FAQ's", href: '/#FAQs' },
      { label: 'Blog', href: '/tips-for-interview' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
    ],
    copyright: 'ihiring Inc. | All Rights Reserved © 2025',
  },

  home: {
    hero: {
      eyebrow: 'Meet Sam!',
      headline: 'The Only AI Interviewer',
      subheadline: 'That Thinks Beyond Intelligence',
      chips: ['Screening', 'Scheduling', 'Interviewing', 'Analyzed Reports', 'ATS Integration'],
      cta: 'See ihiring',
      video: {
        provider: 'gumlet',
        embed: o.heroVideo,
        screenshot: 'screenshots/hero-video-frame.png',
        thumbnails: list('video-thumbnails'),
        ui: 'Candidate video left; "Live Transcripts" chat right; role tag "Backend Engineer"; SAM orb bottom-right',
      },
    },
    features: {
      id: 'Features',
      heading: 'Let SAM handle your overwhelming tasks, too!',
      items: [
        {
          title: 'Precise Pipeline Management',
          body: 'Screen and onboard qualified candidates from every source, ensuring a quality interview pipeline.',
          visual: 'Flow diagram: Source -> Screen -> Schedule / Report -> Interview -> ihiring ATS | Your ATS',
          assets: ['assets/svg/file_flow.svg', 'assets/svg/flow-right-image.svg', 'assets/svg/flow_vector.svg'],
        },
        {
          title: 'Auto Schedule Anytime',
          body: "Candidates can instantly schedule, reschedule interviews 24/7 through Sam's smart calendar.",
          visual: 'Animated scheduling GIF',
          assets: ['assets/gifs/interview_Schedule_Latest.gif'],
        },
      ],
    },
    actionableInsights: {
      id: 'Actionable_Insights',
      badge: 'Actionable Insights',
      heading: 'Vet Qualified Candidates in Minutes, Not Weeks',
      subheading: 'Swiftly filter through thousands of candidates to identify the most qualified and onboard top talent faster than ever',
      items: [
        { title: 'Increases Productivity', body: "Increases your teams productivity by 7.4x and achieve your planned KPI's.", asset: 'assets/gifs/IncreasesProductivity2-new.gif' },
        { title: 'Smart Proctoring', body: 'A real-time cheating detection system ensures interview integrity', asset: 'assets/gifs/Smart_Proctor.gif' },
        { title: 'Decision-Ready Insights', body: 'Sam writes and delivers detailed, unbiased interview reports after each stage, enabling quick, informed, merit-based decisions', asset: 'assets/gifs/InsightsVideo2.gif' },
      ],
    },
    functionality: {
      id: 'Functionality',
      eyebrow: 'Move Smart',
      heading: 'Designed to fit every need, for teams of any size!',
      pipeline: ['Smart Screening', 'Auto Scheduling', 'AI Interviewing', 'Reports', 'ATS Integration'],
      footnote: '*Seamlessly integrates with any enterprise, staffing, or recruitment model and ATS.',
      integrationsInGraphic: ['LinkedIn', 'Indeed', 'Glassdoor', 'Workday', 'Robert Half'],
      integrationsNamedInFaq: ['Workday', 'Greenhouse', 'Lever', 'Ashby', 'Bullhorn', 'LinkedIn', 'Indeed', 'Glassdoor'],
      screenshots: ['screenshots/integrations-0.png', 'screenshots/integrations-1.png', 'screenshots/integrations-2.png'],
    },
    testimonials: {
      heading: "Candidates (thumbs-up) ihiring's SAM",
      note: 'These are quotes from CANDIDATES interviewed by SAM, not from buyers. No customer logos or buyer testimonials exist on the site.',
      items: o.testimonials.filter((t) => t.name).map((t) => {
        const [name, role] = t.name.split('\n');
        return { quote: t.quote, name, role };
      }),
    },
    explore: {
      eyebrow: 'There is a lot more',
      heading: 'Explore it yourself ...',
      cta: 'Get a Demo',
      visual: 'Blurred candidate-name pills (decorative)',
      assets: list('ui/candidate-pills'),
    },
    socialProof: { g2: 'G2 badge', capterra: 'Capterra badge (5 stars)' },
    faq: { id: 'FAQs', heading: 'Your Questions, Answered', tabs: o.faq },
  },

  pages: {
    blog: {
      path: '/tips-for-interview',
      title: 'Tips for Interviewing with Sam, on ihiring',
      date: 'February 22, 2025',
      note: 'Only one blog post exists. Audience is candidates, not buyers.',
      text: o.subpages['tips-for-interview'].text,
    },
    demo: {
      path: '/contact-us',
      heading: 'See our solution in action!',
      subheading: 'Schedule your personalized demo and discover how we can transform your hiring process.',
      chips: ['Screening', 'Scheduling', 'Interviewing', 'Analyzed Reports', 'ATS Integration'],
      form: [
        { name: 'name', label: 'Full Name*' },
        { name: 'organizationName', label: 'Organization Name*' },
        { name: 'jobTitle', label: 'Job Title*' },
        { name: 'email', label: 'Work Email*' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'source', label: 'How did you hear about us?*', options: ['AI/Tech Conferences', 'Referral', 'Google Search', 'Linkedin', 'Billboard', 'Teammates', 'LLMs', 'Others'] },
      ],
      submit: 'Get a Demo',
    },
    privacy: { path: '/privacy-policy', lastUpdated: 'March 03, 2025', rawHtml: 'raw/privacy-policy.html', text: o.subpages['privacy-policy'].text },
  },

  currentDesign: {
    fonts: ['Poppins (headings and body)', 'Arial fallback'],
    colors: { primaryBlue: '#1d4ed8', accentBlue: '#0e5dfc', gradientHeading: 'blue-700 -> #ff33cc', bg: '#ffffff', darkSection: '#000000', tint: '#f4f4f5' },
    stack: 'Next.js + Tailwind + shadcn tokens, hosted behind CloudFront',
    tokens: h.designTokens,
    screenshots: list('../screenshots'),
  },

  assets: Object.fromEntries(['logos', 'icons', 'svg', 'gifs', 'images', 'video-thumbnails', 'ui', 'fonts'].map((d) => [d, list(d)])),
};

fs.writeFileSync('site.config.json', JSON.stringify(cfg, null, 2));
console.log('sections:', Object.keys(cfg).join(', '));
console.log('testimonials:', cfg.home.testimonials.items.length, '| faq:', Object.fromEntries(Object.entries(cfg.home.faq.tabs).map(([k, v]) => [k, v.length])));
