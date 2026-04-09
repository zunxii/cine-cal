import type { Config } from "tailwindcss";

const config: Config = {
  content: [
  "./app/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
],
  theme: {
    extend: {
      fontFamily: {
        // Display fonts — one per film theme
        display: ["var(--font-display)"],
        body:    ["var(--font-body)"],
        notes:   ["var(--font-notes)"],
      },
      colors: {
        // All theme colors come through CSS custom properties
        // so Tailwind reads them dynamically
        theme: {
          bg:        "var(--theme-bg)",
          surface:   "var(--theme-surface)",
          accent:    "var(--theme-accent)",
          accentAlt: "var(--theme-accent-alt)",
          text:      "var(--theme-text)",
          textMuted: "var(--theme-text-muted)",
          border:    "var(--theme-border)",
          highlight: "var(--theme-highlight)",
          grain:     "var(--theme-grain-opacity)",
        },
      },
      animation: {
        "flicker-in": "flickerIn 0.6s ease-in-out forwards",
        "fade-up":    "fadeUp 0.4s ease-out forwards",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        flickerIn: {
          "0%":   { opacity: "1" },
          "10%":  { opacity: "0" },
          "20%":  { opacity: "1" },
          "30%":  { opacity: "0.2" },
          "50%":  { opacity: "1" },
          "70%":  { opacity: "0.6" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "1",   transform: "scale(1)" },
          "50%":      { opacity: "0.6", transform: "scale(1.2)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;