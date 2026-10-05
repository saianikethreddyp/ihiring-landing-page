import dots from "@/content/world-dots.json";
import { Container, SectionHeader } from "@/components/ui";
import { Reveal } from "@/components/Reveal";
import { customerLocations, hq } from "@/lib/site";

// Equirectangular projection onto a 360 x 138 viewBox (lat 80 .. -58).
const px = (lon: number) => lon + 180;
const py = (lat: number) => 80 - lat;

const hours = Array.from({ length: 24 }, (_, h) => {
  const label = h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`;
  return { h, label };
});

export function Global() {
  const pins = [{ ...hq, hq: true }, ...customerLocations.map((c) => ({ ...c, hq: false }))];

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper sm:py-32">
      <Container>
        <Reveal>
          <SectionHeader
            light
            eyebrow="Global coverage"
            title={
              <>
                Interviews without <em>borders.</em>
              </>
            }
            sub="Sam interviews live, 1:1, anywhere in the world and at any hour. Candidates pick a time in their own timezone, so your pipeline never waits on yours."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-14 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 sm:p-8">
            <svg
              viewBox="0 0 360 138"
              className="h-auto w-full"
              role="img"
              aria-label={`World map. Headquarters: ${hq.city}.${customerLocations.length ? ` Customers in ${customerLocations.map((c) => c.city).join(", ")}.` : ""}`}
            >
              <g fill="#6fa3ff" fillOpacity="0.38">
                {(dots as [number, number][]).map(([lon, lat], i) => (
                  <circle key={i} cx={px(lon)} cy={py(lat)} r="0.62" />
                ))}
              </g>
              {pins.map((p) => (
                <g key={p.city} transform={`translate(${px(p.lon)} ${py(p.lat)})`}>
                  <circle r="3" fill="#0e5dfc" fillOpacity="0.5" className="map-pulse motion-safe-anim" />
                  <circle r="1.7" fill="#0e5dfc" stroke="#fff" strokeWidth="0.5" />
                </g>
              ))}
            </svg>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {pins.map((p) => (
                <li
                  key={p.city}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6fa3ff]" aria-hidden />
                  {p.city}
                  {p.hq && <span className="font-mono text-[10px] uppercase tracking-wider text-white/45">HQ</span>}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
              Sam is on shift, every hour of the day
            </p>
            <ol className="mt-4 grid grid-cols-12 gap-1.5 sm:grid-cols-24 sm:[grid-template-columns:repeat(24,minmax(0,1fr))]">
              {hours.map((h) => (
                <li key={h.h} className="space-y-1.5">
                  <span className="block h-8 rounded-md bg-gradient-to-b from-brand to-[#0a47c4]" />
                  <span className="block text-center font-mono text-[9px] text-white/40">{h.label}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
