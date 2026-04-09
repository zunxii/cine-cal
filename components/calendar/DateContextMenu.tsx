"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Pencil } from "lucide-react";
import type { FilmTheme } from "@/types/theme";

interface DateContextMenuProps {
  theme: FilmTheme;
  pos: { x: number; y: number };
  dayNumber: number;
  date: Date;
  isMarked: boolean;
  onMark: () => void;
  onNote: () => void;
  onClose: () => void;
}

export function DateContextMenu({
  theme,
  pos,
  date,
  isMarked,
  onMark,
  onNote,
  onClose,
}: DateContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener("click", handleClick, { passive: true });
    return () => document.removeEventListener("click", handleClick);
  }, [onClose]);

  // Clamp position so menu stays in viewport
  const x = typeof window !== "undefined"
    ? Math.min(pos.x, window.innerWidth - 200)
    : pos.x;
  const y = typeof window !== "undefined"
    ? Math.min(pos.y, window.innerHeight - 120)
    : pos.y;

  const dateLabel = date.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        className="fixed z-[60] rounded-xl overflow-hidden"
        style={{
          left: x,
          top: y,
          background: theme.colors.paper,
          border: `1.5px solid ${theme.colors.border}`,
          boxShadow: `0 12px 40px ${theme.colors.shadow}, 0 4px 16px rgba(0,0,0,0.1)`,
          minWidth: 180,
        }}
        initial={{ opacity: 0, scale: 0.88, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: -4 }}
        transition={{ duration: 0.14, ease: "easeOut" }}
      >
        <div
          className="px-3 py-2"
          style={{ borderBottom: `1px solid ${theme.colors.borderLight}` }}
        >
          <p className="text-[9px] font-semibold truncate" style={{ color: theme.colors.inkLight }}>
            {dateLabel}
          </p>
        </div>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] hover:opacity-70 transition-opacity text-left"
          style={{ color: theme.colors.ink }}
          onClick={(e) => {
            e.stopPropagation();
            onMark();
            onClose();
          }}
        >
          <Star
            size={13}
            style={{ color: theme.colors.gold }}
            fill={isMarked ? theme.colors.gold : "none"}
          />
          {isMarked ? "Unmark this date" : "Mark this date"}
        </button>

        <button
          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[12px] hover:opacity-70 transition-opacity text-left"
          style={{ color: theme.colors.ink }}
          onClick={(e) => {
            e.stopPropagation();
            onNote();
            onClose();
          }}
        >
          <Pencil size={13} style={{ color: theme.colors.accent }} />
          Add a note
        </button>
      </motion.div>
    </AnimatePresence>
  );
}