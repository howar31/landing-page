import { describe, it, expect } from "vitest";
import { deriveMonogram } from "./monogram";
import { type Project } from "@/data/projects";

// Minimal project factory — only the fields deriveMonogram reads.
function project(over: Partial<Project>): Project {
  return {
    title: "Untitled",
    description: "",
    url: "#",
    tags: [],
    ...over,
  };
}

describe("deriveMonogram", () => {
  it("uses an explicit monogram override verbatim", () => {
    expect(deriveMonogram(project({ title: "Anything", monogram: "X9" }))).toBe("X9");
  });

  it("returns the first character for a CJK title", () => {
    expect(deriveMonogram(project({ title: "早餐計算機" }))).toBe("早");
  });

  it("returns the first letters of the first two ASCII words, uppercased", () => {
    expect(deriveMonogram(project({ title: "Discord Bot Usagi" }))).toBe("DB");
  });

  it("returns the first two letters for a single-word title", () => {
    expect(deriveMonogram(project({ title: "Countdown" }))).toBe("CO");
  });

  it("ignores trailing CJK words when the title leads with ASCII", () => {
    expect(deriveMonogram(project({ title: "Stockfeel 股感知識庫" }))).toBe("ST");
  });
});
