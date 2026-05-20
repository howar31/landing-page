import { describe, it, expect, beforeEach } from "vitest";
import { readCache, readStaleCache, writeCache } from "./cache";

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

  it("returns null when the entry's cache version does not match", () => {
    // An entry written by an older deploy (pre-versioning) has no `v` field.
    localStorage.setItem(
      "lp-cache:k",
      JSON.stringify({ ts: Date.now(), data: { n: 1 } }),
    );
    expect(readCache("k", 60000)).toBeNull();
  });

  describe("readStaleCache", () => {
    it("returns data even when the TTL has elapsed", () => {
      writeCache("k", { n: 1 });
      const raw = JSON.parse(localStorage.getItem("lp-cache:k")!);
      raw.ts = Date.now() - 365 * 24 * 60 * 60 * 1000; // a year ago
      localStorage.setItem("lp-cache:k", JSON.stringify(raw));
      expect(readCache("k", 60000)).toBeNull();
      expect(readStaleCache<{ n: number }>("k")).toEqual({ n: 1 });
    });

    it("still rejects a version mismatch", () => {
      localStorage.setItem(
        "lp-cache:k",
        JSON.stringify({ ts: Date.now(), data: { n: 1 } }),
      );
      expect(readStaleCache("k")).toBeNull();
    });

    it("returns null when nothing is cached", () => {
      expect(readStaleCache("k")).toBeNull();
    });
  });
});
