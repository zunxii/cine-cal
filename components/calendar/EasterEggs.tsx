"use client";

import { motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";

interface EasterEggsProps {
  theme: FilmTheme;
}

export function EasterEggs({ theme }: EasterEggsProps) {
  return (
    <>
      {theme.easterEggs.map((egg, i) => {
        const positionClass = {
          "bottom-left": "absolute bottom-2 left-4",
          "bottom-right": "absolute bottom-2 right-4",
          "top-left": "absolute top-12 left-4",
          "top-right": "absolute top-12 right-4",
          "center": "absolute bottom-8 left-1/2 -translate-x-1/2",
        }[egg.position];

        if (egg.type === "dialogue") {
          return (
            <motion.div
              key={i}
              className={`${positionClass} pointer-events-none select-none`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.2, duration: 0.6 }}
            >
              <p
                className="text-[9px] italic font-medium"
                style={{
                  color: theme.colors.inkLight,
                  fontFamily: "'Crimson Text', Georgia, serif",
                  maxWidth: "160px",
                  opacity: 0.45,
                  lineHeight: 1.4,
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
              key={i}
              className={`${positionClass} pointer-events-none select-none`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.0 + i * 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.span
                className="text-2xl block"
                animate={{
                  rotate: [0, 8, -8, 0],
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                style={{ opacity: 0.3, filter: "grayscale(30%)" }}
              >
                {egg.content}
              </motion.span>
            </motion.div>
          );
        }

        return null;
      })}

      {/* Decorative watermark quote behind calendar grid */}
      <div
        className="absolute bottom-16 right-4 pointer-events-none select-none hidden lg:block"
        style={{ zIndex: 0 }}
      >
        <p
          className="text-[28px] leading-tight font-bold italic"
          style={{
            color: theme.colors.accent,
            fontFamily: "'Crimson Text', Georgia, serif",
            opacity: 0.04,
            transform: "rotate(-3deg)",
            maxWidth: "200px",
            textAlign: "right",
          }}
        >
          {theme.shortTitle}
        </p>
      </div>
    </>
  );
}