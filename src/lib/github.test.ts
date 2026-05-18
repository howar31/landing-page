import { describe, it, expect } from "vitest";
import { parseRepos, parseLanguages } from "./github";

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
      languages: [],
    });
  });

  it("returns an empty array for non-array input", () => {
    expect(parseRepos(null)).toEqual([]);
    expect(parseRepos({} as unknown)).toEqual([]);
  });
});

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
    expect(result).toEqual([
      { name: "TypeScript", pct: 70 },
      { name: "CSS", pct: 15 },
      { name: "Shell", pct: 10 },
      { name: "Other", pct: 5 },
    ]);
  });
});
