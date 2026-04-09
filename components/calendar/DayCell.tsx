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
      initial={{ opacity: 0, y: 10, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.92 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute bottom-full left-1/2 z-50 pointer-events-none mb-2.5"
      style={{ transform: "translateX(-50%)", width: 240, minWidth: 200 }}
    >
      <div
        className="rounded-xl p-3.5 text-left"
        style={{
          background: theme.colors.paper,
          border: `1.5px solid ${theme.colors.border}`,
          boxShadow: `0 12px 40px ${theme.colors.shadow}, 0 4px 12px rgba(0,0,0,0.12)`,
        }}
      >
        <p
          className="text-[8px] font-bold uppercase tracking-widest mb-1.5"
          style={{
            color: theme.colors.gold,
            fontFamily: "'Josefin Sans', sans-serif",
            letterSpacing: "0.18em",
          }}
        >
          ✦ {filmRef}
        </p>
        <p
          className="text-[11px] leading-relaxed"
          style={{
            color: theme.colors.ink,
            fontFamily: "'Lora', Georgia, serif",
          }}
        >
          {fact}
        </p>
      </div>
      {/* Arrow */}
      <div
        className="w-2.5 h-2.5 mx-auto rotate-45 -mt-[5px]"
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

  const isStart    = selectionState === "start";
  const isEnd      = selectionState === "end";
  const isInRange  = selectionState === "in-range";
  const isSelected = isStart || isEnd;

  const handleEnter = useCallback(() => {
    onMouseEnter();
    if (isGoldenDate && goldenFact) {
      const t = setTimeout(() => setShowTip(true), 650);
      setTipTimer(t);
    }
  }, [onMouseEnter, isGoldenDate, goldenFact]);

  const handleLeave = useCallback(() => {
    onMouseLeave();
    setShowTip(false);
    if (tipTimer) clearTimeout(tipTimer);
  }, [onMouseLeave, tipTimer]);

  // Faded ghost for out-of-month days
  if (!isCurrentMonth) {
    return (
      <div className="relative h-full min-h-[42px] md:min-h-[52px] flex items-center justify-center">
        <span
          className="text-[11px] select-none"
          style={{
            color: theme.colors.borderLight,
            opacity: 0.35,
            fontFamily: "'Lora', Georgia, serif",
          }}
        >
          {dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[42px] md:min-h-[52px]">
      {/* Tooltip */}
      <AnimatePresence>
        {showTip && goldenFact && goldenFilmRef && (
          <DayTooltip fact={goldenFact} filmRef={goldenFilmRef} theme={theme} />
        )}
      </AnimatePresence>

      {/* Range fill background */}
      {isInRange && (
        <div
          className="absolute inset-y-1 inset-x-0"
          style={{ background: `${theme.colors.accentSoft}88` }}
        />
      )}
      {isStart && (
        <div
          className="absolute inset-y-1 right-0 left-1/2"
          style={{ background: `${theme.colors.accentSoft}70` }}
        />
      )}
      {isEnd && (
        <div
          className="absolute inset-y-1 left-0 right-1/2"
          style={{ background: `${theme.colors.accentSoft}70` }}
        />
      )}

      {/* Main day button */}
      <motion.button
        type="button"
        onClick={onClick}
        onContextMenu={onContextMenu}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 24 }}
        className="relative w-full h-full flex flex-col items-center justify-center rounded-full cursor-pointer select-none"
        style={{
          background: isSelected
            ? theme.colors.accent
            : "transparent",
          border: isToday && !isSelected
            ? `2px solid ${theme.colors.accent}`
            : "2px solid transparent",
          boxShadow: isSelected
            ? `0 4px 14px ${theme.colors.shadow}, 0 2px 6px ${theme.colors.accent}44`
            : "none",
          zIndex: isSelected ? 2 : 1,
          minHeight: "38px",
          minWidth: "38px",
        }}
      >
        {/* Today dot */}
        {isToday && !isSelected && (
          <div
            className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: theme.colors.accent }}
          />
        )}

        {/* Day number */}
        <span
          className="leading-none select-none"
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: "clamp(11px, 2.2vw, 16px)",
            fontWeight: isToday ? 700 : 400,
            color: isSelected
              ? theme.colors.headerText
              : isToday
              ? theme.colors.accent
              : isWeekend
              ? theme.colors.accent
              : theme.colors.ink,
          }}
        >
          {dayNumber}
        </span>

        {/* Golden star marker */}
        {isGoldenDate && (
          <motion.span
            className="absolute top-0 right-0.5 leading-none"
            animate={{
              rotate:  [0, 20, -15, 10, 0],
              scale:   [1, 1.35, 1.1, 1.2, 1],
              opacity: [0.9, 1, 0.85, 1, 0.9],
            }}
            transition={{
              duration:    4,
              repeat:      Infinity,
              repeatDelay: 2.5,
              ease:        "easeInOut",
            }}
            style={{
              fontSize: "7px",
              color: isSelected ? theme.colors.headerText : theme.colors.gold,
            }}
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