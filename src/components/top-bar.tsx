import { identity } from "@/data/identity";

export function TopBar() {
  return (
    <header
      style={{ maxWidth: 1180 }}
      className="mx-auto px-5 feed:px-8 pt-5 feed:pt-7 flex items-center justify-between gap-3"
    >
      {/* Wordmark */}
      <a
        href="#"
        className="inline-flex items-center gap-[10px] font-mono text-sm text-white/85 no-underline tracking-[-0.01em] shrink-0"
      >
        <span
          style={{
            background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
            boxShadow: "0 0 10px #a78bfa99",
          }}
          className="w-[10px] h-[10px] rounded-full shrink-0"
        />
        howar31
      </a>

      {/* Status */}
      <div className="inline-flex items-center gap-2 font-mono text-xs text-white/55 min-w-0">
        <span
          className="w-[7px] h-[7px] rounded-full shrink-0"
          style={{
            background: "#34d399",
            boxShadow: "0 0 8px rgba(52,211,153,0.7)",
          }}
        />
        <span className="tracking-[0.02em] truncate">{identity.status}</span>
      </div>
    </header>
  );
}
