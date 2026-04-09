"use client";

import { useMemo} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { DayCell } from "./DayCell";
import { WEEKDAY_LABELS } from "@/lib/calendarUtils";
import { selectDateSelectionState } from "@/store/calendarStore";
import type { FilmTheme } from "@/types/theme";
import type { DateRange } from "@/types/calendar";

interface CalendarGridProps {
  theme: FilmTheme;
  monthIndex: number;
  year: number;
  weeks: Array<Array<{
    date: Date;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    selectionState: "none" | "start" | "end" | "in-range";
    isGoldenDate: boolean;
    goldenFact?: string;
    goldenFilmRef?: string;
    isMarked?: boolean;
  }>>;
  previewRange: DateRange;
  selectedRange: DateRange;
  selectionPhase: "idle" | "selecting-end";
  markedDates: number[];
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  onContextMenu: (e: React.MouseEvent, date: Date, dayNumber: number) => void;
  onClearSelection: () => void;
}

export function CalendarGrid({
  theme,
  weeks,
  previewRange,
  selectedRange,
  selectionPhase,
  markedDates,
  onDateClick,
  onDateHover,
  onContextMenu,
  onClearSelection,
}: CalendarGridProps) {
  const selectionLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(start)} — ${fmt(end)}`;
  }, [selectedRange]);

  const computedWeeks = useMemo(() => {
    return weeks.map((week) =>
      week.map((day) => ({
        ...day,
        selectionState: selectDateSelectionState(day.date, previewRange),
      }))
    );
  }, [weeks, previewRange]);

  return (
    <div className="p-4 md:p-5 flex-1">
      {/* Selection hint bar */}
      <AnimatePresence>
        {(selectionPhase === "selecting-end" || selectionLabel) && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="flex items-center justify-between rounded-lg px-3 py-1.5 overflow-hidden"
            style={{
              background: theme.colors.accentSoft,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <div className="flex items-center gap-2">
              {selectionPhase === "selecting-end" && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.0, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: theme.colors.accent }}
                />
              )}
              <span
                className="text-[10px] uppercase tracking-widest font-bold"
                style={{ color: theme.colors.accent }}
              >
                {selectionPhase === "selecting-end"
                  ? "Pick an end date"
                  : `✦ ${selectionLabel}`}
              </span>
            </div>
            <button
              onClick={onClearSelection}
              className="rounded-full p-0.5 transition-opacity hover:opacity-70"
              style={{ color: theme.colors.inkLight }}
            >
              <X size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className="text-center py-1.5 text-[9px] font-bold uppercase tracking-[0.2em]"
            style={{
              color: i === 0 || i === 6 ? theme.colors.accent : theme.colors.inkLight,
            }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mb-2" style={{ borderTop: `1px solid ${theme.colors.borderLight}` }} />

      {/* Calendar grid */}
      <div className="flex flex-col gap-[2px]">
        {computedWeeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-[2px]">
            {week.map((day, di) => (
              <DayCell
                key={`${wi}-${di}`}
                {...day}
                isMarked={day.isCurrentMonth && markedDates.includes(day.dayNumber)}
                theme={theme}
                onClick={() => {
                  if (day.isCurrentMonth) onDateClick(day.date);
                }}
                onContextMenu={(e) => {
                  if (day.isCurrentMonth) onContextMenu(e, day.date, day.dayNumber);
                }}
                onMouseEnter={() => {
                  if (day.isCurrentMonth) onDateHover(day.date);
                }}
                onMouseLeave={() => onDateHover(null)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex flex-wrap items-center gap-3 mt-4 pt-3"
        style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }}
      >
        {[
          { label: "Selected", fill: true, ring: false },
          { label: "Today", fill: false, ring: true },
          { label: "✦ Film trivia", fill: false, ring: false, gold: true },
          { label: "Marked", fill: false, ring: false, dot: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {item.dot ? (
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors.accent }} />
            ) : (
              <div
                className="w-3 h-3 rounded"
                style={{
                  background: item.fill ? theme.colors.accent : "transparent",
                  border: item.ring
                    ? `2px solid ${theme.colors.accent}`
                    : item.fill
                    ? "none"
                    : `1.5px solid ${item.gold ? theme.colors.gold : theme.colors.accent}`,
                }}
              />
            )}
            <span
              className="text-[9px] uppercase tracking-[0.15em]"
              style={{ color: theme.colors.inkLight }}
            >
              {item.label}
            </span>
          </div>
        ))}
        <span
          className="text-[8px] ml-auto hidden md:block"
          style={{ color: `${theme.colors.inkLight}70` }}
        >
          Right-click to mark · hover ✦ for trivia
        </span>
      </div>
    </div>
  );
}