"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
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

// Page flip variants
const pageVariants = {
  enterFromRight: {
    opacity: 0,
    rotateY: -15,
    x: 60,
    scale: 0.97,
  },
  enterFromLeft: {
    opacity: 0,
    rotateY: 15,
    x: -60,
    scale: 0.97,
  },
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    scale: 1,
  },
  exitToLeft: {
    opacity: 0,
    rotateY: 15,
    x: -60,
    scale: 0.97,
  },
  exitToRight: {
    opacity: 0,
    rotateY: -15,
    x: 60,
    scale: 0.97,
  },
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

  // Get preview and selected range directly from store
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

  // Update theme when month changes
  useEffect(() => {
    const newTheme = getThemeByMonth(activeMonthIndex);
    setDirection(activeMonthIndex > prevMonthIndex || (prevMonthIndex === 11 && activeMonthIndex === 0) ? "right" : "left");
    setTheme(newTheme);
    setPrevMonthIndex(activeMonthIndex);
    injectTheme(newTheme);
  }, [activeMonthIndex, activeYear]);

  // Inject theme on mount
  useEffect(() => {
    injectTheme(theme);
  }, []);

  const note = getNote(activeMonthIndex as MonthIndex, activeYear);
  const markedDates = note?.markedDates ?? [];

  // Build calendar weeks with golden dates injected
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

  const bgStyle = {
    background: `linear-gradient(135deg, ${theme.colors.paperAlt} 0%, ${theme.colors.paper} 50%, ${theme.colors.paperAlt} 100%)`,
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-3 md:p-6 lg:p-8 transition-colors duration-700"
      style={bgStyle}
      onClick={() => contextMenu && setContextMenu(null)}
    >
      {/* Subtle paper grain overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Calendar container */}
      <div
        className="relative w-full max-w-4xl"
        style={{ perspective: "1200px" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${activeMonthIndex}-${activeYear}`}
            custom={direction}
            variants={pageVariants}
            initial={direction === "right" ? "enterFromRight" : "enterFromLeft"}
            animate="center"
            exit={direction === "right" ? "exitToLeft" : "exitToRight"}
            transition={{
              duration: 0.45,
              ease: [0.25, 0.1, 0.25, 1.0],
              opacity: { duration: 0.3 },
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* The calendar card */}
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
              {/* Spiral binding */}
              <SpiralBinding color={theme.colors.border} />

              {/* Hero */}
              <HeroSection
                theme={theme}
                monthIndex={activeMonthIndex}
                year={activeYear}
              />

              {/* Main content: grid + sidebar */}
              <div className="flex flex-col lg:flex-row relative">
                {/* Easter eggs behind content */}
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

                  {/* Note preview on calendar (mobile also shows here) */}
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
                  style={{
                    border: `1.5px solid ${theme.colors.border}`,
                    color: theme.colors.inkLight,
                  }}
                >
                  <ChevronLeft size={13} /> Prev
                </motion.button>

                <button
                  onClick={openNoteDialog}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    background: theme.colors.headerBg,
                    color: theme.colors.headerText,
                  }}
                >
                  <Pencil size={11} /> Notes
                </button>

                <motion.button
                  onClick={goToNextMonth}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold"
                  style={{
                    border: `1.5px solid ${theme.colors.border}`,
                    color: theme.colors.inkLight,
                  }}
                >
                  Next <ChevronRight size={13} />
                </motion.button>
              </div>
            </div>

            {/* Paper lift shadow layers */}
            <div
              className="absolute inset-x-4 -bottom-3 h-4 rounded-b-2xl -z-10 opacity-30"
              style={{
                background: theme.colors.border,
                filter: "blur(8px)",
              }}
            />
            <div
              className="absolute inset-x-8 -bottom-5 h-4 rounded-b-2xl -z-20 opacity-15"
              style={{
                background: theme.colors.border,
                filter: "blur(14px)",
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