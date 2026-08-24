import { describe, it, expect, beforeEach, vi } from "vitest";
import { parseBlogFeed, fetchBlogPosts } from "./blog-feed";

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

// Hugo puts the full post HTML in <description>, entity-escaped rather than in
// CDATA. Several posts open with an inline <style> block for the image modal.
const HUGO_SAMPLE = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
  <item>
    <title>Styled Post</title>
    <description>&lt;style&gt;
.vp-image-modal-card { max-width: 96vw; }
&lt;/style&gt;
&lt;p&gt;Body text.&lt;/p&gt;</description>
  </item>
  <item>
    <title>Scripted Post</title>
    <description>&lt;script&gt;console.log("tracking")&lt;/script&gt;
&lt;p&gt;Body text.&lt;/p&gt;</description>
  </item>
  <item>
    <title>Entity Post</title>
    <description>&lt;p&gt;He said &amp;ldquo;hi&amp;rdquo;&amp;hellip;&lt;/p&gt;</description>
  </item>
</channel></rss>`;

describe("parseBlogFeed excerpt sanitising", () => {
  it("drops <style> blocks instead of leaking their CSS", () => {
    expect(parseBlogFeed(HUGO_SAMPLE)[0].excerpt).toBe("Body text.");
  });

  it("drops <script> blocks instead of leaking their code", () => {
    expect(parseBlogFeed(HUGO_SAMPLE)[1].excerpt).toBe("Body text.");
  });

  it("decodes HTML entities left in the excerpt", () => {
    expect(parseBlogFeed(HUGO_SAMPLE)[2].excerpt).toBe("He said “hi”…");
  });
});

describe("fetchBlogPosts", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.unstubAllGlobals();
  });

  const okFetch = () =>
    vi.fn().mockResolvedValue({ ok: true, text: async () => SAMPLE });

  it("issues a single request when both consumers call it concurrently", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    const [a, b] = await Promise.all([fetchBlogPosts(), fetchBlogPosts()]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(a).toEqual(b);
  });

  it("refetches on a later call instead of serving a stored copy", async () => {
    const fetchMock = okFetch();
    vi.stubGlobal("fetch", fetchMock);

    await fetchBlogPosts();
    await fetchBlogPosts();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("recovers after a failed request rather than caching the rejection", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValue({ ok: true, text: async () => SAMPLE });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchBlogPosts()).rejects.toThrow("offline");
    await expect(fetchBlogPosts()).resolves.toHaveLength(2);
  });
});
