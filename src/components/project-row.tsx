"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { type Project } from "@/data/projects";
import { languageColor } from "@/lib/languages";
import { cn } from "@/lib/utils";

interface ProjectRowProps {
  project: Project;
  onTagClick: (tag: string) => void;
}

const isPrivate = (url: string | undefined): boolean =>
  !url || url === "#";

export function ProjectRow({ project, onTagClick }: ProjectRowProps) {
  const [hover, setHover] = useState(false);
  const langColor = languageColor(project.language);

  const titleRow = (
    <div className="flex items-center gap-2.5 flex-wrap">
      <span className="text-[17px] font-semibold text-white tracking-[-0.01em]">
        {project.title}
      </span>
      {project.language && (
        <span
          className="inline-flex items-center gap-[5px] font-mono text-[11px] px-2 py-0.5 rounded-full"
          style={{
            background: langColor + "22",
            color: langColor,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: langColor }}
          />
          {project.language}
        </span>
      )}
    </div>
  );

  const body = (
    <div className="min-w-0">
      {titleRow}
      <div className="mt-1.5 text-[14.5px] leading-[1.55] text-white/70">
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

  if (isPrivate(project.url)) {
    return (
      <div
        className="grid gap-x-[14px] feed:gap-x-[18px] gap-y-[18px] items-start p-[18px_16px] rounded-xl border border-white/[0.06] grid-cols-[46px_1fr_24px] feed:grid-cols-[64px_1fr_24px]"
      >
        <div className="font-mono text-[12px] text-white/40 pt-1">
          {project.year ?? ""}
        </div>
        {body}
        <div className="pt-1 text-white/30" title="This is a private project">
          <Lock size={16} />
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
      className={cn(
        "grid gap-x-[14px] feed:gap-x-[18px] gap-y-[18px] items-start p-[18px_16px] rounded-xl border",
        "grid-cols-[46px_1fr_24px] feed:grid-cols-[64px_1fr_24px]",
        "no-underline",
        "transition-[background,border-color] duration-200 ease-[ease]",
      )}
      style={{
        background: hover ? "rgba(15,23,42,0.6)" : "transparent",
        borderColor: hover ? "rgba(96,165,250,0.25)" : "rgba(255,255,255,0.06)",
      }}
    >
      <div className="font-mono text-[12px] text-white/40 pt-1">
        {project.year ?? ""}
      </div>
      {body}
      <div
        className="text-[#a78bfa]/70 text-[18px] pt-1 transition-transform duration-200 ease-[ease]"
        style={{ transform: hover ? "translateX(4px)" : "none" }}
      >
        ↗
      </div>
    </a>
  );
}
