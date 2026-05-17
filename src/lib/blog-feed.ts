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

export function parseBlogFeed(xml: string): BlogPost[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.getElementsByTagName("parsererror").length > 0) return [];
  const items = Array.from(doc.getElementsByTagName("item"));
  return items.map((item) => ({
    title: text(item, "title"),
    link: text(item, "link"),
    date: text(item, "pubDate"),
    excerpt: text(item, "description").replace(/<[^>]*>/g, "").trim(),
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
