import { describe, it, expect } from "vitest";
import { parseBlogFeed } from "./blog-feed";

const SAMPLE = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <title>Blog</title>
  <item>
    <title>First Post</title>
    <link>https://blog.howar31.com/posts/first/</link>
    <pubDate>Wed, 22 Apr 2026 00:00:00 +0000</pubDate>
    <description>An excerpt about the first post.</description>
  </item>
  <item>
    <title>Second Post</title>
    <link>https://blog.howar31.com/posts/second/</link>
    <pubDate>Thu, 01 Jan 2026 00:00:00 +0000</pubDate>
    <description><![CDATA[Excerpt with <b>html</b> tags.]]></description>
  </item>
</channel></rss>`;

describe("parseBlogFeed", () => {
  it("returns one entry per <item> in document order", () => {
    const posts = parseBlogFeed(SAMPLE);
    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe("First Post");
    expect(posts[0].link).toBe("https://blog.howar31.com/posts/first/");
    expect(posts[0].date).toBe("Wed, 22 Apr 2026 00:00:00 +0000");
  });

  it("strips HTML tags from the excerpt", () => {
    const posts = parseBlogFeed(SAMPLE);
    expect(posts[1].excerpt).toBe("Excerpt with html tags.");
  });

  it("returns an empty array for non-feed input", () => {
    expect(parseBlogFeed("<html></html>")).toEqual([]);
    expect(parseBlogFeed("garbage")).toEqual([]);
  });
});
