"use client";

import { motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";

interface EasterEggsProps {
  theme: FilmTheme;
}

// Theme-specific decorative elements (bullet holes, blood stains, etc.)
function ThematicDecor({ theme }: { theme: FilmTheme }) {
  if (theme.id === "gow" || theme.id === "satya") {
    return (
      <>
        {/* Bullet holes */}
        {[
          { x: "8%",  y: "15%", size: 10, opacity: 0.35 },
          { x: "92%", y: "22%", size: 7,  opacity: 0.28 },
          { x: "5%",  y: "75%", size: 12, opacity: 0.3  },
        ].map((hole, i) => (
          <div
            key={i}
            className="bullet-hole absolute"
            style={{
              left: hole.x,
              top: hole.y,
              width: hole.size,
              height: hole.size,
              opacity: hole.opacity,
            }}
          />
        ))}
        {/* Radiating crack lines from one bullet */}
        <svg
          className="absolute pointer-events-none"
          style={{ left: "8%", top: "15%", width: 40, height: 40, opacity: 0.15 }}
          viewBox="0 0 40 40"
        >
          <line x1="20" y1="20" x2="0"  y2="5"  stroke={theme.colors.ink} strokeWidth="0.8"/>
          <line x1="20" y1="20" x2="40" y2="8"  stroke={theme.colors.ink} strokeWidth="0.8"/>
          <line x1="20" y1="20" x2="35" y2="38" stroke={theme.colors.ink} strokeWidth="0.8"/>
          <line x1="20" y1="20" x2="5"  y2="38" stroke={theme.colors.ink} strokeWidth="0.8"/>
        </svg>
      </>
    );
  }

  if (theme.id === "devdas") {
    // Rose petals watermark
    return (
      <div
        className="absolute bottom-12 right-4 pointer-events-none select-none text-[48px] opacity-[0.06]"
        style={{ transform: "rotate(-15deg)", filter: "grayscale(50%)" }}
      >
        🌹
      </div>
    );
  }

  if (theme.id === "bajirao") {
    // Crossed swords watermark
    return (
      <div
        className="absolute top-8 right-6 pointer-events-none select-none text-[56px] opacity-[0.06]"
        style={{ transform: "rotate(20deg)" }}
      >
        ⚔️
      </div>
    );
  }

  if (theme.id === "lagaan") {
    return (
      <div
        className="absolute bottom-8 left-4 pointer-events-none select-none text-[52px] opacity-[0.07]"
        style={{ transform: "rotate(-8deg)" }}
      >
        🏏
      </div>
    );
  }

  return null;
}

export function EasterEggs({ theme }: EasterEggsProps) {
  return (
    <>
      {/* Thematic decorations per film */}
      <ThematicDecor theme={theme} />

      {/* Dialogue / symbol easter eggs */}
      {theme.easterEggs.map((egg, i) => {
        const positionStyle: React.CSSProperties = {
          "bottom-left":  { position: "absolute", bottom: "0.5rem",  left:  "1rem"              },
          "bottom-right": { position: "absolute", bottom: "0.5rem",  right: "1rem"              },
          "top-left":     { position: "absolute", top:    "3rem",    left:  "1rem"              },
          "top-right":    { position: "absolute", top:    "3rem",    right: "1rem"              },
          "center":       { position: "absolute", bottom: "2rem",    left:  "50%", transform: "translateX(-50%)" },
        }[egg.position] as React.CSSProperties;

        if (egg.type === "dialogue") {
          return (
            <motion.div
              key={i}
              className="pointer-events-none select-none easter-egg-dialogue"
              style={positionStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
            >
              &ldquo;{egg.content}&rdquo;
            </motion.div>
          );
        }

        if (egg.type === "symbol") {
          return (
            <motion.div
              key={i}
              className="pointer-events-none select-none"
              style={{ ...positionStyle }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + i * 0.15, type: "spring", stiffness: 200, damping: 15 }}
            >
              <motion.span
                className="text-2xl block"
                animate={{ rotate: [0, 8, -8, 0], y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                style={{ opacity: 0.25, filter: "grayscale(20%)" }}
              >
                {egg.content}
              </motion.span>
            </motion.div>
          );
        }

        return null;
      })}

      {/* Film title watermark behind the grid */}
      <div
        className="absolute bottom-16 right-2 pointer-events-none select-none hidden lg:block"
        style={{ zIndex: 0 }}
      >
        <p
          className="text-[32px] leading-tight font-bold italic"
          style={{
            fontFamily: "var(--f-display)",
            color: theme.colors.accent,
            opacity: 0.045,
            transform: "rotate(-3deg)",
            maxWidth: "210px",
            textAlign: "right",
          }}
        >
          {theme.shortTitle}
        </p>
      </div>

      {/* Subtle ink stamp / seal in corner */}
      <motion.div
        className="absolute top-2 left-2 pointer-events-none select-none hidden lg:block"
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 0.08, rotate: -15 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div
          className="text-[9px] font-bold uppercase tracking-[0.3em] border rounded-full px-2 py-1"
          style={{
            color: theme.colors.accent,
            borderColor: theme.colors.accent,
            fontFamily: "var(--f-oswald, var(--f-display))",
          }}
        >
          {theme.year}
        </div>
      </motion.div>
    </>
  );
}