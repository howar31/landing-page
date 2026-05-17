import { describe, it, expect } from "vitest";
import { parseRepos } from "./github";

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
    });
  });

  it("returns an empty array for non-array input", () => {
    expect(parseRepos(null)).toEqual([]);
    expect(parseRepos({} as unknown)).toEqual([]);
  });
});
