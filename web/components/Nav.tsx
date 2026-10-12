"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { nav, LOGIN_URL, CALENDLY_URL } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const menuToggle = useRef<HTMLButtonElement>(null);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); menuToggle.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors",
        scrolled || open ? "border-ink/10 bg-paper/90" : "border-transparent bg-paper/60",
      )}
    >
      <div className="relative mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="ihiring home" className="shrink-0">
          <Image src="/logo/ihiring.svg" alt="ihiring" width={160} height={52} priority className="h-10 w-auto sm:h-11" />
        </Link>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={pathname === n.href ? "page" : undefined}
              className="site-nav-link rounded-full px-4 py-2 text-sm text-mute transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="site-desktop-actions hidden items-center gap-2 lg:flex">
          <a
            href={LOGIN_URL}
            className="inline-flex h-11 items-center justify-center rounded-md border border-brand/30 px-5 text-sm font-medium text-brand transition-colors hover:border-brand hover:bg-brand-soft"
          >
            Sign in
          </a>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-5 text-sm font-medium text-white transition-colors hover:bg-brand-ink"
          >
            Request a demo
          </a>
        </div>

        <button
          ref={menuToggle}
          type="button"
          className="site-menu-toggle inline-flex h-10 w-10 items-center justify-center rounded-full lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={reduce ? false : { opacity: 0, y: -8, scale: .98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6, scale: .98 }}
          transition={{ duration: reduce ? 0 : .2, ease: "easeOut" }}
          id="mobile-menu"
          className="border-t border-ink/10 bg-paper p-3 lg:hidden"
        >
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === n.href ? "page" : undefined}
              className="site-nav-link block rounded-2xl px-4 py-3 text-lg hover:bg-ink/5"
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2 p-1">
            <a href={LOGIN_URL} onClick={() => setOpen(false)} className="flex min-h-12 flex-1 items-center justify-center rounded-md border border-brand/30 px-5 text-sm font-medium text-brand">Sign in</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="flex min-h-12 flex-1 items-center justify-center rounded-md bg-brand px-5 text-sm font-medium text-white">Request a demo</a>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
}
