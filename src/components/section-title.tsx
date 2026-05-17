interface SectionTitleProps {
  kicker: string;
  title: string;
  count?: number;
}

export function SectionTitle({ kicker, title, count }: SectionTitleProps) {
  return (
    <div className="mb-[22px]">
      {/* Kicker row */}
      <div className="inline-flex items-center gap-[10px] font-mono text-[11px] tracking-[0.14em] uppercase text-white/50">
        <span
          style={{ background: "#a78bfab3" }}
          className="w-[22px] h-px block shrink-0"
        />
        {kicker}
      </div>
      {/* Title row */}
      <div className="mt-2 flex items-baseline justify-between gap-4">
        <h2 className="m-0 text-[26px] font-semibold tracking-[-0.02em] text-white">
          {title}
        </h2>
        {count != null ? (
          <span className="font-mono text-xs text-white/35">
            {String(count).padStart(2, "0")}
          </span>
        ) : null}
      </div>
    </div>
  );
}
