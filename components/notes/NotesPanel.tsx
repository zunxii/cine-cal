"use client";

import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatRangeLabel(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" });
  return `${fmt.format(start)} → ${fmt.format(end)}`;
}

interface NotesPanelProps {
  className?: string;
}

export function NotesPanel({ className = "" }: NotesPanelProps) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const selectedRange = useCalendarStore((s) => s.selectedRange);
  const updateNote = useCalendarStore((s) => s.updateNote);
  const clearNote = useCalendarStore((s) => s.clearNote);
  const note = useCalendarStore((s) => s.getNote(activeMonthIndex, activeYear));
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rangeLabel = useMemo(() => {
    if (note?.rangeLabel) return note.rangeLabel;
    if (selectedRange.start && selectedRange.end) {
      return formatRangeLabel(selectedRange.start, selectedRange.end);
    }
    return null;
  }, [note?.rangeLabel, selectedRange]);

  const monthName = MONTH_NAMES[activeMonthIndex];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [note?.content]);

  const lineCount = 20;

  return (
    <motion.section
      key={activeMonthIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`relative overflow-hidden flex flex-col ${className}`}
      style={{
        borderRadius: "16px",
        border: `1px solid ${activeTheme.colors.border}`,
        backgroundColor: activeTheme.colors.surface,
        transition: "border-color 0.8s ease, background-color 0.8s ease",
        minHeight: "400px",
      }}
    >
      {/* Lined paper background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 31px,
            ${activeTheme.colors.border}33 31px,
            ${activeTheme.colors.border}33 32px
          )`,
          backgroundPositionY: "60px",
          transition: "background-image 0.8s ease",
        }}
      />

      {/* Red margin line */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          left: "48px",
          width: "1px",
          backgroundColor: `${activeTheme.colors.accent}33`,
          transition: "background-color 0.8s ease",
        }}
      />

      {/* Header */}
      <div
        className="relative flex items-start justify-between gap-3 px-4 pt-4 pb-3"
        style={{
          borderBottom: `1px solid ${activeTheme.colors.border}`,
          transition: "border-color 0.8s ease",
        }}
      >
        <div className="pl-10">
          <p
            className="text-[9px] tracking-[0.35em] uppercase"
            style={{ color: activeTheme.colors.textMuted }}
          >
            Director's notebook
          </p>
          <h3
            className="text-xl mt-0.5 leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              color: activeTheme.colors.text,
              transition: "color 0.8s ease",
            }}
          >
            {monthName} {activeYear}
          </h3>

          {rangeLabel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-1.5 mt-1"
            >
              <span
                className="text-[8px]"
                style={{ color: activeTheme.colors.highlight }}
              >
                ✦
              </span>
              <span
                className="text-[9px] tracking-[0.15em]"
                style={{ color: activeTheme.colors.textMuted }}
              >
                Scene log: {rangeLabel}
              </span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Page corner fold decoration */}
          <div
            style={{
              width: "20px",
              height: "20px",
              borderLeft: `8px solid ${activeTheme.colors.accent}`,
              borderTop: `8px solid ${activeTheme.colors.accent}`,
              borderRight: "8px solid transparent",
              borderBottom: "8px solid transparent",
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* Golden date for this month */}
      {activeTheme.goldenDates.length > 0 && (
        <div
          className="relative px-4 py-2.5 flex items-start gap-3"
          style={{
            borderBottom: `1px solid ${activeTheme.colors.border}`,
            transition: "border-color 0.8s ease",
          }}
        >
          <div className="pl-10 flex items-start gap-2 w-full">
            <span
              className="text-[9px] flex-shrink-0 mt-0.5"
              style={{ color: activeTheme.colors.highlight }}
            >
              ✦
            </span>
            <div className="min-w-0">
              <p
                className="text-[8px] tracking-[0.25em] uppercase"
                style={{ color: activeTheme.colors.highlight }}
              >
                {activeTheme.goldenDates[0].filmReference}
              </p>
              <p
                className="text-[10px] leading-relaxed mt-0.5"
                style={{ color: activeTheme.colors.textMuted }}
              >
                {activeTheme.goldenDates[0].fact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Notes textarea */}
      <div className="relative flex-1 px-4 py-3">
        <div className="pl-10 relative h-full">
          {/* Placeholder hint */}
          {!note?.content && (
            <p
              className="absolute top-1 left-0 text-sm pointer-events-none italic"
              style={{
                color: `${activeTheme.colors.textMuted}55`,
                fontFamily: "var(--font-notes)",
              }}
            >
              Write a memo for {monthName}...
            </p>
          )}

          <textarea
            ref={textareaRef}
            value={note?.content ?? ""}
            onChange={(e) => updateNote(activeMonthIndex, activeYear, e.target.value)}
            className="w-full bg-transparent outline-none resize-none text-sm leading-8"
            style={{
              color: activeTheme.colors.text,
              fontFamily: "var(--font-notes)",
              caretColor: activeTheme.colors.accent,
              minHeight: "200px",
              height: "auto",
              border: "none",
              padding: 0,
              lineHeight: "32px", // matches lined paper
              transition: "color 0.8s ease",
            }}
            rows={8}
          />
        </div>
      </div>

      {/* Footer actions */}
      <div
        className="relative flex items-center justify-between px-4 py-2.5"
        style={{
          borderTop: `1px solid ${activeTheme.colors.border}`,
          transition: "border-color 0.8s ease",
        }}
      >
        <div className="pl-10">
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: activeTheme.colors.border }}
          >
            local only · autosaved
          </span>
        </div>

        {note?.content && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => clearNote(activeMonthIndex, activeYear)}
            className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full transition-all"
            style={{
              border: `1px solid ${activeTheme.colors.border}`,
              color: activeTheme.colors.textMuted,
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = activeTheme.colors.accent;
              (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.accent;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = activeTheme.colors.border;
              (e.currentTarget as HTMLButtonElement).style.color = activeTheme.colors.textMuted;
            }}
          >
            clear
          </motion.button>
        )}
      </div>
    </motion.section>
  );
}