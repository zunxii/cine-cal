import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MonthIndex } from "@/types/theme";
import type { DateRange, SelectionPhase, MonthNote } from "@/types/calendar";

interface CalendarStore {
  activeYear: number;
  activeMonthIndex: MonthIndex;
  selectedRange: DateRange;
  selectionPhase: SelectionPhase;
  hoveredDate: Date | null;
  notes: Record<string, MonthNote>;

  goToNextMonth: () => void;
  goToPrevMonth: () => void;

  handleDateClick: (date: Date) => void;
  handleDateHover: (date: Date | null) => void;
  clearSelection: () => void;
  toggleMarkDate: (day: number, monthIndex: MonthIndex, year: number) => void;

  updateNote: (monthIndex: MonthIndex, year: number, content: string) => void;
  clearNote: (monthIndex: MonthIndex, year: number) => void;

  getNote: (monthIndex: MonthIndex, year: number) => MonthNote | null;
  getPreviewRange: () => DateRange;
}

function noteKey(monthIndex: MonthIndex, year: number): string {
  return `${year}-${monthIndex}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const now = new Date();

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      activeYear: now.getFullYear(),
      activeMonthIndex: now.getMonth() as MonthIndex,
      selectedRange: { start: null, end: null },
      selectionPhase: "idle" as SelectionPhase,
      hoveredDate: null,
      notes: {},

      goToNextMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        if (activeMonthIndex === 11) {
          set({ activeMonthIndex: 0 as MonthIndex, activeYear: activeYear + 1 });
        } else {
          set({ activeMonthIndex: (activeMonthIndex + 1) as MonthIndex });
        }
      },

      goToPrevMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        if (activeMonthIndex === 0) {
          set({ activeMonthIndex: 11 as MonthIndex, activeYear: activeYear - 1 });
        } else {
          set({ activeMonthIndex: (activeMonthIndex - 1) as MonthIndex });
        }
      },

      handleDateClick: (date: Date) => {
        const { selectionPhase, selectedRange } = get();

        if (selectionPhase === "idle") {
          set({
            selectedRange: { start: date, end: null },
            selectionPhase: "selecting-end",
            hoveredDate: null,
          });
          return;
        }

        if (selectionPhase === "selecting-end") {
          const { start } = selectedRange;
          if (!start) {
            set({ selectedRange: { start: date, end: null }, selectionPhase: "selecting-end" });
            return;
          }

          if (isSameDay(date, start)) {
            set({ selectedRange: { start: null, end: null }, selectionPhase: "idle", hoveredDate: null });
            return;
          }

          const [finalStart, finalEnd] = date < start ? [date, start] : [start, date];

          set({
            selectedRange: { start: finalStart, end: finalEnd },
            selectionPhase: "idle",
            hoveredDate: null,
          });
        }
      },

      handleDateHover: (date: Date | null) => {
        set({ hoveredDate: date });
      },

      clearSelection: () => {
        set({ selectedRange: { start: null, end: null }, selectionPhase: "idle", hoveredDate: null });
      },

      toggleMarkDate: (day: number, monthIndex: MonthIndex, year: number) => {
        const key = noteKey(monthIndex, year);
        const existing = get().notes[key];
        const markedDates = existing?.markedDates ?? [];
        const isMarked = markedDates.includes(day);

        set((state) => ({
          notes: {
            ...state.notes,
            [key]: {
              monthIndex,
              year,
              content: existing?.content ?? "",
              rangeLabel: existing?.rangeLabel ?? null,
              markedDates: isMarked
                ? markedDates.filter((d) => d !== day)
                : [...markedDates, day],
            },
          },
        }));
      },

      updateNote: (monthIndex: MonthIndex, year: number, content: string) => {
        const key = noteKey(monthIndex, year);
        const existing = get().notes[key];
        set((state) => ({
          notes: {
            ...state.notes,
            [key]: {
              monthIndex,
              year,
              content,
              rangeLabel: existing?.rangeLabel ?? null,
              markedDates: existing?.markedDates ?? [],
            },
          },
        }));
      },

      clearNote: (monthIndex: MonthIndex, year: number) => {
        const key = noteKey(monthIndex, year);
        set((state) => {
          const next = { ...state.notes };
          delete next[key];
          return { notes: next };
        });
      },

      getNote: (monthIndex: MonthIndex, year: number) => {
        const key = noteKey(monthIndex, year);
        return get().notes[key] ?? null;
      },

      getPreviewRange: (): DateRange => {
        const { selectionPhase, selectedRange, hoveredDate } = get();
        if (selectionPhase !== "selecting-end") return selectedRange;
        const { start } = selectedRange;
        if (!start || !hoveredDate) return selectedRange;
        const [pStart, pEnd] = hoveredDate < start ? [hoveredDate, start] : [start, hoveredDate];
        return { start: pStart, end: pEnd };
      },
    }),
    {
      name: "cinecalendar-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        activeMonthIndex: state.activeMonthIndex,
        activeYear: state.activeYear,
      }),
    }
  )
);

export function selectDateSelectionState(
  date: Date,
  range: DateRange
): "start" | "end" | "in-range" | "none" {
  const { start, end } = range;
  if (!start) return "none";

  const isSame = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSame(date, start)) return "start";
  if (end && isSame(date, end)) return "end";
  if (end) {
    const t = date.getTime();
    if (t > start.getTime() && t < end.getTime()) return "in-range";
  }
  return "none";
}