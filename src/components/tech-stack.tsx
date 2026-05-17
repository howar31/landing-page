import { skillCategories } from "@/data/skills";
import { SectionTitle } from "@/components/section-title";

export function TechStack() {
  return (
    <section className="py-10 feed:py-12 border-t border-white/[0.06]">
      <SectionTitle kicker="// stack" title="What I build with" />

      <ul
        className="list-none m-0 p-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {skillCategories.map((category) => (
          <li
            key={category.title}
            className="grid items-baseline gap-x-[10px] feed:gap-x-[14px] gap-y-1 py-4 grid-cols-[20px_90px_1fr] feed:grid-cols-[20px_110px_1fr]"
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Dot */}
            <span
              className="w-2 h-2 rounded-full justify-self-center"
              style={{
                background: category.color,
                boxShadow: `0 0 10px ${category.color}99`,
              }}
            />

            {/* Label */}
            <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">
              {category.title}
            </span>

            {/* Body */}
            <span className="text-[15px] text-white/85 leading-[1.5]">
              {category.skills.join(" · ")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
