import config from "@/content/site.config.json";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ihiring.ai";

// TODO(ihiring): replace with the real app login URL.
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://ihiring.ai/";

export const DEMO_HREF = "/demo";

/**
 * Companies shown under "Trusted by". Edit this list to change the strip.
 * Make sure every name here is a company you have permission to show.
 */
export const trustedBy = ["Meta", "NVIDIA", "Microsoft", "Google", "Tesla", "Stripe", "DoorDash"];

/** Headquarters pin on the world map. */
export const hq = { city: "San Francisco Bay Area", lat: 37.77, lon: -122.42 };

/**
 * Customer locations, plotted on the map and listed beneath it.
 * Add real ones, e.g. { city: "New York", lat: 40.71, lon: -74.0 }.
 */
export const customerLocations: { city: string; lat: number; lon: number }[] = [];

/**
 * Real, verifiable traction. The "By the numbers" block renders only when this has items.
 * e.g. { value: "12,400", label: "interviews completed", note: "as of Sep 2026" }
 */
export const traction: { value: string; label: string; note?: string }[] = [];

export const nav = [
  { label: "How it works", href: "/#how" },
  { label: "Integrations", href: "/#stack" },
  { label: "Who it's for", href: "/#who" },
  { label: "FAQ", href: "/#faq" },
];

export const testimonials = config.home.testimonials.items;

export const faqs = (() => {
  const seen = new Set<string>();
  return Object.values(config.home.faq.tabs)
    .flat()
    .filter((f) => (seen.has(f.q) ? false : (seen.add(f.q), true)));
})();

export const integrations: { name: string; kind: "ATS" | "Job board" }[] = [
  { name: "Workday", kind: "ATS" },
  { name: "Greenhouse", kind: "ATS" },
  { name: "Lever", kind: "ATS" },
  { name: "Ashby", kind: "ATS" },
  { name: "Bullhorn", kind: "ATS" },
  { name: "LinkedIn", kind: "Job board" },
  { name: "Indeed", kind: "Job board" },
  { name: "Glassdoor", kind: "Job board" },
];

// Real roles Sam has interviewed for, taken from candidate quotes on the current site.
export const roles = Array.from(new Set(testimonials.map((t) => t.role)));

export const demoForm = config.pages.demo.form;
