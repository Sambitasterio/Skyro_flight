import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4F46E5",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        surface: {
          DEFAULT: "#F8FAFC",
          dark: "#0F172A",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#1E293B",
        },
        muted: {
          DEFAULT: "#64748B",
          foreground: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          dark: "#334155",
        },
      },
    },
  },
  plugins: [],
};

export default config;
