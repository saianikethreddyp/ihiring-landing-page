import Link from "next/link";
import { Container } from "@/components/ui";
import { LOGIN_URL } from "@/lib/site";

const links = [
  { label: "How it works", href: "/#how" },
  { label: "Who it's for", href: "/#who" },
  { label: "FAQ", href: "/#faq" },
  { label: "For candidates", href: "/blog" },
  { label: "Log in", href: LOGIN_URL },
  { label: "Privacy", href: "/privacy" },
  { label: "G2", href: "https://www.g2.com/products/ihiring-ai/reviews" },
  { label: "Capterra", href: "https://www.capterra.com/p/10031866/ihiring/reviews/" },
];

export function Footer() {
  return (
    <footer className="overflow-hidden pt-20">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xs text-mute">
            The AI interviewer for founders and hiring teams. Hire in minutes, not months.
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-3 text-sm">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-ink/75 transition-colors hover:text-brand"
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p
          aria-hidden
          className="display mt-14 select-none pb-[0.12em] text-center text-[clamp(5rem,24vw,20rem)] leading-[0.9] tracking-tighter text-ink/[0.06]"
        >
          ihiring
        </p>
        <div className="flex flex-col justify-between gap-2 border-t border-ink/10 py-6 text-xs text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} ihiring Inc. All rights reserved.</p>
          <p className="font-mono">Sam never sleeps. You can.</p>
        </div>
      </Container>
    </footer>
  );
}
