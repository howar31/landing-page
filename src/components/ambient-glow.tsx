import type { CSSProperties } from "react";

// Fixed glow color values derived from #8b5cf6 (r1,g1,b1) and #a855f7 (r2,g2,b2)
// Mid-blend: r3=Math.round((139+168)/2)=153, g3=Math.round((92+85)/2)=88, b3=Math.round((246+247)/2)=246
// intensity = 0.27 — tuned so blob 1 peaks at ~0.15 alpha, matching howar31-blog's --glow-1

const INTENSITY = 0.27;

const BLOB_BASE: CSSProperties = {
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(90px)",
  willChange: "transform, opacity",
};

export function AmbientGlow() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* Blob 1 — top-center */}
      <div
        style={{
          ...BLOB_BASE,
          top: "-12%",
          left: "38%",
          width: 700,
          height: 700,
          background: `radial-gradient(circle, rgba(139,92,246,${0.55 * INTENSITY}), rgba(139,92,246,${0.18 * INTENSITY}) 40%, transparent 70%)`,
          animation:
            "glowDrift1 18s ease-in-out infinite, glowPulse1 7s ease-in-out infinite",
        }}
      />
      {/* Blob 2 — bottom-left */}
      <div
        style={{
          ...BLOB_BASE,
          bottom: "-18%",
          left: "-8%",
          width: 620,
          height: 620,
          background: `radial-gradient(circle, rgba(168,85,247,${0.45 * INTENSITY}), rgba(168,85,247,${0.15 * INTENSITY}) 45%, transparent 70%)`,
          animation:
            "glowDrift2 22s ease-in-out infinite, glowPulse2 9s ease-in-out infinite",
        }}
      />
      {/* Blob 3 — mid-right, mid-blend color */}
      <div
        style={{
          ...BLOB_BASE,
          top: "30%",
          right: "-10%",
          width: 520,
          height: 520,
          background: `radial-gradient(circle, rgba(153,88,246,${0.35 * INTENSITY}), transparent 65%)`,
          animation:
            "glowDrift3 26s ease-in-out infinite, glowPulse1 11s ease-in-out infinite",
        }}
      />
      {/* Blob 4 — lower-center */}
      <div
        style={{
          ...BLOB_BASE,
          top: "60%",
          left: "20%",
          width: 380,
          height: 380,
          background: `radial-gradient(circle, rgba(139,92,246,${0.30 * INTENSITY}), transparent 70%)`,
          animation:
            "glowDrift4 16s ease-in-out infinite, glowPulse2 6s ease-in-out infinite",
        }}
      />
      {/* Scanline */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, transparent, rgba(139,92,246,${0.04 * INTENSITY}) 50%, transparent)`,
          animation: "glowScan 14s linear infinite",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
