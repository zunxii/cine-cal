"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";

interface HeroPanelProps {
  className?: string;
}

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function HeroPanel({ className }: HeroPanelProps) {
  const activeTheme = useThemeStore((s) => s.activeTheme);
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const selectedRange = useCalendarStore((s) => s.selectedRange);

  const featuredGolden = activeTheme.goldenDates[0] ?? null;

  const selectedLabel = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start || !end) return null;
    return `${formatShort(start)} → ${formatShort(end)}`;
  }, [selectedRange]);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-5 md:p-6",
        "shadow-[0_20px_70px_rgba(0,0,0,0.25)]",
        className
      )}
      style={{
        background: activeTheme.heroGradient,
        borderColor: "var(--theme-border)",
        color: "var(--theme-text)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{ background: activeTheme.colors.heroOverlay }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--theme-highlight) 38%, transparent), transparent 68%)",
          opacity: 0.45,
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)",
        }}
      />

      <div className="relative grid gap-5 md:grid-cols-[1.35fr_0.95fr] md:items-end">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {activeYear} · month {activeMonthIndex + 1}
            </span>

            <span
              className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{
                borderColor: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.8)",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              {activeTheme.filmTitle}
            </span>
          </div>

          <div className="space-y-2">
            <h2
              className="text-4xl leading-none md:text-6xl"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 12px 30px rgba(0,0,0,0.35)",
              }}
            >
              {activeTheme.filmTitle}
            </h2>

            <p
              className="max-w-2xl text-sm leading-relaxed md:text-base"
              style={{ color: "rgba(255,255,255,0.82)" }}
            >
              {activeTheme.director} · {activeTheme.year} · {activeTheme.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {selectedLabel ? (
              <span
                className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                }}
              >
                chapter span: {selectedLabel}
              </span>
            ) : (
              <span
                className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                no chapter selected yet
              </span>
            )}

            <span
              className="rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{
                borderColor: "rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {activeTheme.goldenDates.length} trivia anchors
            </span>
          </div>
        </div>

        <div className="grid gap-4">
          <div
            className={cn(
              "group relative overflow-hidden rounded-[1.75rem] border p-4 md:p-5",
              "backdrop-blur-md"
            )}
            style={{
              background: "rgba(0,0,0,0.18)",
              borderColor: "rgba(255,255,255,0.14)",
              filter: activeTheme.startsGrayscale ? "grayscale(1)" : "none",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-60 transition duration-700 group-hover:opacity-85"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06), transparent 38%, rgba(255,255,255,0.02))",
              }}
            />
            <div className="relative flex min-h-[240px] flex-col justify-between">
              <div className="space-y-3">
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.42em]"
                  style={{ color: "rgba(255,255,255,0.72)" }}
                >
                  cinematic still
                </p>

                <div className="space-y-2">
                  <p
                    className="text-3xl leading-none md:text-4xl"
                    style={{
                      fontFamily: "var(--font-display)",
                      textShadow: "0 12px 24px rgba(0,0,0,0.35)",
                    }}
                  >
                    {activeTheme.filmTitle}
                  </p>
                  <p
                    className="text-sm uppercase tracking-[0.3em]"
                    style={{ color: "rgba(255,255,255,0.78)" }}
                  >
                    {activeTheme.director}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-8">
                <div
                  className="rounded-2xl border p-3"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    chapter tone
                  </p>
                  <p className="mt-2 text-sm" style={{ color: "white" }}>
                    {activeTheme.tagline}
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-3"
                  style={{
                    borderColor: "rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    palette
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: "var(--theme-accent)" }}
                    />
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: "var(--theme-accentAlt)" }}
                    />
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ background: "var(--theme-highlight)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {featuredGolden && (
            <div
              className="rounded-[1.5rem] border p-4"
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                background: "rgba(0,0,0,0.18)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "rgba(255,255,255,0.72)" }}
              >
                featured frame · {featuredGolden.day}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                {featuredGolden.fact}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-white/70">
                {featuredGolden.filmReference}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}