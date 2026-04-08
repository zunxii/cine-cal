import { create } from "zustand";
import { getThemeByMonth } from "@/data/theme";
import type { FilmTheme, MonthIndex } from "@/types/theme";

interface ThemeStore {
  activeTheme: FilmTheme;
  previousTheme: FilmTheme | null;
  syncThemeToMonth: (monthIndex: MonthIndex) => void;
}

// Font family map per film — Google Fonts names exactly
const FONT_MAP: Record<string, { display: string; body: string; notes: string }> = {
  ddlj: { display: "Playfair Display", body: "Lora", notes: "Kalam" },
  kkhh: { display: "Bebas Neue", body: "Nunito", notes: "Kalam" },
  rdb: { display: "Oswald", body: "Source Sans 3", notes: "Kalam" },
  gow: { display: "Teko", body: "Barlow", notes: "Kalam" },
  satya: { display: "Bebas Neue", body: "Barlow Condensed", notes: "Kalam" },
  devdas: { display: "Playfair Display", body: "EB Garamond", notes: "Kalam" },
  jthj: { display: "Oswald", body: "Raleway", notes: "Kalam" },
  lagaan: { display: "Teko", body: "Source Sans 3", notes: "Kalam" },
  "three-idiots": { display: "Nunito", body: "Nunito", notes: "Kalam" },
  "mughal-e-azam": { display: "Playfair Display", body: "EB Garamond", notes: "Kalam" },
  "dil-chahta-hai": { display: "Bebas Neue", body: "Raleway", notes: "Kalam" },
  bajirao: { display: "Playfair Display", body: "EB Garamond", notes: "Kalam" },
};

export function injectThemeCSSVars(theme: FilmTheme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { colors } = theme;

  root.style.setProperty("--theme-bg", colors.bg);
  root.style.setProperty("--theme-surface", colors.surface);
  root.style.setProperty("--theme-accent", colors.accent);
  root.style.setProperty("--theme-accent-alt", colors.accentAlt);
  root.style.setProperty("--theme-text", colors.text);
  root.style.setProperty("--theme-text-muted", colors.textMuted);
  root.style.setProperty("--theme-border", colors.border);
  root.style.setProperty("--theme-highlight", colors.highlight);
  root.style.setProperty("--theme-hero-overlay", colors.heroOverlay);
  root.style.setProperty("--theme-hero-gradient", theme.heroGradient);
  root.style.setProperty("--theme-grayscale", theme.startsGrayscale ? "1" : "0");

  const grainOpacity = { none: "0", subtle: "0.03", medium: "0.06", heavy: "0.12" }[theme.grain];
  root.style.setProperty("--theme-grain-opacity", grainOpacity);

  // Inject font vars
  const fonts = FONT_MAP[theme.id] ?? FONT_MAP.ddlj;
  root.style.setProperty("--font-display", `'${fonts.display}', serif`);
  root.style.setProperty("--font-body", `'${fonts.body}', sans-serif`);
  root.style.setProperty("--font-notes", `'${fonts.notes}', cursive`);

  // Also update body background directly for smooth transition
  document.body.style.backgroundColor = colors.bg;
  document.body.style.color = colors.text;
}

const initialTheme = getThemeByMonth(new Date().getMonth() as MonthIndex);

export const useThemeStore = create<ThemeStore>()((set, get) => ({
  activeTheme: initialTheme,
  previousTheme: null,

  syncThemeToMonth: (monthIndex: MonthIndex) => {
    const current = get().activeTheme;
    const next = getThemeByMonth(monthIndex);
    if (current.id === next.id) return;
    set({ previousTheme: current, activeTheme: next });
    injectThemeCSSVars(next);
  },
}));

export function initThemeCSSVars(monthIndex: MonthIndex): void {
  injectThemeCSSVars(getThemeByMonth(monthIndex));
}