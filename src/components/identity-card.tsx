"use client";

import type { CSSProperties } from "react";
import { Github, BookOpen, MapPin, type LucideIcon } from "lucide-react";
import { identity } from "@/data/identity";
import { fetchProfileRepoCount } from "@/lib/github";
import { fetchBlogPosts } from "@/lib/blog-feed";
import { useRemoteData } from "@/lib/use-remote-data";
import { useCountUp } from "@/lib/use-count-up";

const ACCENT = "#a78bfa";
const ACCENT2 = "#60a5fa";

const BAR_HEIGHTS = [8, 14, 6, 12, 10];
const BAR_DELAYS = ["0s", "0.15s", "0.3s", "0.45s", "0.6s"];

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  GitHub: Github,
  Blog: BookOpen,
};

export function IdentityCard() {
  const repoCount = useRemoteData(fetchProfileRepoCount);
  const posts = useRemoteData(fetchBlogPosts);

  // Count-up animates the live numbers from 0 once their data resolves.
  const repoTarget =
    repoCount.loading || repoCount.error ? null : repoCount.data ?? null;
  const postsTarget =
    posts.loading || posts.error ? null : posts.data?.length ?? null;
  const repoValue = useCountUp(repoTarget);
  const postsValue = useCountUp(postsTarget);

  const repoDisplay = repoValue === null ? "—" : String(repoValue);
  const postsDisplay = postsValue === null ? "—" : String(postsValue);

  return (
    <aside
      className="feed:sticky feed:top-7 feed:self-start w-full p-5 feed:p-7"
      style={{
        borderRadius: 18,
        background: "rgba(15,23,42,0.55)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
      }}
    >
      {/* Avatar */}
      <div
        className="w-[110px] h-[110px] feed:w-[132px] feed:h-[132px]"
        style={
          {
            position: "relative",
            boxSizing: "content-box",
            borderRadius: "50%",
            padding: 3,
            background: `linear-gradient(135deg,${ACCENT2},${ACCENT})`,
            boxShadow: `0 0 24px ${ACCENT}59`,
            // Slow glow breath; the static boxShadow is the reduced-motion rest state.
            "--avatar-glow": `${ACCENT}59`,
            animation: "avatarGlow 5s ease-in-out infinite",
          } as CSSProperties
        }
      >
        <img
          src={identity.avatar}
          alt={identity.name}
          style={{
            boxSizing: "content-box",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            display: "block",
            border: "3px solid rgb(2,6,23)",
            objectFit: "cover",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: -2,
            bottom: 6,
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "rgb(2,6,23)",
            border: `2px solid ${ACCENT}`,
            color: ACCENT,
            fontSize: 18,
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ display: "block", transform: "translateY(-2px)" }}>♥</span>
        </span>
      </div>

      {/* Handle */}
      <div
        className="font-mono"
        style={{
          marginTop: 18,
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.02em",
        }}
      >
        {identity.handle}
      </div>

      {/* Name */}
      <h1
        style={{
          margin: "4px 0 0",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#fff",
          lineHeight: 1.1,
        }}
      >
        <span
          style={{
            backgroundImage: `linear-gradient(to right,${ACCENT2},${ACCENT})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {identity.name}
        </span>
      </h1>

      {/* Tagline + location */}
      <div
        style={{
          marginTop: 12,
          fontSize: 14,
          lineHeight: 1.55,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        {identity.tagline}
        <br />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            marginTop: 4,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          <MapPin size={13} style={{ opacity: 0.7, flexShrink: 0 }} aria-label="Location" />
          {identity.location}
        </span>
      </div>

      {/* Stats row */}
      <div
        style={{
          marginTop: 22,
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          padding: "14px 0",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {[
          { label: "Since", value: identity.since },
          { label: "Repos", value: repoDisplay },
          { label: "Posts", value: postsDisplay },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              className="font-mono"
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {label}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 18,
                fontWeight: 600,
                color: "#fff",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Socials */}
      <div
        style={{
          marginTop: 18,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
        }}
      >
        {identity.socials.map((s) => {
          const Icon = SOCIAL_ICONS[s.label];
          return (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 12px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                textDecoration: "none",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {Icon && <Icon size={14} />}
              {s.label}
            </a>
          );
        })}
      </div>

      {/* Music / decorative equalizer */}
      <div
        style={{
          marginTop: 18,
          padding: 14,
          borderRadius: 12,
          border: `1px solid ${ACCENT2}26`,
          background: `${ACCENT2}0f`,
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: ACCENT2,
          }}
        >
          {identity.music.label}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {identity.music.text}
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 3,
            alignItems: "flex-end",
            height: 16,
          }}
        >
          {BAR_HEIGHTS.map((h, i) => (
            <span
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 1.5,
                background: `linear-gradient(to top,${ACCENT2},${ACCENT})`,
                animation: "meter 1.2s ease-in-out infinite",
                animationDelay: BAR_DELAYS[i],
              }}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
