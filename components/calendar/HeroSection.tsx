"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { FilmTheme } from "@/types/theme";
import { MONTH_NAMES } from "@/lib/calendarUtils";

// Film-specific font families using CSS variables from next/font
const DISPLAY_FONTS: Record<string, string> = {
  ddlj:            "var(--font-playfair, Georgia, serif)",
  kkhh:            "var(--font-bebas, Impact, sans-serif)",
  rdb:             "var(--font-oswald, 'Arial Narrow', sans-serif)",
  gow:             "var(--font-teko, Impact, sans-serif)",
  satya:           "var(--font-bebas, Impact, sans-serif)",
  devdas:          "var(--font-eb-garamond, Georgia, serif)",
  jthj:            "var(--font-cinzel, Georgia, serif)",
  lagaan:          "var(--font-oswald, 'Arial Narrow', sans-serif)",
  "three-idiots":  "var(--font-righteous, sans-serif)",
  "mughal-e-azam": "var(--font-cinzel, Georgia, serif)",
  "dil-chahta-hai":"var(--font-josefin, sans-serif)",
  bajirao:         "var(--font-eb-garamond, Georgia, serif)",
};

const BODY_FONTS: Record<string, string> = {
  ddlj:            "var(--font-lora, Georgia, serif)",
  kkhh:            "var(--font-nunito, sans-serif)",
  rdb:             "var(--font-barlow, sans-serif)",
  gow:             "var(--font-barlow, sans-serif)",
  satya:           "var(--font-barlow-condensed, sans-serif)",
  devdas:          "var(--font-eb-garamond, Georgia, serif)",
  jthj:            "var(--font-raleway, sans-serif)",
  lagaan:          "var(--font-source-sans, sans-serif)",
  "three-idiots":  "var(--font-nunito, sans-serif)",
  "mughal-e-azam": "var(--font-libre-baskerville, Georgia, serif)",
  "dil-chahta-hai":"var(--font-josefin, sans-serif)",
  bajirao:         "var(--font-eb-garamond, Georgia, serif)",
};

interface HeroSectionProps {
  theme: FilmTheme;
  monthIndex: number;
  year: number;
}

export function HeroSection({ theme, monthIndex, year }: HeroSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  // Use a key to force re-mount the flicker overlay on theme change
  const [flickerKey, setFlickerKey] = useState(0);
  const prevThemeId = useRef(theme.id);

  const displayFont = DISPLAY_FONTS[theme.id] ?? "var(--font-playfair, Georgia, serif)";
  const bodyFont = BODY_FONTS[theme.id] ?? "var(--font-lora, Georgia, serif)";

  // Reset image state and trigger flicker when theme changes
  // Using a ref to avoid calling setState synchronously in the effect body
  useEffect(() => {
    if (prevThemeId.current !== theme.id) {
      prevThemeId.current = theme.id;
      // Schedule all state updates to avoid cascading renders
      const t = setTimeout(() => {
        setImgLoaded(false);
        setImgError(false);
        setFlickerKey((k) => k + 1);
      }, 0);
      return () => clearTimeout(t);
    }
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

      {/* Hero image using next/image */}
      {!imgError && (
        <div className="absolute inset-0">
          <Image
            src={theme.heroImage}
            alt={theme.filmTitle}
            fill
            className="object-cover"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.8s ease",
              filter: theme.id === "mughal-e-azam" ? "grayscale(0.6) sepia(0.3)" : "none",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
          />
        </div>
      )}

      {/* Projector flicker overlay — re-mounts on key change, no setState in effect */}
      <motion.div
        key={`flicker-${flickerKey}`}
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        style={{ background: "rgba(255,255,255,0.15)" }}
      />

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
                fontFamily: "var(--font-josefin, sans-serif)",
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
              {theme.filmTitle}
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
            className="text-right flex-shrink-0 mx-4 px-4 py-2.5 rounded-xl"
            style={{
              background: theme.colors.headerBg,
              color: theme.colors.headerText,
              boxShadow: `0 6px 24px ${theme.colors.shadow}, 0 2px 8px rgba(0,0,0,0.15)`,
            }}
          >
            <div
              className="text-[8px] font-semibold tracking-[0.25em] uppercase opacity-75"
              style={{ fontFamily: "var(--font-josefin, sans-serif)" }}
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
              style={{ fontFamily: "var(--font-josefin, sans-serif)" }}
            >
              {theme.mood}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}