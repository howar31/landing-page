# Landing Page UI Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild howar31.com as the two-column "personal card" layout from the Howar31 Brand handoff, with client-side live data from the GitHub API and the blog RSS feed.

**Architecture:** Next.js 14 App Router, static export. A sticky `IdentityCard` rail plus a content feed (`IntroLetter`, `TechStack`, `Projects`, `Writing`, `SupportBlock`, `SiteFooter`). Pure data-layer functions (RSS parsing, caching, formatting, transforms) live in `src/lib/` and are unit-tested with Vitest; visual components are verified by build + lint + dev-server review against the handoff reference.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind CSS 3, framer-motion, lucide-react, Vitest + jsdom.

**Reference:** The full design spec is `docs/superpowers/specs/2026-05-18-ui-refactor-design.md`. The handoff bundle is the zip at `/Users/howar31/Downloads/Howar31 Brand-handoff.zip`; Task 2 extracts its reference files into the repo.

---

## File Structure

**New — tooling**
- `vitest.config.ts` — Vitest config (jsdom environment).

**New — assets (extracted in Task 2)**
- `src/app/fonts/NotoSansTC.woff2`, `src/app/fonts/AtkinsonHyperlegibleNext.woff2`
- `public/avatar-2025.jpg`
- `docs/superpowers/reference/landing-page-kit/` — handoff `components.jsx`, `app.jsx`, `index.html`, `colors_and_type.css` (read-only reference for porting).

**New — data layer (`src/lib/`)**
- `languages.ts` — language→color map + `languageColor()`.
- `format-date.ts` — `formatPostDate()` (absolute) + `formatRelativeTime()`.
- `cache.ts` — `readCache()` / `writeCache()` localStorage helpers with TTL.
- `blog-feed.ts` — `parseBlogFeed()` (pure) + `fetchBlogPosts()`.
- `github.ts` — `parseRepos()` (pure) + `fetchProfile()` + `fetchRecentRepos()`.
- `use-remote-data.ts` — React hook wrapping a fetcher with loading/error/cache.

**New — data (`src/data/`)**
- `identity.ts` — identity, intro-letter, and support copy.

**Modified — data**
- `src/data/projects.ts` — add optional `year` / `language`; backfill values.
- `src/data/skills.ts` — add per-category `color`.
- `src/data/config.ts` — unchanged (reviewed).

**Removed — data**
- `src/data/hero.ts`, `src/data/footer.ts`.

**New — components (`src/components/`)**
- `ambient-glow.tsx`, `top-bar.tsx`, `identity-card.tsx`, `section-title.tsx`,
  `intro-letter.tsx`, `tech-stack.tsx`, `project-row.tsx`, `github-feed.tsx`,
  `projects.tsx`, `writing.tsx`, `support-block.tsx`, `site-footer.tsx`.

**Removed — components**
- `src/components/hero.tsx`, `src/components/skills.tsx`, `src/components/footer.tsx`
  (old `projects.tsx` is overwritten).

**Modified — app shell / styling**
- `src/app/globals.css` — design tokens + keyframes; old glow removed.
- `src/app/layout.tsx` — self-hosted fonts.
- `src/app/page.tsx` — new composition.
- `tailwind.config.ts` — `feed` breakpoint, font families, palette.
- `package.json` — Vitest devDeps + `test` script.

---

## Task 1: Add Vitest test infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/smoke.test.ts` (temporary, deleted in this task)

- [ ] **Step 1: Install Vitest and jsdom**

Run:
```bash
npm install -D vitest@^2 jsdom@^25
```
Expected: both added under `devDependencies`; no errors.

- [ ] **Step 2: Add the `test` script to `package.json`**

In `package.json` `"scripts"`, add after `"lint"`:
```json
    "test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Create a smoke test `src/lib/smoke.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("vitest", () => {
  it("runs and has a DOM", () => {
    expect(typeof DOMParser).toBe("function");
    expect(typeof localStorage).toBe("object");
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `npm test`
Expected: PASS, 1 test passed.

- [ ] **Step 6: Delete the smoke test**

Run: `rm src/lib/smoke.test.ts`

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: add Vitest test infrastructure"
```

---

## Task 2: Extract design-system assets into the repo

**Files:**
- Create: `src/app/fonts/NotoSansTC.woff2`, `src/app/fonts/AtkinsonHyperlegibleNext.woff2`
- Create: `public/avatar-2025.jpg`
- Create: `docs/superpowers/reference/landing-page-kit/{components.jsx,app.jsx,index.html,colors_and_type.css}`

- [ ] **Step 1: Extract from the handoff zip into a temp dir**

Run:
```bash
mkdir -p /tmp/lp-handoff && unzip -o "/Users/howar31/Downloads/Howar31 Brand-handoff.zip" -d /tmp/lp-handoff
```
Expected: files extracted under `/tmp/lp-handoff/howar31-brand/`.

- [ ] **Step 2: Copy fonts**

Run:
```bash
mkdir -p src/app/fonts
cp "/tmp/lp-handoff/howar31-brand/project/fonts/NotoSansTC.woff2" src/app/fonts/
cp "/tmp/lp-handoff/howar31-brand/project/fonts/AtkinsonHyperlegibleNext.woff2" src/app/fonts/
```

- [ ] **Step 3: Copy the avatar**

Run:
```bash
cp "/tmp/lp-handoff/howar31-brand/project/assets/avatar-2025.jpg" public/avatar-2025.jpg
```

- [ ] **Step 4: Copy the reference kit (read-only, for porting components)**

Run:
```bash
mkdir -p docs/superpowers/reference/landing-page-kit
cp /tmp/lp-handoff/howar31-brand/project/ui_kits/landing-page/components.jsx docs/superpowers/reference/landing-page-kit/
cp /tmp/lp-handoff/howar31-brand/project/ui_kits/landing-page/app.jsx docs/superpowers/reference/landing-page-kit/
cp /tmp/lp-handoff/howar31-brand/project/ui_kits/landing-page/index.html docs/superpowers/reference/landing-page-kit/
cp /tmp/lp-handoff/howar31-brand/project/colors_and_type.css docs/superpowers/reference/landing-page-kit/
```

- [ ] **Step 5: Verify all files are present**

Run: `ls -la src/app/fonts public/avatar-2025.jpg docs/superpowers/reference/landing-page-kit`
Expected: 2 woff2 files, the jpg, and 4 reference files all listed.

- [ ] **Step 6: Commit**

```bash
git add src/app/fonts public/avatar-2025.jpg docs/superpowers/reference
git commit -m "chore: vendor design-system fonts, avatar, and reference kit"
```

---

## Task 3: Design tokens and global styles

Replace `globals.css` with the design-system token set and the AmbientGlow
keyframes. The old `body::before` / `body::after` glow and its keyframes are
removed — `AmbientGlow` (Task 8) is the replacement.

**Files:**
- Modify: `src/app/globals.css` (full replacement)

- [ ] **Step 1: Replace `src/app/globals.css` with:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Color scales */
  --blue-400: #60a5fa;
  --blue-500: #3b82f6;
  --violet-400: #a78bfa;
  --violet-500: #8b5cf6;
  --violet-purple: #a855f7;
  --slate-300: #cbd5e1;
  --slate-400: #94a3b8;
  --slate-500: #64748b;
  --slate-800: #1e293b;
  --slate-900: #0f172a;
  --slate-950: #020617;

  /* Semantic — dark */
  --bg-canvas: rgb(2, 6, 23);
  --bg-card: rgba(15, 23, 42, 0.5);
  --fg-1: #ffffff;
  --fg-2: rgba(255, 255, 255, 0.7);
  --fg-3: rgba(255, 255, 255, 0.6);
  --border-1: rgba(255, 255, 255, 0.08);
  --border-2: rgba(255, 255, 255, 0.12);

  /* Brand gradient */
  --brand-grad: linear-gradient(to right, var(--blue-400), var(--violet-400));

  /* Liquid glass */
  --glass-bg: rgba(15, 23, 42, 0.55);
  --glass-border: rgba(255, 255, 255, 0.08);

  /* Radii */
  --radius-lg: 10px;
  --radius-xl: 12px;
  --radius-pill: 999px;
}

body {
  background-color: var(--bg-canvas);
  color: var(--fg-1);
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* AmbientGlow keyframes */
@keyframes glowDrift1 { 0%,100% { transform: translate(0,0) scale(1); } 25% { transform: translate(80px,-50px) scale(1.08); } 50% { transform: translate(-40px,-90px) scale(0.95); } 75% { transform: translate(-90px,30px) scale(1.05); } }
@keyframes glowDrift2 { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(-60px,40px) scale(1.1); } 66% { transform: translate(70px,-30px) scale(0.92); } }
@keyframes glowDrift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-120px,80px) scale(1.15); } }
@keyframes glowDrift4 { 0%,100% { transform: translate(0,0) scale(0.9); } 50% { transform: translate(50px,-60px) scale(1.2); } }
@keyframes glowPulse1 { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
@keyframes glowPulse2 { 0%,100% { opacity: 0.5; } 50% { opacity: 0.95; } }
@keyframes glowScan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
@keyframes wave { 0%,60%,100% { transform: rotate(0deg); } 10%,30% { transform: rotate(14deg); } 20% { transform: rotate(-8deg); } 40%,50% { transform: rotate(10deg); } }
@keyframes meter { 0%,100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: Verify the build still compiles**

Run: `npm run build`
Expected: build succeeds (old components still present and valid).

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: replace globals.css with design-system tokens"
```

---

## Task 4: Tailwind config and self-hosted fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace `tailwind.config.ts` with:**

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        feed: "880px",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "monospace"],
        display: ["var(--font-atkinson)", "var(--font-noto-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 2: Replace `src/app/layout.tsx` with:**

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/config";

const notoSansTC = localFont({
  src: "./fonts/NotoSansTC.woff2",
  variable: "--font-noto-sans",
  display: "swap",
});

const atkinson = localFont({
  src: "./fonts/AtkinsonHyperlegibleNext.woff2",
  variable: "--font-atkinson",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  openGraph: siteConfig.openGraph,
  icons: siteConfig.icons,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansTC.variable} ${atkinson.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds; fonts resolve without network.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/app/layout.tsx
git commit -m "refactor: self-host fonts and extend Tailwind config"
```

---

## Task 5: Language color helper

**Files:**
- Create: `src/lib/languages.ts`
- Test: `src/lib/languages.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/languages.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { languageColor } from "./languages";

describe("languageColor", () => {
  it("returns a known color for a known language", () => {
    expect(languageColor("TypeScript")).toBe("#60a5fa");
    expect(languageColor("CSS")).toBe("#c084fc");
  });

  it("falls back to slate for an unknown language", () => {
    expect(languageColor("Brainfuck")).toBe("#94a3b8");
  });

  it("falls back to slate for null/undefined", () => {
    expect(languageColor(null)).toBe("#94a3b8");
    expect(languageColor(undefined)).toBe("#94a3b8");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./languages`.

- [ ] **Step 3: Create `src/lib/languages.ts`**

```ts
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#60a5fa",
  JavaScript: "#fbbf24",
  HTML: "#fb7185",
  CSS: "#c084fc",
  SCSS: "#c084fc",
  Shell: "#34d399",
  Go: "#22d3ee",
  Python: "#818cf8",
  PHP: "#a78bfa",
  Lua: "#818cf8",
  Java: "#fb923c",
  AutoHotkey: "#94a3b8",
  VimL: "#34d399",
};

const FALLBACK = "#94a3b8";

export function languageColor(language: string | null | undefined): string {
  if (!language) return FALLBACK;
  return LANGUAGE_COLORS[language] ?? FALLBACK;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/languages.ts src/lib/languages.test.ts
git commit -m "feat: add language color helper"
```

---

## Task 6: Date formatting helpers

**Files:**
- Create: `src/lib/format-date.ts`
- Test: `src/lib/format-date.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/format-date.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { formatPostDate, formatRelativeTime } from "./format-date";

describe("formatPostDate", () => {
  it("formats an ISO/RFC date as 'Mon DD, YYYY'", () => {
    expect(formatPostDate("2026-04-22T00:00:00Z")).toBe("Apr 22, 2026");
  });
  it("returns empty string for an unparseable date", () => {
    expect(formatPostDate("not a date")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-05-18T12:00:00Z");

  it("formats minutes/hours/days ago", () => {
    expect(formatRelativeTime("2026-05-18T11:30:00Z", now)).toBe("30 minutes ago");
    expect(formatRelativeTime("2026-05-18T09:00:00Z", now)).toBe("3 hours ago");
    expect(formatRelativeTime("2026-05-15T12:00:00Z", now)).toBe("3 days ago");
  });
  it("uses singular units", () => {
    expect(formatRelativeTime("2026-05-17T12:00:00Z", now)).toBe("1 day ago");
  });
  it("says 'just now' for under a minute", () => {
    expect(formatRelativeTime("2026-05-18T11:59:30Z", now)).toBe("just now");
  });
  it("falls back to an absolute date beyond ~30 days", () => {
    expect(formatRelativeTime("2026-01-01T12:00:00Z", now)).toBe("Jan 1, 2026");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./format-date`.

- [ ] **Step 3: Create `src/lib/format-date.ts`**

```ts
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function absolute(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function formatPostDate(input: string): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  return absolute(d);
}

export function formatRelativeTime(input: string, now: Date = new Date()): string {
  const d = new Date(input);
  if (isNaN(d.getTime())) return "";
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days <= 30) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return absolute(d);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/format-date.ts src/lib/format-date.test.ts
git commit -m "feat: add date formatting helpers"
```

---

## Task 7: localStorage cache helpers

**Files:**
- Create: `src/lib/cache.ts`
- Test: `src/lib/cache.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/cache.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { readCache, writeCache } from "./cache";

describe("cache", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when nothing is cached", () => {
    expect(readCache("k", 1000)).toBeNull();
  });

  it("round-trips a value within TTL", () => {
    writeCache("k", { n: 1 });
    expect(readCache<{ n: number }>("k", 60000)).toEqual({ n: 1 });
  });

  it("returns null when the entry is older than the TTL", () => {
    writeCache("k", { n: 1 });
    const raw = JSON.parse(localStorage.getItem("lp-cache:k")!);
    raw.ts = Date.now() - 120000;
    localStorage.setItem("lp-cache:k", JSON.stringify(raw));
    expect(readCache("k", 60000)).toBeNull();
  });

  it("returns null on corrupt JSON", () => {
    localStorage.setItem("lp-cache:k", "{not json");
    expect(readCache("k", 60000)).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./cache`.

- [ ] **Step 3: Create `src/lib/cache.ts`**

```ts
const PREFIX = "lp-cache:";

interface Entry<T> {
  ts: number;
  data: T;
}

export function readCache<T>(key: string, ttlMs: number): T | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as Entry<T>;
    if (Date.now() - entry.ts > ttlMs) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  if (typeof localStorage === "undefined") return;
  try {
    const entry: Entry<T> = { ts: Date.now(), data };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    /* quota / unavailable — caching is best-effort */
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cache.ts src/lib/cache.test.ts
git commit -m "feat: add localStorage cache helpers"
```

---

## Task 8: Blog RSS feed parsing and fetching

**Files:**
- Create: `src/lib/blog-feed.ts`
- Test: `src/lib/blog-feed.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/blog-feed.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { parseBlogFeed } from "./blog-feed";

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <title>Blog</title>
  <item>
    <title>First Post</title>
    <link>https://blog.howar31.com/posts/first/</link>
    <pubDate>Wed, 22 Apr 2026 00:00:00 +0000</pubDate>
    <description>An excerpt about the first post.</description>
  </item>
  <item>
    <title>Second Post</title>
    <link>https://blog.howar31.com/posts/second/</link>
    <pubDate>Thu, 01 Jan 2026 00:00:00 +0000</pubDate>
    <description><![CDATA[Excerpt with <b>html</b> tags.]]></description>
  </item>
</channel></rss>`;

describe("parseBlogFeed", () => {
  it("returns one entry per <item> in document order", () => {
    const posts = parseBlogFeed(SAMPLE);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("First Post");
    expect(posts[0].link).toBe("https://blog.howar31.com/posts/first/");
    expect(posts[0].date).toBe("Wed, 22 Apr 2026 00:00:00 +0000");
  });

  it("strips HTML tags from the excerpt", () => {
    const posts = parseBlogFeed(SAMPLE);
    expect(posts[1].excerpt).toBe("Excerpt with html tags.");
  });

  it("returns an empty array for non-feed input", () => {
    expect(parseBlogFeed("<html></html>")).toEqual([]);
    expect(parseBlogFeed("garbage")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./blog-feed`.

- [ ] **Step 3: Create `src/lib/blog-feed.ts`**

```ts
import { readCache, writeCache } from "./cache";

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
}

const FEED_URL = "https://blog.howar31.com/index.xml";
const CACHE_KEY = "blog-feed";
const TTL_MS = 30 * 60 * 1000;

function text(item: Element, tag: string): string {
  return item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
}

export function parseBlogFeed(xml: string): BlogPost[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) return [];
  const items = Array.from(doc.getElementsByTagName("item"));
  return items.map((item) => ({
    title: text(item, "title"),
    link: text(item, "link"),
    date: text(item, "pubDate"),
    excerpt: text(item, "description").replace(/<[^>]*>/g, "").trim(),
  }));
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const cached = readCache<BlogPost[]>(CACHE_KEY, TTL_MS);
  if (cached) return cached;
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Blog feed HTTP ${res.status}`);
  const posts = parseBlogFeed(await res.text());
  writeCache(CACHE_KEY, posts);
  return posts;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/blog-feed.ts src/lib/blog-feed.test.ts
git commit -m "feat: add blog RSS feed parsing and fetching"
```

---

## Task 9: GitHub API parsing and fetching

**Files:**
- Create: `src/lib/github.ts`
- Test: `src/lib/github.test.ts`

- [ ] **Step 1: Write the failing test `src/lib/github.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { parseRepos } from "./github";

const RAW = [
  { name: "a", description: "first", language: "TypeScript", fork: false,
    html_url: "https://github.com/howar31/a", pushed_at: "2026-05-10T00:00:00Z" },
  { name: "b", description: null, language: null, fork: true,
    html_url: "https://github.com/howar31/b", pushed_at: "2026-05-09T00:00:00Z" },
  { name: "c", description: "third", language: "Go", fork: false,
    html_url: "https://github.com/howar31/c", pushed_at: "2026-05-08T00:00:00Z" },
];

describe("parseRepos", () => {
  it("drops forks", () => {
    const repos = parseRepos(RAW);
    expect(repos.map((r) => r.name)).toEqual(["a", "c"]);
  });

  it("maps fields and defaults a missing description to empty string", () => {
    const repos = parseRepos([{ ...RAW[1], fork: false }]);
    expect(repos[0]).toEqual({
      name: "b",
      description: "",
      language: null,
      url: "https://github.com/howar31/b",
      pushedAt: "2026-05-09T00:00:00Z",
    });
  });

  it("returns an empty array for non-array input", () => {
    expect(parseRepos(null)).toEqual([]);
    expect(parseRepos({} as unknown)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot resolve `./github`.

- [ ] **Step 3: Create `src/lib/github.ts`**

```ts
import { readCache, writeCache } from "./cache";

export interface Repo {
  name: string;
  description: string;
  language: string | null;
  url: string;
  pushedAt: string;
}

const USER = "howar31";
const TTL_MS = 30 * 60 * 1000;

export function parseRepos(raw: unknown): Repo[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((r) => r && r.fork === false)
    .map((r) => ({
      name: String(r.name ?? ""),
      description: String(r.description ?? ""),
      language: r.language ?? null,
      url: String(r.html_url ?? ""),
      pushedAt: String(r.pushed_at ?? ""),
    }));
}

export async function fetchProfileRepoCount(): Promise<number> {
  const cached = readCache<number>("gh-profile", TTL_MS);
  if (cached !== null) return cached;
  const res = await fetch(`https://api.github.com/users/${USER}`);
  if (!res.ok) throw new Error(`GitHub profile HTTP ${res.status}`);
  const count = Number((await res.json()).public_repos ?? 0);
  writeCache("gh-profile", count);
  return count;
}

export async function fetchRecentRepos(limit = 3): Promise<Repo[]> {
  const cached = readCache<Repo[]>("gh-repos", TTL_MS);
  if (cached) return cached.slice(0, limit);
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?sort=pushed&direction=desc&per_page=12`,
  );
  if (!res.ok) throw new Error(`GitHub repos HTTP ${res.status}`);
  const repos = parseRepos(await res.json());
  writeCache("gh-repos", repos);
  return repos.slice(0, limit);
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/github.ts src/lib/github.test.ts
git commit -m "feat: add GitHub API parsing and fetching"
```

---

## Task 10: useRemoteData hook

A small client hook: runs an async fetcher on mount, exposes `{ data, loading,
error }`. Not unit-tested (exercised through components).

**Files:**
- Create: `src/lib/use-remote-data.ts`

- [ ] **Step 1: Create `src/lib/use-remote-data.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export interface RemoteData<T> {
  data: T | null;
  loading: boolean;
  error: boolean;
}

export function useRemoteData<T>(fetcher: () => Promise<T>): RemoteData<T> {
  const [state, setState] = useState<RemoteData<T>>({
    data: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let active = true;
    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: false });
      })
      .catch(() => {
        if (active) setState({ data: null, loading: false, error: true });
      });
    return () => {
      active = false;
    };
    // fetcher is a stable module-level function; intentionally run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/use-remote-data.ts
git commit -m "feat: add useRemoteData hook"
```

---

## Task 11: Data files

**Files:**
- Create: `src/data/identity.ts`
- Modify: `src/data/skills.ts`
- Modify: `src/data/projects.ts`

- [ ] **Step 1: Create `src/data/identity.ts`**

```ts
export const identity = {
  handle: "@howar31",
  name: "Howar31",
  tagline: "Web developer · open-source tinkerer",
  location: "The Pale Blue Dot 🌌",
  status: "Open to interesting problems",
  since: "1995",
  avatar: "/avatar-2025.jpg",
  music: { label: "♪ on repeat", text: "Lo-fi beats · late-night coding" },
  socials: [
    { label: "GitHub", href: "https://github.com/howar31" },
    { label: "Blog", href: "https://blog.howar31.com" },
  ],
};

export const introLetter = {
  greeting: "Hi there",
  paragraphs: [
    `I'm Howar31 — a web developer who's been writing code since 1995, back when "deploying" meant FTP. These days I build modern web apps with a backend-and-cloud bias, and since 2022 I pair with AI on most of it. I keep a slow-burning blog about whatever I've recently figured out — or broken.`,
    `This page is just a card I keep updated: somewhere to find my work and say hi.`,
  ],
  signoff: "— Howar31",
};

export const support = {
  kicker: "Support",
  body: "If something here saved you time or made you smile, you can buy me a coffee — no pressure, a kind word works too.",
  kofiUrl: "https://ko-fi.com/howar31",
  moreUrl: "https://donate.howar31.com",
};
```

- [ ] **Step 2: Replace `src/data/skills.ts` with (adds a `color` per category):**

```ts
import { Cpu, Globe, Cloud, Database, Sparkles } from "lucide-react";

export const skillCategories = [
  {
    title: "Backend",
    icon: Cpu,
    color: "#60a5fa",
    skills: ["Node.js", "TypeScript", "Golang", "PHP (Laravel)", "GraphQL", "RESTful API", "ActivityPub"],
  },
  {
    title: "Frontend",
    icon: Globe,
    color: "#a78bfa",
    skills: ["React", "Next.js", "Vue.js", "JavaScript", "Tailwind CSS"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "#34d399",
    skills: ["GCP", "AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Database & Tools",
    icon: Database,
    color: "#f59e0b",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Prisma", "Git", "Postman"],
  },
  {
    title: "AI Workflows",
    icon: Sparkles,
    color: "#f472b6",
    skills: ["Cursor", "AntiGravity", "ComfyUI", "Automatic1111", "CLI Agent"],
  },
];
```

- [ ] **Step 3: Update the `Project` interface in `src/data/projects.ts`**

Replace the interface with:
```ts
export interface Project {
  title: string;
  description: string;
  url: string;
  tags: string[];
  imageUrl?: string;
  year?: string;
  language?: string;
}
```

- [ ] **Step 4: Backfill `year` / `language` on the project objects in `src/data/projects.ts`**

Add the fields below to the matching project objects (values verified from the
GitHub API on 2026-05-18). Projects not listed have no GitHub repo — leave them
without `year` / `language` (the user fills them later):

| Project `title` | `year` | `language` |
|---|---|---|
| `Landing Page` | `"2025"` | `"TypeScript"` |
| `GW2 Timer` | `"2014"` | `"JavaScript"` |
| `PTT 推樂透` | `"2014"` | `"JavaScript"` |
| `Countdown` | `"2015"` | `"JavaScript"` |
| `假的 信用卡安全掃描系統` | `"2019"` | *(omit — repo has no language)* |
| `早餐計算機` | `"2017"` | `"JavaScript"` |
| `NeoPlurkCSS3` | `"2013"` | `"CSS"` |
| `EzTwitch` | `"2016"` | `"JavaScript"` |
| `Warhammer 40,000: Rogue Trader 繁體中文化` | `"2024"` | *(omit)* |
| `Prison Architect 繁體中文化` | `"2015"` | *(omit)* |
| `Trove Auto Fishing` | `"2015"` | `"AutoHotkey"` |
| `Oh-My-Zsh Powerline Theme` | `"2013"` | `"Shell"` |

Example — the `Landing Page` object becomes:
```ts
  {
    title: "Landing Page",
    description:
      "A minimalist, performance-focused personal landing page built with Next.js. (a.k.a this website)",
    url: "https://github.com/howar31/landing-page",
    tags: ["Design", "Website"],
    imageUrl: "",
    year: "2025",
    language: "TypeScript",
  },
```

- [ ] **Step 5: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/data/identity.ts src/data/skills.ts src/data/projects.ts
git commit -m "feat: add identity data and extend skills/projects data"
```

---

## Task 12: Static presentational components

Four components with no data dependencies. Port from the reference
`docs/superpowers/reference/landing-page-kit/components.jsx`, converting inline
`style` objects to Tailwind classes + the CSS custom properties from
`globals.css`. All accent colors are **fixed** to the brand values
(`accent = #a78bfa`, `accent2 = #60a5fa`) — the reference's `accent` props and
the tweaks panel are dropped.

**Files:**
- Create: `src/components/ambient-glow.tsx`
- Create: `src/components/section-title.tsx`
- Create: `src/components/top-bar.tsx`
- Create: `src/components/site-footer.tsx`

- [ ] **Step 1: Create `ambient-glow.tsx`**

Port the reference `AmbientGlow` (the `ambientGlow` style block + the four blobs
+ scanline). Fix `glowColor = "#8b5cf6"`, `glowColor2 = "#a855f7"`,
`intensity = 1.6`. Keep the `aria-hidden` wrapper, `position: fixed`,
`pointer-events: none`, `zIndex: 0`. The blob keyframes (`glowDrift1-4`,
`glowPulse1-2`, `glowScan`) are already in `globals.css`. No `"use client"`
needed — it is static markup.

- [ ] **Step 2: Create `section-title.tsx`**

Port the reference `SectionTitle` (kicker dash + uppercase mono kicker, title
row with optional zero-padded `count`). Props: `kicker: string`,
`title: string`, `count?: number`. Fix the dash color to `#a78bfab3`.

- [ ] **Step 3: Create `top-bar.tsx`**

Port the reference `TopBar`. Left: `howar31` wordmark with a blue→violet
gradient dot. Right: a green status dot + the status text. Wire the status text
from `identity.status` (import from `@/data/identity`). Keep `maxWidth: 1180`.

- [ ] **Step 4: Create `site-footer.tsx`**

A single centered/left line: `© 1995–2026 Howar31`. Use the reference
`SiteFooter`'s top-border + muted mono styling, but render only that one line —
drop the version / uptime / deploy lines.

- [ ] **Step 5: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds (components not yet imported by a page — that is fine).

- [ ] **Step 6: Commit**

```bash
git add src/components/ambient-glow.tsx src/components/section-title.tsx src/components/top-bar.tsx src/components/site-footer.tsx
git commit -m "feat: add ambient glow, section title, top bar, footer components"
```

---

## Task 13: IntroLetter and TechStack components

**Files:**
- Create: `src/components/intro-letter.tsx`
- Create: `src/components/tech-stack.tsx`

- [ ] **Step 1: Create `intro-letter.tsx`**

Port the reference `IntroLetter`. Render from `introLetter` (`@/data/identity`):
the gradient `greeting` + animated `👋`, one `<p>` per `introLetter.paragraphs`
entry, and the `signoff` in the accent color. **Drop** the
`last touched · …` meta line. Fix accent `#a78bfa`.

- [ ] **Step 2: Create `tech-stack.tsx`**

Build the Tech Stack section using the reference `NowSection` row layout (the
`now` style block: a bordered list, each row a grid of `dot | label | body`).
One row per `skillCategories` entry (`@/data/skills`):
- dot — `category.color`,
- label — `category.title`, uppercase mono,
- body — `category.skills.join(" · ")`.

Wrap it with `<SectionTitle kicker="// stack" title="What I build with" />`.

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/intro-letter.tsx src/components/tech-stack.tsx
git commit -m "feat: add intro letter and tech stack components"
```

---

## Task 14: ProjectRow and GithubFeed components

**Files:**
- Create: `src/components/project-row.tsx`
- Create: `src/components/github-feed.tsx`

- [ ] **Step 1: Create `project-row.tsx`**

Port the reference `ProjectRow` to a typed component. Props: a `Project` (from
`@/data/projects`) plus `onTagClick: (tag: string) => void`.
- Left column: `project.year` when present, else render the column empty.
- Title; if `project.language` is present, render the language badge — name +
  a dot colored via `languageColor(project.language)` (`@/lib/languages`).
- Description, then tags as small buttons that call `onTagClick(tag)`.
- A project is "private" when `url` is missing or `"#"`: render a non-link row
  with a `lucide-react` `Lock` icon and `title="This is a private project"`.
  Otherwise render an `<a>` with the hover lift + trailing `↗`.
- `"use client"` (hover state + tag click handler).

- [ ] **Step 2: Create `github-feed.tsx`**

A `"use client"` component — the live "Latest on GitHub" strip.
- `const { data, loading, error } = useRemoteData(() => fetchRecentRepos(3));`
  (`@/lib/github`, `@/lib/use-remote-data`).
- Heading row: `↳ Latest on GitHub`.
- `loading` → 3 skeleton rows (pulsing placeholder blocks).
- `error` or empty → render `null` (the strip disappears).
- Each repo row: name (link to `repo.url`), description, a language dot via
  `languageColor(repo.language)` + language name, and
  `formatRelativeTime(repo.pushedAt)` (`@/lib/format-date`).

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/project-row.tsx src/components/github-feed.tsx
git commit -m "feat: add project row and GitHub feed components"
```

---

## Task 15: Projects section component

**Files:**
- Modify (overwrite): `src/components/projects.tsx`

- [ ] **Step 1: Overwrite `src/components/projects.tsx`**

A `"use client"` component composing the projects section:
- `<SectionTitle kicker="// works" title="Things I've made" count={projects.length} />`.
- `<GithubFeed />`.
- Tag filter pills: derive the sorted unique tag set from `projects` (`@/data/projects`);
  a `useState<string | null>` holds the active tag; clicking a pill toggles it;
  no active tag = show all. Use the `.pill` / active-pill visual treatment from
  the reference (`colors_and_type.css` `.pill` rules). **No** All/Public/Private
  status filter.
- The curated list: `projects` filtered by the active tag, each rendered as
  `<ProjectRow project={p} onTagClick={setActiveTagToggle} />`.
- Keep `framer-motion` `LazyMotion` + layout animation for the filter transition
  if it ports cleanly; plain conditional rendering is acceptable otherwise.
- `moreProjects` link (`@/data/projects`) below the list → `see the rest on github ↗`.

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/projects.tsx
git commit -m "feat: rebuild projects section as filtered list with GitHub feed"
```

---

## Task 16: Writing section component

**Files:**
- Create: `src/components/writing.tsx`

- [ ] **Step 1: Create `src/components/writing.tsx`**

A `"use client"` component:
- `const { data, loading, error } = useRemoteData(fetchBlogPosts);` (`@/lib/blog-feed`).
- `<SectionTitle kicker="// writing" title="From the blog" />`.
- `loading` → 3 skeleton rows.
- On success → the first **3** posts, each a `PostRow`-style entry (port the
  reference `PostRow` row layout): `formatPostDate(post.date)` + title (link to
  `post.link`) + excerpt.
- `error` → render the post list area as nothing (skip it).
- Always render the footer link `read all posts ↗` → `https://blog.howar31.com`.

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/writing.tsx
git commit -m "feat: add writing section with live blog feed"
```

---

## Task 17: IdentityCard component

**Files:**
- Create: `src/components/identity-card.tsx`

- [ ] **Step 1: Create `src/components/identity-card.tsx`**

A `"use client"` component — port the reference `IdentityCard`:
- Avatar `identity.avatar` with the blue→violet gradient ring + glow.
- `identity.handle`, gradient `identity.name`, `identity.tagline`, and a
  `Lives in <identity.location>` line.
- Stats row, three cells:
  - `Since` → `identity.since`.
  - `Repos` → `useRemoteData(fetchProfileRepoCount)`; while loading show `—`,
    on error show `—`, on success the number.
  - `Posts` → `useRemoteData(fetchBlogPosts)`; value is `data.length`; `—`
    while loading or on error.
- Socials grid: `identity.socials` (GitHub, Blog) — drop the reference's Email
  and RSS entries. Use `lucide-react` `Github` and `BookOpen` icons.
- The decorative music block: `identity.music.label` + `identity.music.text` +
  the animated equalizer bars (keyframe `meter`). No real audio.
- Wrapper: `position: sticky; top: 28px` on `feed:` and up; static below
  (handled by the page grid in Task 18).

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/identity-card.tsx
git commit -m "feat: add identity card with live repo and post counts"
```

---

## Task 18: SupportBlock component

**Files:**
- Create: `src/components/support-block.tsx`

- [ ] **Step 1: Create `src/components/support-block.tsx`**

Port the reference `GuestbookCTA` shape into a support block, rendering from
`support` (`@/data/identity`):
- kicker `↳ Support`,
- `support.body` copy,
- primary button → `support.kofiUrl` labelled `☕ Buy me a coffee`,
- secondary link → `support.moreUrl` labelled `more ways to support ↗`.

**Adblock-safe identifiers (required):** no CSS class, `id`, `data-*`, or
`aria-label` in this component may contain `sponsor`, `donate`, `donation`,
`support-cta`, `tip-jar`, `patron`, or `bmac`. Use neutral names such as
`kofi-link` / `footer-links`. Visible button text is unrestricted.

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/support-block.tsx
git commit -m "feat: add support block with Ko-fi and donate links"
```

---

## Task 19: Page composition and cleanup

**Files:**
- Modify (overwrite): `src/app/page.tsx`
- Delete: `src/components/hero.tsx`, `src/components/skills.tsx`, `src/components/footer.tsx`
- Delete: `src/data/hero.ts`, `src/data/footer.ts`

- [ ] **Step 1: Overwrite `src/app/page.tsx`**

```tsx
import { AmbientGlow } from "@/components/ambient-glow";
import { TopBar } from "@/components/top-bar";
import { IdentityCard } from "@/components/identity-card";
import { IntroLetter } from "@/components/intro-letter";
import { TechStack } from "@/components/tech-stack";
import { ProjectGrid } from "@/components/projects";
import { Writing } from "@/components/writing";
import { SupportBlock } from "@/components/support-block";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <AmbientGlow />
      <div className="relative z-[1] min-h-screen">
        <TopBar />
        <main className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 px-5 pt-6 feed:grid-cols-[320px_1fr] feed:gap-14 feed:px-8 feed:pt-10">
          <IdentityCard />
          <div className="min-w-0">
            <IntroLetter />
            <TechStack />
            <ProjectGrid />
            <Writing />
            <SupportBlock />
            <SiteFooter />
          </div>
        </main>
      </div>
    </>
  );
}
```

Note: keep the export name used by `projects.tsx` consistent — if Task 15 kept
the export as `ProjectGrid`, import that; if it was renamed to `Projects`,
update this import to match. Pick one name in Task 15 and use it here.

- [ ] **Step 2: Delete the obsolete files**

Run:
```bash
rm src/components/hero.tsx src/components/skills.tsx src/components/footer.tsx
rm src/data/hero.ts src/data/footer.ts
```

- [ ] **Step 3: Verify no dangling imports**

Run: `grep -rn "hero\|/footer\|/skills" src/ --include=*.tsx --include=*.ts`
Expected: no import referencing the deleted files (matches inside `site-footer`
or unrelated words are fine — confirm none are `import` lines pointing at the
removed modules).

- [ ] **Step 4: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components src/data
git commit -m "feat: compose new two-column landing page layout"
```

---

## Task 20: Responsive / mobile polish

The handoff design's RWD is minimal — it only collapses the two columns to one
at 880px (and unsticks the rail). It has no phone-specific tuning, and the ported
components use fixed pixel paddings/sizes from a desktop-centric prototype. This
task tunes the assembled page for phones (target widths 360–414px).

**Files:**
- Modify: `src/components/top-bar.tsx`, `src/components/identity-card.tsx`,
  `src/components/intro-letter.tsx`, `src/components/section-title.tsx`,
  `src/components/project-row.tsx`, `src/components/github-feed.tsx`, and any
  other component whose fixed sizing looks wrong at 360px.

- [ ] **Step 1: Audit the page at 360px**

Run `npm run dev`, open `http://localhost:3000`, set the devtools device
toolbar to 360px wide. Note every element that overflows, is cramped, or has
oversized fixed padding.

- [ ] **Step 2: Apply responsive fixes**

Convert fixed paddings/sizes that are too large on phones to responsive Tailwind
pairs (`base` value for mobile, `feed:` value for desktop). Required minimums:
- `TopBar` — horizontal padding ≤ 20px on mobile; the status text may shrink or
  truncate but must not overflow.
- `IdentityCard` — inner padding ~20px on mobile (vs ~28px desktop); avatar,
  stats grid, and socials grid stay within the card; the card is full-width.
- `IntroLetter` — greeting font scales down on mobile (e.g. `text-3xl` mobile →
  `text-4xl` desktop) so it never wraps awkwardly or clips.
- `SectionTitle` / section vertical gaps — reduce on mobile.
- `ProjectRow` — the `64px 1fr 24px` grid must not crush the description at
  360px; reduce the year column (e.g. 44–48px) on mobile or stack the year above
  the title.
- `GithubFeed` rows — same: no horizontal overflow at 360px.
- No element causes horizontal page scroll (`body` already has `overflow-x:
  hidden`, but content should genuinely fit, not just be clipped).

- [ ] **Step 3: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: both succeed.

- [ ] **Step 4: Re-audit at 360px and 414px**

Confirm no horizontal scroll, no overlapping or clipped text, tap targets
(links, pills, buttons) are at least ~40px tall, and the layout reads cleanly at
both widths.

- [ ] **Step 5: Commit**

```bash
git add src/components
git commit -m "fix: tune landing page layout for mobile widths"
```

---

## Task 21: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Build, lint, and tests all pass**

Run: `npm run build && npm run lint && npm test`
Expected: all three succeed; static export written to `out/`.

- [ ] **Step 2: Visual review on the dev server**

Run: `npm run dev`, open `http://localhost:3000`. Confirm against the reference
`docs/superpowers/reference/landing-page-kit/index.html`:
- AmbientGlow drifts behind everything.
- IdentityCard sticks on the left ≥ 880px; live Repos/Posts numbers appear.
- IntroLetter, TechStack rows, Projects (GitHub strip + tag filter + list),
  Writing (3 live posts), SupportBlock, footer all render.

- [ ] **Step 3: Responsive check**

Resize below 880px: layout collapses to one column and the IdentityCard is no
longer sticky. Resize above 880px: two columns return. At 375px (iPhone-class
width): no horizontal scroll, no clipped or overlapping text, every section
readable — the Task 20 polish must hold up here.

- [ ] **Step 4: Reduced-motion check**

In browser devtools, emulate `prefers-reduced-motion: reduce`. Confirm the glow,
the `👋` wave, and the equalizer bars stop animating.

- [ ] **Step 5: Data fallback check**

In devtools, set network to offline and reload (with cache cleared via
`localStorage.clear()` in the console first). Confirm: the page still renders,
the GitHub strip and Writing list disappear gracefully, and the Repos/Posts
stats show `—`. No uncaught errors in the console.

- [ ] **Step 6: Tag filter check**

Click a tag pill — the project list filters; click it again — the filter
clears. Clicking a tag inside a project row sets the same filter.

- [ ] **Step 7: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: address issues found in UI refactor verification"
```
(Skip if Steps 1–6 surfaced nothing to fix.)

---

## Self-Review Notes

- **Spec coverage:** layout/shell → Tasks 3,4,18; AmbientGlow → 12; TopBar → 12;
  IdentityCard + live stats → 17; IntroLetter → 13; TechStack → 13; Projects
  (GitHub strip + tag filter + curated list) → 14,15; Writing → 16;
  SupportBlock + adblock-safe identifiers → 18; SiteFooter → 12; tokens/fonts →
  3,4; data layer + endpoints + cache + fallback → 5–10; data files → 11;
  accessibility/reduced-motion → 3,21; responsive/mobile → 3,4,19,20;
  verification → 21.
- **Deviation from spec §5.5:** `Project.language` is stored as a plain string
  (the name); its color is derived at render time via `languageColor()`
  (`@/lib/languages`), which is also reused by `GithubFeed`. This is DRYer than
  storing `{ name, color }` per project and is intentional.
- All dynamic-data tasks degrade gracefully on fetch failure (Tasks 14,16,17).
