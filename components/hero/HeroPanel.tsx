"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";

interface HeroPanelProps {
  className?: string;
}

// Curated cinematic images from Unsplash (reliable, no auth needed)
const THEME_IMAGES: Record<string, string> = {
  ddlj: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", // Alps/mountains golden
  kkhh: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&q=80", // forest light blue
  rdb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80", // amber dunes
  gow: "https://images.unsplash.com/photo-1517315003714-a071486bd9ea?w=800&q=80", // dark industrial
  satya: "https://images.unsplash.com/photo-1502920514313-52581002a659?w=800&q=80", // night city blue
  devdas: "https://images.unsplash.com/photo-1518895312237-a9e23508077d?w=800&q=80", // purple flowers
  jthj: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80", // snowy Ladakh
  lagaan: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80", // golden cricket field
  "three-idiots": "https://images.unsplash.com/photo-1495653797063-114787b77b23?w=800&q=80", // teal Pangong
  "mughal-e-azam": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", // dark marble
  "dil-chahta-hai": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", // Goa beach
  bajirao: "https://images.unsplash.com/photo-1477840539360-af932bfbc467?w=800&q=80", // golden palace
};

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { month: "short", day: "numeric" }).format(date);
}

export function HeroPanel({ className = "" }: HeroPanelProps) {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const selectedRange = useCalendarStore((s) => s.selectedRange);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hoveredGolden, setHoveredGolden] = useState<number | null>(null);

  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const selectedLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    return `${formatShort(start)} — ${formatShort(end)}`;
  }, [selectedRange]);

  const imgSrc = THEME_IMAGES[activeTheme.id];
  const featuredGolden = activeTheme.goldenDates[0] ?? null;
  const hoveredGoldenData = hoveredGolden !== null
    ? activeTheme.goldenDates.find(g => g.day === hoveredGolden)
    : null;

  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={activeTheme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative overflow-hidden ${className}`}
        style={{
          borderRadius: "16px",
          border: `1px solid ${activeTheme.colors.border}`,
          backgroundColor: activeTheme.colors.surface,
          transition: "border-color 0.8s ease, background-color 0.8s ease",
        }}
      >
        {/* Main hero image */}
        <div className="relative" style={{ aspectRatio: "16/7", overflow: "hidden", borderRadius: "15px 15px 0 0" }}>
          {/* Gradient base (shows before image loads or as fallback) */}
          <div
            className="absolute inset-0"
            style={{ background: activeTheme.heroGradient, transition: "background 0.8s ease" }}
          />

          {/* Actual image with cinematic overlay */}
          {imgSrc && (
            <img
              src={imgSrc}
              alt={activeTheme.filmTitle}
              className="absolute inset-0 w-full h-full transition-opacity duration-700"
              style={{
                objectFit: "cover",
                opacity: imgLoaded ? 1 : 0,
                filter: activeTheme.startsGrayscale ? "grayscale(1) contrast(1.1)" : "none",
              }}
              onLoad={() => setImgLoaded(true)}
            />
          )}

          {/* Cinematic color overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: activeTheme.colors.heroOverlay,
              mixBlendMode: "multiply",
            }}
          />

          {/* Bottom fade */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "70%",
              background: `linear-gradient(to bottom, transparent, ${activeTheme.colors.surface}ee)`,
              transition: "background 0.8s ease",
            }}
          />

          {/* Film perforation holes - sides */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly py-2 pl-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "14px",
                  borderRadius: "2px",
                  border: `1px solid rgba(255,255,255,0.2)`,
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly py-2 pr-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "14px",
                  borderRadius: "2px",
                  border: `1px solid rgba(255,255,255,0.2)`,
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>

          {/* Year + Month badge - top right */}
          <div className="absolute top-4 right-12 text-right">
            <div
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {activeYear}
            </div>
            <div
              className="text-2xl md:text-4xl font-bold leading-none"
              style={{
                fontFamily: "var(--font-display)",
                color: activeTheme.colors.accent,
                textShadow: `0 0 40px ${activeTheme.colors.accent}88`,
                transition: "color 0.8s ease",
              }}
            >
              {MONTH_NAMES[activeMonthIndex].toUpperCase()}
            </div>
          </div>

          {/* Film info overlay - bottom */}
          <div className="absolute bottom-0 left-12 right-12 p-4">
            <motion.div
              key={activeTheme.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <p
                className="text-xs tracking-[0.35em] uppercase mb-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {activeTheme.director} · {activeTheme.year}
              </p>
              <h2
                className="text-lg md:text-2xl leading-tight font-medium"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "rgba(255,255,255,0.95)",
                  textShadow: "0 2px 20px rgba(0,0,0,0.8)",
                  maxWidth: "80%",
                }}
              >
                {activeTheme.filmTitle}
              </h2>
              <p
                className="text-xs mt-1 italic"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                "{activeTheme.tagline}"
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom info strip */}
        <div
          className="flex items-start justify-between gap-4 px-4 py-3"
          style={{ backgroundColor: activeTheme.colors.surface, transition: "background-color 0.8s ease" }}
        >
          {/* Selected range */}
          <div className="flex-1 min-w-0">
            {selectedLabel ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: activeTheme.colors.accent,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${activeTheme.colors.accent}`,
                  }}
                />
                <div>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase"
                    style={{ color: activeTheme.colors.textMuted }}
                  >
                    selected range
                  </p>
                  <p
                    className="text-sm font-medium mt-0.5"
                    style={{ color: activeTheme.colors.text, fontFamily: "var(--font-display)" }}
                  >
                    {selectedLabel}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div>
                <p
                  className="text-[9px] tracking-[0.3em] uppercase"
                  style={{ color: activeTheme.colors.textMuted }}
                >
                  click to select range
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: activeTheme.colors.border }}
                >
                  start → end date
                </p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "1px",
              alignSelf: "stretch",
              backgroundColor: activeTheme.colors.border,
              flexShrink: 0,
            }}
          />

          {/* Golden dates */}
          <div className="flex-1 min-w-0">
            {featuredGolden ? (
              <div
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredGolden(featuredGolden.day)}
                onMouseLeave={() => setHoveredGolden(null)}
              >
                <p
                  className="text-[9px] tracking-[0.3em] uppercase flex items-center gap-1"
                  style={{ color: activeTheme.colors.highlight }}
                >
                  <span style={{ fontSize: "8px" }}>✦</span>
                  featured trivia
                </p>
                <p
                  className="text-xs mt-0.5 leading-relaxed line-clamp-2"
                  style={{ color: activeTheme.colors.textMuted, transition: "color 0.3s ease" }}
                >
                  {hoveredGolden !== null && hoveredGoldenData
                    ? hoveredGoldenData.fact
                    : featuredGolden.fact}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}