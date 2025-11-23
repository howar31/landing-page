"use client";

import { useState, useMemo } from "react";
import { projects, moreProjects } from "@/data/projects";
import { ExternalLink, Folder, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";

export function ProjectGrid() {
  // Separate state for status filter (All/Public/Private) and tag filter
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Public" | "Private"
  >("All");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply status filter
    if (statusFilter === "Public") {
      filtered = filtered.filter(
        (project) => project.url && project.url !== "#"
      );
    } else if (statusFilter === "Private") {
      filtered = filtered.filter(
        (project) => !project.url || project.url === "#"
      );
    }

    // Apply tag filter
    if (selectedTag !== "All") {
      filtered = filtered.filter((project) =>
        project.tags.includes(selectedTag)
      );
    }

    return filtered;
  }, [statusFilter, selectedTag]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-900/50">
      <LazyMotion features={domAnimation}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          {/* ... existing header code ... */}
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 shrink-0">
            <Folder className="w-6 h-6 text-blue-400" />
            Side Projects
          </h2>

          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* Status Filter */}
            <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-800">
              {(["All", "Public", "Private"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-200",
                    statusFilter === status
                      ? "text-blue-300 bg-blue-900/50 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Divider for desktop */}
            <div className="hidden md:block w-px h-6 bg-slate-800" />

            {/* Tag Filter Bar */}
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(selectedTag === tag ? "All" : tag)
                  }
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200",
                    selectedTag === tag
                      ? "text-blue-300 bg-blue-900/50 border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                      : "text-slate-400 bg-slate-900/50 border-slate-800 hover:border-slate-600 hover:text-slate-200"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <m.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const hasLink = project.url && project.url !== "#";

              const CardContent = (
                <>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3
                        className={cn(
                          "font-bold text-lg transition-colors pr-4",
                          hasLink
                            ? "text-slate-100 group-hover:text-blue-400"
                            : "text-slate-100"
                        )}
                      >
                        {project.title}
                      </h3>
                      <div className="shrink-0 mt-1">
                        {!hasLink ? (
                          <div title="This is a private project">
                            <Lock className="w-4 h-4 text-slate-800" />
                          </div>
                        ) : (
                          <ExternalLink className="w-4 h-4 text-slate-800 group-hover:text-blue-400 transition-colors" />
                        )}
                      </div>
                    </div>

                    <p className="text-slate-400 mb-6 leading-relaxed text-sm flex-grow">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedTag(selectedTag === tag ? "All" : tag);
                          }}
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 rounded-full border transition-colors z-10 relative",
                            selectedTag === tag
                              ? "text-blue-300 bg-blue-950/80 border-blue-500/50"
                              : "text-blue-300 bg-blue-950/30 border-blue-900/30 hover:bg-blue-900/50 hover:border-blue-800/50"
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt=""
                      className="absolute bottom-0 right-0 h-full w-[60%] opacity-30 object-cover pointer-events-none"
                      style={{
                        maskImage:
                          "linear-gradient(110deg, transparent 20%, black 100%)",
                        WebkitMaskImage:
                          "linear-gradient(110deg, transparent 20%, black 100%)",
                      }}
                    />
                  )}
                </>
              );

              const cardClasses =
                "group flex flex-col p-6 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 backdrop-blur-sm h-full relative overflow-hidden";

              return (
                <m.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={project.title}
                >
                  {hasLink ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        cardClasses,
                        "hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                      )}
                    >
                      {CardContent}
                    </a>
                  ) : (
                    <div className={cardClasses}>{CardContent}</div>
                  )}
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>
      </LazyMotion>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          No projects found.
        </div>
      )}

      <div className="flex justify-end mt-8">
        <a
          href={moreProjects.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all duration-200"
        >
          <moreProjects.icon className="w-4 h-4" />
          <span className="text-sm font-medium">{moreProjects.text}</span>
        </a>
      </div>
    </section>
  );
}
