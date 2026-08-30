import { support } from "@/data/identity";
import { cn } from "@/lib/utils";

export function SupportBlock() {
  return (
    <section
      className="py-7 feed:py-8 cv-defer"
      style={{ containIntrinsicSize: "auto 280px" }}
    >
      <div
        className={cn(
          "p-5 feed:p-[26px] rounded-2xl border",
          "bg-gradient-to-br from-blue-400/[0.08] to-violet-400/[0.06]",
          "border-violet-400/20"
        )}
      >
        {/* Kicker */}
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-violet-400">
          ↳ {support.kicker}
        </div>

        {/* Body copy */}
        <div className="mt-3 text-[15px] leading-[1.6] text-white/85 max-w-[540px]">
          {support.body}
        </div>

        {/* Actions */}
        <div className="mt-[18px] flex flex-wrap items-center gap-3">
          <a
            href={support.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2",
              "font-sans text-[15px] font-medium tracking-[0.01em]",
              "px-[18px] py-[10px] rounded-[10px]",
              "text-white no-underline",
              "bg-blue-400/[0.18] border border-blue-400/40",
              "transition-colors hover:bg-blue-400/[0.28]"
            )}
          >
            {/* Sponsor-page mark: heart outline, see ~/.claude/skills/accept-donations/references/sponsor-mark.md */}
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Sponsor
          </a>

          <span className="font-mono text-[12px] text-white/40">or</span>

          <a
            href={support.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-[14px] text-white/85 no-underline",
              "border-b border-dashed border-white/30",
              "transition-colors hover:text-white hover:border-white/60"
            )}
          >
            Ko-fi ↗
          </a>
        </div>
      </div>
    </section>
  );
}
