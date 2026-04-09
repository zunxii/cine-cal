"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";
import { MONTH_NAMES } from "@/lib/calendarUtils";

// Film-specific font families
const DISPLAY_FONTS: Record<string, string> = {
  ddlj:            "'Playfair Display', Georgia, serif",
  kkhh:            "'Bebas Neue', Impact, sans-serif",
  rdb:             "'Oswald', 'Arial Narrow', sans-serif",
  gow:             "'Teko', Impact, sans-serif",
  satya:           "'Bebas Neue', Impact, sans-serif",
  devdas:          "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
  jthj:            "'Cinzel', Georgia, serif",
  lagaan:          "'Oswald', 'Arial Narrow', sans-serif",
  "three-idiots":  "'Righteous', 'Nunito', sans-serif",
  "mughal-e-azam": "'Cinzel', 'Playfair Display', Georgia, serif",
  "dil-chahta-hai":"'Josefin Sans', 'Raleway', sans-serif",
  bajirao:         "'Cormorant Garamond', Georgia, serif",
};

const BODY_FONTS: Record<string, string> = {
  ddlj:            "'Lora', Georgia, serif",
  kkhh:            "'Nunito', sans-serif",
  rdb:             "'Barlow', sans-serif",
  gow:             "'Barlow', sans-serif",
  satya:           "'Barlow Condensed', sans-serif",
  devdas:          "'EB Garamond', Georgia, serif",
  jthj:            "'Raleway', sans-serif",
  lagaan:          "'Source Sans 3', sans-serif",
  "three-idiots":  "'Nunito', sans-serif",
  "mughal-e-azam": "'Libre Baskerville', Georgia, serif",
  "dil-chahta-hai":"'Josefin Sans', sans-serif",
  bajirao:         "'EB Garamond', Georgia, serif",
};

interface HeroSectionProps {
  theme: FilmTheme;
  monthIndex: number;
  year: number;
}

export function HeroSection({ theme, monthIndex, year }: HeroSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [flickered, setFlickered] = useState(false);

  const displayFont = DISPLAY_FONTS[theme.id] ?? "'Playfair Display', Georgia, serif";
  const bodyFont = BODY_FONTS[theme.id] ?? "'Lora', Georgia, serif";

  // Projector flicker on mount
  useEffect(() => {
    setFlickered(false);
    const t = setTimeout(() => setFlickered(true), 50);
    return () => clearTimeout(t);
  }, [theme.id]);

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "clamp(190px, 32vh, 320px)" }}
    >
      {/* Gradient fallback background */}
      <div
        className="absolute inset-0"
        style={{ background: theme.accentPattern }}
      />

      {/* Hero image */}
      {!imgError && (
        <img
          src={theme.heroImage}
          alt={theme.filmTitle}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.8s ease",
            filter: theme.id === "mughal-e-azam" ? "grayscale(0.6) sepia(0.3)" : "none",
          }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Projector flicker overlay */}
      {flickered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ background: "rgba(255,255,255,0.15)" }}
        />
      )}

      {/* Film grain on hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />

      {/* Bottom gradient fade to paper color */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "38%",
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.paper}f0 85%, ${theme.colors.paper} 100%)`,
        }}
      />

      {/* Top fade (for spiral binding) */}
      {/* <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "48px",
          background: `linear-gradient(to bottom, ${theme.colors.paper} 0%, transparent 100%)`,
        }}
      /> */}

      {/* Film perforation strips */}
      <div
        className="absolute left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "16px",
          background: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 10px,
            ${theme.colors.shadow} 10px,
            ${theme.colors.shadow} 16px,
            transparent 16px,
            transparent 22px
          )`,
          opacity: 0.35,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: "16px",
          background: `repeating-linear-gradient(
            to bottom,
            transparent 0px,
            transparent 10px,
            ${theme.colors.shadow} 10px,
            ${theme.colors.shadow} 16px,
            transparent 16px,
            transparent 22px
          )`,
          opacity: 0.35,
        }}
      />

      {/* Film info overlay */}
      <div className="absolute bottom-3 left-5 right-5">
        <div className="flex items-end justify-between gap-3">
          {/* Film title block */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p
              className="text-[8px] uppercase tracking-[0.35em] font-semibold mb-1"
              style={{
                color: theme.colors.inkLight,
                fontFamily: "'Josefin Sans', sans-serif",
              }}
            >
              {theme.director} · {theme.year}
            </p>
            <h2
              className="leading-none font-bold"
              style={{
                fontFamily: displayFont,
                color: theme.colors.ink,
                fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
                textShadow: `0 2px 20px ${theme.colors.paper}cc, 0 1px 4px ${theme.colors.paper}88`,
                letterSpacing: theme.id === "gow" || theme.id === "satya" ? "0.04em" : "0",
              }}
            >
              {theme.shortTitle}
            </h2>
            <p
              className="text-[10px] mt-1.5 italic leading-snug"
              style={{
                color: theme.colors.inkLight,
                fontFamily: bodyFont,
                maxWidth: "280px",
                opacity: 0.85,
              }}
            >
              &ldquo;{theme.tagline}&rdquo;
            </p>
          </motion.div>

          {/* Month badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="text-right flex-shrink-0 px-4 py-2.5 rounded-xl"
            style={{
              background: theme.colors.headerBg,
              color: theme.colors.headerText,
              boxShadow: `0 6px 24px ${theme.colors.shadow}, 0 2px 8px rgba(0,0,0,0.15)`,
            }}
          >
            <div
              className="text-[8px] font-semibold tracking-[0.25em] uppercase opacity-75"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              {year}
            </div>
            <div
              className="text-xl md:text-2xl font-bold leading-none mt-0.5"
              style={{ fontFamily: displayFont, letterSpacing: "0.04em" }}
            >
              {MONTH_NAMES[monthIndex].toUpperCase()}
            </div>
            <div
              className="text-[7px] tracking-widest uppercase opacity-60 mt-0.5"
              style={{ fontFamily: "'Josefin Sans', sans-serif" }}
            >
              {theme.mood}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}