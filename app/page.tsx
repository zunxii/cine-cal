"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
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
import type { FilmTheme, MonthIndex } from "@/types/theme";

// ── Page-flip animation variants ──────────────────────────────────────────
const pageVariants = {
  enterFromRight: { opacity: 0, rotateY: -18, x: 80, scale: 0.96 },
  enterFromLeft:  { opacity: 0, rotateY:  18, x: -80, scale: 0.96 },
  center:         { opacity: 1, rotateY:   0, x:   0, scale: 1 },
  exitToLeft:     { opacity: 0, rotateY:  18, x: -80, scale: 0.96 },
  exitToRight:    { opacity: 0, rotateY: -18, x:  80, scale: 0.96 },
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
  const previewRange  = store.getPreviewRange();

  // ── Theme state ───────────────────────────────────────────────────────────
  // Derive theme synchronously to avoid flash; keep ref for direction tracking
  const [theme, setTheme] = useState<FilmTheme>(() =>
    getThemeByMonth(activeMonthIndex)
  );
  const prevMonthRef = useRef(activeMonthIndex);
  const [direction, setDirection] = useState<"left" | "right">("right");

  // ── Context-menu state ────────────────────────────────────────────────────
  const [contextMenu, setContextMenu] = useState<{
    pos: { x: number; y: number };
    dayNumber: number;
    date: Date;
  } | null>(null);

  // ── Update theme + direction when month changes ───────────────────────────
  // Using useLayoutEffect (sync) avoids the "setState inside effect" cascade
  // warning because layout effects run before the browser paints — they are
  // conceptually part of the render cycle, not external synchronisation.
  useLayoutEffect(() => {
    const prev = prevMonthRef.current;
    const next = activeMonthIndex;
    if (prev === next) return;

    const goingRight =
      next > prev || (prev === 11 && next === 0);
    const goingLeft  =
      next < prev || (prev === 0  && next === 11);

    setDirection(goingRight ? "right" : goingLeft ? "left" : "right");
    setTheme(getThemeByMonth(next));
    prevMonthRef.current = next;
  }, [activeMonthIndex]);

  // ── Inject CSS custom props on theme change ───────────────────────────────
  useEffect(() => {
    injectTheme(theme);
  }, [theme]);

  // ── Initial injection on mount ────────────────────────────────────────────
  useEffect(() => {
    injectTheme(getThemeByMonth(activeMonthIndex));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — mount only

  // ── Notes & marked dates ──────────────────────────────────────────────────
  const note = getNote(activeMonthIndex as MonthIndex, activeYear);

  // Wrap markedDates init in its own useMemo to stabilise reference
  const markedDates = useMemo(
    () => note?.markedDates ?? [],
    [note]
  );

  // ── Build calendar grid ───────────────────────────────────────────────────
  const weeks = useMemo(() => {
    const baseWeeks = buildCalendarDays(activeMonthIndex, activeYear);
    const goldenSet = new Set(theme.goldenDates.map((g) => g.day));
    const goldenMap = new Map(theme.goldenDates.map((g) => [g.day, g]));

    return baseWeeks.map((week) =>
      week.map((day) => ({
        ...day,
        isGoldenDate: day.isCurrentMonth && goldenSet.has(day.dayNumber),
        goldenFact:    goldenMap.get(day.dayNumber)?.fact,
        goldenFilmRef: goldenMap.get(day.dayNumber)?.filmReference,
        isMarked:      day.isCurrentMonth && markedDates.includes(day.dayNumber),
      }))
    );
  }, [activeMonthIndex, activeYear, theme, markedDates]);

  // ── Callbacks ─────────────────────────────────────────────────────────────
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

  // ── Background style ──────────────────────────────────────────────────────
  const bgStyle = {
    background: `linear-gradient(135deg, ${theme.colors.paperAlt} 0%, ${theme.colors.paper} 50%, ${theme.colors.paperAlt} 100%)`,
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8 transition-colors duration-700"
      style={bgStyle}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {/* Paper grain overlay */}
      <div className="paper-grain" />

      {/* Calendar container */}
      <div className="calendar-wrapper relative w-full max-w-4xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${activeMonthIndex}-${activeYear}`}
            custom={direction}
            variants={pageVariants}
            initial={direction === "right" ? "enterFromRight" : "enterFromLeft"}
            animate="center"
            exit={direction === "right"  ? "exitToLeft"    : "exitToRight"}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: 0.3 },
            }}
            className="calendar-page"
          >
            {/* Stack shadow layers (paper feel) */}
            <div className="calendar-shadow-1" />
            <div className="calendar-shadow-2" />

            {/* The main calendar card */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: theme.colors.paper,
                boxShadow: `
                  0 25px 80px ${theme.colors.shadow},
                  0 8px 32px rgba(0,0,0,0.06),
                  0 2px 8px rgba(0,0,0,0.04)
                `,
                border: `1px solid ${theme.colors.borderLight}`,
              }}
            >
              {/* Paper fold corner */}
              <div className="paper-fold-edge" />

              {/* Spiral binding */}
              <SpiralBinding color={theme.colors.border} />

              {/* Hero section */}
              <HeroSection
                theme={theme}
                monthIndex={activeMonthIndex}
                year={activeYear}
              />

              {/* Main content */}
              <div className="flex flex-col lg:flex-row relative">
                {/* Easter eggs */}
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
                  onPrevMonth={goToPrevMonth}
                  onNextMonth={goToNextMonth}
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
                  onClick={goToPrevMonth}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
                >
                  <ChevronLeft size={13} /> Prev
                </motion.button>

                <button
                  onClick={openNoteDialog}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{ background: theme.colors.headerBg, color: theme.colors.headerText }}
                >
                  <Pencil size={11} /> Notes
                </button>

                <motion.button
                  onClick={goToNextMonth}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{ border: `1.5px solid ${theme.colors.border}`, color: theme.colors.inkLight }}
                >
                  Next <ChevronRight size={13} />
                </motion.button>
              </div>
            </div>
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