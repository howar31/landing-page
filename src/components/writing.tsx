"use client";

import { BookOpen } from "@/components/icons";
import { fetchBlogPosts } from "@/lib/blog-feed";
import { useRemoteData } from "@/lib/use-remote-data";
import { formatPostDate } from "@/lib/format-date";
import { SectionTitle } from "@/components/section-title";

export function Writing() {
  const { data, loading, error } = useRemoteData(fetchBlogPosts);

  return (
    <section
      className="py-7 feed:py-8 border-t border-white/[0.06] cv-defer"
      style={{ containIntrinsicSize: "auto 540px" }}
    >
      <SectionTitle kicker="// writing" title="From the blog" />

      {/* Post list area */}
      <div>
        {loading && (
          <>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="grid gap-x-[14px] feed:gap-x-[18px] gap-y-2 py-4 border-b border-white/[0.06] animate-pulse grid-cols-[80px_1fr] feed:grid-cols-[110px_1fr]"
              >
                {/* Date placeholder */}
                <div className="h-3 w-16 rounded bg-white/10 mt-[3px]" />
                {/* Body placeholder */}
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-full rounded bg-white/[0.07]" />
                  <div className="h-3 w-2/3 rounded bg-white/[0.07]" />
                </div>
              </div>
            ))}
          </>
        )}

        {!loading && !error && data && data.length > 0 &&
          data.slice(0, 3).map((post) => (
            <a
              key={post.link}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="grid gap-x-[14px] feed:gap-x-[18px] gap-y-2 py-4 border-b border-white/[0.06] text-white/85 no-underline transition-colors duration-200 hover:text-white group grid-cols-[80px_1fr] feed:grid-cols-[110px_1fr]"
            >
              {/* Date column */}
              <div className="font-mono text-[12px] text-white/40 pt-[3px]">
                {formatPostDate(post.date)}
              </div>
              {/* Body column */}
              <div className="max-w-[680px]">
                <div className="text-[16px] font-semibold tracking-[-0.01em]">
                  {post.title}
                </div>
                <div className="mt-1.5 text-[14px] leading-[1.55] text-white/60 line-clamp-2">
                  {post.excerpt}
                </div>
              </div>
            </a>
          ))
        }
      </div>

      {/* Footer link — always rendered */}
      <div className="mt-6 flex justify-end">
        <a
          href="https://blog.howar31.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[13px] text-white/50 hover:text-white/85 transition-colors"
        >
          read all posts
          <BookOpen className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
