import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>{children}</div>;
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "light" | "violet";
  size?: "md" | "lg";
  className?: string;
};

export function Button({ href, children, variant = "primary", size = "md", className }: ButtonProps) {
  const styles = {
    primary: "bg-ink text-paper hover:bg-ink-2",
    violet: "bg-brand text-white hover:bg-brand-ink",
    secondary: "border border-ink/15 bg-transparent text-ink hover:border-ink/40",
    ghost: "text-ink hover:bg-ink/5",
    light: "bg-paper text-ink hover:bg-white",
  }[variant];
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        size === "lg" ? "h-13 px-7 text-[15px]" : "h-10 px-5 text-sm",
        styles,
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({ children, light, live }: { children: ReactNode; light?: boolean; live?: boolean }) {
  return (
    <p
      className={clsx(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]",
        light ? "text-white/55" : "text-mute",
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", live ? "bg-live" : light ? "bg-white/40" : "bg-brand")} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "left",
  light,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={clsx(
          "display mt-5 text-balance text-5xl leading-[1.02] sm:text-6xl lg:text-7xl",
          light && "text-paper [&_em]:text-[#6fa3ff]",
        )}
      >
        {title}
      </h2>
      {sub && (
        <p className={clsx("mt-6 max-w-xl text-pretty text-lg leading-relaxed", light ? "text-white/65" : "text-mute", align === "center" && "mx-auto")}>
          {sub}
        </p>
      )}
    </div>
  );
}
