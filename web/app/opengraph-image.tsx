import { ImageResponse } from "next/og";

export const alt = "ihiring.ai: hire your next engineer this week, not this quarter";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f6f8",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: "#0f181b" }}>
          <span style={{ color: "#0e5dfc" }}>i</span>hiring
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#0f181b", lineHeight: 1.05, letterSpacing: -2 }}>
            Your first ten hires,
          </div>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#0e5dfc", lineHeight: 1.05, letterSpacing: -2 }}>
            interviewed overnight.
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#596569" }}>The AI interviewer for founders and hiring teams · ihiring.ai</div>
      </div>
    ),
    size,
  );
}
