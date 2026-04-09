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
      setTimeout(() => textRef.current?.focus(), 100);
    }
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              background: `rgba(0,0,0,0.4)`,
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Dialog */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto w-full max-w-md rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: theme.colors.paper,
                border: `2px solid ${theme.colors.border}`,
                boxShadow: `0 25px 80px ${theme.colors.shadow}, 0 8px 32px rgba(0,0,0,0.2)`,
                maxHeight: "80vh",
              }}
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* Decorative top strip */}
              <div
                className="h-1 w-full"
                style={{ background: theme.colors.headerBg }}
              />

              {/* Header */}
              <div
                className="px-5 pt-4 pb-3"
                style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="text-[8px] uppercase tracking-[0.35em] font-bold"
                      style={{ color: theme.colors.inkLight }}
                    >
                      Director&apos;s Notebook
                    </p>
                    <h3
                      className="text-xl mt-0.5 leading-tight font-semibold"
                      style={{
                        fontFamily: "'Crimson Text', Georgia, serif",
                        color: theme.colors.ink,
                      }}
                    >
                      {MONTH_NAMES[monthIndex]} {year}
                    </h3>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-full p-1.5 transition-opacity hover:opacity-60 flex-shrink-0"
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
                className="px-5 py-2.5"
                style={{
                  background: theme.colors.accentSoft,
                  borderBottom: `1px dashed ${theme.colors.border}`,
                }}
              >
                <p
                  className="text-[10px] italic leading-relaxed"
                  style={{
                    color: theme.colors.inkLight,
                    fontFamily: "'Crimson Text', Georgia, serif",
                  }}
                >
                  &ldquo;{theme.quote}&rdquo;
                </p>
                <p
                  className="text-[8px] mt-1 uppercase tracking-widest font-bold"
                  style={{ color: theme.colors.accent }}
                >
                  — {theme.shortTitle}
                </p>
              </div>

              {/* Lined paper textarea */}
              <div className="relative flex-1 overflow-hidden" style={{ minHeight: "220px", maxHeight: "280px" }}>
                {/* Lined paper effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(
                      to bottom,
                      transparent,
                      transparent 31px,
                      ${theme.colors.borderLight} 31px,
                      ${theme.colors.borderLight} 32px
                    )`,
                    backgroundPositionY: "8px",
                    opacity: 0.7,
                  }}
                />

                {/* Red margin line */}
                <div
                  className="absolute top-0 bottom-0 left-10 w-px pointer-events-none"
                  style={{ background: `${theme.colors.accent}25` }}
                />

                {/* Placeholder */}
                {!note?.content && (
                  <p
                    className="absolute top-4 left-12 text-sm pointer-events-none italic select-none"
                    style={{
                      color: `${theme.colors.inkLight}50`,
                      fontFamily: "'Kalam', cursive",
                    }}
                  >
                    Write your scene notes...
                  </p>
                )}

                <textarea
                  ref={textRef}
                  value={note?.content ?? ""}
                  onChange={(e) => onUpdate(e.target.value)}
                  className="absolute inset-0 w-full h-full resize-none bg-transparent border-none outline-none pl-12 pr-4 py-4 text-sm"
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
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${theme.colors.borderLight}` }}
              >
                <span
                  className="text-[8px] uppercase tracking-widest"
                  style={{ color: `${theme.colors.borderLight}` }}
                >
                  autosaved · local storage
                </span>

                <div className="flex items-center gap-2">
                  {note?.content && (
                    <button
                      onClick={() => {
                        onClear();
                      }}
                      className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg transition-opacity hover:opacity-70"
                      style={{
                        color: theme.colors.inkLight,
                        background: theme.colors.paperAlt,
                      }}
                    >
                      <Trash2 size={10} /> Clear
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-[10px] px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
                    style={{
                      background: theme.colors.headerBg,
                      color: theme.colors.headerText,
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