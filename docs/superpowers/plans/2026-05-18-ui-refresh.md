# Landing Page UI Refresh — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dim the ambient glow, rebuild the project section as a 2-column thumbnail-card grid, and fix the wrapping Tech Stack label.

**Architecture:** Pure presentational changes plus one new pure helper (`src/lib/monogram.ts`). No data-layer or fetch changes. The project list moves from a vertical row list to a responsive 2-column grid of thumbnail cards; image-less projects get a generated monogram tile.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS 3.4, Vitest.

**Commit policy:** Per the project's `CLAUDE.md`, commits are NOT made per task. Implement all tasks, then Task 9 runs full verification and hands off to the `/commit` skill, which presents a summary and waits for the user's approval. Individual tasks below have no `git commit` step.

**Source spec:** `docs/superpowers/specs/2026-05-18-ui-refresh-design.md`

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `src/components/ambient-glow.tsx` | Background glow blobs | Modify — lower `INTENSITY` |
| `src/lib/monogram.ts` | Derive a placeholder monogram from a project | Create |
| `src/lib/monogram.test.ts` | Unit tests for `deriveMonogram` | Create |
| `src/data/projects.ts` | Curated project data + `Project` type | Modify — drop `year`, add `monogram?`, repoint images |
| `public/*.{png,jpg}` | Locally-hosted project thumbnails | Create — downloaded images |
| `src/components/project-row.tsx` → `project-card.tsx` | One project, rendered as a thumbnail card | Rename + rewrite |
| `src/components/projects.tsx` | Project section: feed + grid + tag filter | Modify — list → grid, import rename |
| `src/components/tech-stack.tsx` | Tech-stack category list | Modify — column grid → stacked blocks |
| `SPEC.md` | Project architecture doc | Modify — sync the above |

---

## Task 1: Dim the ambient glow

**Files:**
- Modify: `src/components/ambient-glow.tsx:3-7`

- [ ] **Step 1: Lower the intensity constant and update the comment**

In `src/components/ambient-glow.tsx`, replace lines 3-7:

```tsx
// Fixed glow color values derived from #8b5cf6 (r1,g1,b1) and #a855f7 (r2,g2,b2)
// Mid-blend: r3=Math.round((139+168)/2)=153, g3=Math.round((92+85)/2)=88, b3=Math.round((246+247)/2)=246
// intensity = 1.6

const INTENSITY = 1.6;
```

with:

```tsx
// Fixed glow color values derived from #8b5cf6 (r1,g1,b1) and #a855f7 (r2,g2,b2)
// Mid-blend: r3=Math.round((139+168)/2)=153, g3=Math.round((92+85)/2)=88, b3=Math.round((246+247)/2)=246
// intensity = 0.27 — tuned so blob 1 peaks at ~0.15 alpha, matching howar31-blog's --glow-1

const INTENSITY = 0.27;
```

- [ ] **Step 2: Verify the build still compiles**

Run: `npm run lint`
Expected: exit 0. Only pre-existing `<img>` warnings, no errors.

---

## Task 2: `deriveMonogram` helper (TDD)

**Files:**
- Create: `src/lib/monogram.ts`
- Test: `src/lib/monogram.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/monogram.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { deriveMonogram } from "./monogram";
import { type Project } from "@/data/projects";

// Minimal project factory — only the fields deriveMonogram reads.
function project(over: Partial<Project>): Project {
  return {
    title: "Untitled",
    description: "",
    url: "#",
    tags: [],
    ...over,
  };
}

describe("deriveMonogram", () => {
  it("uses an explicit monogram override verbatim", () => {
    expect(deriveMonogram(project({ title: "Anything", monogram: "X9" }))).toBe("X9");
  });

  it("returns the first character for a CJK title", () => {
    expect(deriveMonogram(project({ title: "早餐計算機" }))).toBe("早");
  });

  it("returns the first letters of the first two ASCII words, uppercased", () => {
    expect(deriveMonogram(project({ title: "Discord Bot Usagi" }))).toBe("DB");
  });

  it("returns the first two letters for a single-word title", () => {
    expect(deriveMonogram(project({ title: "Countdown" }))).toBe("CO");
  });

  it("ignores trailing CJK words when the title leads with ASCII", () => {
    expect(deriveMonogram(project({ title: "Stockfeel 股感知識庫" }))).toBe("ST");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run src/lib/monogram.test.ts`
Expected: FAIL — cannot resolve `./monogram`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/monogram.ts`:

```ts
import { type Project } from "@/data/projects";

// First character is a CJK ideograph (incl. Extension A) or Japanese kana.
const CJK_FIRST = /^[぀-ヿ㐀-鿿]/;

/**
 * Derive a short monogram for a project's placeholder tile.
 * Priority: explicit override → first CJK character → initials of the first
 * two ASCII-leading words → first two characters of the title.
 */
export function deriveMonogram(project: Project): string {
  if (project.monogram && project.monogram.trim() !== "") {
    return project.monogram.trim();
  }
  const title = project.title.trim();
  if (CJK_FIRST.test(title)) {
    return title[0];
  }
  const words = title.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return title.slice(0, 2).toUpperCase();
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/lib/monogram.test.ts`
Expected: PASS — 5 tests.

---

## Task 3: Download project images

The 7 hotlinked remote images are copied into `public/` so they are static and
fast. EzTwitch's remote URL (a 128px app icon) is intentionally NOT downloaded.

**Files:**
- Create: `public/gw2timer.png`, `public/pttlottery.png`, `public/countdown.png`,
  `public/neoplurkcss3.png`, `public/wh4krt.jpg`, `public/prison-architect.jpg`,
  `public/banished.jpg`

- [ ] **Step 1: Download each remote image into `public/`**

Run from the repo root:

```bash
curl -fL --max-time 30 -o public/gw2timer.png        "https://github.com/howar31/GW2Timer/raw/gh-pages/GW2Timer_Preview_en.png"
curl -fL --max-time 30 -o public/pttlottery.png      "https://github.com/howar31/PTTLottery/raw/gh-pages/preview.png"
curl -fL --max-time 30 -o public/countdown.png       "https://github.com/howar31/countdown/raw/gh-pages/preview2.png"
curl -fL --max-time 30 -o public/wh4krt.jpg          "https://github.com/howar31/WH4KRT-TradChinese/raw/main/screenshots/20241110231725_1.jpg"
curl -fL --max-time 30 -o public/prison-architect.jpg "https://images.steamusercontent.com/ugc/441732331243214089/AC1E70D832FC116B983627C30FEAF9D86D4467FC/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
curl -fL --max-time 30 -o public/banished.jpg        "https://cdn.steamusercontent.com/ugc/38606361443126458/DAA04D6C5A22D5ABC8772972C77D6326D5E60FB9/?imw=268&imh=268&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
curl -fL --max-time 30 -o public/neoplurkcss3.png    "https://camo.githubusercontent.com/234ab2d21c889aa2e587ded3510ed0b8505b9e5cca2c077f3f472cc44105599e/687474703a2f2f332e62702e626c6f6773706f742e636f6d2f2d30744471616f6251386e6b2f55555a57626657645a5f492f41414141414141414a35512f6c66766b6a4f772d4348592f73313630302f312e6e6f6c6f67696e2e706e67"
```

- [ ] **Step 2: Verify each file is a real image and note any failures**

Run: `for f in gw2timer.png pttlottery.png countdown.png neoplurkcss3.png wh4krt.jpg prison-architect.jpg banished.jpg; do echo -n "$f: "; file -b "public/$f" 2>/dev/null || echo MISSING; done`

Expected: each line reports `PNG image data` or `JPEG image data`.

**For any file that failed to download or is not a valid image:** delete the
broken file (`rm public/<name>`) and record the project name — in Task 4 that
project's `imageUrl` is set to `""` instead of the local path, so it falls back
to a monogram tile. The 2013 `neoplurkcss3.png` (a `camo`-wrapped blogspot URL)
is the most likely to fail; that is acceptable.

---

## Task 4: Update `projects.ts` data

Remove `year` from the type and every entry, add the optional `monogram` field,
and repoint `imageUrl` to local paths.

**Files:**
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Replace the entire file contents**

Overwrite `src/data/projects.ts` with:

```ts
import { Github } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
  imageUrl?: string;
  language?: string;
  /** Optional override for the placeholder-tile monogram (image-less cards). */
  monogram?: string;
}

export const projects: Project[] = [
  {
    title: "Landing Page",
    description:
      "A minimalist, performance-focused personal landing page built with Next.js. (a.k.a this website)",
    url: "https://github.com/howar31/landing-page",
    tags: ["Design", "Website"],
    imageUrl: "",
    language: "TypeScript",
  },
  {
    title: "Star Citizen 中文社群網",
    description: "Traditional Chinese community website for Star Citizen.",
    url: "http://starcitizen.howar31.com/",
    tags: ["Community", "Game", "Website"],
    imageUrl: "/starcitizen.jpg",
  },
  {
    title: "GW2 Timer",
    description: "Guild Wars 2 World Boss Event Timer.",
    url: "https://gw2timer.howar31.com/",
    tags: ["Game", "Tool", "Website"],
    imageUrl: "/gw2timer.png",
    language: "JavaScript",
  },
  {
    title: "PTT 推樂透",
    description: "Lottery tool for PTT (Taiwanese BBS).",
    url: "https://pttlottery.howar31.com/",
    tags: ["Tool", "Website"],
    imageUrl: "/pttlottery.png",
    language: "JavaScript",
  },
  {
    title: "Countdown",
    description: "A pure JavaScript countdown timer.",
    url: "https://countdown.howar31.com/",
    tags: ["Tool", "Website"],
    imageUrl: "/countdown.png",
    language: "JavaScript",
  },
  {
    title: "假的 信用卡安全掃描系統",
    description:
      "A prank web app simulating credit card scanning to raise security awareness.",
    url: "https://howar31.github.io/prank_credit_card_scan/",
    tags: ["Tool", "Website"],
    imageUrl: "",
  },
  {
    title: "早餐計算機",
    description:
      "A simple breakfast calculator to choose the best meal items within the company’s subsidy amount.",
    url: "https://howar31.github.io/breakfast/",
    tags: ["Tool", "Website"],
    imageUrl: "",
    language: "JavaScript",
  },
  {
    title: "NeoPlurkCSS3",
    description: "Modern CSS3 theme for Plurk.",
    url: "https://github.com/howar31/NeoPlurkCSS3",
    tags: ["Design"],
    imageUrl: "/neoplurkcss3.png",
    language: "CSS",
  },
  {
    title: "EzTwitch",
    description:
      "A lightweight Chrome extension for Twitch TV notification and popout.",
    url: "https://chrome.google.com/webstore/detail/eztwitch/pnapgjocmoacccjajhomkikgggcepobk/",
    tags: ["Tool"],
    imageUrl: "",
    language: "JavaScript",
  },
  {
    title: "中華民國外交部駐外單位網站",
    description: "Portal of Diplomatic Missions of ROC (Taiwan).",
    url: "http://www.roc-taiwan.org/portalOfDiplomaticMission_tc.html",
    tags: ["Website"],
    imageUrl: "",
  },
  {
    title: "Stockfeel 股感知識庫",
    description: "Financial knowledge platform.",
    url: "http://www.stockfeel.com.tw/",
    tags: ["Website"],
    imageUrl: "",
  },
  {
    title: "國立臺北大學 鄭愁予數位文學館",
    description: "Digital literature museum for Zheng Chouyu.",
    url: "http://www.digitalpoetry-zcy.ntpu.edu.tw/",
    tags: ["Website"],
    imageUrl: "/digitalpoetry-zcy.jpg",
  },
  {
    title: "Warhammer 40,000: Rogue Trader 繁體中文化",
    description:
      "Traditional Chinese localization project for Warhammer 40,000: Rogue Trader.",
    url: "https://github.com/howar31/WH4KRT-TradChinese",
    tags: ["Game", "Translation"],
    imageUrl: "/wh4krt.jpg",
  },
  {
    title: "Prison Architect 繁體中文化",
    description: "Traditional Chinese localization mod for Prison Architect.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=473471025",
    tags: ["Game", "Translation"],
    imageUrl: "/prison-architect.jpg",
  },
  {
    title: "Banished 繁體中文化",
    description: "Traditional Chinese localization mod for Banished.",
    url: "https://steamcommunity.com/sharedfiles/filedetails/?id=338554849",
    tags: ["Game", "Translation"],
    imageUrl: "/banished.jpg",
  },
  {
    title: "Trove Auto Fishing",
    description: "AutoHotKey script for auto fishing in Trove.",
    url: "https://github.com/howar31/Trove-AHK-AutoFish",
    tags: ["Game", "Tool"],
    imageUrl: "",
    language: "AutoHotkey",
  },
  {
    title: "Discord Bot Usagi",
    description: "Custom Discord bot for private server management.",
    url: "#",
    tags: ["Community", "Tool"],
    imageUrl: "",
  },
  {
    title: "EVE Echoes IOP 鐵星軍團",
    description: "Guild website for EVE Echoes Iron Order Phalanx corporation.",
    url: "#",
    tags: ["Community", "Game"],
    imageUrl: "",
  },
  {
    title: "GW2 PTT Netizens 公會網站",
    description: "Guild website for GW2 PTT players.",
    url: "#",
    tags: ["Community", "Game"],
    imageUrl: "",
  },
  {
    title: "Oh-My-Zsh Powerline Theme",
    description: "A modified Powerline style theme for Oh My Zsh.",
    url: "https://github.com/howar31/oh-my-zsh-powerline-theme",
    tags: ["Design", "Tool"],
    imageUrl: "",
    language: "Shell",
  },
];

export const moreProjects = {
  text: "More on GitHub",
  url: "https://github.com/howar31",
  icon: Github,
};
```

- [ ] **Step 2: Apply any download-failure fallbacks**

For every project recorded as failed in Task 3 Step 2, change its `imageUrl`
to `""` in the file above. (If `neoplurkcss3.png` failed, NeoPlurkCSS3's
`imageUrl` becomes `""`.)

- [ ] **Step 3: Verify the type compiles**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

---

## Task 5: Build the `ProjectCard` component

Rename `project-row.tsx` to `project-card.tsx` and rewrite it as a thumbnail card.

**Files:**
- Rename: `src/components/project-row.tsx` → `src/components/project-card.tsx`

- [ ] **Step 1: Rename the file (preserve git history)**

Run: `git mv src/components/project-row.tsx src/components/project-card.tsx`

- [ ] **Step 2: Replace the file contents**

Overwrite `src/components/project-card.tsx` with:

```tsx
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
  Design: "#a78bfa",
  Website: "#60a5fa",
  Community: "#f472b6",
  Game: "#34d399",
  Tool: "#f59e0b",
  Translation: "#22d3ee",
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
      <div className="mt-1 text-[13.5px] leading-[1.5] text-white/65 line-clamp-2">
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
```

---

## Task 6: Switch `projects.tsx` to the 2-column grid

**Files:**
- Modify: `src/components/projects.tsx:8` (import) and `:71-79` (list → grid)

- [ ] **Step 1: Update the import**

In `src/components/projects.tsx`, replace line 8:

```tsx
import { ProjectRow } from "@/components/project-row";
```

with:

```tsx
import { ProjectCard } from "@/components/project-card";
```

- [ ] **Step 2: Replace the list block with a responsive grid**

Replace the "Curated project list" block (lines 70-79):

```tsx
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
```

with:

```tsx
      {/* Curated project grid — one column below 880px, two above */}
      <div className="mt-4 grid grid-cols-1 feed:grid-cols-2 gap-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
            onTagClick={handleTagClick}
          />
        ))}
      </div>
```

- [ ] **Step 3: Verify no stale references to the old component remain**

Run: `grep -rn "ProjectRow\|project-row" src/`
Expected: no output.

---

## Task 7: Restack the Tech Stack labels

**Files:**
- Modify: `src/components/tech-stack.tsx`

- [ ] **Step 1: Replace the file contents**

Overwrite `src/components/tech-stack.tsx` with:

```tsx
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
```

---

## Task 8: Sync `SPEC.md`

**Files:**
- Modify: `SPEC.md`

- [ ] **Step 1: Update the component list entry**

In `SPEC.md`, in the `Layout` tree, replace the `project-row.tsx` line:

```
│   │   ├── project-row.tsx     # One curated project row
```

with:

```
│   │   ├── project-card.tsx    # One curated project, as a thumbnail card
```

- [ ] **Step 2: Update the "Known Limitations / Non-goals" section**

Replace these two bullets:

```
- `Project.imageUrl` is retained in the data but unused by the current
  row-based layout (vestigial from the previous card-grid design).
- `Project.year` / `Project.language` are backfilled only for GitHub-hosted
  projects; non-GitHub projects leave them blank.
```

with:

```
- `Project.imageUrl` is a locally-hosted thumbnail when present; image-less
  projects render a generated monogram tile instead.
- `Project.language` is set only for projects whose language is known;
  others leave it blank.
```

- [ ] **Step 3: Update the `lib/` description in the Layout tree**

After the `languages.ts` line, the `lib/` listing should include `monogram.ts`.
Add this line directly below the `languages.ts` entry:

```
│       ├── monogram.ts         # Derive a placeholder monogram for a project
```

---

## Task 9: Full verification and commit

- [ ] **Step 1: Run the unit tests**

Run: `npm test`
Expected: all test files pass, including `src/lib/monogram.test.ts` (5 tests).

- [ ] **Step 2: Run the linter**

Run: `npm run lint`
Expected: exit 0. Only `<img>` warnings (`identity-card.tsx`; `project-card.tsx`
is suppressed with an inline `eslint-disable`). No errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds; `out/` is generated and contains the downloaded
images (e.g. `out/gw2timer.png`).

- [ ] **Step 4: Manual check**

Run `npm run dev` and confirm at http://localhost:3000:
- Glow is barely perceptible.
- Project section is a 2-column grid ≥ 880px, 1-column below (resize down to ~360px).
- Cards with images show square thumbnails; image-less cards show monogram tiles.
- Private projects (Discord Bot Usagi, EVE Echoes IOP, GW2 PTT Netizens) show a
  lock and are not links; public cards hover (background lift, blue border, ↗).
- Tech Stack: no category label wraps.

Stop the dev server before continuing.

- [ ] **Step 5: Commit via the `/commit` skill**

Per `CLAUDE.md`, do NOT run `git commit` directly. Invoke the `/commit` skill.
It syncs documentation and presents a summary for the user to approve. When
prompted, note that this work spans three logical changes (glow, project cards,
Tech Stack) — let the user decide whether to land them as one commit or three.

---

## Self-Review Notes

- **Spec coverage:** glow intensity (Task 1), monogram helper (Task 2), image
  download (Task 3), data changes incl. year removal + `monogram` field
  (Task 4), thumbnail card incl. rename, hover, lock, language pill (Task 5),
  2-column grid (Task 6), Tech Stack stacked labels (Task 7), SPEC sync
  (Task 8). All spec sections map to a task.
- **Type consistency:** `deriveMonogram(project: Project)` defined in Task 2 and
  consumed in Task 5; `Project` gains `monogram?` in Task 4 before Task 5 reads
  it; `TAG_COLOR` keys match the design's tag list. `ProjectCard` named export
  matches the Task 6 import.
- **Verification:** TDD for the one pure helper; lint + build + manual for the
  presentational changes (the repo unit-tests only `src/lib/` pure functions).
