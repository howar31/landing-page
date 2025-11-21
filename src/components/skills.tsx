import { skillCategories } from "@/data/skills";
import { Layers } from "lucide-react";

export function Skills() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-900/50">
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
          <Layers className="w-6 h-6 text-blue-400" />
          Tech Stack
        </h2>
        <p className="text-slate-400 max-w-2xl">
          Technologies and tools I've worked with to build scalable systems.
        </p>
      </div>

      <div className="space-y-12">
        {skillCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-10 items-start group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-200 text-lg">
                  {category.title}
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-sm font-medium text-slate-300 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-800 hover:border-slate-700 hover:bg-slate-800 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
