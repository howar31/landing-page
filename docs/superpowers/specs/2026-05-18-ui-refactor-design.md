# Landing Page UI Refactor — Design Spec

**Date:** 2026-05-18
**Status:** Approved (brainstorming) → ready for implementation planning
**Scope:** Visual redesign of howar31.com. Content/data refinement beyond what is
specified here is explicitly deferred.

## 1. Goal

Replace the current vertical-scroll landing page (full-screen Hero → Tech Stack →
filterable project card grid → Footer) with the two-column "personal card" layout
from the *Howar31 Brand* handoff (`ui_kits/landing-page`). The refactor is
visual-first: it adopts the design system's layout, tokens, fonts, and components.

The handoff bundle lives at `/Users/howar31/Downloads/Howar31 Brand-handoff.zip`
(extracted reference). The relevant kit is `howar31-brand/project/ui_kits/landing-page`
plus `colors_and_type.css` and `fonts/` / `assets/`.

## 2. Non-goals

- No data-accuracy pass on the curated project list beyond adding optional
  `year` / `language` fields (backfilled from GitHub where possible).
- No favicon / PWA icon / OpenGraph overhaul.
- The design system's dev-only "tweaks panel" is **not** ported.
- The `blog` and `hype-sign` UI kits are out of scope.
- No build-time data fetching or scheduled rebuilds — all dynamic data is fetched
  client-side (see §7).

## 3. Layout & shell

- Dark canvas `rgb(2, 6, 23)` (slate-950), always dark.
- **AmbientGlow** — four drifting blurred purple radial blobs + a faint scanline,
  fixed behind everything, `aria-hidden`, `pointer-events: none`. This is the
  brand's signature move. Animations disabled under `prefers-reduced-motion`.
- Two-column grid, max-width ~1180px:
  - **≥ 880px:** `320px` sticky `IdentityCard` rail + flexible content feed,
    `gap` ~56px.
  - **< 880px:** single column. `IdentityCard` stacks on top and is **not**
    sticky.
- `880px` is a custom breakpoint — add `screens: { feed: '880px' }` to the
  Tailwind config (or use a raw media query).

## 4. Components

All components are rewritten under `src/components/`. Naming is kebab-case files,
PascalCase exports. Components that fetch data or use hooks are client components
(`"use client"`).

| Component | File | Notes |
|---|---|---|
| `AmbientGlow` | `ambient-glow.tsx` | Decorative; static markup, CSS animations. |
| `TopBar` | `top-bar.tsx` | Wordmark + status text. |
| `IdentityCard` | `identity-card.tsx` | Left rail; client (consumes live repo/post counts). |
| `SectionTitle` | `section-title.tsx` | Kicker + title + optional count. |
| `IntroLetter` | `intro-letter.tsx` | Static copy. |
| `TechStack` | `tech-stack.tsx` | Row list built from `skills.ts`. |
| `Projects` | `projects.tsx` | Latest-on-GitHub strip + tag filter + curated list; client. |
| `ProjectRow` | `project-row.tsx` | One curated project row. |
| `GithubFeed` | `github-feed.tsx` | "Latest on GitHub" strip; client. |
| `Writing` | `writing.tsx` | Blog post list; client. |
| `SupportBlock` | `support-block.tsx` | Ko-fi + donate CTA. |
| `SiteFooter` | `site-footer.tsx` | Single copyright line. |

`src/components/hero.tsx`, `skills.tsx`, `footer.tsx` are removed/replaced.

## 5. Page composition

`src/app/page.tsx` renders:

```
<AmbientGlow />
<TopBar />
<main> two-column grid
  <IdentityCard />            ← left rail
  <div> feed                 ← right column
    <IntroLetter />
    <TechStack />
    <Projects />
    <Writing />
    <SupportBlock />
    <SiteFooter />
  </div>
</main>
```

### 5.1 TopBar

- Left: `howar31` wordmark with a blue→violet gradient dot.
- Right: green status dot + text `Open to interesting problems`.

### 5.2 IdentityCard (sticky left rail)

Frosted-glass panel (`rgba(15,23,42,0.55)`, `1px` white/8% border,
`backdrop-filter: blur(24px)`).

- Avatar: `avatar-2025.jpg` (copied from the bundle), blue→violet gradient ring + glow.
- `@howar31` handle (mono, muted).
- Name **Howar31** — blue→violet `background-clip: text` gradient.
- Tagline: `Web developer · open-source tinkerer`.
- Location line: `The Pale Blue Dot 🌌`.
- Stats row, three cells:
  - **Since** — `1995` (static; the year the user started writing code).
  - **Repos** — live, from GitHub API `public_repos`.
  - **Posts** — live, count of items in the blog RSS feed.
- Socials: **GitHub** (`https://github.com/howar31`) and **Blog**
  (`https://blog.howar31.com`) only. No Email, no RSS.
- Decorative "now playing" bar — purely ornamental, no real integration:
  - label `♪ on repeat`
  - text `Lo-fi beats · late-night coding`
  - animated equalizer bars kept (disabled under reduced-motion).

### 5.3 IntroLetter

Static letter-style block. Approved copy:

> **Hi there 👋**
>
> I'm Howar31 — a web developer who's been writing code since 1995, back when
> "deploying" meant FTP. These days I build modern web apps with a
> backend-and-cloud bias, and since 2022 I pair with AI on most of it. I keep a
> slow-burning blog about whatever I've recently figured out — or broken.
>
> This page is just a card I keep updated: somewhere to find my work and say hi.
>
> *— Howar31*

The "👋" wave keeps its small animation. No "last updated" line (avoids a
recurring manual edit).

### 5.4 TechStack

`SectionTitle` kicker `// stack`, title e.g. `What I build with`.

Reuses the design system's `NowSection` row layout (colored dot + mono label +
body) to present the existing `skills.ts` categories. One row per category:

- dot — a per-category accent color (added to `skills.ts`),
- label — category name, mono, uppercase,
- body — that category's skills joined with ` · `.

`skills.ts` is extended with a `color` field per category. Suggested colors
(from the palette): Backend `#60a5fa`, Frontend `#a78bfa`, Cloud & DevOps
`#34d399`, Database & Tools `#f59e0b`, AI Workflows `#f472b6`.

The design system's `Toolbox` component is **not** used (it overlapped with
Tech Stack).

### 5.5 Projects

`SectionTitle` kicker `// works`, count = curated project count.

Three parts, top to bottom:

1. **Latest on GitHub strip** (`GithubFeed`) — a compact live row labeled
   `↳ Latest on GitHub`, showing the 3 most-recently-pushed public repos.
   - Fetch `https://api.github.com/users/howar31/repos?sort=pushed&direction=desc&per_page=12`.
   - Filter out forks (`fork === false`); optionally drop archived; take the
     first 3.
   - Each entry: repo name, description (GitHub's own), primary language with
     color dot, relative pushed date, link to the repo.
   - Loading skeleton; on fetch failure the strip is hidden gracefully.
2. **Tag filter pills** — derived from the union of curated project `tags`.
   Clicking a pill toggles it; no pill selected = show all. The current
   All/Public/Private status filter is **dropped**.
3. **Curated project list** — the existing 20 projects from `projects.ts`,
   rendered as list rows (`ProjectRow`), not a card grid:
   - left: `year` (when known),
   - title + optional `language` badge (name + color dot),
   - description,
   - tags (clickable → set the tag filter),
   - trailing `↗` arrow on hover for linked projects.
   - Projects with no real URL (`url` is `#` or empty) are "private": show a
     lock icon with a "private project" tooltip (carries over the existing
     behavior), and the row is not a link.

`projects.ts` `Project` interface gains two **optional** fields:

```ts
year?: string;
language?: { name: string; color: string };
```

These are backfilled during implementation: for GitHub-hosted projects, from the
GitHub API (`created_at` year, primary `language`); non-GitHub projects
(government sites, Steam Workshop localizations, Chrome extension, etc.) are left
for the user to fill later. `ProjectRow` renders both fields gracefully when absent.

Filter transitions may keep light `framer-motion` layout animation (already a
dependency) or use plain CSS — implementer's choice, kept subtle.

### 5.6 Writing

`SectionTitle` kicker `// writing`.

Live list of the **3** most recent blog posts, fetched client-side from the blog
RSS feed (see §7). Each row: date + title + excerpt. Footer link
`read all posts ↗` → `https://blog.howar31.com`. Loading skeleton; on failure
the section is hidden gracefully (the `read all posts` link may still show).

### 5.7 SupportBlock

`SectionTitle`-style kicker `↳ Support`. Friendly, low-pressure copy, e.g.:

> If something here saved you time or made you smile, you can buy me a coffee —
> no pressure, a kind word works too.

- Primary button → **Ko-fi**: `https://ko-fi.com/howar31`.
- Secondary link `more ways to support ↗` → `https://donate.howar31.com`.

**Adblock-safe identifiers (required):** CSS class names, element `id`s,
`data-*` attributes, and `aria-label`s in this block must NOT contain the words
`sponsor`, `donate`, `donation`, `support-cta`, `tip-jar`, `patron`, or `bmac` —
EasyList/uBlock cosmetic filters match them and would hide the block. Use neutral
names (`kofi-link`, `footer-links`, etc.). Visible button text ("Support",
"Ko-fi", "PayPal") is fine. The destination URL `donate.howar31.com` is fine
(hostname, not a DOM identifier).

### 5.8 SiteFooter

A single line: `© 1995–2026 Howar31`. The design system's fake version /
uptime / "built with" lines are **not** ported.

## 6. Design tokens, fonts, styling

- Import the `colors_and_type.css` `:root` custom properties into
  `src/app/globals.css` — color scales, semantic colors, glass tokens, glow
  colors, shadows, radii, type stacks, type scale.
- Extend `tailwind.config.ts`: the `feed: '880px'` screen, brand gradient
  colors, and any custom values needed so components can use Tailwind utilities
  rather than inline styles where practical.
- Fonts — self-host the design system's subset `.woff2` files via
  `next/font/local`:
  - **Noto Sans TC** (`NotoSansTC.woff2`) — body / default sans, CJK-first.
  - **Atkinson Hyperlegible Next** (`AtkinsonHyperlegibleNext.woff2`) — display.
  - **JetBrains Mono** — keep via `next/font/google` (the bundle ships no mono
    woff2; current setup already uses it).
  - LXGW WenKai TC / Noto Serif TC are not needed for this page.
  Font files copied into the repo (e.g. `src/app/fonts/` or `public/fonts/`).
- `globals.css` keeps the existing `body::before` / `body::after` glow only if
  `AmbientGlow` does not fully replace it — `AmbientGlow` is the replacement, so
  the old CSS glow keyframes/pseudo-elements are removed to avoid double glow.

## 7. Data layer (client-side)

All dynamic data is fetched in the browser. No API keys — public endpoints only.
Embedding a key in client code would leak it.

### 7.1 Endpoints (all confirmed CORS-open: `access-control-allow-origin: *`)

| Data | Endpoint | Used by |
|---|---|---|
| Repo count | `https://api.github.com/users/howar31` → `public_repos` | IdentityCard "Repos" |
| Latest repos | `https://api.github.com/users/howar31/repos?sort=pushed&direction=desc&per_page=12` | GithubFeed |
| Blog posts | `https://blog.howar31.com/index.xml` (RSS 2.0, parse with `DOMParser`) | Writing, IdentityCard "Posts" |

### 7.2 Behavior

- GitHub unauthenticated rate limit is 60 req/hour/IP — ample for a personal
  site (a normal visit makes 2–3 requests).
- Add a `localStorage` cache per endpoint: store `{ data, ts }`, TTL ~30 min.
  On mount, use fresh cache immediately (skip skeleton); otherwise fetch.
- Each consumer shows a loading skeleton while fetching.
- On failure: degrade gracefully — `GithubFeed` and `Writing` hide their dynamic
  content; numeric stats fall back to cached value or a `—` placeholder. A failed
  request never breaks page render.
- Suggested shared helper: a small `useRemoteData` hook (loading / data / error +
  cache) in `src/lib/`, plus `src/lib/github.ts` and `src/lib/blog-feed.ts` for
  endpoint-specific fetching/parsing.
- The "Posts" stat shows the number of `<item>` elements in the RSS feed; this
  is the feed's item count (acceptable approximation if Hugo caps the feed).

## 8. Data files

`src/data/`:

- `identity.ts` — **new.** Handle, name, tagline, location, status text, socials
  array (GitHub, Blog), the decorative music label, and the `since` year.
- `intro.ts` — **new** (or part of `identity.ts`). IntroLetter copy.
- `projects.ts` — extended with optional `year` / `language` fields.
- `skills.ts` — extended with a per-category `color`.
- `config.ts` — kept (site metadata); reviewed for accuracy.
- `hero.ts`, `footer.ts` — removed; `socialLinks` content folds into `identity.ts`.

## 9. Accessibility & polish

- `AmbientGlow` and the equalizer bars are `aria-hidden`; all animations are
  disabled under `prefers-reduced-motion`.
- Semantic landmarks: `header` (TopBar), `aside` (IdentityCard), `main` + the
  feed, `footer`.
- Color contrast for body/meta text checked against the dark canvas.
- Keyboard focus states on all links/buttons and the tag-filter pills.

## 10. Verification

- `npm run build` — the static export (`output: export`) must succeed; the
  refactor must not break static generation.
- `npm run lint` passes.
- Dev-server visual review against the `ui_kits/landing-page` reference.
- Responsive check: two-column ≥ 880px, single column < 880px (IdentityCard not
  sticky).
- `prefers-reduced-motion` — confirm glow/equalizer/wave animations stop.
- Data-layer manual checks: live GitHub/RSS data renders; simulate fetch failure
  (offline / blocked request) and confirm graceful fallback; confirm
  `localStorage` cache is used on reload.
- Optional: preview on a phone via the `expose-local-tailscale` skill.
