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

  const fonts = FONT_MAP[theme.id] ?? FONT_MAP.ddlj;
  root.style.setProperty("--font-display", `'${fonts.display}', serif`);
  root.style.setProperty("--font-body", `'${fonts.body}', sans-serif`);
  root.style.setProperty("--font-notes", `'${fonts.notes}', cursive`);

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