const PREFIX = "lp-cache:";

/**
 * Bump whenever the shape of any cached value changes. A version mismatch
 * makes readCache treat the entry as a miss, so a stale cache written by an
 * older deploy can never be deserialized into the current code's expected
 * shape (which would otherwise crash consumers).
 */
const CACHE_VERSION = 1;

interface Entry<T> {
  v: number;
  ts: number;
  data: T;
}

export function readCache<T>(key: string, ttlMs: number): T | null {
  if (typeof localStorage === "undefined") return null;
  const raw = localStorage.getItem(PREFIX + key);
  if (!raw) return null;
  try {
    const entry = JSON.parse(raw) as Entry<T>;
    if (entry.v !== CACHE_VERSION) return null;
    if (Date.now() - entry.ts > ttlMs) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  if (typeof localStorage === "undefined") return;
  try {
    const entry: Entry<T> = { v: CACHE_VERSION, ts: Date.now(), data };
    localStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    /* quota / unavailable — caching is best-effort */
  }
}
