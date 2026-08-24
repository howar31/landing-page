import { readCache, writeCache } from "./cache";

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
}

const FEED_URL = "https://blog.howar31.com/index.xml";
const CACHE_KEY = "blog-feed";
const TTL_MS = 30 * 60 * 1000;

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

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const cached = readCache<BlogPost[]>(CACHE_KEY, TTL_MS);
  if (cached) return cached;
  const res = await fetch(FEED_URL);
  if (!res.ok) throw new Error(`Blog feed HTTP ${res.status}`);
  const posts = parseBlogFeed(await res.text());
  writeCache(CACHE_KEY, posts);
  return posts;
}
