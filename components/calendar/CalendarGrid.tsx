"use client";

import { useMemo } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

import { DayCell } from "./DayCell";
import {
  selectDateSelectionState,
  useCalendarStore,
} from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import type { CalendarDay, CalendarWeek } from "@/types/calendar";
import type { MonthIndex } from "@/types/theme";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  className?: string;
}

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function buildGridStart(monthIndex: MonthIndex, year: number) {
  const first = new Date(year, monthIndex, 1, 12, 0, 0, 0);
  const offset = first.getDay();
  const start = new Date(year, monthIndex, 1 - offset, 12, 0, 0, 0);
  return start;
}

function buildWeeks(
  monthIndex: MonthIndex,
  year: number,
  previewRange: { start: Date | null; end: Date | null },
  goldenDays: Set<number>,
  goldenLookup: Map<number, { fact: string; filmReference: string }>
): CalendarWeek[] {
  const gridStart = buildGridStart(monthIndex, year);
  const weeks: CalendarWeek[] = [];

  for (let week = 0; week < 6; week += 1) {
    const days: CalendarDay[] = [];

    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const cellOffset = week * 7 + dayIndex;
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + cellOffset);

      const isCurrentMonth =
        date.getMonth() === monthIndex && date.getFullYear() === year;
      const golden = isCurrentMonth ? goldenLookup.get(date.getDate()) : null;

      days.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth,
        isToday: isToday(date),
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        selectionState: selectDateSelectionState(date, previewRange),
        isGoldenDate: Boolean(isCurrentMonth && goldenDays.has(date.getDate())),
        goldenFact: golden?.fact,
        goldenFilmRef: golden?.filmReference,
      });
    }

    weeks.push({ days });
  }

  return weeks;
}

export function CalendarGrid({ className }: CalendarGridProps) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const handleDateClick = useCalendarStore((s) => s.handleDateClick);
  const handleDateHover = useCalendarStore((s) => s.handleDateHover);
  const previewRange = useCalendarStore((s) => s.getPreviewRange());

  const activeTheme = useThemeStore((s) => s.activeTheme);

  const goldenDays = useMemo(
    () => new Set(activeTheme.goldenDates.map((g) => g.day)),
    [activeTheme.goldenDates]
  );

  const goldenLookup = useMemo(() => {
    return new Map(
      activeTheme.goldenDates.map((g) => [
        g.day,
        { fact: g.fact, filmReference: g.filmReference },
      ])
    );
  }, [activeTheme.goldenDates]);

  const weeks = useMemo(
    () =>
      buildWeeks(
        activeMonthIndex,
        activeYear,
        previewRange,
        goldenDays,
        goldenLookup
      ),
    [activeMonthIndex, activeYear, previewRange, goldenDays, goldenLookup]
  );

  return (
    <section
      className={cn(
        "rounded-[2rem] border p-4 md:p-5",
        "shadow-[0_18px_60px_rgba(0,0,0,0.16)]",
        className
      )}
      style={{
        background: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.35em]"
            style={{ color: "var(--theme-text-muted)" }}
          >
            calendar grid
          </p>
          <p
            className="text-sm"
            style={{
              color: "var(--theme-text-muted)",
              fontFamily: "var(--font-body)",
            }}
          >
            select start and end dates across the month.
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em]"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--theme-highlight)" }}
            />
            golden date
          </span>

          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em]"
            style={{ color: "var(--theme-text-muted)" }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--theme-accent)" }}
            />
            selection
          </span>
        </div>
      </div>

      <TooltipProvider delayDuration={140}>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="px-1 pb-2 text-center text-[10px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {label}
            </div>
          ))}

          {weeks.flatMap((week) =>
            week.days.map((day) => (
              <DayCell
                key={day.date.toISOString()}
                day={day}
                theme={activeTheme}
                onClick={handleDateClick}
                onHover={handleDateHover}
              />
            ))
          )}
        </div>
      </TooltipProvider>
    </section>
  );
}