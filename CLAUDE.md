# landing-page

Personal landing page for Howar31 — the public site at howar31.com.
Next.js 14 (App Router) + TypeScript + Tailwind, static-exported to GitHub Pages.

## Architecture

See [SPEC.md](SPEC.md) for the full architecture, layout, and key decisions.
In short: a static two-column "personal card" page; static content in
`src/data/`; GitHub API and blog RSS fetched client-side via `src/lib/` with
localStorage caching and graceful fallback.

## Commands

- `npm run dev` — local dev server (http://localhost:3000)
- `npm run build` — static export to `out/`
- `npm run lint` — ESLint (`next lint`)
- `npm test` — Vitest unit tests for `src/lib/` pure functions

## Conventions

- Components: kebab-case files, PascalCase named exports.
- Code comments in English.
- Tailwind utilities preferred; inline `style` only for dynamic values.
- The support/donation block must use adblock-safe DOM identifiers (no
  `sponsor`/`donate`/etc. in class/id/`data-*`/`aria-label`).
- New `src/lib/` pure functions get Vitest tests.

## Deploy

Push to `main` → `.github/workflows/deploy.yml` builds and publishes to GitHub
Pages. `public/CNAME` pins `howar31.com`. Pushing `main` deploys to production.
