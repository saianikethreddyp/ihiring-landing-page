import config from "@/content/site.config.json";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ihiring.ai";

// TODO(ihiring): replace with the real app login URL.
export const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://ihiring.ai/";

export const CALENDLY_URL = "https://calendly.com/ram-ihiring/demo-ihiring-ai";

export const DEMO_HREF = "/contact";

/**
 * Companies shown under "Trusted by". Edit this list to change the strip.
 * Make sure every name here is a company you have permission to show.
 */
export type Client = { name: string; logo: string; /** Logo height in px; defaults to 26. */ height?: number; /** Show the name beside a mark-only logo. */ label?: boolean };

export const trustedBy: Client[] = [
  { name: "Gamma", logo: "/clients/gamma.svg", height: 22 },
  { name: "Rogo", logo: "/clients/rogo.svg", height: 22 },
  { name: "Intercom", logo: "/clients/intercom.svg", height: 22 },
  { name: "PostHog", logo: "/clients/posthog.svg", height: 24 },
  { name: "Samsara", logo: "/clients/samsara.svg", height: 20 },
  { name: "Qualia", logo: "/clients/qualia.png", height: 30, label: true },
  { name: "Saronic", logo: "/clients/saronic.svg", height: 22 },
  { name: "Baseten", logo: "/clients/baseten.svg", height: 26 },
  { name: "Weaviate", logo: "/clients/weaviate.svg", height: 26 },
  { name: "Varda", logo: "/clients/varda.svg", height: 28, label: true },
  { name: "JK Organisation", logo: "/clients/jk.png", height: 46 },
  { name: "Kairos", logo: "/clients/kairos.png", height: 26 },
  { name: "Function Health", logo: "/clients/function.svg", height: 24 },
  { name: "Machinify", logo: "/clients/machinify.svg", height: 24, label: true },
  { name: "Kavout", logo: "/clients/kavout.png", height: 28 },
  { name: "Emergent", logo: "/clients/emergent.svg", height: 26 },
  { name: "Lovable", logo: "/clients/lovable.svg", height: 24 },
  { name: "Groq", logo: "/clients/groq.svg", height: 26 },
];

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
  { label: "Pricing", href: "/pricing" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const testimonials = config.home.testimonials.items;

/** Short label for each candidate quote, taken from what the candidate actually said. */
export const candidateThemes: Record<string, string> = {
  "Haig Schmidt": "Tested real skills",
  "Taylor": "Felt comfortable",
  "Dominic Z.T.": "Felt natural",
  "Miller": "Less nervous",
  "Nicole Meyer": "Respected my time",
  "Dorthy": "Less nervous",
  "Chris A": "Felt natural",
};

export const initialsOf = (name: string) => name.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

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
