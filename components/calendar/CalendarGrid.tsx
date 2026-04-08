"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  selectDateSelectionState,
  useCalendarStore,
} from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import type { CalendarDay, CalendarWeek } from "@/types/calendar";
import type { MonthIndex } from "@/types/theme";
import type { FilmTheme } from "@/types/theme";

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

  for (let week = 0; week < 6; week++) {
    const days: CalendarDay[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellOffset = week * 7 + dayIndex;
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + cellOffset);
      const isCurrentMonth = date.getMonth() === monthIndex && date.getFullYear() === year;
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

// Single day cell
function DayCell({
  day,
  theme,
  onClick,
  onHover,
}: {
  day: CalendarDay;
  theme: FilmTheme;
  onClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isStart = day.selectionState === "start";
  const isEnd = day.selectionState === "end";
  const isInRange = day.selectionState === "in-range";
  const isSelected = isStart || isEnd;

  const bgColor = isSelected
    ? theme.colors.accent
    : isInRange
    ? `${theme.colors.accent}22`
    : "transparent";

  const textColor = isSelected
    ? theme.colors.bg
    : day.isCurrentMonth
    ? theme.colors.text
    : `${theme.colors.textMuted}44`;

  return (
    <div className="relative">
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && day.isGoldenDate && day.goldenFact && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none"
            style={{ width: "180px" }}
          >
            <div
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "8px",
                padding: "8px 10px",
                boxShadow: `0 8px 32px rgba(0,0,0,0.4)`,
              }}
            >
              <p
                className="text-[8px] tracking-[0.25em] uppercase mb-1 flex items-center gap-1"
                style={{ color: theme.colors.highlight }}
              >
                <span>✦</span>
                {day.goldenFilmRef}
              </p>
              <p
                className="text-[10px] leading-relaxed"
                style={{ color: theme.colors.text }}
              >
                {day.goldenFact}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regular day tooltip */}
      <AnimatePresence>
        {showTooltip && !day.isGoldenDate && day.isCurrentMonth && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.1 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 pointer-events-none"
          >
            <div
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: "4px",
                padding: "3px 8px",
                fontSize: "9px",
                whiteSpace: "nowrap",
                color: theme.colors.textMuted,
              }}
            >
              {day.date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        disabled={!day.isCurrentMonth}
        onClick={() => day.isCurrentMonth && onClick(day.date)}
        onMouseEnter={() => {
          if (day.isCurrentMonth) {
            onHover(day.date);
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          onHover(null);
          setShowTooltip(false);
        }}
        whileHover={day.isCurrentMonth ? { scale: 1.08 } : undefined}
        whileTap={day.isCurrentMonth ? { scale: 0.95 } : undefined}
        className="relative w-full flex flex-col items-center justify-center"
        style={{
          aspectRatio: "1",
          borderRadius: "8px",
          backgroundColor: bgColor,
          cursor: day.isCurrentMonth ? "pointer" : "default",
          transition: "background-color 0.15s ease",
          border: day.isToday && !isSelected
            ? `1.5px solid ${theme.colors.highlight}`
            : isStart || isEnd
            ? "none"
            : `1px solid transparent`,
          boxShadow: isSelected
            ? `0 4px 16px ${theme.colors.accent}44`
            : day.isToday
            ? `0 0 12px ${theme.colors.highlight}33`
            : "none",
        }}
      >
        {/* In-range highlight fill */}
        {isInRange && (
          <div
            className="absolute inset-0 rounded-lg"
            style={{ backgroundColor: `${theme.colors.accent}15` }}
          />
        )}

        {/* Day number */}
        <span
          className="relative text-sm md:text-base font-medium leading-none"
          style={{
            fontFamily: "var(--font-display)",
            color: textColor,
            transition: "color 0.3s ease",
            opacity: day.isCurrentMonth ? 1 : 0.25,
          }}
        >
          {day.dayNumber}
        </span>

        {/* Golden date marker */}
        {day.isGoldenDate && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0.5 right-0.5 text-[6px]"
            style={{ color: theme.colors.highlight }}
          >
            ✦
          </motion.span>
        )}

        {/* Today dot */}
        {day.isToday && !isSelected && (
          <div
            className="absolute bottom-0.5"
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              backgroundColor: theme.colors.highlight,
            }}
          />
        )}

        {/* Weekend indicator */}
        {day.isWeekend && day.isCurrentMonth && !isSelected && (
          <div
            className="absolute bottom-0.5"
            style={{
              width: "3px",
              height: "3px",
              borderRadius: "50%",
              backgroundColor: `${theme.colors.accent}66`,
              display: day.isToday ? "none" : "block",
            }}
          />
        )}
      </motion.button>
    </div>
  );
}

export function CalendarGrid({ className = "" }: { className?: string }) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const handleDateClick = useCalendarStore((s) => s.handleDateClick);
  const handleDateHover = useCalendarStore((s) => s.handleDateHover);
  const previewRange = useCalendarStore((s) => s.getPreviewRange());
  const selectionPhase = useCalendarStore((s) => s.selectionPhase);
  const activeTheme = useThemeStore((s) => s.activeTheme);

  const goldenDays = useMemo(
    () => new Set(activeTheme.goldenDates.map((g) => g.day)),
    [activeTheme.goldenDates]
  );

  const goldenLookup = useMemo(
    () => new Map(activeTheme.goldenDates.map((g) => [g.day, { fact: g.fact, filmReference: g.filmReference }])),
    [activeTheme.goldenDates]
  );

  const weeks = useMemo(
    () => buildWeeks(activeMonthIndex, activeYear, previewRange, goldenDays, goldenLookup),
    [activeMonthIndex, activeYear, previewRange, goldenDays, goldenLookup]
  );

  return (
    <motion.section
      key={activeMonthIndex}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: "16px",
        border: `1px solid ${activeTheme.colors.border}`,
        backgroundColor: activeTheme.colors.surface,
        padding: "16px",
        transition: "border-color 0.8s ease, background-color 0.8s ease",
      }}
    >
      {/* Phase indicator */}
      {selectionPhase === "selecting-end" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-3"
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: activeTheme.colors.accent,
              animation: "pulse 1s ease-in-out infinite",
            }}
          />
          <span
            className="text-[9px] tracking-[0.25em] uppercase"
            style={{ color: activeTheme.colors.textMuted }}
          >
            now select end date
          </span>
        </motion.div>
      )}

      {/* Weekday headers */}
      <div
        className="grid grid-cols-7 mb-2"
        style={{ gap: "4px" }}
      >
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-[9px] font-semibold uppercase tracking-[0.25em] py-1.5"
            style={{ color: activeTheme.colors.textMuted }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div
        className="grid grid-cols-7"
        style={{ gap: "4px" }}
      >
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

      {/* Legend */}
      <div
        className="flex items-center gap-4 mt-3 pt-3 flex-wrap"
        style={{ borderTop: `1px solid ${activeTheme.colors.border}`, transition: "border-color 0.8s ease" }}
      >
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "3px",
              backgroundColor: activeTheme.colors.accent,
            }}
          />
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: activeTheme.colors.textMuted }}>
            Selected
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "3px",
              border: `1.5px solid ${activeTheme.colors.highlight}`,
            }}
          />
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: activeTheme.colors.textMuted }}>
            Today
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span style={{ fontSize: "8px", color: activeTheme.colors.highlight }}>✦</span>
          <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: activeTheme.colors.textMuted }}>
            Golden date · hover for trivia
          </span>
        </div>
      </div>
    </motion.section>
  );
}