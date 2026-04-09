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

  const headingStyle = {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "7px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.2em",
    fontWeight: 700,
    color: theme.colors.inkLight,
  };

  const filmTitleStyle = {
    fontFamily:
      theme.id === "mughal-e-azam" || theme.id === "bajirao" || theme.id === "devdas"
        ? "'Cormorant Garamond', Georgia, serif"
        : theme.id === "kkhh" || theme.id === "satya" || theme.id === "gow"
        ? "'Bebas Neue', sans-serif"
        : "'Playfair Display', Georgia, serif",
    fontSize: "14px",
    fontWeight: 600,
    color: theme.colors.ink,
    lineHeight: 1.3,
  };

  return (
    <div
      className="hidden lg:flex flex-col border-l"
      style={{
        borderColor: theme.colors.borderLight,
        width: "248px",
        flexShrink: 0,
      }}
    >
      {/* Month navigation */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
      >
        <motion.button
          onClick={onPrevMonth}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            border: `1.5px solid ${theme.colors.border}`,
            color: theme.colors.inkLight,
          }}
        >
          <ChevronLeft size={14} />
        </motion.button>

        <div className="text-center">
          <p
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "14px",
              fontWeight: 600,
              color: theme.colors.ink,
            }}
          >
            {MONTH_NAMES[monthIndex]}
          </p>
          <p style={headingStyle}>{year}</p>
        </div>

        <motion.button
          onClick={onNextMonth}
          whileHover={{ scale: 1.1, x: 2 }}
          whileTap={{ scale: 0.9 }}
          className="w-8 h-8 rounded-full flex items-center justify-center"
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
          <p style={headingStyle} className="mb-2">
            Film of the Month
          </p>
          <p style={filmTitleStyle}>{theme.filmTitle}</p>
          <p
            className="text-[10px] mt-1"
            style={{
              color: theme.colors.inkLight,
              fontFamily: "'Josefin Sans', sans-serif",
              letterSpacing: "0.05em",
            }}
          >
            {theme.director} · {theme.year}
          </p>

          {/* Quote */}
          <p
            className="text-[10px] mt-2 italic leading-relaxed"
            style={{
              color: theme.colors.inkLight,
              fontFamily: "'Lora', Georgia, serif",
              opacity: 0.8,
              borderLeft: `2px solid ${theme.colors.accentSoft}`,
              paddingLeft: "8px",
            }}
          >
            &ldquo;{theme.quote.length > 80 ? theme.quote.slice(0, 80) + "…" : theme.quote}&rdquo;
          </p>

          <div
            className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full"
            style={{
              background: theme.colors.accentSoft,
              color: theme.colors.accent,
              fontSize: "8px",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              fontWeight: 700,
              fontFamily: "'Josefin Sans', sans-serif",
            }}
          >
            {theme.mood}
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

        {/* Golden dates */}
        <div>
          <p
            style={{
              ...headingStyle,
              color: theme.colors.gold,
              letterSpacing: "0.16em",
            }}
            className="mb-2"
          >
            ✦ Golden Dates
          </p>
          <div className="flex flex-col gap-3">
            {theme.goldenDates.map((g) => (
              <div key={g.day} className="flex gap-2.5 items-start">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: theme.colors.accentSoft,
                    color: theme.colors.accent,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                >
                  {g.day}
                </div>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{
                    color: theme.colors.inkLight,
                    fontFamily: "'Lora', Georgia, serif",
                  }}
                >
                  {g.fact.length > 90 ? g.fact.slice(0, 90) + "…" : g.fact}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: `1px dashed ${theme.colors.borderLight}` }} />

        {/* Date range */}
        {selectionLabel ? (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
            <p style={headingStyle} className="mb-1">
              Selected Range
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "15px",
                fontWeight: 600,
                color: theme.colors.accent,
              }}
            >
              {selectionLabel}
            </p>
            <button
              onClick={onClearSelection}
              className="mt-1 hover:opacity-60 transition-opacity"
              style={{
                fontSize: "9px",
                color: theme.colors.inkLight,
                fontFamily: "'Josefin Sans', sans-serif",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Clear selection
            </button>
          </motion.div>
        ) : (
          <div>
            <p style={headingStyle} className="mb-1">
              Date Range
            </p>
            <p
              style={{
                fontSize: "10px",
                color: `${theme.colors.inkLight}80`,
                fontFamily: "'Josefin Sans', sans-serif",
                letterSpacing: "0.06em",
              }}
            >
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

      {/* Add note button */}
      <div
        className="p-4"
        style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
      >
        <motion.button
          onClick={onOpenNote}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2"
          style={{
            background: theme.colors.headerBg,
            color: theme.colors.headerText,
            boxShadow: `0 4px 18px ${theme.colors.shadow}`,
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <Pencil size={11} />
          {noteContent ? "Edit Notes" : "Add Notes"}
        </motion.button>
      </div>
    </div>
  );
}