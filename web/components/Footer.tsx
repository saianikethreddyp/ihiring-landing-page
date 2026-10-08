import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";

const groups = [
  { title: "Product", links: [
    { label: "How SAM works", href: "/#how" },
    { label: "Integrations", href: "/#stack" },
    { label: "Who it’s for", href: "/#who" },
    { label: "FAQs", href: "/#faq" },
  ] },
  { title: "Company", links: [
    { label: "About us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Contact & demo", href: "/contact" },
  ] },
  { title: "Resources", links: [
    { label: "Candidate guide", href: "/blog" },
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
          <Image
            src="/logo/ihiring-footer.svg"
            alt=""
            aria-hidden="true"
            width={1000}
            height={330}
            style={{ margin: 0 }}
            className="footer-wordmark block h-auto w-full opacity-90 transition-opacity hover:opacity-100"
          />
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-ink/10 py-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} ihiring Inc. All rights reserved.</p>
          <span>San Francisco, California</span>
        </div>
      </Container>
    </footer>
  );
}
