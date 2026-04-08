import type { MonthIndex } from "./theme";

export type SelectionState = "none" | "start" | "end" | "in-range";

export interface CalendarDay {
  date: Date;
  dayNumber: number;       // 1–31
  isCurrentMonth: boolean; // false for padding days
  isToday: boolean;
  isWeekend: boolean;
  selectionState: SelectionState;
  isGoldenDate: boolean;   // has easter egg fact
  goldenFact?: string;     // trivia text
  goldenFilmRef?: string;  // film reference label
}

export interface CalendarWeek {
  days: CalendarDay[];     // always 7 items
}

export interface CalendarMonth {
  monthIndex: MonthIndex;
  year: number;
  weeks: CalendarWeek[];
  totalDays: number;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type SelectionPhase = "idle" | "selecting-start" | "selecting-end";

// Per-month notes stored in localStorage
export interface MonthNote {
  monthIndex: MonthIndex;
  year: number;
  content: string;
  // Auto-stamped when a range is selected
  rangeLabel: string | null; // e.g. "Scene log: Jan 13 → Jan 18"
}

export interface CalendarState {
  activeYear: number;
  activeMonthIndex: MonthIndex;
  selectedRange: DateRange;
  selectionPhase: SelectionPhase;
  hoveredDate: Date | null;
  notes: Record<string, MonthNote>; // key: "YYYY-MM"
}