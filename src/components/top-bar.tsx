import { identity } from "@/data/identity";

export function TopBar() {
  return (
    <header
      className="mx-auto max-w-[1180px] 2xl:max-w-[1320px] w1:max-w-[1480px] w2:max-w-[1620px] w3:max-w-[1760px] px-5 feed:px-8 pt-5 feed:pt-7 flex items-center justify-between gap-3"
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
        {/* Live status dot — a pinging ring behind a steady dot */}
        <span className="relative inline-flex w-[7px] h-[7px] shrink-0">
          <span
            className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping"
            style={{ background: "#34d399" }}
          />
          <span
            className="relative inline-flex h-[7px] w-[7px] rounded-full"
            style={{
              background: "#34d399",
              boxShadow: "0 0 8px rgba(52,211,153,0.7)",
            }}
          />
        </span>
        <span className="tracking-[0.02em] truncate">{identity.status}</span>
      </div>
    </header>
  );
}
