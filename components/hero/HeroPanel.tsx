"use client";

import { useMemo } from "react";
import { useCalendarStore } from "@/store/calendarStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface HeroPanelProps {
  className?: string;
}

type ThemeWithHero = ReturnType<typeof useThemeStore.getState>["activeTheme"] & {
  heroImage?: string;
  heroImageAlt?: string;
};

function formatShort(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function HeroPanel({ className }: HeroPanelProps) {
  const activeTheme = useThemeStore((s) => s.activeTheme) as ThemeWithHero;
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
        "relative overflow-hidden rounded-[2rem] border p-4 md:p-5",
        "shadow-[0_20px_70px_rgba(0,0,0,0.18)]",
        className
      )}
      style={{
        background: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
        color: "var(--theme-text)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 28%), radial-gradient(circle at bottom right, rgba(255,255,255,0.05), transparent 30%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-7"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
        }}
      />

      <div className="relative grid gap-5 md:grid-cols-[1.15fr_0.85fr] md:items-stretch">
        {/* Visual anchor */}
        <div className="overflow-hidden rounded-[1.6rem] border" style={{ borderColor: "var(--theme-border)" }}>
          <div className="relative aspect-[1.35/1] w-full bg-[var(--theme-bg)]">
            {activeTheme.heroImage ? (
              <Image
                src={activeTheme.heroImage}
                alt={activeTheme.heroImageAlt ?? activeTheme.filmTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: activeTheme.heroGradient }}
              />
            )}

            <div
              className="absolute inset-0"
              style={{
                background: activeTheme.colors.heroOverlay,
              }}
            />

            <div className="absolute left-0 right-0 top-0 h-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.15),transparent)]" />

            <div className="absolute left-4 top-3 flex items-center gap-1.5 opacity-85">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="h-2 w-1 rounded-sm"
                  style={{
                    background:
                      i % 2 === 0
                        ? "color-mix(in srgb, var(--theme-text) 62%, transparent)"
                        : "color-mix(in srgb, var(--theme-text-muted) 40%, transparent)",
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4">
              <div
                className="inline-flex rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{
                  borderColor: "rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.85)",
                  background: "rgba(0,0,0,0.18)",
                }}
              >
                visual anchor
              </div>

              <div className="mt-3 max-w-[80%]">
                <p
                  className="text-3xl leading-none md:text-4xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    textShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  {activeTheme.filmTitle}
                </p>
                <p
                  className="mt-2 text-sm uppercase tracking-[0.3em]"
                  style={{ color: "rgba(255,255,255,0.78)" }}
                >
                  {activeTheme.director} · {activeTheme.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right-side info panel */}
        <div className="flex h-full flex-col justify-between gap-4 rounded-[1.6rem] border p-4 md:p-5" style={{ borderColor: "var(--theme-border)", background: "color-mix(in srgb, var(--theme-bg) 14%, transparent)" }}>
          <div className="space-y-4">
            <div className="space-y-1">
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {activeYear} · month {activeMonthIndex + 1}
              </p>

              <h2
                className="text-2xl leading-tight md:text-3xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--theme-text)",
                }}
              >
                {activeTheme.filmTitle}
              </h2>

              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--theme-text-muted)" }}
              >
                {activeTheme.tagline}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl border p-3"
                style={{
                  borderColor: "var(--theme-border)",
                  background: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  month tone
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--theme-text)" }}>
                  calm paper, clean structure
                </p>
              </div>

              <div
                className="rounded-2xl border p-3"
                style={{
                  borderColor: "var(--theme-border)",
                  background: "color-mix(in srgb, var(--theme-surface) 80%, transparent)",
                }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--theme-text-muted)" }}
                >
                  trivia markers
                </p>
                <p className="mt-2 text-sm" style={{ color: "var(--theme-text)" }}>
                  {activeTheme.goldenDates.length} ✦ dates
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl border px-4 py-3"
              style={{
                borderColor: "var(--theme-border)",
                background: "color-mix(in srgb, var(--theme-surface) 82%, transparent)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                selected range
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--theme-text)" }}>
                {selectedLabel ?? "pick a start and end date on the grid"}
              </p>
            </div>
          </div>

          {featuredGolden && (
            <div
              className="rounded-[1.4rem] border p-4"
              style={{
                borderColor: "var(--theme-border)",
                background: "color-mix(in srgb, var(--theme-bg) 16%, transparent)",
              }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "var(--theme-text-muted)" }}
              >
                featured golden date · {featuredGolden.day}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--theme-text)" }}>
                {featuredGolden.fact}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.28em]" style={{ color: "var(--theme-text-muted)" }}>
                {featuredGolden.filmReference}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}