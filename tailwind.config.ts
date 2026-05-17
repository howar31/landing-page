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
      },
      fontFamily: {
        sans: ["var(--font-noto-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Consolas", "Monaco", "monospace"],
        display: ["var(--font-atkinson)", "var(--font-noto-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
