"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { useCalendarStore } from "@/store/calendarStore";
import { getThemeByMonth } from "@/data/theme";
import { buildCalendarDays, injectTheme } from "@/lib/calendarUtils";
import { SpiralBinding } from "@/components/calendar/SpiralBinding";
import { HeroSection } from "@/components/calendar/HeroSection";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { SidebarPanel } from "@/components/calendar/SidebarPanel";
import { NoteDialog } from "@/components/calendar/NoteDialog";
import { DateContextMenu } from "@/components/calendar/DateContextMenu";
import { EasterEggs } from "@/components/calendar/EasterEggs";
import { NotePreview } from "@/components/calendar/NotePreview";
import type { FilmTheme } from "@/types/theme";
import type { MonthIndex } from "@/types/theme";

// ─── Cinematic page‑flip variants ─────────────────────────────────────────────
const pageVariants = {
  // Forward navigation (next month)
  enterRight: {
    opacity: 0,
    x: 80,
    rotateY: 18,
    scale: 0.96,
    transformOrigin: "left center",
  },
  exitLeft: {
    opacity: 0,
    x: -80,
    rotateY: -18,
    scale: 0.96,
    transformOrigin: "right center",
  },
  // Backward navigation (prev month)
  enterLeft: {
    opacity: 0,
    x: -80,
    rotateY: -18,
    scale: 0.96,
    transformOrigin: "right center",
  },
  exitRight: {
    opacity: 0,
    x: 80,
    rotateY: 18,
    scale: 0.96,
    transformOrigin: "left center",
  },
  center: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    scale: 1,
    transformOrigin: "center center",
  },
};

const pageTransition = {
  duration: 0.52,
  ease: [0.22, 1, 0.36, 1],
  opacity: { duration: 0.38 },
};

export default function CalendarPage() {
  const store = useCalendarStore();
  const {
    activeMonthIndex,
    activeYear,
    goToNextMonth,
    goToPrevMonth,
    handleDateClick,
    handleDateHover,
    clearSelection,
    selectionPhase,
    toggleMarkDate,
    getNote,
    updateNote,
    clearNote,
    openNoteDialog,
    closeNoteDialog,
    isNoteDialogOpen,
  } = store;

  const selectedRange = store.selectedRange;
  const previewRange = store.getPreviewRange();

  const [theme, setTheme] = useState<FilmTheme>(() =>
    getThemeByMonth(activeMonthIndex)
  );
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [prevMonthIndex, setPrevMonthIndex] = useState(activeMonthIndex);
  const [contextMenu, setContextMenu] = useState<{
    pos: { x: number; y: number };
    dayNumber: number;
    date: Date;
  } | null>(null);

  // Track key for AnimatePresence (direction-aware)
  const [flipKey, setFlipKey] = useState(0);

  // Update theme when month changes
  useEffect(() => {
    const newTheme = getThemeByMonth(activeMonthIndex);
    const isForward =
      (activeMonthIndex > prevMonthIndex) ||
      (prevMonthIndex === 11 && activeMonthIndex === 0);
    setDirection(isForward ? "right" : "left");
    setTheme(newTheme);
    setPrevMonthIndex(activeMonthIndex);
    injectTheme(newTheme);
    setFlipKey((k) => k + 1);
  }, [activeMonthIndex, activeYear]);

  // Inject theme on mount
  useEffect(() => {
    injectTheme(theme);
  }, []);

  const note = getNote(activeMonthIndex as MonthIndex, activeYear);
  const markedDates = note?.markedDates ?? [];

  const weeks = useMemo(() => {
    const baseWeeks = buildCalendarDays(activeMonthIndex, activeYear);
    const goldenSet = new Set(theme.goldenDates.map((g) => g.day));
    const goldenMap = new Map(theme.goldenDates.map((g) => [g.day, g]));

    return baseWeeks.map((week) =>
      week.map((day) => ({
        ...day,
        isGoldenDate: day.isCurrentMonth && goldenSet.has(day.dayNumber),
        goldenFact: goldenMap.get(day.dayNumber)?.fact,
        goldenFilmRef: goldenMap.get(day.dayNumber)?.filmReference,
        isMarked: day.isCurrentMonth && markedDates.includes(day.dayNumber),
      }))
    );
  }, [activeMonthIndex, activeYear, theme, markedDates]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, date: Date, dayNumber: number) => {
      e.preventDefault();
      setContextMenu({ pos: { x: e.clientX, y: e.clientY }, dayNumber, date });
    },
    []
  );

  const handleMarkDate = useCallback(
    (dayNumber: number) => {
      toggleMarkDate(dayNumber, activeMonthIndex as MonthIndex, activeYear);
    },
    [toggleMarkDate, activeMonthIndex, activeYear]
  );

  // ─── Navigation with direction tracking ────────────────────────────
  const handleNext = useCallback(() => {
    setDirection("right");
    goToNextMonth();
  }, [goToNextMonth]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    goToPrevMonth();
  }, [goToPrevMonth]);

  // ─── Keyboard navigation ───────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  // Dynamic page background based on theme
  const pageStyle = {
    background: `
      radial-gradient(ellipse at 20% 10%, ${theme.colors.accentSoft}40 0%, transparent 50%),
      radial-gradient(ellipse at 80% 90%, ${theme.colors.accent}20 0%, transparent 50%),
      linear-gradient(160deg, ${theme.colors.paperAlt} 0%, ${theme.colors.paper} 50%, ${theme.colors.paperAlt} 100%)
    `,
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8"
      style={pageStyle}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {/* Animated paper grain overlay */}
      <div
        className="film-grain-overlay pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Calendar stack container */}
      <div
        className="calendar-stack-wrapper relative w-full max-w-4xl"
        style={{ perspective: "1400px", marginBottom: "20px" }}
      >
        {/* Stack layer CSS vars from theme */}
        <style>{`
          .calendar-stack-wrapper::before,
          .calendar-stack-wrapper::after {
            background: ${theme.colors.paperAlt};
            border-color: ${theme.colors.borderLight};
          }
        `}</style>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${activeMonthIndex}-${activeYear}-${flipKey}`}
            initial={direction === "right" ? pageVariants.enterRight : pageVariants.enterLeft}
            animate={pageVariants.center}
            exit={direction === "right" ? pageVariants.exitLeft : pageVariants.exitRight}
            transition={pageTransition}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ─── The Calendar Card ────────────────────────────── */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              initial={{ boxShadow: `0 4px 20px ${theme.colors.shadow}` }}
              animate={{
                boxShadow: `
                  0 32px 80px ${theme.colors.shadow},
                  0 12px 40px rgba(0,0,0,0.08),
                  0 4px 12px rgba(0,0,0,0.05),
                  inset 0 1px 0 rgba(255,255,255,0.6)
                `,
              }}
              style={{
                background: theme.colors.paper,
                border: `1.5px solid ${theme.colors.borderLight}`,
              }}
            >
              {/* Spiral binding */}
              <SpiralBinding color={theme.colors.border} accent={theme.colors.accent} />

              {/* Hero section */}
              <HeroSection
                theme={theme}
                monthIndex={activeMonthIndex}
                year={activeYear}
              />

              {/* Main content area */}
              <div className="flex flex-col lg:flex-row relative">
                {/* Easter eggs layer */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <EasterEggs theme={theme} />
                </div>

                {/* Calendar grid */}
                <div className="flex-1 min-w-0 relative z-10">
                  <CalendarGrid
                    theme={theme}
                    monthIndex={activeMonthIndex}
                    year={activeYear}
                    weeks={weeks}
                    previewRange={previewRange}
                    selectedRange={selectedRange}
                    selectionPhase={selectionPhase}
                    markedDates={markedDates}
                    onDateClick={handleDateClick}
                    onDateHover={handleDateHover}
                    onContextMenu={handleContextMenu}
                    onClearSelection={clearSelection}
                  />

                  {/* Note preview on mobile */}
                  {note?.content && (
                    <div className="px-4 pb-3 lg:hidden">
                      <NotePreview
                        content={note.content}
                        theme={theme}
                        onEdit={openNoteDialog}
                      />
                    </div>
                  )}
                </div>

                {/* Desktop sidebar */}
                <SidebarPanel
                  theme={theme}
                  monthIndex={activeMonthIndex}
                  year={activeYear}
                  noteContent={note?.content ?? ""}
                  selectedRange={selectedRange}
                  onPrevMonth={handlePrev}
                  onNextMonth={handleNext}
                  onOpenNote={openNoteDialog}
                  onClearSelection={clearSelection}
                />
              </div>

              {/* Mobile bottom navigation */}
              <div
                className="lg:hidden flex items-center justify-between px-4 py-3"
                style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
              >
                <motion.button
                  onClick={handlePrev}
                  whileHover={{ scale: 1.06, x: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{
                    border: `1.5px solid ${theme.colors.border}`,
                    color: theme.colors.inkLight,
                    fontFamily: "'Josefin Sans', sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  <ChevronLeft size={13} /> PREV
                </motion.button>

                <button
                  onClick={openNoteDialog}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: theme.colors.headerBg,
                    color: theme.colors.headerText,
                    fontFamily: "'Josefin Sans', sans-serif",
                    letterSpacing: "0.15em",
                  }}
                >
                  <Pencil size={11} /> Notes
                </button>

                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.06, x: 2 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{
                    border: `1.5px solid ${theme.colors.border}`,
                    color: theme.colors.inkLight,
                    fontFamily: "'Josefin Sans', sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  NEXT <ChevronRight size={13} />
                </motion.button>
              </div>

              {/* Subtle inner paper texture */}
              <div
                className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.015]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
                  zIndex: 50,
                }}
              />
            </motion.div>

            {/* ─── Paper shadow layers beneath card ─────────────── */}
            <div
              className="absolute inset-x-3 -bottom-2 h-6 rounded-b-2xl -z-10 opacity-20"
              style={{
                background: theme.colors.accent,
                filter: "blur(10px)",
              }}
            />
            <div
              className="absolute inset-x-6 -bottom-4 h-6 rounded-b-2xl -z-20 opacity-10"
              style={{
                background: theme.colors.border,
                filter: "blur(18px)",
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <DateContextMenu
          theme={theme}
          pos={contextMenu.pos}
          dayNumber={contextMenu.dayNumber}
          date={contextMenu.date}
          isMarked={markedDates.includes(contextMenu.dayNumber)}
          onMark={() => handleMarkDate(contextMenu.dayNumber)}
          onNote={openNoteDialog}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Note Dialog */}
      <NoteDialog
        theme={theme}
        monthIndex={activeMonthIndex as MonthIndex}
        year={activeYear}
        note={note}
        isOpen={isNoteDialogOpen}
        onClose={closeNoteDialog}
        onUpdate={(content) =>
          updateNote(activeMonthIndex as MonthIndex, activeYear, content)
        }
        onClear={() => clearNote(activeMonthIndex as MonthIndex, activeYear)}
      />
    </div>
  );
}