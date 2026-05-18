"use client";

import { useState, useMemo } from "react";
import { flushSync } from "react-dom";
import { projects, moreProjects } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { GithubFeed } from "@/components/github-feed";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProjectCard } from "@/components/project-card";
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

  // Stable view-transition-name per project, indexed off the full list, so a
  // card that survives a filter change morphs from its old grid slot to the new.
  const transitionNames = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((project, i) => map.set(project.title, `project-card-${i}`));
    return map;
  }, []);

  function handleTagClick(tag: string) {
    const apply = () =>
      setActiveTag((current) => (current === tag ? null : tag));

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => unknown;
    };
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // View Transitions: removed cards fade out, survivors glide to their new
    // slot. flushSync commits React's update inside the transition callback.
    if (doc.startViewTransition && !reduceMotion) {
      doc.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  }

  const MoreIcon = moreProjects.icon;

  return (
    <section className="py-10 feed:py-12 border-t border-white/[0.06]">
      <SectionTitle kicker="// works" title="Things I've made" />

      <ErrorBoundary>
        <GithubFeed />
      </ErrorBoundary>

      {/* Featured work kicker */}
      <div className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
        ↳ Featured work
      </div>

      {/* Tag filter pills */}
      <div className="mt-3 flex flex-wrap gap-2">
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

      {/* Curated project grid — one column below 880px, two above.
         Each card carries a stable view-transition-name; the tag filter runs
         inside a View Transition so removed cards fade and survivors glide. */}
      <div className="mt-4 grid grid-cols-1 feed:grid-cols-2 gap-3">
        {filteredProjects.map((project) => (
          <div
            key={project.title}
            style={{ viewTransitionName: transitionNames.get(project.title) }}
          >
            <ProjectCard project={project} onTagClick={handleTagClick} />
          </div>
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
