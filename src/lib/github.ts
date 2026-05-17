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
