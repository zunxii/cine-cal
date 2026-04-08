import { create } from "zustand";
import { getThemeByMonth } from "@/data/theme";
import type { FilmTheme, MonthIndex } from "@/types/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeStore {
  activeTheme: FilmTheme;
  previousTheme: FilmTheme | null;
  fontsLoaded: Set<string>;

  // Actions
  syncThemeToMonth: (monthIndex: MonthIndex) => void;
  markFontLoaded: (fontName: string) => void;
  isFontLoaded: (fontName: string) => boolean;
}

// ─── CSS Custom Property Injection ────────────────────────────────────────────

function injectThemeCSSVars(theme: FilmTheme): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const { colors, fonts } = theme;

  // Color tokens
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

  // Film grain opacity per intensity level
  const grainOpacity = {
    none: "0",
    subtle: "0.03",
    medium: "0.06",
    heavy: "0.12",
  }[theme.grain];
  root.style.setProperty("--theme-grain-opacity", grainOpacity);

  // Font family vars — components use font-[var(--font-display)] etc.
  root.style.setProperty("--font-display", `"${fonts.display}", serif`);
  root.style.setProperty("--font-body", `"${fonts.body}", sans-serif`);
  root.style.setProperty("--font-notes", `"${fonts.notes}", cursive`);

  // Mughal-E-Azam grayscale flag
  root.style.setProperty(
    "--theme-grayscale",
    theme.startsGrayscale ? "1" : "0"
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

const initialTheme = getThemeByMonth(new Date().getMonth() as MonthIndex);

export const useThemeStore = create<ThemeStore>()((set, get) => ({
  activeTheme: initialTheme,
  previousTheme: null,
  fontsLoaded: new Set<string>(),

  syncThemeToMonth: (monthIndex: MonthIndex) => {
    const current = get().activeTheme;
    const next = getThemeByMonth(monthIndex);

    if (current.id === next.id) return;

    set({ previousTheme: current, activeTheme: next });
    injectThemeCSSVars(next);
  },

  markFontLoaded: (fontName: string) => {
    set((state) => ({
      fontsLoaded: new Set([...state.fontsLoaded, fontName]),
    }));
  },

  isFontLoaded: (fontName: string) => {
    return get().fontsLoaded.has(fontName);
  },
}));

// ─── Initialise CSS vars on first load (call once in root layout) ─────────────

export function initThemeCSSVars(monthIndex: MonthIndex): void {
  injectThemeCSSVars(getThemeByMonth(monthIndex));
}