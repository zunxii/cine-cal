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

export function injectTheme(theme: FilmTheme) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const c = theme.colors;
  r.style.setProperty("--paper", c.paper);
  r.style.setProperty("--paper-alt", c.paperAlt);
  r.style.setProperty("--ink", c.ink);
  r.style.setProperty("--ink-light", c.inkLight);
  r.style.setProperty("--accent", c.accent);
  r.style.setProperty("--accent-soft", c.accentSoft);
  r.style.setProperty("--accent-dark", c.accentDark);
  r.style.setProperty("--border", c.border);
  r.style.setProperty("--border-light", c.borderLight);
  r.style.setProperty("--gold", c.gold);
  r.style.setProperty("--shadow", c.shadow);
  r.style.setProperty("--header-bg", c.headerBg);
  r.style.setProperty("--header-text", c.headerText);
}