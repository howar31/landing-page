# Personal Landing Page

The public landing page for Howar31 — a minimalist, performance-focused
personal site with a deep blue & purple aesthetic.

**Live:** [howar31.com](https://howar31.com)

## ✨ Overview

A single static page built as a two-column "personal card":

- **Identity card** — a sticky rail with avatar, name, tagline, live GitHub repo
  & blog post counts, and social links.
- **Content feed** — an introduction letter, a tech-stack list, a project
  portfolio with a live "Latest on GitHub" strip and tag filtering, recent blog
  posts, and a support call-to-action.
- **Responsive** — two columns on wide screens, a single column on phones.
- **Ambient design** — drifting purple radial glow; animations respect
  `prefers-reduced-motion`.
- **Installable** — ships a web app manifest and a full icon set (favicon,
  apple-touch-icon, PWA icons), installable as a Progressive Web App.

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, static export)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with design tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Fonts:** Noto Sans TC + Atkinson Hyperlegible Next (self-hosted), JetBrains Mono
- **Tests:** [Vitest](https://vitest.dev/)
- **Hosting:** GitHub Pages (static) via GitHub Actions, custom domain howar31.com

## 🔄 Live Data

Two parts update themselves — fetched in the browser, no API keys, cached in
`localStorage` for 30 minutes, with graceful fallback if a request fails:

- **GitHub API** — public repo count, the most recently pushed repositories, and
  each one's language breakdown.
- **Blog RSS** (`blog.howar31.com/index.xml`) — recent posts and post count.

## 🛠️ Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other commands: `npm run build` (static export to `out/`), `npm run lint`,
`npm test`.

## 📝 Managing Content

Content is data-driven — edit the files in `src/data/`:

- **`identity.ts`** — name, handle, tagline, location, status, the intro-letter
  copy, social links, and the support / Ko-fi block copy.
- **`projects.ts`** — the curated project list. Each project has a title,
  description, url, tags, and optional `imageUrl` / `language` / `monogram`
  (the monogram overrides the auto-derived placeholder-tile initials).
- **`skills.ts`** — tech-stack categories and their skills.
- **`config.ts`** — site metadata (title, description, keywords, OpenGraph).

## 📦 Deployment

Push to `main` — the `.github/workflows/deploy.yml` workflow builds the site and
deploys the static export to GitHub Pages. `public/CNAME` preserves the custom
domain.

## 📄 License

MIT
