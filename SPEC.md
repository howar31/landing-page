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
- **Motion:** the ambient glow, breathing accent dots, avatar glow, intro
  letter's CRT flicker, and the trailing cursor blink are CSS `@keyframes`;
  live stat numbers count up via the `useCountUp` hook (the "Since" stat
  counts *down* from the current year to the founding year; all roll in over
  a 3s ease-out-quint deceleration). The Featured-work tag filter uses the
  native View Transitions API; Show more / Show less uses a CSS
  `grid-template-rows: 0fr ↔ 1fr` slide. A global `prefers-reduced-motion`
  rule in `globals.css` disables every animation and transition at once;
  the typewriter / slide / View-Transition paths each check the media query
  themselves so they degrade to instant.
- **Layout:** A two-column "personal card" layout — a sticky `IdentityCard`
  rail plus a scrolling content feed. Collapses to a single column below 880px.
  The content max-width steps up from 1180px to 1760px across the large-display
  breakpoints so the page scales to 4K without over-long text lines (prose
  blocks carry their own narrower caps).
- **Fonts:** Atkinson Hyperlegible Next is self-hosted
  (`src/app/fonts/AtkinsonHyperlegibleNext.woff2`) via `next/font/local`;
  JetBrains Mono is fetched at build time and self-hosted via
  `next/font/google`. Body and heading text otherwise falls back to the
  platform's native UI stack — `-apple-system` / `BlinkMacSystemFont` /
  `Segoe UI` for Latin and `PingFang TC` / `Microsoft JhengHei` /
  `Noto Sans CJK TC` for Chinese — so the page ships no CJK web font.
- **Metadata / PWA:** `src/data/config.ts` holds site metadata (title,
  description, keywords, OpenGraph, `icons`, `manifest`), consumed by
  `src/app/layout.tsx` through the Next.js Metadata API. The site is an
  installable PWA — `public/manifest.webmanifest` declares 192/512 icons with
  the dark `#020617` theme/background color; `src/app/favicon.ico` and
  `public/apple-touch-icon.png` complete the icon set. Avatar, favicon, and PWA
  icons are all derived from one shared portrait source. The avatar shipped to
  the page (`public/avatar-2025.webp`) is a 264×264 WebP sized for the largest
  rendered footprint (132 CSS px at 2× DPR); its `<img>` carries explicit
  `width`/`height`, `fetchPriority="high"`, and `decoding="async"` so it can
  serve as the LCP element without contributing to CLS.
- **Data:** Static content lives in `src/data/`. Two parts are fetched live in
  the browser (no API keys, public endpoints):
  - GitHub API (`api.github.com`) — public repo count, the most recently
    pushed repos, and each displayed repo's language composition.
  - The blog RSS feed (`blog.howar31.com/index.xml`) — recent posts and post
    count.
  Both go through `useRemoteData`, show loading skeletons, and degrade
  gracefully on failure, but they cache differently on purpose. The GitHub
  calls are cached in `localStorage` with a 30-minute TTL because the
  unauthenticated API allows only 60 requests/hour/IP and sends
  `max-age=60`, so the HTTP cache cannot protect that quota; they also retain
  a stale-cache fallback: `fetchRecentRepos` returns `{ repos, stale }`, and a
  fresh-fetch failure (e.g., rate-limit, offline) serves the last-known cached
  repos with `stale: true`, surfaced as a low-key `· cached` indicator next to
  the feed kicker. Only a section with no prior data ever hides entirely.
  The blog feed deliberately has **no** `localStorage` layer: it is a static
  file served with `max-age=600` and an etag, so the browser HTTP cache already
  covers repeat loads, and storing the parsed result would let an older
  deploy's parse output survive a parser fix. `fetchBlogPosts` instead shares
  one in-flight promise, because the identity card and the writing section both
  request it on mount.
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
│   │   └── fonts/              # Self-hosted woff2 (Atkinson Hyperlegible Next only)
│   ├── components/             # 14 presentational/section components + an icons module
│   │   ├── ambient-glow.tsx    # Drifting purple radial-gradient background
│   │   ├── top-bar.tsx         # Wordmark + status line
│   │   ├── identity-card.tsx   # Sticky left rail; live repo/post counts
│   │   ├── section-title.tsx   # Shared kicker + title
│   │   ├── icons.tsx           # Inline SVG icon components (paths from lucide-react v0.460.0); replaces the runtime lucide-react dependency
│   │   ├── intro-letter.tsx    # "Hi there" introduction block, wrapped in a CRT-monitor bezel (screen recess + brand label + green power LED); CRT scanline/flicker/phosphor treatment + trailing blinking cursor
│   │   ├── tech-stack.tsx      # Skill categories as a stacked list — rules between rows, no framing border (sections carry no divider lines)
│   │   ├── github-feed.tsx     # Live "Latest on GitHub" strip — whole-row anchor, per-segment language-bar glow on hover, stale-cache indicator
│   │   ├── project-card.tsx    # One curated project — thumbnail card (screenshot or monogram tile); hover styling is CSS-only via Tailwind hover/group-hover utilities (no React state)
│   │   ├── projects.tsx        # Projects section: feed + "Featured work" kicker + curated tag-pill filter + 2-column card grid with View Transitions on filter; first 6 cards always visible, the rest are gated behind a CSS-slide Show more/less control (exports ProjectGrid)
│   │   ├── writing.tsx         # Live recent blog posts (cv-defer; deferred layout/paint until scrolled near)
│   │   ├── support-block.tsx   # Ko-fi + donate call-to-action (cv-defer)
│   │   ├── error-boundary.tsx  # Render-error boundary wrapping live-data sections
│   │   └── site-footer.tsx     # Copyright line (cv-defer)
│   ├── data/                   # Static content
│   │   ├── identity.ts         # Identity, intro-letter, support copy
│   │   ├── skills.ts           # Tech-stack categories (+ per-category color)
│   │   ├── projects.ts         # Curated project list (+ optional imageUrl/language/monogram)
│   │   └── config.ts           # Site metadata / SEO
│   └── lib/                    # Data layer + utilities (+ *.test.ts)
│       ├── github.ts           # GitHub API fetch + parseRepos/parseLanguages; fetchRecentRepos returns { repos, stale } with stale-cache fallback
│       ├── blog-feed.ts        # Blog RSS fetch + parseBlogFeed
│       ├── cache.ts            # localStorage cache with TTL + schema version; readStaleCache bypasses TTL for fallback paths
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
  per displayed repo, so one shared egress IP (office NAT, CGNAT, campus)
  supports only ~12 fresh visitors per hour before the API returns 403. A
  first-time visitor on an exhausted IP has no cache to fall back on: the
  Repos stat shows `—` and the GitHub feed hides itself. Accepted: a static
  site cannot hold a token. The fix, if ever wanted, is to bake the data in at
  build time using the Actions `GITHUB_TOKEN` and rebuild on a schedule.
- GitHub Pages serves every file with a flat `cache-control: max-age=600`,
  including the content-hashed `/_next/static/*` assets that are immutable by
  construction. A returning visitor therefore revalidates ~27 assets after 10
  minutes (304, empty body, ~220 ms each). Pages supports no custom headers, so
  the only fixes are a CDN in front or a service worker; neither is judged
  worth it for this site.
- `Project.imageUrl` is a locally-hosted thumbnail when present; image-less
  projects render a generated monogram tile instead.
- `Project.language` is set only for projects whose language is known;
  others leave it blank.

## Key Decisions

- **Static export over SSR:** the site is content-only and hosted on GitHub
  Pages; a static export keeps hosting free and simple.
- **Inline SVG icons over an icon library:** the six icons used by the UI
  (`Github`, `BookOpen`, `MapPin`, `Lock`, `ChevronDown`, `ChevronUp`) live in
  `src/components/icons.tsx` as inline SVG components. Paths are copied
  verbatim from `lucide-react` v0.460.0 and the default SVG attributes mirror
  lucide's `defaultAttributes` (24×24 viewBox, `currentColor` stroke,
  `strokeWidth=2`, `round` caps/joins) so the rendered output is
  pixel-identical to lucide. This removes the `lucide-react` runtime
  dependency, simplifies the dependency tree, and avoids shipping any
  unreferenced icons.
- **CSS-only hover on project cards:** `ProjectCard` does not track hover in
  React state. Background, border, and the trailing arrow's `translateX` are
  driven entirely by Tailwind `hover:` and `group-hover:` utilities, so the
  card neither re-renders nor wires `onMouseEnter` / `onMouseLeave` listeners
  on each of the up-to-21 cards.
- **`content-visibility` for below-fold sections:** `Writing`, `SupportBlock`,
  and `SiteFooter` carry a `.cv-defer` utility (defined in
  `src/app/globals.css` as `content-visibility: auto`) plus an inline
  per-section `contain-intrinsic-size` (540 / 280 / 80 px). On the single-column
  mobile layout these sit well below the initial viewport, so the browser
  skips their layout and paint until they scroll near — the per-section
  intrinsic size reserves placeholder height to prevent scrollbar jumps, and
  after first render the browser remembers the real size. Targets are limited
  to sections that don't participate in View Transitions; `ProjectGrid` is
  intentionally excluded because its filter morph requires persistent layout.
- **No self-hosted CJK web font:** an earlier build shipped Noto Sans TC as a
  ~1.7 MB self-hosted `.woff2`, which dominated the critical path while only a
  few dozen CJK glyphs ever appeared on the page (mostly project titles).
  Body and heading text now relies on the platform's native CJK stack
  (`PingFang TC` / `Microsoft JhengHei` / `Noto Sans CJK TC`) so no CJK font
  weight is sent over the wire — trading a fully uniform glyph set for a
  ~1.7 MB first-load saving. Only the Atkinson display face and JetBrains
  Mono remain as actual font payloads.
- **Avatar sized to its rendered footprint:** the avatar is shipped as a
  264×264 WebP — exactly twice the largest CSS size (132 px) so it remains
  sharp at 2× DPR without overdraw — and the `<img>` declares
  `width`/`height` plus `fetchPriority="high"` / `decoding="async"` so the
  LCP element loads with hinting and reserves its layout box.
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
- **CSS-first motion, reduced-motion-gated:** all animation is CSS `@keyframes`
  for the ambient glow and breathing accents. A single global
  `prefers-reduced-motion` rule disables all of it. An earlier scroll-driven
  section reveal (`animation-timeline: view()`) was removed in favor of sections
  showing immediately — keeping the page free of scroll-tied entrance motion.
- **Versioned cache + stale fallback + error boundaries:** every cached payload
  is stamped with `CACHE_VERSION`; a deploy that changes a cached shape bumps
  it so stale entries are rejected instead of crashing the new code. The
  GitHub feed also has a stale-cache fallback path (`readStaleCache`) so a
  transient API failure serves last-known data with a `· cached` indicator
  rather than blanking the section. Live-data sections are additionally
  wrapped in an error boundary so a render failure degrades that section
  rather than blanking the page.
- **Featured-work progressive disclosure:** the project grid renders the first
  six cards as a stable grid; the remaining cards live in a sibling grid whose
  outer wrapper animates `grid-template-rows` from `0fr` to `1fr` for an exact
  slide that matches the content's natural height. A Show more button toggles
  the slide; once expanded (by Show more *or* by any filter pill), it remains
  expanded — collapsing is one-way via the Show less button, and only available
  when no filter is active so a single click never both clears a filter and
  collapses the list.
- **Intro-letter CRT treatment:** the introduction block is wrapped in a
  `.crt-bezel` device frame (rounded dark-plastic gradient + drop shadow +
  top-edge highlight + a footer strip carrying a small mono brand label and a
  pulsing green power LED). Inside the bezel sits a recessed `.crt-screen-area`
  (deep navy glass with an inset shadow), and inside that the `<article>`
  carries the `.crt-screen` class: a `repeating-linear-gradient` scanline
  pattern via `::after` (faded toward all four edges with a stacked
  `mask-image` so the scanlines don't cut hard against the bezel), a
  near-imperceptible `crtFlicker` opacity wobble, and a layered phosphor
  `text-shadow` (tight white halo + wider violet bloom). A 2px blinking cursor
  sits at the end of the last paragraph; the trailing word is grouped with the
  cursor in a `whitespace-nowrap` span so the cursor never wraps onto its own
  line at the bezel's max width. The wave emoji is a sibling of the
  gradient-clipped greeting span (not a descendant) so it isn't masked by the
  parent's `bg-clip: text`. The bezel itself carries the reading-width cap
  (`max-w-[720px]`) so paragraphs fill the screen edge-to-edge instead of
  leaving an asymmetric right gutter inside the frame.
