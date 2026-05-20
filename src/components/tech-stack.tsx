import type { CSSProperties } from "react";
import { skillCategories } from "@/data/skills";
import { SectionTitle } from "@/components/section-title";

// Slightly irregular breath timing per dot — non-harmonic durations and
// scattered delays so the five dots never settle into a visible rhythm.
const DOT_BREATH = [
  { duration: "3.4s", delay: "0s" },
  { duration: "4.3s", delay: "0.9s" },
  { duration: "3.7s", delay: "1.7s" },
  { duration: "4.6s", delay: "0.4s" },
  { duration: "3.1s", delay: "1.2s" },
];

export function TechStack() {
  return (
    <section className="py-7 feed:py-8">
      <SectionTitle kicker="// stack" title="What I build with" />

      <ul
        className="list-none m-0 p-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {skillCategories.map((category, index) => {
          const breath = DOT_BREATH[index % DOT_BREATH.length];
          // Skip the closing border on the last row: the next section's
          // border-t already divides the sections, and a closing line here
          // would frame the inter-section gap as an empty box.
          const isLast = index === skillCategories.length - 1;
          return (
            <li
              key={category.title}
              className="py-4"
              style={
                isLast
                  ? undefined
                  : { borderBottom: "1px solid rgba(255,255,255,0.06)" }
              }
            >
              {/* Header line: dot + category label */}
              <div className="flex items-center gap-2.5">
                {/* Dot "breath": glow + scale pulse. Each dot uses a different
                   duration/delay so the group looks organic, not a synced wave.
                   The static boxShadow is the prefers-reduced-motion resting state. */}
                <span
                  className="w-2 h-2 rounded-full"
                  style={
                    {
                      background: category.color,
                      boxShadow: `0 0 8px ${category.color}66`,
                      // Alpha-dimmed glow colour; the keyframe breathes this.
                      "--dot-glow": `${category.color}66`,
                      animation: `dotBreath ${breath.duration} ease-in-out ${breath.delay} infinite`,
                    } as CSSProperties
                  }
                />
                <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">
                  {category.title}
                </span>
              </div>

              {/* Skills */}
              <div className="mt-2 text-[15px] text-white/85 leading-[1.5]">
                {category.skills.join(" · ")}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
