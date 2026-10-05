import { ArrowRight } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { SamOrb } from "@/components/SamOrb";
import { DEMO_HREF } from "@/lib/site";

export function FinalCTA() {
  return (
    <section className="px-3 pb-3 sm:px-6">
      <Container className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-24 text-center text-paper sm:px-12 sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(14,93,252,0.55), rgba(39,51,55,0.35) 60%, transparent 80%)" }}
        />
        <div className="relative flex flex-col items-center">
          <SamOrb size={84} speaking />
          <h2 className="display mt-10 max-w-4xl text-balance text-6xl leading-[0.98] sm:text-7xl lg:text-8xl">
            Meet Sam. <em className="text-[#6fa3ff]">Hire by Friday.</em>
          </h2>
          <p className="mt-7 max-w-xl text-lg text-white/65">
            Book a demo and watch Sam interview for a real role. We&apos;ll show you the scorecard you would get.
          </p>
          <div className="mt-10">
            <Button href={DEMO_HREF} variant="light" size="lg">
              Book a demo <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
