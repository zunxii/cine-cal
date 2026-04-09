"use client";

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
  isNoteDialogOpen: boolean;

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
  openNoteDialog: () => void;
  closeNoteDialog: () => void;
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
      isNoteDialogOpen: false,

      goToNextMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        set({
          selectedRange: { start: null, end: null },
          selectionPhase: "idle",
          hoveredDate: null,
        });
        if (activeMonthIndex === 11) {
          set({ activeMonthIndex: 0 as MonthIndex, activeYear: activeYear + 1 });
        } else {
          set({ activeMonthIndex: (activeMonthIndex + 1) as MonthIndex });
        }
      },

      goToPrevMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        set({
          selectedRange: { start: null, end: null },
          selectionPhase: "idle",
          hoveredDate: null,
        });
        if (activeMonthIndex === 0) {
          set({ activeMonthIndex: 11 as MonthIndex, activeYear: activeYear - 1 });
        } else {
          set({ activeMonthIndex: (activeMonthIndex - 1) as MonthIndex });
        }
      },

      handleDateClick: (date: Date) => {
        const state = get();
        const { selectionPhase, selectedRange } = state;

        if (selectionPhase === "idle" || !selectedRange.start) {
          // Start fresh selection
          set({
            selectedRange: { start: date, end: null },
            selectionPhase: "selecting-end",
            hoveredDate: null,
          });
          return;
        }

        // We have a start, now pick end
        if (selectionPhase === "selecting-end" && selectedRange.start) {
          const start = selectedRange.start;

          // Click same day = clear
          if (isSameDay(date, start)) {
            set({
              selectedRange: { start: null, end: null },
              selectionPhase: "idle",
              hoveredDate: null,
            });
            return;
          }

          const startTime = start.getTime();
          const endTime = date.getTime();
          const [finalStart, finalEnd] =
            endTime >= startTime ? [start, date] : [date, start];

          set({
            selectedRange: { start: finalStart, end: finalEnd },
            selectionPhase: "idle",
            hoveredDate: null,
          });
        }
      },

      handleDateHover: (date: Date | null) => {
        const { selectionPhase } = get();
        if (selectionPhase === "selecting-end") {
          set({ hoveredDate: date });
        }
      },

      clearSelection: () => {
        set({
          selectedRange: { start: null, end: null },
          selectionPhase: "idle",
          hoveredDate: null,
        });
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
        if (selectionPhase !== "selecting-end" || !selectedRange.start || !hoveredDate) {
          return selectedRange;
        }
        const start = selectedRange.start;
        const [pStart, pEnd] =
          hoveredDate.getTime() >= start.getTime()
            ? [start, hoveredDate]
            : [hoveredDate, start];
        return { start: pStart, end: pEnd };
      },

      openNoteDialog: () => set({ isNoteDialogOpen: true }),
      closeNoteDialog: () => set({ isNoteDialogOpen: false }),
    }),
    {
      name: "cinecalendar-v3",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
        return localStorage;
      }),
      partialize: (state) => ({
        notes: state.notes,
        activeMonthIndex: state.activeMonthIndex,
        activeYear: state.activeYear,
      }),
      // Rehydrate dates properly
      merge: (persistedState: unknown, currentState: CalendarStore) => {
        const persisted = persistedState as Partial<CalendarStore> & {
          notes?: Record<string, { monthIndex: MonthIndex; year: number; content: string; rangeLabel: string | null; markedDates: number[] }>;
        };
        return {
          ...currentState,
          ...(persisted || {}),
          // Always reset selection state on load
          selectedRange: { start: null, end: null },
          selectionPhase: "idle" as SelectionPhase,
          hoveredDate: null,
          isNoteDialogOpen: false,
        };
      },
    }
  )
);

export function selectDateSelectionState(
  date: Date,
  range: DateRange
): "start" | "end" | "in-range" | "none" {
  const { start, end } = range;
  if (!start) return "none";

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, start)) return "start";
  if (end && sameDay(date, end)) return "end";
  if (end) {
    const t = date.getTime();
    if (t > start.getTime() && t < end.getTime()) return "in-range";
  }
  return "none";
}