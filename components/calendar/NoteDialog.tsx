"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import type { FilmTheme } from "@/types/theme";
import type { MonthNote } from "@/types/calendar";
import type { MonthIndex } from "@/types/theme";
import { MONTH_NAMES } from "@/lib/calendarUtils";

interface NoteDialogProps {
  theme: FilmTheme;
  monthIndex: MonthIndex;
  year: number;
  note: MonthNote | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (content: string) => void;
  onClear: () => void;
}

export function NoteDialog({
  theme,
  monthIndex,
  year,
  note,
  isOpen,
  onClose,
  onUpdate,
  onClear,
}: NoteDialogProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textRef.current) {
      setTimeout(() => textRef.current?.focus(), 120);
    }
  }, [isOpen]);

  const labelStyle = {
    fontFamily: "'Josefin Sans', sans-serif",
    fontSize: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.22em",
    fontWeight: 700,
  };

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
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(5px)",
            }}
          />

          {/* Dialog */}
          <motion.div className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: theme.colors.paper,
                border: `2px solid ${theme.colors.border}`,
                boxShadow: `0 30px 80px ${theme.colors.shadow}, 0 10px 30px rgba(0,0,0,0.20)`,
                maxHeight: "82vh",
              }}
              initial={{ opacity: 0, scale: 0.86, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 26 }}
            >
              {/* Accent top strip */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(to right, ${theme.colors.accent}, ${theme.colors.gold})` }}
              />

              {/* Header */}
              <div
                className="px-5 pt-4 pb-3"
                style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ ...labelStyle, color: theme.colors.inkLight }}>
                      Director&apos;s Notebook
                    </p>
                    <h3
                      className="mt-0.5 leading-tight"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: theme.colors.ink,
                      }}
                    >
                      {MONTH_NAMES[monthIndex]} {year}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 hover:opacity-60 transition-opacity flex-shrink-0"
                    style={{
                      color: theme.colors.inkLight,
                      background: theme.colors.paperAlt,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Film quote banner */}
              <div
                className="px-5 py-3"
                style={{
                  background: `linear-gradient(to right, ${theme.colors.accentSoft}60, ${theme.colors.accentSoft}20)`,
                  borderBottom: `1px dashed ${theme.colors.border}`,
                }}
              >
                <p
                  className="italic leading-relaxed"
                  style={{
                    color: theme.colors.inkLight,
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "10px",
                    opacity: 0.9,
                  }}
                >
                  &ldquo;{theme.quote}&rdquo;
                </p>
                <p
                  className="mt-1 uppercase"
                  style={{
                    ...labelStyle,
                    color: theme.colors.accent,
                    letterSpacing: "0.18em",
                  }}
                >
                  — {theme.shortTitle}
                </p>
              </div>

              {/* Lined paper textarea */}
              <div
                className="relative flex-1 overflow-hidden"
                style={{ minHeight: "220px", maxHeight: "280px" }}
              >
                {/* Horizontal lines */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      to bottom,
                      transparent,
                      transparent 31px,
                      ${theme.colors.borderLight}90 31px,
                      ${theme.colors.borderLight}90 32px
                    )`,
                    backgroundPositionY: "8px",
                  }}
                />

                {/* Red margin line */}
                <div
                  className="absolute top-0 bottom-0 left-10 w-px pointer-events-none"
                  style={{ background: `${theme.colors.accent}22` }}
                />

                {/* Placeholder */}
                {!note?.content && (
                  <p
                    className="absolute top-4 left-12 pointer-events-none italic select-none"
                    style={{
                      color: `${theme.colors.inkLight}40`,
                      fontFamily: "'Kalam', cursive",
                      fontSize: "13px",
                    }}
                  >
                    Write your scene notes…
                  </p>
                )}

                <textarea
                  ref={textRef}
                  value={note?.content ?? ""}
                  onChange={(e) => onUpdate(e.target.value)}
                  className="absolute inset-0 w-full h-full resize-none bg-transparent border-none outline-none pl-12 pr-4 py-4"
                  style={{
                    color: theme.colors.ink,
                    fontFamily: "'Kalam', cursive",
                    fontSize: "13px",
                    caretColor: theme.colors.accent,
                    lineHeight: "32px",
                  }}
                />
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
              >
                <span
                  style={{
                    ...labelStyle,
                    color: theme.colors.borderLight,
                    fontSize: "7px",
                  }}
                >
                  autosaved · local
                </span>

                <div className="flex items-center gap-2">
                  {note?.content && (
                    <button
                      onClick={() => { onClear(); }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg hover:opacity-70 transition-opacity"
                      style={{
                        color: theme.colors.inkLight,
                        background: theme.colors.paperAlt,
                        fontFamily: "'Josefin Sans', sans-serif",
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      <Trash2 size={10} /> Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
                    style={{
                      background: theme.colors.headerBg,
                      color: theme.colors.headerText,
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                    }}
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}