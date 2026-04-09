import type { FilmTheme } from "@/types/theme";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export function buildCalendarDays(monthIndex: number, year: number) {
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(year, monthIndex, 1 - startOffset, 12);
  const weeks = [];

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + w * 7 + d);
      week.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === monthIndex,
        isToday: isToday(cellDate),
        isWeekend: cellDate.getDay() === 0 || cellDate.getDay() === 6,
        selectionState: "none" as const,
        isGoldenDate: false,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// Film-specific display font mapping — using CSS variable references from next/font
const DISPLAY_FONT_MAP: Record<string, string> = {
  ddlj:            "var(--font-playfair, Georgia, serif)",
  kkhh:            "var(--font-bebas, Impact, sans-serif)",
  rdb:             "var(--font-oswald, 'Arial Narrow', sans-serif)",
  gow:             "var(--font-teko, Impact, sans-serif)",
  satya:           "var(--font-bebas, Impact, sans-serif)",
  devdas:          "var(--font-eb-garamond, Georgia, serif)",
  jthj:            "var(--font-cinzel, Georgia, serif)",
  lagaan:          "var(--font-oswald, 'Arial Narrow', sans-serif)",
  "three-idiots":  "var(--font-righteous, sans-serif)",
  "mughal-e-azam": "var(--font-cinzel, Georgia, serif)",
  "dil-chahta-hai":"var(--font-josefin, sans-serif)",
  bajirao:         "var(--font-eb-garamond, Georgia, serif)",
};

const BODY_FONT_MAP: Record<string, string> = {
  ddlj:            "var(--font-lora, Georgia, serif)",
  kkhh:            "var(--font-nunito, sans-serif)",
  rdb:             "var(--font-barlow, sans-serif)",
  gow:             "var(--font-barlow, sans-serif)",
  satya:           "var(--font-barlow-condensed, sans-serif)",
  devdas:          "var(--font-eb-garamond, Georgia, serif)",
  jthj:            "var(--font-raleway, sans-serif)",
  lagaan:          "var(--font-source-sans, sans-serif)",
  "three-idiots":  "var(--font-nunito, sans-serif)",
  "mughal-e-azam": "var(--font-libre-baskerville, Georgia, serif)",
  "dil-chahta-hai":"var(--font-josefin, sans-serif)",
  bajirao:         "var(--font-eb-garamond, Georgia, serif)",
};

export function injectTheme(theme: FilmTheme) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const c = theme.colors;

  // Color variables
  r.style.setProperty("--paper",        c.paper);
  r.style.setProperty("--paper-alt",    c.paperAlt);
  r.style.setProperty("--ink",          c.ink);
  r.style.setProperty("--ink-light",    c.inkLight);
  r.style.setProperty("--accent",       c.accent);
  r.style.setProperty("--accent-soft",  c.accentSoft);
  r.style.setProperty("--accent-dark",  c.accentDark);
  r.style.setProperty("--border",       c.border);
  r.style.setProperty("--border-light", c.borderLight);
  r.style.setProperty("--gold",         c.gold);
  r.style.setProperty("--shadow",       c.shadow);
  r.style.setProperty("--header-bg",    c.headerBg);
  r.style.setProperty("--header-text",  c.headerText);

  // Font variables — reference the CSS vars injected by next/font
  const displayFont = DISPLAY_FONT_MAP[theme.id] ?? "var(--font-playfair, Georgia, serif)";
  const bodyFont    = BODY_FONT_MAP[theme.id]    ?? "var(--font-lora, Georgia, serif)";
  r.style.setProperty("--font-display", displayFont);
  r.style.setProperty("--font-body",    bodyFont);
  r.style.setProperty("--font-notes",   "var(--font-kalam, cursive)");

  // Update body background
  document.body.style.setProperty("background-color", c.paperAlt);
}