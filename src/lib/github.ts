import { readCache, writeCache } from "./cache";

export interface Repo {
  name: string;
  description: string;
  language: string | null;
  url: string;
  pushedAt: string;
  languages: LanguageShare[];
}

export interface LanguageShare {
  name: string; // language name, or "Other"
  pct: number; // 0-100, rounded integer
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
      languages: [],
    }));
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

export async function fetchProfileRepoCount(): Promise<number> {
  const cached = readCache<number>("gh-profile", TTL_MS);
  if (cached !== null) return cached;
  const res = await fetch(`https://api.github.com/users/${USER}`);
  if (!res.ok) throw new Error(`GitHub profile HTTP ${res.status}`);
  const count = Number((await res.json()).public_repos ?? 0);
  writeCache("gh-profile", count);
  return count;
}

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
