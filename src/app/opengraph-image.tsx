import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(165deg, #fff8f0 0%, #f5ede0 50%, #e8d5c4 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 16 }}>🥣</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#5c3d2e",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 32, color: "#5c3d2e", opacity: 0.75, marginTop: 8 }}>
          {siteConfig.nameEn}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#5c3d2e",
            opacity: 0.65,
            marginTop: 24,
            maxWidth: 800,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#b85c5c",
            marginTop: 32,
            padding: "12px 28px",
            borderRadius: 999,
            background: "rgba(255,248,240,0.8)",
            border: "2px solid rgba(92,61,46,0.15)",
          }}
        >
          {siteConfig.location}
        </div>
      </div>
    ),
    { ...size }
  );
}
