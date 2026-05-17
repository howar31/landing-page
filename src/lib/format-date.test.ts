import { describe, it, expect } from "vitest";
import { formatPostDate, formatRelativeTime } from "./format-date";

describe("formatPostDate", () => {
  it("formats an ISO/RFC date as 'Mon DD, YYYY'", () => {
    expect(formatPostDate("2026-04-22T00:00:00Z")).toBe("Apr 22, 2026");
  });
  it("returns empty string for an unparseable date", () => {
    expect(formatPostDate("not a date")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  const now = new Date("2026-05-18T12:00:00Z");

  it("formats minutes/hours/days ago", () => {
    expect(formatRelativeTime("2026-05-18T11:30:00Z", now)).toBe("30 minutes ago");
    expect(formatRelativeTime("2026-05-18T09:00:00Z", now)).toBe("3 hours ago");
    expect(formatRelativeTime("2026-05-15T12:00:00Z", now)).toBe("3 days ago");
  });
  it("uses singular units", () => {
    expect(formatRelativeTime("2026-05-17T12:00:00Z", now)).toBe("1 day ago");
  });
  it("says 'just now' for under a minute", () => {
    expect(formatRelativeTime("2026-05-18T11:59:30Z", now)).toBe("just now");
  });
  it("falls back to an absolute date beyond ~30 days", () => {
    expect(formatRelativeTime("2026-01-01T12:00:00Z", now)).toBe("Jan 1, 2026");
  });
});
