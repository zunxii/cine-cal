"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";
import type { FilmTheme } from "@/types/theme";

interface NotePreviewProps {
  content: string;
  theme: FilmTheme;
  onEdit: () => void;
}

export function NotePreview({ content, theme, onEdit }: NotePreviewProps) {
  const preview = content.length > 80 ? content.slice(0, 80) + "..." : content;

  return (
    <AnimatePresence>
      {content && (
        <motion.button
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.95 }}
          onClick={onEdit}
          className="w-full text-left"
        >
          <div
            className="rounded-xl p-3 relative overflow-hidden group hover:shadow-md transition-shadow"
            style={{
              background: theme.colors.paperAlt,
              border: `1px dashed ${theme.colors.border}`,
              boxShadow: `0 2px 8px ${theme.colors.shadow}`,
            }}
          >
            {/* Lined paper lines */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  to bottom,
                  transparent,
                  transparent 15px,
                  ${theme.colors.borderLight} 15px,
                  ${theme.colors.borderLight} 16px
                )`,
                backgroundPositionY: "4px",
              }}
            />

            <div className="relative">
              <div className="flex items-start justify-between mb-1.5 gap-2">
                <p
                  className="text-[8px] uppercase tracking-widest font-bold"
                  style={{ color: theme.colors.accent }}
                >
                  ✦ Month Notes
                </p>
                <Pencil
                  size={9}
                  style={{ color: theme.colors.inkLight, flexShrink: 0, marginTop: 1 }}
                />
              </div>
              <p
                className="text-[10px] leading-relaxed"
                style={{
                  color: theme.colors.ink,
                  fontFamily: "'Kalam', cursive",
                }}
              >
                {preview}
              </p>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}