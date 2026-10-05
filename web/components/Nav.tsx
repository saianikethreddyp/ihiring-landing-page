"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui";
import { DEMO_HREF, LOGIN_URL, nav } from "@/lib/site";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={clsx(
          "mx-auto flex h-14 max-w-[1100px] items-center justify-between rounded-full border pl-5 pr-2 backdrop-blur-xl transition-all",
          scrolled || open
            ? "border-ink/10 bg-card/85 shadow-[0_8px_30px_-12px_rgba(14,15,19,0.25)]"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="/" aria-label="ihiring home" className="shrink-0">
          <Image src="/logo/ihiring.svg" alt="ihiring" width={100} height={33} priority className="h-6 w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm text-mute transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex">
          <Button href={LOGIN_URL} variant="ghost">
            Log in
          </Button>
          <Button href={DEMO_HREF}>Book a demo</Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-[1100px] rounded-3xl border border-ink/10 bg-card p-3 shadow-xl md:hidden"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-lg hover:bg-ink/5"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 p-1">
            <Button href={LOGIN_URL} variant="secondary" className="flex-1">
              Log in
            </Button>
            <Button href={DEMO_HREF} className="flex-1">
              Book a demo
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
