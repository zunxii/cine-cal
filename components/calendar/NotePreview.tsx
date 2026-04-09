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
  const preview = content.length > 90 ? content.slice(0, 90) + "…" : content;

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
              boxShadow: `0 2px 10px ${theme.colors.shadow}`,
            }}
          >
            {/* Lined paper */}
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
                  style={{
                    fontFamily: "var(--font-josefin, sans-serif)",
                    fontSize: "7px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                    color: theme.colors.accent,
                  }}
                >
                  ✦ Month Notes
                </p>
                <Pencil
                  size={9}
                  style={{ color: theme.colors.inkLight, flexShrink: 0, marginTop: 1 }}
                />
              </div>
              <p
                style={{
                  fontSize: "10px",
                  lineHeight: 1.6,
                  color: theme.colors.ink,
                  fontFamily: "var(--font-kalam, cursive)",
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