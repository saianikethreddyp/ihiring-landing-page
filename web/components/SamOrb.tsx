// Sam's presence: a living orb drawn entirely in CSS (no raster assets).
export function SamOrb({ size = 120, speaking = false }: { size?: number; speaking?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      {speaking && (
        <>
          <span className="motion-safe-anim absolute inset-0 rounded-full border border-[#6fa3ff]/60 [animation:pulse-ring_1.8s_ease-out_infinite]" />
          <span className="motion-safe-anim absolute inset-0 rounded-full border border-[#6fa3ff]/40 [animation:pulse-ring_1.8s_ease-out_0.9s_infinite]" />
        </>
      )}
      <div
        className="motion-safe-anim absolute inset-0 rounded-full blur-xl opacity-70 [animation:orb-spin_9s_linear_infinite]"
        style={{ background: "conic-gradient(from 0deg, #0e5dfc, #4da3ff, #273337, #0e5dfc)" }}
      />
      <div
        className="motion-safe-anim absolute inset-[6%] rounded-full [animation:orb-spin_6s_linear_infinite]"
        style={{ background: "conic-gradient(from 90deg, #0e5dfc, #8cc2ff, #273337, #0e5dfc)" }}
      />
      <div className="absolute inset-[14%] rounded-full bg-[#0b0b10]" />
      <div
        className="absolute inset-[30%] rounded-full opacity-90"
        style={{ background: "radial-gradient(circle at 35% 30%, #cfe0ff, #0e5dfc 55%, transparent 75%)" }}
      />
    </div>
  );
}
