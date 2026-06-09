import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    "#0b1a35",
          navy:    "#0f2347",
          blue:    "#1a3a6b",
          gold:    "#c9a227",
          "gold-light": "#e0b93a",
          "gold-pale":  "#f5e8b0",
          gray:    "#f4f6fa",
          "gray-mid":   "#e8ecf4",
          muted:   "#8899bb",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto)", "Noto Sans TC", "sans-serif"],
      },
      backgroundImage: {
        "blueprint-pattern": "url('/images/blueprint-bg.svg')",
      },
    },
  },
  plugins: [],
};

export default config;
