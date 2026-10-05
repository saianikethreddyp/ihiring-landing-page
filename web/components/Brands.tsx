import paths from "@/content/brand-paths.json";
import clsx from "clsx";

type PathMap = Record<string, string | null>;
const P = paths as PathMap;

// Keys map a display name to a vector mark. Marks are single-colour paths that inherit
// currentColor, so every logo is tinted from our palette, not pasted in as a raster.
const keyFor: Record<string, string> = {
  Meta: "meta",
  NVIDIA: "nvidia",
  Google: "google",
  Tesla: "tesla",
  Stripe: "stripe",
  DoorDash: "doordash",
  Greenhouse: "greenhouse",
  Indeed: "indeed",
  Glassdoor: "glassdoor",
};

export function BrandMark({ name, size = 22, className }: { name: string; size?: number; className?: string }) {
  if (name === "Microsoft") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <rect x="2" y="2" width="9.5" height="9.5" />
        <rect x="12.5" y="2" width="9.5" height="9.5" />
        <rect x="2" y="12.5" width="9.5" height="9.5" />
        <rect x="12.5" y="12.5" width="9.5" height="9.5" />
      </svg>
    );
  }
  const d = P[keyFor[name]];
  if (d) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
        <path d={d} />
      </svg>
    );
  }
  // No vector mark available: a clean monogram tile in the same visual weight.
  return (
    <span
      aria-hidden
      className={clsx("inline-flex items-center justify-center rounded-md border border-current text-[11px] font-semibold leading-none", className)}
      style={{ width: size, height: size }}
    >
      {name.charAt(0)}
    </span>
  );
}

export function BrandLockup({ name, className, markSize = 24 }: { name: string; className?: string; markSize?: number }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 whitespace-nowrap", className)}>
      <BrandMark name={name} size={markSize} />
      <span className="text-[19px] font-semibold tracking-tight">{name}</span>
    </span>
  );
}
