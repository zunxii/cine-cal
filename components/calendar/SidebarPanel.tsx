"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import type { FilmTheme } from "@/types/theme";
import { MONTH_NAMES } from "@/lib/calendarUtils";
import { NotePreview } from "./NotePreview";
import type { DateRange } from "@/types/calendar";

interface SidebarPanelProps {
  theme: FilmTheme;
  monthIndex: number;
  year: number;
  noteContent: string;
  selectedRange: DateRange;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenNote: () => void;
  onClearSelection: () => void;
}

export function SidebarPanel({
  theme,
  monthIndex,
  year,
  noteContent,
  selectedRange,
  onPrevMonth,
  onNextMonth,
  onOpenNote,
  onClearSelection,
}: SidebarPanelProps) {
  const selectionLabel = (() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    const fmt = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(start)} — ${fmt(end)}`;
  })();

  return (
    <div
      className="hidden lg:flex flex-col border-l"
      style={{ borderColor: theme.colors.borderLight, width: "240px", flexShrink: 0 }}
    >
      {/* Navigation */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
      >
        <motion.button
          onClick={onPrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            border: `1.5px solid ${theme.colors.border}`,
            color: theme.colors.inkLight,
          }}
        >
          <ChevronLeft size={14} />
        </motion.button>

        <div className="text-center">
          <p
            className="text-sm font-semibold"
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              color: theme.colors.ink,
            }}
          >
            {MONTH_NAMES[monthIndex]}
          </p>
          <p
            className="text-[9px] uppercase tracking-widest"
            style={{ color: theme.colors.inkLight }}
          >
            {year}
          </p>
        </div>

        <motion.button
          onClick={onNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          style={{
            border: `1.5px solid ${theme.colors.border}`,
            color: theme.colors.inkLight,
          }}
        >
          <ChevronRight size={14} />
        </motion.button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Film of the month */}
        <div>
          <p
            className="text-[7px] uppercase tracking-widest font-bold mb-2"
            style={{ color: theme.colors.inkLight }}
          >
            Film of the Month
          </p>
          <p
            className="text-[13px] font-semibold leading-snug"
            style={{
              fontFamily: "'Crimson Text', Georgia, serif",
              color: theme.colors.ink,
            }}
          >
            {theme.filmTitle}
          </p>
          <p className="text-[10px] mt-1" style={{ color: theme.colors.inkLight }}>
            {theme.director} · {theme.year}
          </p>
          <div
            className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-widest font-bold"
            style={{
              background: theme.colors.accentSoft,
              color: theme.colors.accent,
            }}
          >
            {theme.mood}
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

        {/* Golden dates */}
        <div>
          <p
            className="text-[7px] uppercase tracking-widest font-bold mb-2"
            style={{ color: theme.colors.gold }}
          >
            ✦ Golden Dates
          </p>
          <div className="flex flex-col gap-2.5">
            {theme.goldenDates.map((g) => (
              <div key={g.day} className="flex gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: theme.colors.accentSoft,
                    color: theme.colors.accent,
                  }}
                >
                  {g.day}
                </div>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{ color: theme.colors.inkLight }}
                >
                  {g.fact.length > 80 ? g.fact.slice(0, 80) + "..." : g.fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

        {/* Selected range */}
        {selectionLabel ? (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <p
              className="text-[7px] uppercase tracking-widest font-bold mb-1"
              style={{ color: theme.colors.inkLight }}
            >
              Selected Range
            </p>
            <p
              className="text-sm font-semibold"
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                color: theme.colors.accent,
              }}
            >
              {selectionLabel}
            </p>
            <button
              onClick={onClearSelection}
              className="mt-1 text-[9px] hover:opacity-60 transition-opacity"
              style={{ color: theme.colors.inkLight }}
            >
              Clear selection
            </button>
          </motion.div>
        ) : (
          <div>
            <p
              className="text-[7px] uppercase tracking-widest font-bold mb-1"
              style={{ color: theme.colors.inkLight }}
            >
              Date Range
            </p>
            <p className="text-[10px]" style={{ color: `${theme.colors.inkLight}80` }}>
              Click two dates to select
            </p>
          </div>
        )}

        {/* Note preview */}
        {noteContent && (
          <>
            <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />
            <NotePreview content={noteContent} theme={theme} onEdit={onOpenNote} />
          </>
        )}
      </div>

      {/* Note button at bottom */}
      <div
        className="p-4"
        style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
      >
        <motion.button
          onClick={onOpenNote}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
          style={{
            background: theme.colors.headerBg,
            color: theme.colors.headerText,
            boxShadow: `0 4px 16px ${theme.colors.shadow}`,
          }}
        >
          <Pencil size={11} />
          {noteContent ? "Edit Notes" : "Add Notes"}
        </motion.button>
      </div>
    </div>
  );
}