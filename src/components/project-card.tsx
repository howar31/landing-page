"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { type Project } from "@/data/projects";
import { languageColor } from "@/lib/languages";
import { deriveMonogram } from "@/lib/monogram";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  onTagClick: (tag: string) => void;
}

// Primary-tag → accent color for the monogram-tile gradient.
const TAG_COLOR: Record<string, string> = {
  AI: "#f59e0b",
  Claude: "#d97757",
  "Dev Tools": "#818cf8",
  "Web App": "#38bdf8",
  Gaming: "#34d399",
  Localization: "#22d3ee",
  Design: "#a78bfa",
  "Client Work": "#fb923c",
  Website: "#60a5fa",
  Community: "#f472b6",
  CLI: "#94a3b8",
};
const DEFAULT_TAG_COLOR = "#a78bfa";

const isPrivate = (url: string | undefined): boolean => !url || url === "#";

const hasImage = (project: Project): boolean =>
  typeof project.imageUrl === "string" && project.imageUrl.trim() !== "";

export function ProjectCard({ project, onTagClick }: ProjectCardProps) {
  const [hover, setHover] = useState(false);
  const langColor = languageColor(project.language);
  const tileColor = TAG_COLOR[project.tags[0]] ?? DEFAULT_TAG_COLOR;

  // 60x60 tile: a cropped screenshot, or a tag-tinted monogram tile.
  const tile = hasImage(project) ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.imageUrl}
      alt=""
      loading="lazy"
      className="w-[60px] h-[60px] rounded-[9px] object-cover flex-none"
    />
  ) : (
    <div
      className="w-[60px] h-[60px] rounded-[9px] flex-none flex items-center justify-center font-mono text-[22px] font-bold text-white/60"
      style={{
        background: `linear-gradient(135deg, ${tileColor}4d, ${tileColor}26)`,
      }}
    >
      {deriveMonogram(project)}
    </div>
  );

  const body = (
    <div className="min-w-0 flex-1 pr-5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[15px] font-semibold text-white tracking-[-0.01em]">
          {project.title}
        </span>
        {project.language && (
          <span
            className="inline-flex items-center gap-[5px] font-mono text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: langColor + "22", color: langColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: langColor }}
            />
            {project.language}
          </span>
        )}
      </div>
      {/* line-clamp-2 truncates; title exposes the full text on hover. */}
      <div
        title={project.description}
        className="mt-1 text-[13.5px] leading-[1.5] text-white/65 line-clamp-2"
      >
        {project.description}
      </div>
      {project.tags.length > 0 && (
        <div className="mt-2.5 flex gap-1.5 flex-wrap">
          {project.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTagClick(tag);
              }}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/65 hover:text-white/90 hover:border-white/20 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const cardClass = cn(
    "relative flex gap-[13px] p-[13px] h-full rounded-xl border",
    "transition-[background,border-color] duration-200 ease-[ease]",
  );

  if (isPrivate(project.url)) {
    return (
      <div
        className={cardClass}
        style={{
          background: "transparent",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        {tile}
        {body}
        <div
          className="absolute top-[13px] right-[13px] text-white/30"
          title="This is a private project"
        >
          <Lock size={15} />
        </div>
      </div>
    );
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(cardClass, "no-underline")}
      style={{
        background: hover ? "rgba(15,23,42,0.7)" : "transparent",
        borderColor: hover ? "rgba(96,165,250,0.28)" : "rgba(255,255,255,0.06)",
      }}
    >
      {tile}
      {body}
      <div
        className="absolute top-[13px] right-[13px] text-[#a78bfa]/70 text-[16px] transition-transform duration-200 ease-[ease]"
        style={{ transform: hover ? "translateX(3px)" : "none" }}
      >
        ↗
      </div>
    </a>
  );
}
