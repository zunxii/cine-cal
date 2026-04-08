"use client";

import { useEffect } from "react";

import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { HeroPanel } from "@/components/hero/HeroPanel";
import { NotesPanel } from "@/components/notes/NotesPanel";
import { useCalendarStore } from "@/store/calendarStore";
import { initThemeCSSVars } from "@/store/themeStore";

export default function HomePage() {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);

  useEffect(() => {
    // Ensures the theme variables exist immediately on first client paint.
    // The header will keep syncing the active theme as months change.
    initThemeCSSVars(activeMonthIndex);
  }, [activeMonthIndex]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Ambient cinematic background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05), transparent 22%), linear-gradient(to bottom, rgba(255,255,255,0.03), transparent 22%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 md:px-6 md:py-6">
        <CalendarHeader />

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-6">
            <HeroPanel />
            <CalendarGrid />
          </section>

          <NotesPanel className="xl:sticky xl:top-6 self-start" />
        </div>
      </div>
    </main>
  );
}