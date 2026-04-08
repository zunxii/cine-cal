"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { CalendarDay } from "@/types/calendar";
import type { FilmTheme } from "@/types/theme";
import { cn } from "@/lib/utils";

interface DayCellProps {
  day: CalendarDay;
  theme: FilmTheme;
  onClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
}

function formatReadableDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function DayCell({ day, theme, onClick, onHover }: DayCellProps) {
  const isStart = day.selectionState === "start";
  const isEnd = day.selectionState === "end";
  const isInRange = day.selectionState === "in-range";

  return (
    <Tooltip delayDuration={120}>
      <TooltipTrigger asChild>
        <motion.button
          type="button"
          whileHover={day.isCurrentMonth ? { y: -1, scale: 1.01 } : undefined}
          whileTap={day.isCurrentMonth ? { scale: 0.98 } : undefined}
          onMouseEnter={() => onHover(day.date)}
          onFocus={() => onHover(day.date)}
          onMouseLeave={() => onHover(null)}
          onBlur={() => onHover(null)}
          onClick={() => onClick(day.date)}
          disabled={!day.isCurrentMonth}
          aria-label={formatReadableDate(day.date)}
          className={cn(
            "group relative flex min-h-[4.9rem] flex-col justify-between overflow-hidden border p-2.5 text-left transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            !day.isCurrentMonth && "cursor-default opacity-45",
            day.isCurrentMonth && "hover:z-10 hover:shadow-lg"
          )}
          style={{
            background: isStart || isEnd
              ? "var(--theme-accent)"
              : "color-mix(in srgb, var(--theme-surface) 84%, transparent)",
            borderColor: isStart || isEnd ? "var(--theme-accent)" : "var(--theme-border)",
            color: isStart || isEnd ? "var(--theme-bg)" : "var(--theme-text)",
            boxShadow:
              day.isToday && !isStart && !isEnd
                ? "0 0 0 1px var(--theme-highlight), 0 0 18px color-mix(in srgb, var(--theme-highlight) 40%, transparent)"
                : undefined,
          }}
        >
          {isInRange && (
            <span
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--theme-accentAlt) 22%, transparent), transparent)",
              }}
            />
          )}

          <div className="relative flex items-start justify-between gap-2">
            <span
              className="text-[0.72rem] font-medium uppercase tracking-[0.18em] opacity-80"
            >
              {day.date.toLocaleDateString("en-IN", { weekday: "short" })}
            </span>

            {day.isGoldenDate && (
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black"
                style={{
                  background: "var(--theme-highlight)",
                  color: "var(--theme-bg)",
                }}
              >
                ✦
              </span>
            )}
          </div>

          <div className="relative flex items-end justify-between gap-2">
            <span
              className="text-2xl font-semibold leading-none tracking-tight md:text-[1.55rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {day.dayNumber}
            </span>

            {day.isWeekend && (
              <span
                className="mb-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.25em]"
                style={{
                  borderColor: "var(--theme-border)",
                  color: "var(--theme-text-muted)",
                  background: "color-mix(in srgb, var(--theme-bg) 15%, transparent)",
                }}
              >
                wknd
              </span>
            )}
          </div>

          <p
            className="relative text-[11px] leading-relaxed"
            style={{
              color:
                isStart || isEnd
                  ? "color-mix(in srgb, var(--theme-bg) 75%, black)"
                  : "var(--theme-text-muted)",
            }}
          >
            {day.isGoldenDate ? "golden day" : "calendar day"}
          </p>
        </motion.button>
      </TooltipTrigger>

      <TooltipContent
        side="top"
        align="center"
        className="z-50 max-w-[19rem] rounded-[1.25rem] border p-0 shadow-2xl"
        style={{
          background: "var(--theme-surface)",
          borderColor: "var(--theme-border)",
          color: "var(--theme-text)",
        }}
      >
        {day.isGoldenDate ? (
          <div className="overflow-hidden rounded-[1.25rem]">
            <div
              className="h-2"
              style={{ background: "var(--theme-highlight)" }}
            />
            <div className="space-y-3 p-4">
              <div className="flex items-start gap-3">
                <div
                  className="h-14 w-12 shrink-0 rounded-xl border"
                  style={{
                    background: theme.heroGradient,
                    borderColor: "color-mix(in srgb, var(--theme-border) 62%, white)",
                  }}
                />
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: "var(--theme-text-muted)" }}
                  >
                    ✦ {day.goldenFilmRef}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed">
                    {day.goldenFact}
                  </p>
                </div>
              </div>

              <p
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {formatReadableDate(day.date)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 px-4 py-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              {formatReadableDate(day.date)}
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--theme-text)" }}>
              Date cell in the wall calendar.
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}