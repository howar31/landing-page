export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
}

const FEED_URL = "https://blog.howar31.com/index.xml";

function text(item: Element, tag: string): string {
  return item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? "";
}

/**
 * Feed descriptions carry the full post HTML. Parse it and read the rendered
 * text so entities decode, dropping <style>/<script> first: stripping only
 * their tags would leave the CSS or code behind as visible excerpt text.
 */
function toExcerpt(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  doc.querySelectorAll("style, script").forEach((el) => el.remove());
  return doc.body.textContent?.trim() ?? "";
}

export function parseBlogFeed(xml: string): BlogPost[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) return [];
  const items = Array.from(doc.getElementsByTagName("item"));
  return items.map((item) => ({
    title: text(item, "title"),
    link: text(item, "link"),
    date: text(item, "pubDate"),
    excerpt: toExcerpt(text(item, "description")),
  }));
}

/**
 * The identity card (post count) and the writing section both call this on
 * mount, so share one in-flight request instead of fetching the feed twice.
 * Cleared on settle so a transient failure stays retryable.
 *
 * There is no localStorage layer here on purpose: the feed is a static file
 * served with `cache-control: max-age=600` and an etag, so the HTTP cache
 * already covers repeat loads, and it cannot serve a parsed shape from an
 * older deploy the way a stored result can.
 */
let inFlight: Promise<BlogPost[]> | null = null;

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  if (!inFlight) {
    inFlight = (async () => {
      const res = await fetch(FEED_URL);
      if (!res.ok) throw new Error(`Blog feed HTTP ${res.status}`);
      return parseBlogFeed(await res.text());
    })().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}
