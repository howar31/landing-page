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
