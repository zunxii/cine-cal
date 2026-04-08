import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { MonthIndex } from "@/types/theme";
import type { DateRange, SelectionPhase, MonthNote } from "@/types/calendar";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CalendarStore {
  // ── Active view ──────────────────────────────────────────────────────────
  activeYear: number;
  activeMonthIndex: MonthIndex;

  // ── Date selection ────────────────────────────────────────────────────────
  selectedRange: DateRange;
  selectionPhase: SelectionPhase;
  hoveredDate: Date | null;

  // ── Notes (persisted per month) ───────────────────────────────────────────
  notes: Record<string, MonthNote>; // key: "YYYY-M" e.g. "2025-0"

  // ── UI flags ─────────────────────────────────────────────────────────────
  isTransitioning: boolean; // GSAP projector flicker in progress

  // ── Actions: Navigation ───────────────────────────────────────────────────
  goToNextMonth: () => void;
  goToPrevMonth: () => void;
  goToMonth: (monthIndex: MonthIndex, year?: number) => void;

  // ── Actions: Selection ────────────────────────────────────────────────────
  handleDateClick: (date: Date) => void;
  handleDateHover: (date: Date | null) => void;
  clearSelection: () => void;

  // ── Actions: Notes ────────────────────────────────────────────────────────
  updateNote: (monthIndex: MonthIndex, year: number, content: string) => void;
  stampRangeHeader: (monthIndex: MonthIndex, year: number) => void;
  clearNote: (monthIndex: MonthIndex, year: number) => void;

  // ── Actions: UI ───────────────────────────────────────────────────────────
  setTransitioning: (val: boolean) => void;

  // ── Selectors (computed helpers) ──────────────────────────────────────────
  getActiveNoteKey: () => string;
  getNote: (monthIndex: MonthIndex, year: number) => MonthNote | null;
  getPreviewRange: () => DateRange; // during hover, shows ghost end
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function noteKey(monthIndex: MonthIndex, year: number): string {
  return `${year}-${monthIndex}`;
}

function formatDateShort(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

function buildRangeLabel(start: Date, end: Date): string {
  return `🎬 Scene log: ${formatDateShort(start)} → ${formatDateShort(end)}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function clampToMonth(date: Date, monthIndex: number, year: number): Date {
  // Returns date if it's in the correct month, else null
  if (date.getMonth() === monthIndex && date.getFullYear() === year) {
    return date;
  }
  return date;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const now = new Date();

const INITIAL_STATE = {
  activeYear: now.getFullYear(),
  activeMonthIndex: now.getMonth() as MonthIndex,
  selectedRange: { start: null, end: null } as DateRange,
  selectionPhase: "idle" as SelectionPhase,
  hoveredDate: null as Date | null,
  notes: {} as Record<string, MonthNote>,
  isTransitioning: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // ── Navigation ──────────────────────────────────────────────────────────

      goToNextMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        const next = activeMonthIndex === 11
          ? { activeMonthIndex: 0 as MonthIndex, activeYear: activeYear + 1 }
          : { activeMonthIndex: (activeMonthIndex + 1) as MonthIndex, activeYear };
        set({ ...next, isTransitioning: true });
      },

      goToPrevMonth: () => {
        const { activeMonthIndex, activeYear } = get();
        const prev = activeMonthIndex === 0
          ? { activeMonthIndex: 11 as MonthIndex, activeYear: activeYear - 1 }
          : { activeMonthIndex: (activeMonthIndex - 1) as MonthIndex, activeYear };
        set({ ...prev, isTransitioning: true });
      },

      goToMonth: (monthIndex: MonthIndex, year?: number) => {
        set({
          activeMonthIndex: monthIndex,
          activeYear: year ?? get().activeYear,
          isTransitioning: true,
        });
      },

      // ── Date Selection ───────────────────────────────────────────────────────
      // Two-click range: first click = start, second click = end
      // Clicking the same date twice resets selection
      // Clicking an end date before the start swaps them

      handleDateClick: (date: Date) => {
        const { selectionPhase, selectedRange, activeMonthIndex, activeYear } = get();

        if (selectionPhase === "idle" || selectionPhase === "selecting-start") {
          // First click — set start, begin hunting for end
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
            // Shouldn't happen but guard anyway
            set({
              selectedRange: { start: date, end: null },
              selectionPhase: "selecting-end",
            });
            return;
          }

          // Clicking the same date = reset
          if (isSameDay(date, start)) {
            set({
              selectedRange: { start: null, end: null },
              selectionPhase: "idle",
              hoveredDate: null,
            });
            return;
          }

          // Ensure chronological order
          const [finalStart, finalEnd] =
            date < start ? [date, start] : [start, date];

          set({
            selectedRange: { start: finalStart, end: finalEnd },
            selectionPhase: "idle",
            hoveredDate: null,
          });

          // Auto-stamp the note header for this month
          // (only if both dates are in the active month)
          const noteMonth = finalStart.getMonth() as MonthIndex;
          const noteYear = finalStart.getFullYear();
          get().stampRangeHeader(noteMonth, noteYear);
        }
      },

      handleDateHover: (date: Date | null) => {
        set({ hoveredDate: date });
      },

      clearSelection: () => {
        set({
          selectedRange: { start: null, end: null },
          selectionPhase: "idle",
          hoveredDate: null,
        });
      },

      // ── Notes ────────────────────────────────────────────────────────────────

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
            },
          },
        }));
      },

      stampRangeHeader: (monthIndex: MonthIndex, year: number) => {
        const { selectedRange, notes } = get();
        const { start, end } = selectedRange;
        if (!start || !end) return;

        const key = noteKey(monthIndex, year);
        const existing = notes[key];
        const rangeLabel = buildRangeLabel(start, end);

        set((state) => ({
          notes: {
            ...state.notes,
            [key]: {
              monthIndex,
              year,
              content: existing?.content ?? "",
              rangeLabel,
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

      // ── UI ───────────────────────────────────────────────────────────────────

      setTransitioning: (val: boolean) => {
        set({ isTransitioning: val });
      },

      // ── Selectors ────────────────────────────────────────────────────────────

      getActiveNoteKey: () => {
        const { activeMonthIndex, activeYear } = get();
        return noteKey(activeMonthIndex, activeYear);
      },

      getNote: (monthIndex: MonthIndex, year: number) => {
        const key = noteKey(monthIndex, year);
        return get().notes[key] ?? null;
      },

      // During "selecting-end" phase, show a ghost range from start → hovered
      // This drives the in-between highlight while the user drags their eye across dates
      getPreviewRange: (): DateRange => {
        const { selectionPhase, selectedRange, hoveredDate } = get();

        if (selectionPhase !== "selecting-end") {
          return selectedRange;
        }

        const { start } = selectedRange;
        if (!start || !hoveredDate) {
          return selectedRange;
        }

        const [previewStart, previewEnd] =
          hoveredDate < start
            ? [hoveredDate, start]
            : [start, hoveredDate];

        return { start: previewStart, end: previewEnd };
      },
    }),

    // ── Persistence config ────────────────────────────────────────────────────
    // Only notes survive a page refresh — UI state resets fresh each visit
    {
      name: "cinecalendar-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        notes: state.notes,
        // Persist last viewed month so the user returns to where they left off
        activeMonthIndex: state.activeMonthIndex,
        activeYear: state.activeYear,
      }),
    }
  )
);

// ─── Derived selectors (use outside components too) ───────────────────────────

export function selectIsDateInRange(date: Date, range: DateRange): boolean {
  const { start, end } = range;
  if (!start || !end) return false;
  const t = date.getTime();
  return t > start.getTime() && t < end.getTime();
}

export function selectIsRangeStart(date: Date, range: DateRange): boolean {
  return range.start ? isSameDay(date, range.start) : false;
}

export function selectIsRangeEnd(date: Date, range: DateRange): boolean {
  return range.end ? isSameDay(date, range.end) : false;
}

export function selectDateSelectionState(
  date: Date,
  range: DateRange
): "start" | "end" | "in-range" | "none" {
  if (selectIsRangeStart(date, range)) return "start";
  if (selectIsRangeEnd(date, range)) return "end";
  if (selectIsDateInRange(date, range)) return "in-range";
  return "none";
}