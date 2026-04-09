"use client";

import { useState } from "react";
import type { FilmTheme } from "@/types/theme";
import { MONTH_NAMES } from "@/lib/calendarUtils";

interface HeroSectionProps {
  theme: FilmTheme;
  monthIndex: number;
  year: number;
}

export function HeroSection({ theme, monthIndex, year }: HeroSectionProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative overflow-hidden" style={{ height: "clamp(180px, 30vh, 300px)" }}>
      {/* Gradient fallback */}
      <div
        className="absolute inset-0"
        style={{ background: theme.accentPattern }}
      />

      {/* Hero image */}
      {!imgError && (
        <img
          src={theme.heroImage}
          alt={theme.filmTitle}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: imgLoaded ? 1 : 0 }}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
        />
      )}

      {/* Film grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.08,
        }}
      />

      {/* Bottom gradient fade to paper */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "75%",
          background: `linear-gradient(to bottom, transparent 0%, ${theme.colors.paper} 100%)`,
        }}
      />

      {/* Top spiral fade */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: "50px",
          background: `linear-gradient(to bottom, ${theme.colors.paper} 0%, transparent 100%)`,
        }}
      />

      {/* Film info overlay */}
      <div className="absolute bottom-3 left-5 right-5">
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-[8px] uppercase tracking-[0.35em] font-bold mb-1"
              style={{ color: theme.colors.inkLight }}
            >
              {theme.director} · {theme.year}
            </p>
            <h2
              className="text-2xl md:text-3xl leading-none font-bold"
              style={{
                fontFamily: "'Crimson Text', Georgia, serif",
                color: theme.colors.ink,
                textShadow: `0 1px 12px ${theme.colors.paper}cc`,
              }}
            >
              {theme.shortTitle}
            </h2>
            <p
              className="text-[10px] mt-1 italic"
              style={{ color: theme.colors.inkLight }}
            >
              &ldquo;{theme.tagline}&rdquo;
            </p>
          </div>

          {/* Month badge */}
          <div
            className="text-right px-4 py-2 rounded-xl shadow-lg"
            style={{
              background: theme.colors.headerBg,
              color: theme.colors.headerText,
              boxShadow: `0 4px 20px ${theme.colors.shadow}`,
            }}
          >
            <div className="text-[9px] font-semibold tracking-widest uppercase opacity-80">
              {year}
            </div>
            <div
              className="text-xl md:text-2xl font-bold leading-none mt-0.5"
              style={{ fontFamily: "'Crimson Text', Georgia, serif" }}
            >
              {MONTH_NAMES[monthIndex].toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative film perforations - left edge */}
      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-around pointer-events-none" style={{ width: "14px", gap: "6px", padding: "8px 0" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-[8px] h-[6px] rounded-[1px] mx-auto"
            style={{ background: `${theme.colors.shadow}`, opacity: 0.3 }}
          />
        ))}
      </div>

      {/* Decorative film perforations - right edge */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-around pointer-events-none" style={{ width: "14px", gap: "6px", padding: "8px 0" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-[8px] h-[6px] rounded-[1px] mx-auto"
            style={{ background: `${theme.colors.shadow}`, opacity: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}