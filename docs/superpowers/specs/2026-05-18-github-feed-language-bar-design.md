# GitHub Feed Language Bar — Design

**Date:** 2026-05-18
**Status:** Approved (design), pending implementation plan

## Problem

The "↳ Latest on GitHub" feed (`GithubFeed`) shows each repo's language as a
single dot + label. GitHub's `/users/{user}/repos` list endpoint returns only
the primary language (Linguist top-by-bytes), so one repo with a meaningful mix
(e.g. TypeScript + CSS + Shell) looks single-language. We want to surface the
real language composition with proportions, like GitHub's own language bar.

## Approach

GitHub's per-repo endpoint `GET /repos/{owner}/{repo}/languages` returns byte
counts per language:

```json
{ "TypeScript": 145203, "CSS": 28110, "Shell": 9024 }
```

GitHub's own language bar uses this same data, so computed percentages match
GitHub exactly. The feed displays 3 repos; we fetch languages for those 3 only.

**UI:** a thin stacked bar (proportions encoded as segment widths) plus one line
of language names. No inline percentage numbers — the minimal variant. Top 3
languages named individually; the remainder is summed into a single `Other`
segment.

## Data layer — `src/lib/github.ts`

### Types

```ts
interface LanguageShare {
  name: string;  // language name, or "Other"
  pct: number;   // 0-100, rounded; segment width and tooltip use this
}

interface Repo {
  // ...existing fields...
  languages: LanguageShare[];  // [] when unavailable
}
```

### `parseLanguages(raw: unknown): LanguageShare[]` (pure, tested)

1. Reject non-object / empty input → return `[]`.
2. Sum all byte counts; if total is 0 → return `[]`.
3. Map each entry to `{ name, pct }` where `pct = bytes / total * 100`.
4. Sort descending by `pct`.
5. If more than 3 languages: keep the top 3, sum the rest's `pct` into one
   `{ name: "Other", pct }` entry appended last.
6. Round each `pct` to an integer (or 1 decimal — implementer's choice; the sum
   may not be exactly 100, which is acceptable since no numbers are displayed
   and bar widths absorb the drift).

### `fetchRepoLanguages(repoName: string): Promise<LanguageShare[]>`

Fetches `https://api.github.com/repos/howar31/{repoName}/languages`, returns
`parseLanguages(...)`. On any failure (non-OK response, network error) returns
`[]` — a single repo's language failure must not break the whole feed.

### `fetchRecentRepos(limit)` changes

After parsing the repo list, run `Promise.all` over the top `limit` repos to
fetch their languages, attach each result to `Repo.languages`, and store the
enriched repos in the existing `gh-repos` localStorage cache (30 min TTL).
`parseRepos` initializes `languages: []` for every repo.

## UI layer — `src/components/github-feed.tsx`

Replace the current single language dot block with:

- **Stacked bar:** `max-w-[360px]`, `h-1.5`, `rounded-full`, `overflow-hidden`,
  a flex row of segments. Each segment: `width: {pct}%`, `background:
  languageColor(name)`, and `title="{name} {pct}%"` so desktop hover still
  reveals the exact figure.
- **Name line:** below the bar, one `font-mono text-[11px]` line. Language names
  joined by `·` separators (`·` in `text-white/25`); each name tinted with its
  own `languageColor()`. Order matches the bar (descending; `Other` last).
- **Fallback:** if `languages` is empty but the legacy `repo.language` string
  exists → render the old single-dot treatment. If both are empty → render
  nothing.

The loading skeleton's existing short bottom line stands in for the bar; no
change required.

## Color map — `src/lib/languages.ts`

`LANGUAGE_COLORS` currently covers 13 languages; unmapped languages and `Other`
fall back to gray (`#94a3b8`). Add a handful of common languages (e.g. Ruby,
Rust, C, C++, C#, Kotlin, Swift) to reduce the chance of multiple gray segments
in one bar. `Other` intentionally stays gray.

## Testing

- **`parseLanguages`** — new Vitest cases: empty/non-object input, single
  language, exactly 3 languages (no `Other`), more than 3 (top 3 + `Other`,
  percentages sum to ~100, `Other` is last).
- **`parseRepos`** — update the existing `toEqual` assertion to include
  `languages: []`.
- `fetchRepoLanguages` network behavior is not unit-tested; its logic delegates
  to the tested `parseLanguages`.

## Trade-offs

- A fresh page load makes 5 GitHub API calls (profile + repos + 3× languages),
  up from 2. The unauthenticated limit is 60/hour/IP; the localStorage cache
  suppresses repeat loads from the same browser. Well within budget.
- Percentages are not shown as numbers (minimal variant, per design choice);
  proportions are conveyed by bar segment widths, with exact values available
  via the hover `title` tooltip on desktop.
