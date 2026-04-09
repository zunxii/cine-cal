"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";

interface DayTooltipProps {
  fact: string;
  filmRef: string;
  theme: FilmTheme;
}

function DayTooltip({ fact, filmRef, theme }: DayTooltipProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute bottom-full left-1/2 z-50 pointer-events-none mb-2"
      style={{ transform: "translateX(-50%)", width: 220 }}
    >
      <div
        className="rounded-xl p-3 shadow-2xl text-left"
        style={{
          background: theme.colors.paper,
          border: `1.5px solid ${theme.colors.border}`,
          boxShadow: `0 8px 32px ${theme.colors.shadow}`,
        }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: theme.colors.gold }}>
          ✦ {filmRef}
        </p>
        <p className="text-[11px] leading-relaxed" style={{ color: theme.colors.ink }}>
          {fact}
        </p>
      </div>
      <div
        className="w-2 h-2 mx-auto rotate-45 -mt-1"
        style={{ background: theme.colors.border }}
      />
    </motion.div>
  );
}

interface DayCellProps {
  dayNumber: number;
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  selectionState: "none" | "start" | "end" | "in-range";
  isGoldenDate: boolean;
  goldenFact?: string;
  goldenFilmRef?: string;
  isMarked: boolean;
  theme: FilmTheme;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DayCell({
  dayNumber,
  isCurrentMonth,
  isToday,
  isWeekend,
  selectionState,
  isGoldenDate,
  goldenFact,
  goldenFilmRef,
  isMarked,
  theme,
  onClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
}: DayCellProps) {
  const [showTip, setShowTip] = useState(false);
  const [tipTimer, setTipTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const isStart = selectionState === "start";
  const isEnd = selectionState === "end";
  const isInRange = selectionState === "in-range";
  const isSelected = isStart || isEnd;

  const handleEnter = useCallback(() => {
    onMouseEnter();
    if (isGoldenDate && goldenFact) {
      const t = setTimeout(() => setShowTip(true), 700);
      setTipTimer(t);
    }
  }, [onMouseEnter, isGoldenDate, goldenFact]);

  const handleLeave = useCallback(() => {
    onMouseLeave();
    setShowTip(false);
    if (tipTimer) clearTimeout(tipTimer);
  }, [onMouseLeave, tipTimer]);

  if (!isCurrentMonth) {
    return (
      <div className="relative h-full min-h-[40px] md:min-h-[50px] flex items-center justify-center">
        <span
          className="text-[11px] select-none"
          style={{ color: theme.colors.borderLight, opacity: 0.4 }}
        >
          {dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[40px] md:min-h-[50px]">
      <AnimatePresence>
        {showTip && goldenFact && goldenFilmRef && (
          <DayTooltip fact={goldenFact} filmRef={goldenFilmRef} theme={theme} />
        )}
      </AnimatePresence>

      {/* Range fill */}
      {isInRange && (
        <div
          className="absolute inset-y-1 inset-x-0 rounded-none"
          style={{ background: theme.colors.accentSoft, opacity: 0.5 }}
        />
      )}

      {/* Start cap */}
      {isStart && (
        <div
          className="absolute inset-y-1 right-0 left-1/2"
          style={{ background: theme.colors.accentSoft, opacity: 0.4 }}
        />
      )}

      {/* End cap */}
      {isEnd && (
        <div
          className="absolute inset-y-1 left-0 right-1/2"
          style={{ background: theme.colors.accentSoft, opacity: 0.4 }}
        />
      )}

      <motion.button
        type="button"
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 450, damping: 22 }}
        className="relative w-full h-full flex flex-col items-center justify-center rounded-full cursor-pointer select-none"
        style={{
          background: isSelected ? theme.colors.accent : "transparent",
          border: isToday && !isSelected
            ? `2px solid ${theme.colors.accent}`
            : "2px solid transparent",
          boxShadow: isSelected
            ? `0 3px 12px ${theme.colors.shadow}, 0 1px 6px ${theme.colors.accent}50`
            : "none",
          zIndex: isSelected ? 2 : 1,
          minHeight: "36px",
          minWidth: "36px",
        }}
      >
        {/* Today dot indicator */}
        {isToday && !isSelected && (
          <div
            className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: theme.colors.accent }}
          />
        )}

        {/* Day number */}
        <span
          className="text-[11px] md:text-sm font-semibold leading-none select-none"
          style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: isSelected
              ? theme.colors.headerText
              : isToday
              ? theme.colors.accent
              : isWeekend
              ? theme.colors.accent
              : theme.colors.ink,
            fontWeight: isToday ? 700 : 500,
          }}
        >
          {dayNumber}
        </span>

        {/* Golden star */}
        {isGoldenDate && (
          <motion.span
            className="absolute top-0.5 right-0.5 text-[7px] leading-none"
            animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            style={{ color: isSelected ? theme.colors.headerText : theme.colors.gold }}
          >
            ✦
          </motion.span>
        )}

        {/* Marked dot */}
        {isMarked && !isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-0.5 w-1 h-1 rounded-full"
            style={{ background: theme.colors.accent }}
          />
        )}
      </motion.button>
    </div>
  );
}