"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { HeroPanel } from "@/components/hero/HeroPanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore, initThemeCSSVars } from "@/store/themeStore";

export default function HomePage() {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const [prevMonthIndex, setPrevMonthIndex] = useState(activeMonthIndex);
  const [isFlickering, setIsFlickering] = useState(false);
  const [showFilmStrip, setShowFilmStrip] = useState(true);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    initThemeCSSVars(activeMonthIndex);
  }, []);

  // Projector flicker on month change
  useEffect(() => {
    if (activeMonthIndex !== prevMonthIndex) {
      setIsFlickering(true);
      const t = setTimeout(() => {
        setIsFlickering(false);
        setPrevMonthIndex(activeMonthIndex);
      }, 700);
      return () => clearTimeout(t);
    }
  }, [activeMonthIndex, prevMonthIndex]);

  // Film grain canvas
  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animFrame: number;

    const drawGrain = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
      animFrame = requestAnimationFrame(drawGrain);
    };

    drawGrain();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <main
      className="relative w-full min-h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
        transition: "background-color 0.8s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Animated grain canvas */}
      <canvas
        ref={grainRef}
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{ opacity: 0.4 }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Projector flicker overlay */}
      <AnimatePresence>
        {isFlickering && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.9, 0, 0.6, 0, 0.3, 0],
              backgroundColor: ["#000", "#fff", "#000", "#fff", "#000", "#000", "#000"],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, times: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Ambient color bloom */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${activeTheme.colors.accent}22 0%, transparent 70%)`,
          transition: "background 1s ease",
        }}
      />

      {/* Film perforation strip - top */}
      <div
        className="fixed top-0 left-0 right-0 z-30 h-6 flex items-center gap-0 overflow-hidden"
        style={{ backgroundColor: "var(--theme-bg)" }}
      >
        <div className="flex w-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: "24px",
                height: "14px",
                border: `1.5px solid ${activeTheme.colors.border}`,
                borderRadius: "2px",
                margin: "0 3px",
                transition: "border-color 0.8s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 pt-8 pb-6 px-3 md:px-5 lg:px-8 min-h-screen flex flex-col">

        {/* Header bar */}
        <CalendarHeader />

        {/* Core Layout: wall calendar split */}
        <div className="flex-1 grid gap-3 md:gap-4 mt-3 md:mt-4"
          style={{
            gridTemplateColumns: "1fr",
            gridTemplateRows: "auto",
          }}
        >
          {/* Desktop: side-by-side like a real wall calendar */}
          <div className="hidden lg:grid gap-4" style={{ gridTemplateColumns: "1.1fr 0.9fr", gridTemplateRows: "1fr" }}>
            {/* Left: Hero + Calendar */}
            <div className="flex flex-col gap-4 min-h-0">
              <HeroPanel />
              <div className="flex-1">
                <CalendarGrid />
              </div>
            </div>

            {/* Right: Notes */}
            <div className="h-full">
              <NotesPanel className="h-full" />
            </div>
          </div>

          {/* Mobile/Tablet: stacked */}
          <div className="lg:hidden flex flex-col gap-3">
            <HeroPanel />
            <CalendarGrid />
            <NotesPanel />
          </div>
        </div>
      </div>

      {/* Film perforation strip - bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 h-6 flex items-center overflow-hidden"
        style={{ backgroundColor: "var(--theme-bg)" }}
      >
        <div className="flex w-full">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{
                width: "24px",
                height: "14px",
                border: `1.5px solid ${activeTheme.colors.border}`,
                borderRadius: "2px",
                margin: "0 3px",
                transition: "border-color 0.8s ease",
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}