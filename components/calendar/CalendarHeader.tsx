"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function CalendarHeader({ className = "" }: { className?: string }) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const selectedRange = useCalendarStore((s) => s.selectedRange);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const syncThemeToMonth = useThemeStore((s) => s.syncThemeToMonth);

  const [direction, setDirection] = useState(1);
  const [displayMonth, setDisplayMonth] = useState(activeMonthIndex);
  const prevMonth = useRef(activeMonthIndex);

  useEffect(() => {
    syncThemeToMonth(activeMonthIndex);
    const d = activeMonthIndex > prevMonth.current ? 1 : -1;
    setDirection(d);
    setDisplayMonth(activeMonthIndex);
    prevMonth.current = activeMonthIndex;
  }, [activeMonthIndex, syncThemeToMonth]);

  const selectionLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    const fmt = new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" });
    return `${fmt.format(start)} — ${fmt.format(end)}`;
  }, [selectedRange]);

  const handleNext = () => {
    setDirection(1);
    goToNextMonth();
  };

  const handlePrev = () => {
    setDirection(-1);
    goToPrevMonth();
  };

  return (
    <header className={`relative flex items-center justify-between gap-4 px-1 ${className}`}>
      {/* Left: Film info */}
      <div className="flex items-center gap-4 min-w-0">
        {/* Reel icon */}
        <div
          className="hidden md:flex items-center justify-center flex-shrink-0"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: `1.5px solid ${activeTheme.colors.border}`,
            position: "relative",
            transition: "border-color 0.8s ease",
          }}
        >
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: activeTheme.colors.accent,
            transition: "background-color 0.8s ease",
          }} />
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <div
              key={deg}
              style={{
                position: "absolute",
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: activeTheme.colors.textMuted,
                transform: `rotate(${deg}deg) translateY(-11px)`,
                transition: "background-color 0.8s ease",
              }}
            />
          ))}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-bold tracking-[0.3em] uppercase"
              style={{ color: activeTheme.colors.textMuted, transition: "color 0.8s ease" }}
            >
              CineCalendar
            </span>
            <span style={{ color: activeTheme.colors.border }}>·</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={activeTheme.filmTitle}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] tracking-[0.2em] uppercase truncate max-w-[160px] md:max-w-[280px]"
                style={{ color: activeTheme.colors.highlight, transition: "color 0.8s ease" }}
              >
                {activeTheme.filmTitle}
              </motion.span>
            </AnimatePresence>
          </div>

          {selectionLabel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 mt-0.5"
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: activeTheme.colors.accent,
                  flexShrink: 0,
                }}
              />
              <span
                className="text-[10px] tracking-[0.15em]"
                style={{ color: activeTheme.colors.textMuted }}
              >
                {selectionLabel}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Center: Animated month name */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none select-none hidden md:block">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeMonthIndex}
              custom={direction}
              initial={{ y: direction > 0 ? 40 : -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: direction > 0 ? -40 : 40, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <h1
                className="text-2xl md:text-3xl leading-none tracking-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  color: activeTheme.colors.text,
                  transition: "color 0.8s ease",
                  letterSpacing: "-0.02em",
                }}
              >
                {MONTH_NAMES[displayMonth]}
              </h1>
              <p
                className="text-[10px] tracking-[0.3em] uppercase mt-0.5"
                style={{ color: activeTheme.colors.textMuted }}
              >
                {activeYear} · {activeTheme.director}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-1.5">
        {/* Golden dates count */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full mr-2"
          style={{
            border: `1px solid ${activeTheme.colors.border}`,
            transition: "border-color 0.8s ease",
          }}
        >
          <span style={{
            fontSize: "8px",
            color: activeTheme.colors.highlight,
          }}>✦</span>
          <span
            className="text-[10px] tracking-[0.2em] uppercase"
            style={{ color: activeTheme.colors.textMuted }}
          >
            {activeTheme.goldenDates.length} golden
          </span>
        </div>

        <button
          onClick={handlePrev}
          className="group flex items-center justify-center transition-all duration-200"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `1px solid ${activeTheme.colors.border}`,
            backgroundColor: "transparent",
            color: activeTheme.colors.textMuted,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = activeTheme.colors.surface;
            (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.textMuted;
          }}
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          onClick={handleNext}
          className="group flex items-center justify-center transition-all duration-200"
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: `1px solid ${activeTheme.colors.border}`,
            backgroundColor: "transparent",
            color: activeTheme.colors.textMuted,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = activeTheme.colors.surface;
            (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.text;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.textMuted;
          }}
          aria-label="Next month"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </header>
  );
}