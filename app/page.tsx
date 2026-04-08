"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Pencil, Star, Trash2, CheckCircle } from "lucide-react";
import { useCalendarStore, selectDateSelectionState } from "@/store/calendarStore";
import { getThemeByMonth } from "../data/theme";
import type { FilmTheme, MonthIndex } from "@/types/theme";
import type { CalendarDay } from "@/types/calendar";

// ─── Constants ────────────────────────────────────────────────────────────────
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// ─── Date Helpers ─────────────────────────────────────────────────────────────
function isToday(date: Date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

function buildCalendarDays(monthIndex: number, year: number): CalendarDay[][] {
  const firstDay = new Date(year, monthIndex, 1);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(year, monthIndex, 1 - startOffset, 12);
  const weeks: CalendarDay[][] = [];

  for (let w = 0; w < 6; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + w * 7 + d);
      week.push({
        date: cellDate,
        dayNumber: cellDate.getDate(),
        isCurrentMonth: cellDate.getMonth() === monthIndex,
        isToday: isToday(cellDate),
        isWeekend: cellDate.getDay() === 0 || cellDate.getDay() === 6,
        selectionState: "none",
        isGoldenDate: false,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// ─── CSS injection ─────────────────────────────────────────────────────────────
function injectTheme(theme: FilmTheme) {
  if (typeof document === "undefined") return;
  const r = document.documentElement;
  const c = theme.colors;
  r.style.setProperty("--paper", c.paper);
  r.style.setProperty("--paper-alt", c.paperAlt);
  r.style.setProperty("--ink", c.ink);
  r.style.setProperty("--ink-light", c.inkLight);
  r.style.setProperty("--accent", c.accent);
  r.style.setProperty("--accent-soft", c.accentSoft);
  r.style.setProperty("--accent-dark", c.accentDark);
  r.style.setProperty("--border", c.border);
  r.style.setProperty("--border-light", c.borderLight);
  r.style.setProperty("--gold", c.gold);
  r.style.setProperty("--shadow", c.shadow);
  r.style.setProperty("--header-bg", c.headerBg);
  r.style.setProperty("--header-text", c.headerText);
}

// ─── Day Tooltip ─────────────────────────────────────────────────────────────
function DayTooltip({ day, theme }: { day: CalendarDay; theme: FilmTheme }) {
  if (!day.isGoldenDate || !day.goldenFact) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute bottom-full left-1/2 z-50 pointer-events-none mb-2"
      style={{ transform: "translateX(-50%)", width: 220 }}
    >
      <div
        className="rounded-xl p-3 shadow-xl text-left"
        style={{
          background: theme.colors.paper,
          border: `1.5px solid ${theme.colors.border}`,
          boxShadow: `0 8px 32px ${theme.colors.shadow}`,
        }}
      >
        <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: theme.colors.gold }}>
          ✦ {day.goldenFilmRef}
        </p>
        <p className="text-[11px] leading-relaxed" style={{ color: theme.colors.ink }}>
          {day.goldenFact}
        </p>
      </div>
      <div
        className="w-2 h-2 mx-auto rotate-45 -mt-1"
        style={{ background: theme.colors.border }}
      />
    </motion.div>
  );
}

// ─── Single Day Cell ──────────────────────────────────────────────────────────
function DayCell({
  day, theme, onHover, onLeave, onClick, onRightClick, isMarked
}: {
  day: CalendarDay;
  theme: FilmTheme;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
  isMarked: boolean;
}) {
  const [showTip, setShowTip] = useState(false);
  const [tipTimeout, setTipTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const isStart = day.selectionState === "start";
  const isEnd = day.selectionState === "end";
  const isInRange = day.selectionState === "in-range";
  const isSelected = isStart || isEnd;

  const handleEnter = () => {
    onHover();
    if (day.isGoldenDate) {
      const t = setTimeout(() => setShowTip(true), 600);
      setTipTimeout(t);
    }
  };

  const handleLeave = () => {
    onLeave();
    setShowTip(false);
    if (tipTimeout) clearTimeout(tipTimeout);
  };

  if (!day.isCurrentMonth) {
    return (
      <div className="relative h-full min-h-[44px] md:min-h-[54px] flex items-center justify-center">
        <span className="text-sm select-none" style={{ color: theme.colors.borderLight, opacity: 0.5 }}>
          {day.dayNumber}
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[44px] md:min-h-[54px]">
      <AnimatePresence>{showTip && <DayTooltip day={day} theme={theme} />}</AnimatePresence>

      {/* Range fill background */}
      {isInRange && (
        <div
          className="absolute inset-y-1 inset-x-0"
          style={{ background: theme.colors.accentSoft, opacity: 0.6 }}
        />
      )}

      <motion.button
        type="button"
        onClick={onClick}
        onContextMenu={onRightClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        whileHover={{ scale: 1.12, zIndex: 10 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative w-full h-full flex flex-col items-center justify-center rounded-lg group"
        style={{
          background: isSelected
            ? theme.colors.accent
            : "transparent",
          border: day.isToday && !isSelected
            ? `2px solid ${theme.colors.accent}`
            : "2px solid transparent",
          boxShadow: isSelected
            ? `0 4px 16px ${theme.colors.shadow}, 0 2px 8px ${theme.colors.accent}40`
            : "none",
          zIndex: isSelected ? 2 : 1,
          cursor: "pointer",
          transition: "background 0.15s ease",
        }}
      >
        {/* Day number */}
        <span
          className="text-sm md:text-base font-semibold leading-none select-none"
          style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            color: isSelected
              ? theme.colors.headerText
              : day.isWeekend
              ? theme.colors.accent
              : theme.colors.ink,
            fontWeight: day.isToday ? 700 : 500,
          }}
        >
          {day.dayNumber}
        </span>

        {/* Golden date star */}
        {day.isGoldenDate && (
          <motion.div
            className="absolute top-0.5 right-0.5 text-[7px]"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            style={{ color: isSelected ? theme.colors.headerText : theme.colors.gold }}
          >
            ✦
          </motion.div>
        )}

        {/* Marked dot */}
        {isMarked && !isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
            style={{ background: theme.colors.accent }}
          />
        )}

        {/* Today indicator dot */}
        {day.isToday && !isSelected && !isMarked && (
          <div
            className="absolute bottom-1 w-1.5 h-1.5 rounded-full"
            style={{ background: theme.colors.accent, opacity: 0.8 }}
          />
        )}
      </motion.button>
    </div>
  );
}

// ─── Notes Panel ──────────────────────────────────────────────────────────────
function NotesPanel({
  theme, monthIndex, year, isOpen, onClose
}: {
  theme: FilmTheme;
  monthIndex: MonthIndex;
  year: number;
  isOpen: boolean;
  onClose: () => void;
}) {
  const note = useCalendarStore((s) => s.getNote(monthIndex, year));
  const updateNote = useCalendarStore((s) => s.updateNote);
  const clearNote = useCalendarStore((s) => s.clearNote);
  const selectedRange = useCalendarStore((s) => s.selectedRange);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const rangeLabel = useMemo(() => {
    if (!selectedRange.start || !selectedRange.end) return note?.rangeLabel ?? null;
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(selectedRange.start)} → ${fmt(selectedRange.end)}`;
  }, [selectedRange, note?.rangeLabel]);

  useEffect(() => {
    if (isOpen && textRef.current) textRef.current.focus();
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)" }}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-xs md:max-w-sm flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            style={{
              background: theme.colors.paperAlt,
              borderLeft: `2px solid ${theme.colors.border}`,
              boxShadow: `-8px 0 40px ${theme.colors.shadow}`,
            }}
          >
            {/* Header */}
            <div className="p-5 pb-3" style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.colors.inkLight }}>
                    Director's Notebook
                  </p>
                  <h3
                    className="text-xl mt-0.5 leading-tight"
                    style={{ fontFamily: "'Crimson Text', Georgia, serif", color: theme.colors.ink, fontWeight: 600 }}
                  >
                    {MONTH_NAMES[monthIndex]} {year}
                  </h3>
                  {rangeLabel && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] mt-1 flex items-center gap-1"
                      style={{ color: theme.colors.accent }}
                    >
                      <span>✦</span> {rangeLabel}
                    </motion.p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 hover:bg-black/5 transition-colors mt-0.5"
                  style={{ color: theme.colors.inkLight }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Featured film quote */}
            <div className="px-5 py-3" style={{ borderBottom: `1px dashed ${theme.colors.borderLight}` }}>
              <p className="text-[10px] italic leading-relaxed" style={{ color: theme.colors.inkLight, fontFamily: "'Crimson Text', Georgia, serif" }}>
                "{theme.quote}"
              </p>
              <p className="text-[9px] mt-1 uppercase tracking-widest font-semibold" style={{ color: theme.colors.accent }}>
                — {theme.shortTitle}
              </p>
            </div>

            {/* Lined paper textarea */}
            <div className="flex-1 relative overflow-hidden">
              {/* Lined paper lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 31px, ${theme.colors.borderLight} 31px, ${theme.colors.borderLight} 32px)`,
                  backgroundPositionY: "8px",
                  opacity: 0.6,
                }}
              />
              {/* Red margin line */}
              <div
                className="absolute top-0 bottom-0 left-10 w-px"
                style={{ background: `${theme.colors.accent}30` }}
              />

              {!note?.content && (
                <p
                  className="absolute top-4 left-12 text-sm pointer-events-none italic"
                  style={{ color: `${theme.colors.inkLight}60`, fontFamily: "'Kalam', cursive" }}
                >
                  Write your scene log...
                </p>
              )}

              <textarea
                ref={textRef}
                value={note?.content ?? ""}
                onChange={(e) => updateNote(monthIndex, year, e.target.value)}
                className="absolute inset-0 w-full h-full resize-none bg-transparent border-none outline-none pl-12 pr-4 py-4 text-sm leading-8"
                style={{
                  color: theme.colors.ink,
                  fontFamily: "'Kalam', cursive",
                  caretColor: theme.colors.accent,
                  lineHeight: "32px",
                }}
              />
            </div>

            {/* Footer */}
            <div
              className="p-4 flex items-center justify-between"
              style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
            >
              <span className="text-[9px] uppercase tracking-widest" style={{ color: theme.colors.borderLight }}>
                autosaved · local
              </span>
              {note?.content && (
                <button
                  onClick={() => clearNote(monthIndex, year)}
                  className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full hover:bg-black/5 transition-colors"
                  style={{ color: theme.colors.inkLight }}
                >
                  <Trash2 size={10} /> Clear
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Date Context Menu ────────────────────────────────────────────────────────
function DateMenu({
  day, theme, pos, onMark, onNote, onClose, isMarked
}: {
  day: CalendarDay;
  theme: FilmTheme;
  pos: { x: number; y: number };
  onMark: () => void;
  onNote: () => void;
  onClose: () => void;
  isMarked: boolean;
}) {
  return (
    <motion.div
      className="fixed z-[60] rounded-xl shadow-2xl overflow-hidden"
      style={{
        left: Math.min(pos.x, window.innerWidth - 200),
        top: Math.min(pos.y, window.innerHeight - 120),
        background: theme.colors.paper,
        border: `1.5px solid ${theme.colors.border}`,
        boxShadow: `0 12px 40px ${theme.colors.shadow}`,
        minWidth: 180,
      }}
      initial={{ opacity: 0, scale: 0.85, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -4 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
    >
      <div className="px-3 py-2" style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}>
        <p className="text-[10px] font-semibold" style={{ color: theme.colors.inkLight }}>
          {day.date.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}
        </p>
      </div>
      <button
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-black/5 transition-colors text-left"
        style={{ color: theme.colors.ink }}
        onClick={() => { onMark(); onClose(); }}
      >
        <Star size={13} style={{ color: theme.colors.gold }} fill={isMarked ? theme.colors.gold : "none"} />
        {isMarked ? "Unmark this date" : "Mark this date"}
      </button>
      <button
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-black/5 transition-colors text-left"
        style={{ color: theme.colors.ink }}
        onClick={() => { onNote(); onClose(); }}
      >
        <Pencil size={13} style={{ color: theme.colors.accent }} />
        Add a note
      </button>
    </motion.div>
  );
}

// ─── Spiral Binding ───────────────────────────────────────────────────────────
function SpiralBinding({ color }: { color: string }) {
  return (
    <div className="absolute top-0 left-0 right-0 flex justify-center gap-4 -translate-y-3 z-20 pointer-events-none px-8">
      {Array.from({ length: 14 }).map((_, i) => (
        <div
          key={i}
          className="w-5 h-6 rounded-full border-2"
          style={{
            borderColor: color,
            background: "transparent",
            boxShadow: `inset 0 1px 3px rgba(0,0,0,0.15)`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Calendar Page ────────────────────────────────────────────────────────
export default function CalendarPage() {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const handleDateClick = useCalendarStore((s) => s.handleDateClick);
  const handleDateHover = useCalendarStore((s) => s.handleDateHover);
  const clearSelection = useCalendarStore((s) => s.clearSelection);
  const selectionPhase = useCalendarStore((s) => s.selectionPhase);
  const toggleMarkDate = useCalendarStore((s) => s.toggleMarkDate);
  const getNote = useCalendarStore((s) => s.getNote);

  const previewRange = useCalendarStore((s) => s.getPreviewRange());
  const selectedRange = useCalendarStore((s) => s.selectedRange);

  const [theme, setTheme] = useState<FilmTheme>(() => getThemeByMonth(activeMonthIndex));
  const [prevMonth, setPrevMonth] = useState(activeMonthIndex);
  const [direction, setDirection] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ day: CalendarDay; pos: { x: number; y: number } } | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Theme transition
  useEffect(() => {
    const newTheme = getThemeByMonth(activeMonthIndex);
    setDirection(activeMonthIndex > prevMonth ? 1 : -1);
    setTheme(newTheme);
    setPrevMonth(activeMonthIndex);
    setImgLoaded(false);
    injectTheme(newTheme);
    clearSelection();
  }, [activeMonthIndex]);

  // Initial theme inject
  useEffect(() => {
    injectTheme(theme);
  }, []);

  // Close context menu on click outside
  useEffect(() => {
    if (!contextMenu) return;
    const close = () => setContextMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [contextMenu]);

  // Build calendar weeks
  const weeks = useMemo(() => {
    const baseWeeks = buildCalendarDays(activeMonthIndex, activeYear);
    const goldenSet = new Set(theme.goldenDates.map((g) => g.day));
    const goldenMap = new Map(theme.goldenDates.map((g) => [g.day, g]));
    const note = getNote(activeMonthIndex, activeYear);
    const markedSet = new Set(note?.markedDates ?? []);

    return baseWeeks.map((week) =>
      week.map((day) => ({
        ...day,
        selectionState: selectDateSelectionState(day.date, previewRange),
        isGoldenDate: day.isCurrentMonth && goldenSet.has(day.dayNumber),
        goldenFact: goldenMap.get(day.dayNumber)?.fact,
        goldenFilmRef: goldenMap.get(day.dayNumber)?.filmReference,
        isMarked: day.isCurrentMonth && markedSet.has(day.dayNumber),
      }))
    );
  }, [activeMonthIndex, activeYear, theme, previewRange, getNote]);

  const note = getNote(activeMonthIndex, activeYear);
  const markedDates = note?.markedDates ?? [];

  const selectionLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(start)} — ${fmt(end)}`;
  }, [selectedRange]);

  const handleContextMenu = useCallback((e: React.MouseEvent, day: CalendarDay) => {
    e.preventDefault();
    if (!day.isCurrentMonth) return;
    setContextMenu({ day, pos: { x: e.clientX, y: e.clientY } });
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-colors duration-700"
      style={{ background: `linear-gradient(135deg, var(--paper-alt) 0%, var(--paper) 60%, var(--paper-alt) 100%)` }}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {/* Subtle paper texture overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* The Wall Calendar */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={`${activeMonthIndex}-${activeYear}`}
          custom={direction}
          initial={{ opacity: 0, rotateY: direction > 0 ? -12 : 12, y: 20 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          exit={{ opacity: 0, rotateY: direction > 0 ? 12 : -12, y: -20 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-5xl"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        >
          {/* Calendar card */}
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: theme.colors.paper,
              boxShadow: `0 20px 80px ${theme.colors.shadow}, 0 4px 20px rgba(0,0,0,0.08)`,
              border: `1px solid ${theme.colors.borderLight}`,
            }}
          >
            {/* Spiral rings at top */}
            <SpiralBinding color={theme.colors.border} />

            {/* ── HERO IMAGE SECTION ────────────────────────── */}
            <div className="relative" style={{ height: "clamp(200px, 32vh, 320px)" }}>
              {/* Gradient fallback */}
              <div
                className="absolute inset-0"
                style={{ background: theme.accentPattern, opacity: 0.3 }}
              />

              {/* Hero image */}
              <img
                src={theme.heroImage}
                alt={theme.filmTitle}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: imgLoaded ? 1 : 0 }}
                onLoad={() => setImgLoaded(true)}
              />

              {/* Gradient overlay - bottom */}
              <div
                className="absolute inset-x-0 bottom-0"
                style={{
                  height: "70%",
                  background: `linear-gradient(to bottom, transparent, ${theme.colors.paper})`,
                }}
              />

              {/* Top fade for spiral */}
              <div
                className="absolute inset-x-0 top-0"
                style={{ height: "40px", background: `linear-gradient(to bottom, ${theme.colors.paper}, transparent)` }}
              />

              {/* Movie title overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-1"
                      style={{ color: theme.colors.inkLight }}
                    >
                      {theme.director} · {theme.year}
                    </p>
                    <h2
                      className="text-2xl md:text-3xl leading-none font-bold"
                      style={{
                        fontFamily: "'Crimson Text', Georgia, serif",
                        color: theme.colors.ink,
                        textShadow: `0 2px 20px ${theme.colors.paper}aa`,
                      }}
                    >
                      {theme.shortTitle}
                    </h2>
                    <p
                      className="text-xs mt-1 italic"
                      style={{ color: theme.colors.inkLight }}
                    >
                      "{theme.tagline}"
                    </p>
                  </div>

                  {/* Year + Month badge */}
                  <div
                    className="text-right px-4 py-2 rounded-xl"
                    style={{
                      background: theme.colors.headerBg,
                      color: theme.colors.headerText,
                    }}
                  >
                    <div className="text-[10px] font-semibold tracking-widest uppercase opacity-70">
                      {activeYear}
                    </div>
                    <div
                      className="text-xl md:text-2xl font-bold leading-none"
                      style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
                    >
                      {MONTH_NAMES[activeMonthIndex].toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative quote in corner */}
              <div
                className="absolute top-10 right-5 max-w-[140px] text-right pointer-events-none"
                style={{ opacity: imgLoaded ? 0.18 : 0.35 }}
              >
                <p
                  className="text-[9px] italic leading-relaxed"
                  style={{ color: theme.colors.ink, fontFamily: "'Crimson Text', Georgia, serif", fontSize: "9px" }}
                >
                  "{theme.quote}"
                </p>
              </div>
            </div>

            {/* ── CALENDAR GRID + SIDE PANEL ────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] xl:grid-cols-[1fr_260px]">
              {/* Calendar grid */}
              <div className="p-4 md:p-6">

                {/* Selection hint bar */}
                <AnimatePresence>
                  {(selectionPhase === "selecting-end" || selectionLabel) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3 flex items-center justify-between rounded-lg px-3 py-1.5"
                      style={{ background: `${theme.colors.accentSoft}`, border: `1px solid ${theme.colors.border}` }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={selectionPhase === "selecting-end" ? { scale: [1, 1.4, 1] } : {}}
                          transition={{ duration: 1.2, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: theme.colors.accent }}
                        />
                        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: theme.colors.accent }}>
                          {selectionPhase === "selecting-end"
                            ? "Click end date to complete range"
                            : `Selected: ${selectionLabel}`}
                        </span>
                      </div>
                      {selectedRange.start && (
                        <button
                          onClick={clearSelection}
                          className="rounded-full p-0.5 hover:bg-black/10"
                          style={{ color: theme.colors.inkLight }}
                        >
                          <X size={10} />
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAY_LABELS.map((label, i) => (
                    <div
                      key={label}
                      className="text-center py-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em]"
                      style={{
                        color: i === 0 || i === 6 ? theme.colors.accent : theme.colors.inkLight,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>

                {/* Horizontal line under weekday headers */}
                <div className="mb-2" style={{ borderTop: `1px solid ${theme.colors.borderLight}` }} />

                {/* Calendar weeks */}
                <div className="flex flex-col gap-px">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="grid grid-cols-7 gap-px">
                      {week.map((day, di) => (
                        <DayCell
                          key={`${wi}-${di}`}
                          day={day}
                          theme={theme}
                          isMarked={day.isCurrentMonth && markedDates.includes(day.dayNumber)}
                          onClick={() => {
                            if (day.isCurrentMonth) handleDateClick(day.date);
                          }}
                          onRightClick={(e) => handleContextMenu(e, day)}
                          onHover={() => {
                            if (day.isCurrentMonth) {
                              handleDateHover(day.date);
                              setHoveredDay(day.dayNumber);
                            }
                          }}
                          onLeave={() => {
                            handleDateHover(null);
                            setHoveredDay(null);
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div
                  className="flex items-center gap-4 mt-4 pt-3 flex-wrap"
                  style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }}
                >
                  {[
                    { color: theme.colors.accent, label: "Selected", fill: true },
                    { color: theme.colors.gold, label: "✦ Film trivia", fill: false },
                    { color: theme.colors.accent, label: "Today", fill: false, ring: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded"
                        style={{
                          background: item.fill ? item.color : "transparent",
                          border: item.ring ? `2px solid ${item.color}` : item.fill ? "none" : `1.5px solid ${item.color}`,
                        }}
                      />
                      <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.colors.inkLight }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: theme.colors.accent }} />
                    <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: theme.colors.inkLight }}>
                      Marked date
                    </span>
                  </div>
                  <span className="text-[9px] ml-auto" style={{ color: `${theme.colors.inkLight}80` }}>
                    Right-click to mark · hover ✦ for trivia
                  </span>
                </div>
              </div>

              {/* Right sidebar */}
              <div
                className="hidden lg:flex flex-col border-l"
                style={{ borderColor: theme.colors.borderLight }}
              >
                {/* Navigation */}
                <div
                  className="p-4 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
                >
                  <motion.button
                    onClick={goToPrevMonth}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
                  >
                    <ChevronLeft size={14} />
                  </motion.button>

                  <div className="text-center">
                    <p className="text-xs font-semibold" style={{ fontFamily: "'Crimson Text', Georgia, serif", color: theme.colors.ink }}>
                      {MONTH_NAMES[activeMonthIndex]}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest" style={{ color: theme.colors.inkLight }}>
                      {activeYear}
                    </p>
                  </div>

                  <motion.button
                    onClick={goToNextMonth}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
                  >
                    <ChevronRight size={14} />
                  </motion.button>
                </div>

                {/* Film info */}
                <div className="p-4 flex-1 flex flex-col gap-4">
                  {/* Film details */}
                  <div>
                    <p className="text-[8px] uppercase tracking-widest font-bold mb-2" style={{ color: theme.colors.inkLight }}>
                      Film of the Month
                    </p>
                    <p
                      className="text-sm font-semibold leading-snug"
                      style={{ fontFamily: "'Crimson Text', Georgia, serif", color: theme.colors.ink }}
                    >
                      {theme.filmTitle}
                    </p>
                    <p className="text-[10px] mt-1" style={{ color: theme.colors.inkLight }}>
                      {theme.director} · {theme.year}
                    </p>

                    {/* Mood badge */}
                    <div
                      className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-bold"
                      style={{ background: theme.colors.accentSoft, color: theme.colors.accent }}
                    >
                      {theme.mood}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

                  {/* Golden dates */}
                  <div>
                    <p className="text-[8px] uppercase tracking-widest font-bold mb-2" style={{ color: theme.colors.gold }}>
                      ✦ Golden Dates
                    </p>
                    <div className="flex flex-col gap-2">
                      {theme.goldenDates.map((g) => (
                        <div key={g.day} className="flex gap-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: theme.colors.accentSoft, color: theme.colors.accent }}
                          >
                            {g.day}
                          </div>
                          <p className="text-[10px] leading-relaxed" style={{ color: theme.colors.inkLight }}>
                            {g.fact}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

                  {/* Selected range display */}
                  {selectionLabel ? (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                      <p className="text-[8px] uppercase tracking-widest font-bold mb-1" style={{ color: theme.colors.inkLight }}>
                        Selected Range
                      </p>
                      <p className="text-sm font-semibold" style={{ fontFamily: "'Crimson Text', Georgia, serif", color: theme.colors.accent }}>
                        {selectionLabel}
                      </p>
                      <button
                        onClick={clearSelection}
                        className="mt-1 text-[9px] hover:underline"
                        style={{ color: theme.colors.inkLight }}
                      >
                        Clear selection
                      </button>
                    </motion.div>
                  ) : (
                    <div>
                      <p className="text-[8px] uppercase tracking-widest font-bold mb-1" style={{ color: theme.colors.inkLight }}>
                        Date Range
                      </p>
                      <p className="text-[10px]" style={{ color: `${theme.colors.inkLight}80` }}>
                        Click two dates to select a range
                      </p>
                    </div>
                  )}

                  {/* Note button */}
                  <motion.button
                    onClick={() => setNotesOpen(true)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-auto w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2"
                    style={{
                      background: theme.colors.headerBg,
                      color: theme.colors.headerText,
                      boxShadow: `0 4px 16px ${theme.colors.shadow}`,
                    }}
                  >
                    <Pencil size={11} />
                    {note?.content ? "Edit Notes" : "Add Notes"}
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Mobile bottom bar */}
            <div
              className="lg:hidden flex items-center justify-between px-4 py-3"
              style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
            >
              <motion.button
                onClick={goToPrevMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
              >
                <ChevronLeft size={12} /> Prev
              </motion.button>

              <button
                onClick={() => setNotesOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: theme.colors.headerBg, color: theme.colors.headerText }}
              >
                <Pencil size={11} /> Notes
              </button>

              <motion.button
                onClick={goToNextMonth}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
              >
                Next <ChevronRight size={12} />
              </motion.button>
            </div>
          </div>

          {/* Calendar shadow / paper lift effect */}
          <div
            className="absolute inset-x-4 -bottom-3 h-4 rounded-b-2xl -z-10 opacity-40"
            style={{
              background: theme.colors.border,
              filter: "blur(8px)",
            }}
          />
          <div
            className="absolute inset-x-8 -bottom-5 h-4 rounded-b-2xl -z-20 opacity-20"
            style={{
              background: theme.colors.border,
              filter: "blur(12px)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <DateMenu
            day={contextMenu.day}
            theme={theme}
            pos={contextMenu.pos}
            isMarked={markedDates.includes(contextMenu.day.dayNumber)}
            onMark={() => toggleMarkDate(contextMenu.day.dayNumber, activeMonthIndex, activeYear)}
            onNote={() => setNotesOpen(true)}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* Notes Panel */}
      <NotesPanel
        theme={theme}
        monthIndex={activeMonthIndex}
        year={activeYear}
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
      />
    </div>
  );
}