const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#60a5fa",
  JavaScript: "#fbbf24",
  HTML: "#fb7185",
  CSS: "#c084fc",
  SCSS: "#c084fc",
  Shell: "#34d399",
  Go: "#22d3ee",
  Python: "#818cf8",
  PHP: "#a78bfa",
  Lua: "#818cf8",
  Java: "#fb923c",
  AutoHotkey: "#94a3b8",
  VimL: "#34d399",
  Ruby: "#ef4444",
  Rust: "#f97316",
  C: "#7dd3fc",
  "C++": "#f472b6",
  "C#": "#86efac",
  Kotlin: "#c084fc",
  Swift: "#fdba74",
  Dockerfile: "#38bdf8",
  Vue: "#4ade80",
};

const FALLBACK = "#94a3b8";

export function languageColor(language: string | null | undefined): string {
  if (!language) return FALLBACK;
  return LANGUAGE_COLORS[language] ?? FALLBACK;
}
