# Landing Page UI Refresh — Design

Date: 2026-05-18

## Overview

A focused visual pass over three areas of the landing page, plus a glow-intensity
reduction. No new sections, no data-layer changes. Scope:

1. **Ambient glow** — dim it dramatically toward "almost invisible".
2. **Project section** — replace the long vertical row list with a 2-column
   thumbnail-card grid; drop the year; surface project images.
3. **Tech Stack** — fix the wrapping category label.

All three were validated against browser mockups during brainstorming.

## 1. Ambient glow

`src/components/ambient-glow.tsx` exposes an `INTENSITY` constant (currently
`1.6`) that scales every blob's gradient alpha and the scanline.

**Change:** `INTENSITY = 1.6 → 0.27`.

At `0.27`, blob 1's peak alpha lands at ~0.15 — the same as howar31-blog's
`--glow-1` token, the reference for "barely-there". Update the header comment
that documents the intensity value. No structural change to the blobs,
animations, or scanline.

## 2. Project section — 2-column thumbnail cards

### Layout

`src/components/projects.tsx` (`ProjectGrid`): the curated project list changes
from `flex flex-col gap-2` to a responsive grid — one column below the existing
`feed` breakpoint (880px), two columns above it
(`grid-cols-1 feed:grid-cols-2 gap-3`). The empty-state and "more on GitHub"
link are unchanged. The tag filter still drives `filteredProjects`.

### Card component

`src/components/project-row.tsx` is renamed to `project-card.tsx`; the export
`ProjectRow` becomes `ProjectCard`. It is no longer a row.

Card anatomy — a horizontal flex layout:

- **Left:** a 60×60 tile, `rounded-[9px]`, `flex-none`.
  - If the project has a usable image: an `<img>` cropped with `object-cover`,
    `loading="lazy"`, empty `alt` (decorative — the title carries the name).
  - Otherwise: a **monogram tile** — a gradient background tinted by the
    project's primary-tag color, with the monogram centered in mono type.
- **Right** (`min-w-0`): title row (title + optional language pill),
  description clamped to two lines (`line-clamp-2`), then the clickable tag
  pills (same filter behavior as today).
- **Whole card is a link** (`<a>`) for public projects. Private projects
  (`url` is `#` or empty) render as a non-link `<div>` with a lock icon in
  place of the hover arrow.
- **Hover** (public only): background lifts to `rgba(15,23,42,0.7)`, border
  tints blue (`rgba(96,165,250,0.28)`), a `↗` appears. Mirrors the current
  row's hover treatment.

The `year` display is removed entirely.

### Monogram

New pure helper `src/lib/monogram.ts`:

```
deriveMonogram(project: Project): string
```

Rules, in order:

1. If `project.monogram` is set, return it verbatim.
2. If the title starts with a CJK character, return that first character.
3. Otherwise (Latin): return the uppercased first letter of each of the first
   two whitespace-separated words; if the title is a single word, return its
   first two letters uppercased.

The tile gradient is derived from the project's **primary tag** (`tags[0]`) via
a static tag→color map kept in `project-card.tsx` (small, local, no premature
abstraction). Tags and colors:

- Design → `#a78bfa`
- Website → `#60a5fa`
- Community → `#f472b6`
- Game → `#34d399`
- Tool → `#f59e0b`
- Translation → `#22d3ee`

A project with no tags, or a tag not in the map, falls back to the default
purple (`#a78bfa`). The tile background is a single-hue 135° gradient built
from that one tag color — from the color at ~0.30 alpha to ~0.15 alpha — so it
is fully deterministic and needs no second color input. The monogram sits on
top in mono type at `rgba(255,255,255,0.6)`.

### Data changes — `src/data/projects.ts`

- **`Project` type:** remove `year`. Add optional `monogram?: string`.
- Remove every `year` entry from the project objects.
- **Images:** download the worthwhile hotlinked remote images into `public/`
  and repoint `imageUrl` to local paths. Affected projects: GW2 Timer,
  PTT 推樂透, Countdown, NeoPlurkCSS3, Warhammer 40K Rogue Trader,
  Prison Architect, Banished.
  - EzTwitch's `imageUrl` is a 128px app icon, not a screenshot — clear it so
    EzTwitch falls back to a monogram tile.
  - Star Citizen and 鄭愁予數位文學館 already use local images — unchanged.
  - Any remote image that fails to download (e.g. the 2013 NeoPlurkCSS3
    `camo`/blogspot URL may be dead) has its `imageUrl` cleared and falls back
    to a monogram tile. This is acceptable.
- `imageUrl: ""` empty strings are treated as "no image".

## 3. Tech Stack — stacked labels

`src/components/tech-stack.tsx`: the current per-row 3-column grid
(`grid-cols-[20px_90px_1fr]`) gives the category label a fixed 90–110px column,
which is too narrow for "Cloud & DevOps" and "Database & Tools" — they wrap.

**Change:** drop the fixed grid. Each `<li>` becomes a stacked block:

- A header line: the colored dot + the mono uppercase label, side by side.
- Below it, the skills list on a full-width line.

No fixed column remains, so no label can wrap. The `border-bottom` dividers and
vertical rhythm (`py-4`) are preserved. The `skillCategories` data is unchanged.

## Files touched

| File | Change |
|---|---|
| `src/components/ambient-glow.tsx` | `INTENSITY` 1.6 → 0.27; comment update |
| `src/components/projects.tsx` | list → 2-column responsive grid; import rename |
| `src/components/project-row.tsx` → `project-card.tsx` | rename; row → thumbnail card; monogram tile; year removed |
| `src/components/tech-stack.tsx` | 3-column grid → stacked blocks |
| `src/data/projects.ts` | remove `year`; add `monogram?`; repoint images |
| `src/lib/monogram.ts` | new — `deriveMonogram` pure helper |
| `src/lib/monogram.test.ts` | new — Vitest coverage |
| `public/` | new local images for the downloaded remote ones |
| `SPEC.md` | sync: component rename, year removed, `imageUrl` now used |

## Verification

- `npm test` — Vitest, including new `monogram.test.ts` covering: explicit
  override, CJK first char, two-word Latin, single-word Latin, no-tag fallback.
- `npm run lint` — ESLint clean.
- `npm run build` — static export succeeds; downloaded images present in `out/`.
- Manual:
  - Project grid is 2-column ≥ 880px, 1-column below, down to ~360px.
  - Cards with images show square-cropped thumbnails; image-less cards show
    monogram tiles tinted by primary tag.
  - Private projects show a lock and are not links; public cards hover and link.
  - Tech Stack: no label wraps; "Cloud & DevOps" / "Database & Tools" fit.
  - Glow is barely perceptible; `prefers-reduced-motion` still honored.

## Out of scope

- No changes to the GitHub feed, blog feed, identity card, or support block.
- No new project entries; no curation changes beyond image sourcing.
- The tag→color map is intentionally local to `project-card.tsx`; not promoted
  to shared config until a second consumer needs it.
