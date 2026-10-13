import { ClientLogo } from "@/components/ClientLogo";
import { trustedBy } from "@/lib/site";

export function TrustedBy() {
  return (
    <div className="relative mt-16" aria-label={`Trusted by ${trustedBy.map((c) => c.name).join(", ")}`}>
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
        Trusted by teams at
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max motion-safe-anim [animation:marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <ul key={dup} className="flex shrink-0 items-center gap-16 pr-16" aria-hidden={dup === 1}>
              {trustedBy.map((c) => (
                <li key={c.name}>
                  <ClientLogo client={c} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
