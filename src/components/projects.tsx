"use client";

import { useState, useMemo } from "react";
import { flushSync } from "react-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { projects, moreProjects } from "@/data/projects";
import { SectionTitle } from "@/components/section-title";
import { GithubFeed } from "@/components/github-feed";
import { ErrorBoundary } from "@/components/error-boundary";
import { ProjectCard } from "@/components/project-card";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 6;

// Curated filter pills, in narrative order. The filter bar is decoupled from
// the full tag vocabulary: descriptive tags (Website, Community, CLI) stay on
// cards but are intentionally kept out of the pills. Any tag — pill or not —
// still filters when clicked from a card.
const PRIMARY_TAGS = [
  "AI",
  "Claude",
  "Dev Tools",
  "Web App",
  "Gaming",
  "Localization",
  "Design",
  "Client Work",
];

export function ProjectGrid() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  // Collapsed by default; any filter interaction also expands so filtering
  // operates on the full list rather than the visible six.
  const [expanded, setExpanded] = useState(false);

  // Filter projects by active tag; show all when null
  const filteredProjects = useMemo(() => {
    if (activeTag === null) return projects;
    return projects.filter((project) => project.tags.includes(activeTag));
  }, [activeTag]);

  // Always render the first six in a stable grid. Anything beyond goes into a
  // separately rendered "extras" grid that we slide open/closed.
  const firstSix = filteredProjects.slice(0, INITIAL_VISIBLE);
  const extras = filteredProjects.slice(INITIAL_VISIBLE);

  const hiddenCount = projects.length - INITIAL_VISIBLE;
  const showMoreVisible = !expanded && activeTag === null && hiddenCount > 0;
  // Collapse only makes sense when the list was expanded by the user and not
  // narrowed by a filter; otherwise the filter is what's controlling visibility.
  const showLessVisible = expanded && activeTag === null && hiddenCount > 0;
  // Extras are visible when the user has expanded the list OR when a filter
  // pushes the result past the initial six. In the filter case we forced
  // expanded=true, so this reduces to a single condition.
  const extrasOpen = expanded;

  // Stable view-transition-name per project, indexed off the full list, so a
  // card that survives a filter change morphs from its old grid slot to the new.
  const transitionNames = useMemo(() => {
    const map = new Map<string, string>();
    projects.forEach((project, i) =>
      map.set(project.title, `project-card-${i}`)
    );
    return map;
  }, []);

  function runWithTransition(apply: () => void) {
    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => unknown;
    };
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // View Transitions: removed cards fade out, survivors glide to their new
    // slot. flushSync commits React's update inside the transition callback.
    if (doc.startViewTransition && !reduceMotion) {
      doc.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  }

  function handleTagClick(tag: string) {
    runWithTransition(() => {
      // Any filter interaction implies expansion so the filter sees the full
      // list, never just the initial six.
      setExpanded(true);
      setActiveTag((current) => (current === tag ? null : tag));
    });
  }

  // Show more / Show less rely on a plain CSS slide on the extras container
  // (max-height + opacity + margin-top). View Transitions are intentionally
  // skipped here — they would snapshot cards while the container is collapsing
  // and cause the slide to compete with a cross-fade.
  function handleShowMore() {
    setExpanded(true);
  }

  function handleShowLess() {
    setExpanded(false);
  }

  const MoreIcon = moreProjects.icon;

  return (
    <section className="py-7 feed:py-8 border-t border-white/[0.06]">
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
        {PRIMARY_TAGS.map((tag) => (
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

      {/* Curated project grid — split in two: the always-visible first six,
         and an "extras" grid that slides open/closed. The split lets us drive
         the show more/less animation with a max-height/opacity transition,
         while each card still carries a stable view-transition-name so the
         tag filter retains its morph/glide behavior. */}
      <div className="mt-4 grid grid-cols-1 feed:grid-cols-2 gap-3">
        {firstSix.map((project) => (
          <div
            key={project.title}
            style={{ viewTransitionName: transitionNames.get(project.title) }}
          >
            <ProjectCard project={project} onTagClick={handleTagClick} />
          </div>
        ))}
      </div>

      {extras.length > 0 && (
        // Outer grid animates a single row from 0fr → 1fr — the row's natural
        // size IS the inner content height, so the slide is exact. The inner
        // `overflow-hidden` clips during the transition.
        <div
          className={cn(
            "grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out",
            extrasOpen
              ? "grid-rows-[1fr] opacity-100 mt-3"
              : "grid-rows-[0fr] opacity-0 mt-0"
          )}
          aria-hidden={!extrasOpen}
        >
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 feed:grid-cols-2 gap-3">
              {extras.map((project) => (
                <div
                  key={project.title}
                  style={{
                    viewTransitionName: transitionNames.get(project.title),
                  }}
                >
                  <ProjectCard project={project} onTagClick={handleTagClick} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="py-16 text-center font-mono text-[13px] text-white/35">
          No projects match this tag.
        </div>
      )}

      {/* Footer row: Show more/less on the left, more on GitHub on the right —
         both rendered as plain mono text links so the row stays compact on
         narrow viewports (the old pill button forced the GitHub link to wrap). */}
      <div className="mt-6 flex items-center justify-between gap-3">
        {showMoreVisible || showLessVisible ? (
          <button
            type="button"
            onClick={showMoreVisible ? handleShowMore : handleShowLess}
            className="inline-flex items-center gap-1.5 font-mono text-[13px] text-white/50 hover:text-white/85 transition-colors"
          >
            {showMoreVisible ? (
              <>
                Show {hiddenCount} more
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show less
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        ) : (
          <span />
        )}
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
