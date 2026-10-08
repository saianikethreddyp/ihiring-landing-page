import { ImageResponse } from "next/og";

export const alt = "ihiring.ai: a résumé can’t ask why. More time hiring.";
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
          background: "#f2f6ff",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 52, fontWeight: 700, color: "#202a3a" }}>
          <span style={{ color: "#165cde" }}>i</span>hiring
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#202a3a", lineHeight: 1.05, letterSpacing: -2 }}>
            Less time screening.
          </div>
          <div style={{ fontSize: 80, fontWeight: 700, color: "#165cde", lineHeight: 1.05, letterSpacing: -2 }}>
            More time hiring.
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#596569" }}>The AI interviewer for founders and hiring teams · ihiring.ai</div>
      </div>
    ),
    size,
  );
}
