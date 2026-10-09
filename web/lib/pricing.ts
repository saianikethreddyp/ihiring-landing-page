/**
 * Plans taken from the vendor-supplied G2 pricing listing
 * (https://www.g2.com/products/ihiring-ai/pricing, scraped 2026-10-09).
 *
 * TODO(ihiring): confirm before launch. G2 lists amounts in USD "per month" but does not state
 * the billing period explicitly, shows two different "last updated" dates (Dec 11 2025, Apr 9 2026),
 * and lists Tier 4 "Interview report" without the word "Audited" (likely a typo).
 */
export type Plan = {
  id: string;
  name: string;
  audience: string;
  price: number | null;
  interviews: number | null;
  featured?: boolean;
  duration: string;
  retentionDays: number;
  jobPosts: string;
  seats: number;
  resumeScreens: number | null;
  support: string;
  has: string[];
};

export const plans: Plan[] = [
  {
    id: "startups", name: "Startups", audience: "Founders hiring without a recruiter",
    price: 152, interviews: 25, duration: "10, 20 or 30 min", retentionDays: 7, jobPosts: "1", seats: 1, resumeScreens: 5,
    support: "Platform dashboard", has: [],
  },
  {
    id: "basic", name: "Basic", audience: "Small teams hiring across a few roles",
    price: 479, interviews: 100, duration: "10, 20 or 30 min", retentionDays: 15, jobPosts: "7", seats: 3, resumeScreens: 20,
    support: "Dashboard, email and phone", has: ["logic"],
  },
  {
    id: "smb", name: "Small & Medium", audience: "Growing companies and small staffing teams",
    price: 2140, interviews: 500, featured: true, duration: "10, 20 or 30 min", retentionDays: 45, jobPosts: "25", seats: 7, resumeScreens: 100,
    support: "Dashboard, email and phone", has: ["logic", "integrations", "multilingual"],
  },
  {
    id: "large", name: "Large", audience: "High-volume staffing and large hiring teams",
    price: 5600, interviews: 2000, duration: "10, 20 or 30 min", retentionDays: 60, jobPosts: "Unlimited", seats: 10, resumeScreens: 400,
    support: "Dashboard, email, phone and virtual connect",
    has: ["logic", "integrations", "multilingual", "branding", "export"],
  },
  {
    id: "enterprise", name: "Enterprise", audience: "Governance, security and custom deployment",
    price: null, interviews: null, duration: "10, 20 or 30 min", retentionDays: 90, jobPosts: "Unlimited", seats: 15, resumeScreens: null,
    support: "Dedicated Slack channel",
    has: ["logic", "integrations", "multilingual", "branding", "export", "whitelabel", "sso", "onprem"],
  },
];

/** Rows of the comparison table that differ between plans. */
export const featureRows: { id: string; label: string }[] = [
  { id: "logic", label: "Reasoning and logic metrics" },
  { id: "integrations", label: "ATS and other integrations" },
  { id: "multilingual", label: "Multilingual interviews" },
  { id: "branding", label: "Custom and domain branding" },
  { id: "export", label: "Bulk invite and export" },
  { id: "whitelabel", label: "Domain white labelling" },
  { id: "sso", label: "SSO" },
  { id: "onprem", label: "On-premise deployment" },
];

/**
 * Included in every paid plan per the G2 listing. Descriptions come from ihiring.ai's own copy;
 * items without a description are listed on G2 without explanation.
 * TODO(ihiring): add one-line explanations for "Candidate engagement score" and "Reasoning and logic metrics".
 */
export const everyPlan: { title: string; body?: string }[] = [
  { title: "Two-way dynamic interview", body: "SAM asks follow-up questions based on each answer." },
  { title: "Interview report", body: "Video, transcript and a performance summary for your team." },
  { title: "Proctoring alerts", body: "Real-time flags for possible cheating during the interview." },
  { title: "Candidate engagement score" },
  { title: "Single and bulk invites", body: "Invite one candidate or many at once." },
  { title: "Add-ons", body: "Available on every plan." },
];

export const G2 = { rating: "4.9", reviews: 16, url: "https://www.g2.com/products/ihiring-ai/reviews" };

export const pricingFaqs = [
  { q: "Is there a free trial?", a: "Yes, a free trial of the AI interviewer is available. Contact us to get started." },
  { q: "What if I go over my monthly interviews?", a: "Add-ons are available on every plan. Contact us for details on going over your monthly interviews." },
  { q: "Do you integrate with our ATS?", a: "Integrations are available from the Small & Medium plan. We work with Workday, Greenhouse, Lever, Ashby and Bullhorn." },
  { q: "How long do you keep interview videos?", a: "It depends on the plan: 7 days on Startups, up to 90 days on Enterprise." },
];

export const perInterview = (p: Plan) => (p.price && p.interviews ? p.price / p.interviews : null);
export const perInterviewRange = () => {
  const v = plans.map(perInterview).filter((n): n is number => n !== null);
  return { min: Math.min(...v), max: Math.max(...v) };
};
export const money = (n: number) => `$${n.toLocaleString("en-US")}`;
