import type { MonthIndex } from "./theme";

export type SelectionState = "none" | "start" | "end" | "in-range";

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  selectionState: SelectionState;
  isGoldenDate: boolean;
  goldenFact?: string;
  goldenFilmRef?: string;
  isMarked?: boolean;
}

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export type SelectionPhase = "idle" | "selecting-end";

export interface MonthNote {
  monthIndex: MonthIndex;
  year: number;
  content: string;
  rangeLabel: string | null;
  markedDates: number[];
}