import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import { FooterWordmark } from "@/components/FooterWordmark";

const socials = [
  {
    label: "ihiring on LinkedIn",
    href: "https://www.linkedin.com/company/ihiringai/home/",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>
    ),
  },
  {
    label: "ihiring on X",
    href: "https://x.com/ihiring",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" /></svg>
    ),
  },
];

const groups = [
  { title: "Product", links: [
    { label: "How SAM works", href: "/#how" },
    { label: "Integrations", href: "/#stack" },
    { label: "Pricing", href: "/pricing" },
    { label: "Who it’s for", href: "/#who" },
    { label: "FAQs", href: "/#faq" },
  ] },
  { title: "Company", links: [
    { label: "Careers", href: "/careers" },
    { label: "Contact & demo", href: "/contact" },
  ] },
  { title: "Resources", links: [
    { label: "Blog", href: "/blog" },
    { label: "Privacy policy", href: "/privacy" },
    { label: "Reviews on G2", href: "https://www.g2.com/products/ihiring-ai/reviews" },
    { label: "Reviews on Capterra", href: "https://www.capterra.com/p/10031866/ihiring/reviews/" },
  ] },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-ink/10 bg-card/60 pt-12 sm:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="ihiring home" className="inline-block">
              <Image src="/logo/ihiring.svg" alt="ihiring" width={110} height={36} className="h-7 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-base leading-relaxed text-mute">
              SAM handles first-round interviews, so your team can focus on the next conversation.
            </p>
            <a href="mailto:info@ihiring.ai" className="mt-4 inline-block text-sm text-mute transition-colors hover:text-brand">info@ihiring.ai</a>
            <ul className="mt-5 flex items-center gap-3" aria-label="Social media">
              {socials.map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {item.icon}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-8">
            {groups.map(group => (
              <div key={group.title}>
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">{group.title}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {group.links.map(item => (
                    <li key={item.href}>
                      {item.href.startsWith("https:") ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-mute transition-colors hover:text-brand">
                          {item.label}<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : <Link href={item.href} className="text-mute transition-colors hover:text-brand">{item.label}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-10 pt-4 sm:mt-14 sm:pt-6">
          <FooterWordmark className="footer-wordmark fw block h-auto w-full" />
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-ink/10 py-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ihiring Inc. All rights reserved.</p>
          <span>San Francisco, California</span>
        </div>
      </Container>
    </footer>
  );
}
