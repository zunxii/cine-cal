"use client";

import { useEffect, useMemo } from "react";

import { MonthNavigator } from "./MonthNavigator";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

interface CalendarHeaderProps {
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export function CalendarHeader({ className }: CalendarHeaderProps) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const selectedRange = useCalendarStore((s) => s.selectedRange);

  const activeTheme = useThemeStore((s) => s.activeTheme);
  const syncThemeToMonth = useThemeStore((s) => s.syncThemeToMonth);

  useEffect(() => {
    syncThemeToMonth(activeMonthIndex);
  }, [activeMonthIndex, syncThemeToMonth]);

  const monthLabel = MONTH_NAMES[activeMonthIndex];
  const selectionLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return "no scene selected";

    const fmt = new Intl.DateTimeFormat("en-IN", {
      month: "short",
      day: "numeric",
    });

    return `${fmt.format(start)} → ${fmt.format(end)}`;
  }, [selectedRange]);

  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[2rem] border px-5 py-5 md:px-7 md:py-6",
        "shadow-[0_18px_60px_rgba(0,0,0,0.22)]",
        className
      )}
      style={{
        background: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent 38%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--theme-accent), transparent)",
        }}
      />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.45em]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              CineCalendar
            </span>

            <span
              className="rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.28em]"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-muted)",
              }}
            >
              {activeTheme.filmTitle}
            </span>
          </div>

          <div className="space-y-2">
            <h1
              className="text-4xl leading-none md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--theme-text)",
              }}
            >
              {monthLabel}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base">
              <p
                className="font-medium"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {activeTheme.director} · {activeYear}
              </p>

              <span
                className="h-1 w-1 rounded-full"
                style={{ background: "var(--theme-highlight)" }}
              />

              <p
                className="max-w-xl italic"
                style={{
                  color: "var(--theme-text)",
                  fontFamily: "var(--font-notes)",
                }}
              >
                “{activeTheme.tagline}”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] uppercase tracking-[0.28em]">
            <span
              className="rounded-full border px-3 py-1"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-muted)",
              }}
            >
              {activeTheme.goldenDates.length} golden dates
            </span>
            <span
              className="rounded-full border px-3 py-1"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text-muted)",
              }}
            >
              hover reveals trivia
            </span>
          </div>

          <div
            className="max-w-2xl rounded-2xl border px-4 py-3 text-sm leading-relaxed"
            style={{
              background:
                "color-mix(in srgb, var(--theme-bg) 22%, transparent)",
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-muted)",
            }}
          >
            Scene log: <span style={{ color: "var(--theme-text)" }}>{selectionLabel}</span>
          </div>
        </div>

        <MonthNavigator />
      </div>
    </header>
  );
}