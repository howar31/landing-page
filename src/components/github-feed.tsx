"use client";

import { fetchRecentRepos } from "@/lib/github";
import { useRemoteData } from "@/lib/use-remote-data";
import { languageColor } from "@/lib/languages";
import { formatRelativeTime } from "@/lib/format-date";

export function GithubFeed() {
  const { data, loading, error } = useRemoteData(() => fetchRecentRepos(3));

  if (error) return null;
  if (!loading && data && data.length === 0) return null;

  return (
    <div className="mt-4">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50 mb-3">
        ↳ Latest on GitHub
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="animate-pulse flex flex-col gap-2 p-3 rounded-lg border border-white/[0.06]"
            >
              <div className="h-3 w-1/3 rounded bg-white/10" />
              <div className="h-2.5 w-2/3 rounded bg-white/[0.06]" />
              <div className="h-2 w-1/4 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {(data ?? []).map((repo) => (
            <div
              key={repo.name}
              className="flex items-start justify-between gap-3 py-2 border-b border-white/[0.06] last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <div>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-semibold text-white/85 hover:text-white transition-colors no-underline"
                  >
                    {repo.name}
                  </a>
                </div>
                {repo.description && (
                  <div className="mt-0.5 max-w-[640px] text-[12px] leading-[1.5] text-white/55 line-clamp-2">
                    {repo.description}
                  </div>
                )}
                {repo.languages.length > 0 ? (
                  <div className="mt-2">
                    <div className="flex h-1.5 w-full max-w-[360px] overflow-hidden rounded-full">
                      {repo.languages.map((lang) => (
                        <span
                          key={lang.name}
                          title={`${lang.name} ${lang.pct}%`}
                          style={{
                            // flex-grow by pct so segments always partition
                            // the full bar even when rounded pcts don't sum to 100
                            flex: `${lang.pct} 0 0%`,
                            background: languageColor(lang.name),
                          }}
                        />
                      ))}
                    </div>
                    <div className="mt-1.5 font-mono text-[11px]">
                      {repo.languages.map((lang, i) => (
                        <span key={lang.name}>
                          {i > 0 && <span className="text-white/25"> · </span>}
                          <span style={{ color: languageColor(lang.name) }}>
                            {lang.name}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : repo.language ? (
                  <div className="mt-1 inline-flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: languageColor(repo.language) }}
                    />
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: languageColor(repo.language) }}
                    >
                      {repo.language}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="font-mono text-[11px] text-white/35 whitespace-nowrap pt-0.5 shrink-0">
                {formatRelativeTime(repo.pushedAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
