import { describe, it, expect } from "vitest";
import { languageColor } from "./languages";

describe("languageColor", () => {
  it("returns a known color for a known language", () => {
    expect(languageColor("TypeScript")).toBe("#60a5fa");
    expect(languageColor("CSS")).toBe("#c084fc");
  });

  it("falls back to slate for an unknown language", () => {
    expect(languageColor("Brainfuck")).toBe("#94a3b8");
  });

  it("falls back to slate for null/undefined", () => {
    expect(languageColor(null)).toBe("#94a3b8");
    expect(languageColor(undefined)).toBe("#94a3b8");
  });
});
