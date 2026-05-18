# GitHub Feed Language Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single language dot in the "Latest on GitHub" feed with a stacked proportion bar showing each repo's top 3 languages plus "Other".

**Architecture:** A new pure function `parseLanguages` converts GitHub's per-repo byte-count map into a sorted top-3 + "Other" share list. `fetchRecentRepos` enriches the 3 displayed repos by calling `/repos/{owner}/{repo}/languages` in parallel. `GithubFeed` renders a thin stacked bar plus a minimal language-name line, falling back to the legacy single dot when language data is unavailable.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Vitest.

**Commit policy:** Per project CLAUDE.md, the whole feature is ONE commit. Do NOT commit per task. Task 6 runs verification, then commits once via the `/commit` skill after explicit user approval.

---

### Task 1: `parseLanguages` pure function

**Files:**
- Modify: `src/lib/github.ts`
- Test: `src/lib/github.test.ts`

- [ ] **Step 1: Write the failing tests**

Add to `src/lib/github.test.ts` (keep existing `parseRepos` tests):

```ts
import { parseRepos, parseLanguages } from "./github";

describe("parseLanguages", () => {
  it("returns an empty array for non-object or empty input", () => {
    expect(parseLanguages(null)).toEqual([]);
    expect(parseLanguages([])).toEqual([]);
    expect(parseLanguages({})).toEqual([]);
    expect(parseLanguages({ TypeScript: 0 })).toEqual([]);
  });

  it("returns a single 100% entry for one language", () => {
    expect(parseLanguages({ TypeScript: 5000 })).toEqual([
      { name: "TypeScript", pct: 100 },
    ]);
  });

  it("keeps up to 3 languages without an Other entry", () => {
    const result = parseLanguages({ TypeScript: 600, CSS: 300, Shell: 100 });
    expect(result.map((l) => l.name)).toEqual(["TypeScript", "CSS", "Shell"]);
    expect(result.some((l) => l.name === "Other")).toBe(false);
  });

  it("collapses everything past the top 3 into a trailing Other entry", () => {
    const result = parseLanguages({
      TypeScript: 700,
      CSS: 150,
      Shell: 100,
      HTML: 30,
      Go: 20,
    });
    expect(result.map((l) => l.name)).toEqual([
      "TypeScript",
      "CSS",
      "Shell",
      "Other",
    ]);
    expect(result[result.length - 1].name).toBe("Other");
    const sum = result.reduce((s, l) => s + l.pct, 0);
    expect(sum).toBeGreaterThanOrEqual(98);
    expect(sum).toBeLessThanOrEqual(102);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- github`
Expected: FAIL — `parseLanguages` is not exported / not a function.

- [ ] **Step 3: Add the `LanguageShare` type and `parseLanguages` function**

In `src/lib/github.ts`, add the interface near the top (after the existing `Repo` interface) and the function after `parseRepos`:

```ts
export interface LanguageShare {
  name: string; // language name, or "Other"
  pct: number;  // 0-100, rounded integer
}

export function parseLanguages(raw: unknown): LanguageShare[] {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return [];
  const entries = Object.entries(raw as Record<string, unknown>)
    .map(([name, bytes]) => [name, Number(bytes)] as const)
    .filter(([, bytes]) => Number.isFinite(bytes) && bytes > 0)
    .sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (total === 0) return [];
  const toShare = ([name, bytes]: readonly [string, number]): LanguageShare => ({
    name,
    pct: Math.round((bytes / total) * 100),
  });
  if (entries.length <= 3) return entries.map(toShare);
  const top = entries.slice(0, 3).map(toShare);
  const otherBytes = entries
    .slice(3)
    .reduce((sum, [, bytes]) => sum + bytes, 0);
  return [...top, { name: "Other", pct: Math.round((otherBytes / total) * 100) }];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- github`
Expected: PASS — all `parseLanguages` and `parseRepos` tests green (Task 2 fixes the `parseRepos` `toEqual` test if it fails here).

---

### Task 2: Extend `Repo` with `languages`

**Files:**
- Modify: `src/lib/github.ts`
- Test: `src/lib/github.test.ts`

- [ ] **Step 1: Update the existing `parseRepos` test to expect the new field**

In `src/lib/github.test.ts`, update the `"maps fields and defaults..."` assertion:

```ts
  it("maps fields and defaults a missing description to empty string", () => {
    const repos = parseRepos([{ ...RAW[1], fork: false }]);
    expect(repos[0]).toEqual({
      name: "b",
      description: "",
      language: null,
      url: "https://github.com/howar31/b",
      pushedAt: "2026-05-09T00:00:00Z",
      languages: [],
    });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- github`
Expected: FAIL — received object missing `languages` key.

- [ ] **Step 3: Add `languages` to the `Repo` interface and `parseRepos`**

In `src/lib/github.ts`, add to the `Repo` interface:

```ts
export interface Repo {
  name: string;
  description: string;
  language: string | null;
  url: string;
  pushedAt: string;
  languages: LanguageShare[];
}
```

And in `parseRepos`, add `languages: []` to the mapped object:

```ts
    .map((r) => ({
      name: String(r.name ?? ""),
      description: String(r.description ?? ""),
      language: r.language ?? null,
      url: String(r.html_url ?? ""),
      pushedAt: String(r.pushed_at ?? ""),
      languages: [],
    }));
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- github`
Expected: PASS — all tests in `github.test.ts` green.

---

### Task 3: Fetch per-repo languages and enrich the feed

**Files:**
- Modify: `src/lib/github.ts`

- [ ] **Step 1: Add `fetchRepoLanguages`**

In `src/lib/github.ts`, add after `fetchProfileRepoCount`:

```ts
export async function fetchRepoLanguages(
  repoName: string,
): Promise<LanguageShare[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${USER}/${repoName}/languages`,
    );
    if (!res.ok) return [];
    return parseLanguages(await res.json());
  } catch {
    // A single repo's language failure must not break the whole feed.
    return [];
  }
}
```

- [ ] **Step 2: Enrich `fetchRecentRepos` with language data**

Replace the body of `fetchRecentRepos` in `src/lib/github.ts` with:

```ts
export async function fetchRecentRepos(limit = 3): Promise<Repo[]> {
  const cached = readCache<Repo[]>("gh-repos", TTL_MS);
  if (cached) return cached.slice(0, limit);
  const res = await fetch(
    `https://api.github.com/users/${USER}/repos?sort=pushed&direction=desc&per_page=12`,
  );
  if (!res.ok) throw new Error(`GitHub repos HTTP ${res.status}`);
  const repos = parseRepos(await res.json());
  const top = repos.slice(0, limit);
  const languages = await Promise.all(
    top.map((r) => fetchRepoLanguages(r.name)),
  );
  top.forEach((r, i) => {
    r.languages = languages[i];
  });
  writeCache("gh-repos", repos);
  return top;
}
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run lint`
Expected: PASS — no TypeScript or ESLint errors.

---

### Task 4: Expand the language color map

**Files:**
- Modify: `src/lib/languages.ts`

- [ ] **Step 1: Add common languages to `LANGUAGE_COLORS`**

In `src/lib/languages.ts`, add these entries inside the `LANGUAGE_COLORS` object (after the existing entries, before the closing brace):

```ts
  Ruby: "#ef4444",
  Rust: "#f97316",
  C: "#7dd3fc",
  "C++": "#f472b6",
  "C#": "#86efac",
  Kotlin: "#c084fc",
  Swift: "#fdba74",
  Dockerfile: "#38bdf8",
  Vue: "#4ade80",
```

`"Other"` is intentionally left unmapped so it resolves to the gray `FALLBACK`.

- [ ] **Step 2: Run the languages tests**

Run: `npm test -- languages`
Expected: PASS — existing `languages.test.ts` still green (new entries are additive).

---

### Task 5: Render the stacked language bar in `GithubFeed`

**Files:**
- Modify: `src/components/github-feed.tsx`

- [ ] **Step 1: Replace the single language dot block with the bar**

In `src/components/github-feed.tsx`, replace this block (currently lines 56-69):

```tsx
                {repo.language && (
                  <div className="mt-1 inline-flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: languageColor(repo.language) }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: languageColor(repo.language) }}
                    >
                      {repo.language}
                    </span>
                  </div>
                )}
```

with:

```tsx
                {repo.languages.length > 0 ? (
                  <div className="mt-2">
                    <div className="flex h-1.5 w-full max-w-[360px] overflow-hidden rounded-full">
                      {repo.languages.map((lang) => (
                        <span
                          key={lang.name}
                          title={`${lang.name} ${lang.pct}%`}
                          style={{
                            width: `${lang.pct}%`,
                            background: languageColor(lang.name),
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5 font-mono text-[11px]">
                      {repo.languages.map((lang, i) => (
                        <span key={lang.name}>
                          {i > 0 && <span className="text-white/25"> · </span>}
                          <span style={{ color: languageColor(lang.name) }}>
                            {lang.name}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : repo.language ? (
                  <div className="mt-1 inline-flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: languageColor(repo.language) }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: languageColor(repo.language) }}
                    >
                      {repo.language}
                    </span>
                  </div>
                ) : null}
```

- [ ] **Step 2: Verify lint and types**

Run: `npm run lint`
Expected: PASS — no TypeScript or ESLint errors.

---

### Task 6: Full verification and single commit

**Files:** none (verification + commit only)

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS — all Vitest suites green.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: PASS — no errors.

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: SUCCESS — static export to `out/` completes with no errors.
Note: do not run `npm run build` while `npm run dev` is running.

- [ ] **Step 4: Manual visual check**

Run: `npm run dev`, open http://localhost:3000, scroll to "↳ Latest on GitHub".
Expected: each repo shows a thin stacked bar plus a `·`-separated language-name
line; hovering a bar segment shows a `Name pct%` tooltip. Stop the dev server
before Step 5 if a build is needed again.

- [ ] **Step 5: Present summary and commit**

Present a change summary to the user and wait for explicit approval. On
approval, commit the whole feature as ONE commit via the `/commit` skill
(includes the design spec, this plan, and all source changes).

---

## Notes

- Earlier in this session an unrelated "↳ Featured work" kicker was added to
  `src/components/projects.tsx`. If still uncommitted, it belongs in a separate
  commit from this feature — flag it to the user at Task 6 Step 5.
