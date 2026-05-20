import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        feed: "880px",
        w1: "1920px",
        w2: "2400px",
        w3: "3000px",
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "monospace"],
        display: ["var(--font-atkinson)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
