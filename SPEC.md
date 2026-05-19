# landing-page — SPEC

## Purpose

Personal landing page for Howar31, served as the public face of the brand at
[howar31.com](https://howar31.com). It is a single static page presenting an
identity card, an introduction, a tech stack, a project portfolio, recent blog
posts, and a support call-to-action. Visitors are the audience; there is no
backend and no authentication.

## Architecture

- **Framework:** Next.js 14 (App Router), React 18, TypeScript. Output is a
  fully static export (`output: export` in `next.config.mjs`) — no server
  runtime; the build emits a static site to `out/`.
- **Styling:** Tailwind CSS 3 with design tokens (CSS custom properties) and
  `@keyframes` defined in `src/app/globals.css`. Custom breakpoints — `feed`
  (880px) for the two-column ↔ single-column switch, plus `w1`/`w2`/`w3`
  (1920/2400/3000px) for large-display width stepping.
- **Motion:** the ambient glow, breathing accent dots, and avatar glow are CSS
  `@keyframes`; sections reveal on scroll via a CSS scroll-driven timeline
  (`animation-timeline: view()`, no JS); live stat numbers count up via the
  `useCountUp` hook (the "Since" stat counts *down* from the current year to
  the founding year; all roll in over a 3s ease-out-quint deceleration). A
  global `prefers-reduced-motion` rule in `globals.css`
  disables every animation and transition at once.
- **Layout:** A two-column "personal card" layout — a sticky `IdentityCard`
  rail plus a scrolling content feed. Collapses to a single column below 880px.
  The content max-width steps up from 1180px to 1760px across the large-display
  breakpoints so the page scales to 4K without over-long text lines (prose
  blocks carry their own narrower caps).
- **Fonts:** Noto Sans TC and Atkinson Hyperlegible Next are self-hosted
  (`src/app/fonts/*.woff2`) via `next/font/local`; JetBrains Mono via
  `next/font/google`.
- **Metadata / PWA:** `src/data/config.ts` holds site metadata (title,
  description, keywords, OpenGraph, `icons`, `manifest`), consumed by
  `src/app/layout.tsx` through the Next.js Metadata API. The site is an
  installable PWA — `public/manifest.webmanifest` declares 192/512 icons with
  the dark `#020617` theme/background color; `src/app/favicon.ico` and
  `public/apple-touch-icon.png` complete the icon set. Avatar, favicon, and PWA
  icons are all derived from one shared portrait source.
- **Data:** Static content lives in `src/data/`. Two parts are fetched live in
  the browser (no API keys, public endpoints):
  - GitHub API (`api.github.com`) — public repo count, the most recently
    pushed repos, and each displayed repo's language composition.
  - The blog RSS feed (`blog.howar31.com/index.xml`) — recent posts and post
    count.
  Both go through `useRemoteData`, are cached in `localStorage` with a 30-minute
  TTL, show loading skeletons, and degrade gracefully (the section hides or a
  `—` placeholder shows) on failure.
- **Data flow:** Server components compose the page; components that fetch or
  hold state are client components (`"use client"`). Fetch + parse helpers in
  `src/lib/` are pure where possible and unit-tested with Vitest.

## Layout

```
landing-page/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout; font wiring; metadata from config
│   │   ├── page.tsx            # Page composition (two-column grid)
│   │   ├── globals.css         # Design tokens (CSS vars) + keyframes
│   │   ├── favicon.ico         # Browser favicon (Next.js app-dir convention)
│   │   └── fonts/              # Self-hosted woff2 (Noto Sans TC, Atkinson)
│   ├── components/             # 13 presentational/section components
│   │   ├── ambient-glow.tsx    # Drifting purple radial-gradient background
│   │   ├── top-bar.tsx         # Wordmark + status line
│   │   ├── identity-card.tsx   # Sticky left rail; live repo/post counts
│   │   ├── section-title.tsx   # Shared kicker + title
│   │   ├── intro-letter.tsx    # "Hi there" introduction block
│   │   ├── tech-stack.tsx      # Skill categories as stacked blocks
│   │   ├── github-feed.tsx     # Live "Latest on GitHub" strip + language bar
│   │   ├── project-card.tsx    # One curated project — thumbnail card (screenshot or monogram tile)
│   │   ├── projects.tsx        # Projects section: feed + "Featured work" kicker + curated tag-pill filter + 2-column card grid, View Transitions on filter (exports ProjectGrid)
│   │   ├── writing.tsx         # Live recent blog posts
│   │   ├── support-block.tsx   # Ko-fi + donate call-to-action
│   │   ├── error-boundary.tsx  # Render-error boundary wrapping live-data sections
│   │   └── site-footer.tsx     # Copyright line
│   ├── data/                   # Static content
│   │   ├── identity.ts         # Identity, intro-letter, support copy
│   │   ├── skills.ts           # Tech-stack categories (+ per-category color)
│   │   ├── projects.ts         # Curated project list (+ optional imageUrl/language/monogram)
│   │   └── config.ts           # Site metadata / SEO
│   └── lib/                    # Data layer + utilities (+ *.test.ts)
│       ├── github.ts           # GitHub API fetch + parseRepos/parseLanguages
│       ├── blog-feed.ts        # Blog RSS fetch + parseBlogFeed
│       ├── cache.ts            # localStorage cache with TTL + schema version
│       ├── format-date.ts      # Absolute + relative date formatting
│       ├── languages.ts        # Language → color map
│       ├── monogram.ts         # Derive a placeholder monogram for a project
│       ├── use-count-up.ts     # Client hook: animate a number from `from` to target (up or down)
│       ├── use-remote-data.ts  # Client hook: loading/data/error
│       └── utils.ts            # cn() class-merge helper
├── public/                     # CNAME, avatar, PWA manifest + icons, static images
├── docs/superpowers/           # Design spec, implementation plan, reference kit
├── next.config.mjs             # Static export config
├── tailwind.config.ts          # feed: breakpoint, font families
└── vitest.config.ts            # jsdom test environment
```

## Conventions

- Components: kebab-case filenames, PascalCase named exports.
- Code comments in English.
- Tailwind utilities preferred; inline `style` only for dynamic values
  (gradients, computed colors, keyframe animations).
- The support / donation block must use adblock-safe DOM identifiers — no
  class/id/`data-*`/`aria-label` containing `sponsor`, `donate`, `donation`,
  etc. (cosmetic ad-filters would hide it).
- Linting via `next lint` (`.eslintrc.json`, `next/core-web-vitals`).

## Verification

- `npm test` — Vitest (jsdom) unit tests for the `src/lib/` pure functions
  (language colors, date formatting, cache, RSS parsing, GitHub repo parsing,
  monogram derivation).
- `npm run build` — must succeed and produce the static export in `out/`.
- `npm run lint` — ESLint via `next lint`.
- Manual: responsive check (two-column ≥ 880px, single column down to ~360px),
  `prefers-reduced-motion`, and the data-fetch fallback paths.

## Deploy

- GitHub Actions workflow `.github/workflows/deploy.yml` builds the static
  export and publishes it to GitHub Pages on push to `main`.
- `public/CNAME` pins the custom domain `howar31.com`.
- Local dev: `npm install`, then `npm run dev` (http://localhost:3000).

## Known Limitations / Non-goals

- No backend, no CMS — content is edited in `src/data/` files and redeployed.
- Live data (repo count, recent repos, blog posts) is fetched client-side; it is
  not present in the initial static HTML and is unauthenticated (GitHub's
  60 req/hour/IP limit applies, mitigated by the localStorage cache). A fresh
  load makes 5 GitHub calls: profile, the repo list, and one `/languages` call
  per displayed repo.
- `Project.imageUrl` is a locally-hosted thumbnail when present; image-less
  projects render a generated monogram tile instead.
- `Project.language` is set only for projects whose language is known;
  others leave it blank.

## Key Decisions

- **Static export over SSR:** the site is content-only and hosted on GitHub
  Pages; a static export keeps hosting free and simple.
- **Client-side live data over build-time fetch:** both the GitHub API and the
  blog RSS feed send permissive CORS headers, so the browser fetches them
  directly — keeping content fresh without scheduled rebuilds, at the cost of a
  loading state and dependence on those services at view time.
- **Curated project list:** the portfolio is an editorial list in
  `src/data/projects.ts` (including non-GitHub work), not an automated repo
  dump; the live GitHub strip complements it rather than replacing it.
- **Thumbnail-card grid with View Transitions:** the portfolio renders as a
  2-column thumbnail-card grid. Projects without a local screenshot show a
  monogram tile derived from the title (`src/lib/monogram.ts`), tinted by the
  primary tag (`TAG_COLOR` map in `project-card.tsx`). The tag filter runs
  inside the native View Transitions API — removed cards fade, survivors glide
  to their new slot — falling back to an instant swap where the API is
  unavailable or `prefers-reduced-motion` is set; no animation library is added.
- **Filter pills decoupled from the tag set:** a project's `tags` are free-form
  descriptive labels (hashtag model) and every tag is clickable. The filter bar,
  however, shows only a curated subset — `PRIMARY_TAGS` in `projects.tsx` — so
  high-coverage or low-signal tags (e.g. `Website`, `Community`, `CLI`) stay on
  cards as descriptors without becoming pills. The filter logic accepts any tag,
  so clicking a non-pill tag on a card still filters; only the pill bar is
  restricted.
- **CSS-first motion, reduced-motion-gated:** all animation is CSS — `@keyframes`
  for the ambient glow and breathing accents, and a scroll-driven timeline
  (`animation-timeline: view()`) for the section reveal, chosen over a JS
  IntersectionObserver so a section can never be left invisible if scripts fail
  (on browsers without timeline support the reveal collapses to simply-visible).
  A single global `prefers-reduced-motion` rule disables all of it.
- **Versioned cache + error boundaries:** every cached payload is stamped with
  `CACHE_VERSION`; a deploy that changes a cached shape bumps it so stale
  entries are rejected instead of crashing the new code. Live-data sections are
  additionally wrapped in an error boundary so a render failure degrades that
  section rather than blanking the page.
