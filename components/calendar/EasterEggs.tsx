"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";

interface EasterEggsProps {
  theme: FilmTheme;
}

const POSITION_CLASSES: Record<string, string> = {
  "bottom-left":  "absolute bottom-3 left-4",
  "bottom-right": "absolute bottom-3 right-4",
  "top-left":     "absolute top-2 left-4",
  "top-right":    "absolute top-2 right-4",
  "center":       "absolute bottom-8 left-1/2 -translate-x-1/2",
};

export function EasterEggs({ theme }: EasterEggsProps) {
  const [mounted, setMounted] = useState(false);
  const prevThemeId = useRef<string | null>(null);

  useEffect(() => {
    // On initial mount or theme change, schedule mount with delay
    // Avoid calling setState synchronously — always schedule via setTimeout
    const delay = prevThemeId.current === null ? 600 : 700;
    prevThemeId.current = theme.id;

    const t = setTimeout(() => setMounted(true), delay);
    return () => {
      clearTimeout(t);
      // Signal unmount for next render cycle — don't call setMounted(false) directly
      setMounted(false);
    };
  }, [theme.id]);

  if (!mounted) return null;

  return (
    <>
      {theme.easterEggs.map((egg, i) => {
        const posClass = POSITION_CLASSES[egg.position] ?? POSITION_CLASSES["bottom-left"];

        if (egg.type === "dialogue") {
          return (
            <motion.div
              key={`${theme.id}-egg-${i}`}
              className={`${posClass} pointer-events-none select-none`}
              initial={{ opacity: 0, x: egg.position.includes("right") ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.7, ease: "easeOut" }}
              style={{ zIndex: 1 }}
            >
              <p
                style={{
                  color: theme.colors.inkLight,
                  fontFamily: "var(--font-kalam, cursive)",
                  fontSize: "9px",
                  maxWidth: "170px",
                  opacity: 0.5,
                  lineHeight: 1.5,
                  transform: `rotate(${egg.position.includes("right") ? "1.5deg" : "-1deg"})`,
                }}
              >
                &ldquo;{egg.content}&rdquo;
              </p>
            </motion.div>
          );
        }

        if (egg.type === "symbol") {
          return (
            <motion.div
              key={`${theme.id}-egg-${i}`}
              className={`${posClass} pointer-events-none select-none`}
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2 + i * 0.18,
                type: "spring",
                stiffness: 180,
                damping: 14,
              }}
              style={{ zIndex: 1 }}
            >
              <motion.span
                className="block text-2xl md:text-3xl"
                animate={{
                  y:      [0, -5, 0, -3, 0],
                  rotate: [0, 6, -4, 3, 0],
                }}
                transition={{
                  duration: 5 + i * 1.2,
                  repeat: Infinity,
                  repeatDelay: 2 + i,
                  ease: "easeInOut",
                }}
                style={{ opacity: 0.28, filter: "grayscale(20%)" }}
              >
                {egg.content}
              </motion.span>
            </motion.div>
          );
        }

        if (egg.type === "stamp") {
          return (
            <motion.div
              key={`${theme.id}-egg-${i}`}
              className={`${posClass} pointer-events-none select-none`}
              initial={{ opacity: 0, scale: 1.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              transition={{
                delay: 0.3 + i * 0.2,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              style={{ zIndex: 1 }}
            >
              <div
                className="px-2 py-1 border-2 rounded"
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.accent,
                  fontSize: "8px",
                  fontFamily: "var(--font-josefin, sans-serif)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  opacity: 0.4,
                  transform: "rotate(-4deg)",
                }}
              >
                {egg.content}
              </div>
            </motion.div>
          );
        }

        return null;
      })}

      {/* Watermark short title behind grid */}
      <div
        className="absolute bottom-12 right-2 pointer-events-none select-none hidden lg:block"
        style={{ zIndex: 0 }}
      >
        <p
          style={{
            color: theme.colors.accent,
            fontFamily: theme.id === "mughal-e-azam" || theme.id === "bajirao" || theme.id === "devdas"
              ? "var(--font-eb-garamond, Georgia, serif)"
              : theme.id === "kkhh" || theme.id === "satya"
              ? "var(--font-bebas, sans-serif)"
              : "var(--font-playfair, Georgia, serif)",
            fontSize: "clamp(22px, 3vw, 36px)",
            fontWeight: 700,
            fontStyle: "italic",
            opacity: 0.032,
            transform: "rotate(-5deg)",
            maxWidth: "200px",
            textAlign: "right",
            lineHeight: 1.1,
            whiteSpace: "pre-line",
          }}
        >
          {theme.shortTitle}
        </p>
      </div>
    </>
  );
}