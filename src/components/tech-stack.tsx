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
            className="py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            {/* Header line: dot + category label */}
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background: category.color,
                  boxShadow: `0 0 10px ${category.color}99`,
                }}
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
        ))}
      </ul>
    </section>
  );
}
