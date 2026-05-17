"use client";

import { useState, useMemo } from "react";
import { projects, moreProjects } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { GithubFeed } from "@/components/github-feed";
import { ProjectRow } from "@/components/project-row";
import { cn } from "@/lib/utils";

export function ProjectGrid() {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Derive sorted unique tag set from all projects
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter projects by active tag; show all when null
  const filteredProjects = useMemo(() => {
    if (activeTag === null) return projects;
    return projects.filter((project) => project.tags.includes(activeTag));
  }, [activeTag]);

  function handleTagClick(tag: string) {
    setActiveTag((current) => (current === tag ? null : tag));
  }

  const MoreIcon = moreProjects.icon;

  return (
    <section className="py-12 border-t border-white/[0.06]">
      <SectionTitle kicker="// works" title="Things I've made" count={projects.length} />

      <GithubFeed />

      {/* Tag filter pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={cn(
              // Base .pill treatment: translucent slate, border, mono text
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-medium transition-all duration-200",
              activeTag === tag
                ? // .pill--active: blue-tinted with subtle glow
                  "text-[#93c5fd] bg-blue-950/50 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                : // .pill default: translucent slate
                  "text-white/60 bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:text-white"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Curated project list */}
      <div className="mt-4 flex flex-col gap-2">
        {filteredProjects.map((project) => (
          <ProjectRow
            key={project.title}
            project={project}
            onTagClick={handleTagClick}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center font-mono text-[13px] text-white/35">
          No projects match this tag.
        </div>
      )}

      {/* More projects link */}
      <div className="mt-6 flex justify-end">
        <a
          href={moreProjects.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[13px] text-white/50 hover:text-white/85 transition-colors"
        >
          {moreProjects.text}
          <MoreIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
