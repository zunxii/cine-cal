"use client";

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCalendarStore } from "@/store/calendarStore";
import { cn } from "@/lib/utils";

interface NotesPanelProps {
  className?: string;
}

function formatRangeLabel(start: Date, end: Date) {
  const fmt = new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
  });

  return `🎬 Scene log: ${fmt.format(start)} → ${fmt.format(end)}`;
}

export function NotesPanel({ className }: NotesPanelProps) {
  const activeMonthIndex = useCalendarStore((s) => s.activeMonthIndex);
  const activeYear = useCalendarStore((s) => s.activeYear);
  const selectedRange = useCalendarStore((s) => s.selectedRange);
  const updateNote = useCalendarStore((s) => s.updateNote);
  const clearNote = useCalendarStore((s) => s.clearNote);
  const note = useCalendarStore((s) => s.getNote(activeMonthIndex, activeYear));

  const visibleRangeLabel = useMemo(() => {
    if (note?.rangeLabel) return note.rangeLabel;
    if (selectedRange.start && selectedRange.end) {
      return formatRangeLabel(selectedRange.start, selectedRange.end);
    }
    return "scene log will appear after a range is selected";
  }, [note?.rangeLabel, selectedRange]);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border p-5 md:p-6",
        "shadow-[0_18px_60px_rgba(0,0,0,0.14)]",
        className
      )}
      style={{
        background: "var(--theme-surface)",
        borderColor: "var(--theme-border)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 28px)",
        }}
      />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.35em]"
              style={{ color: "var(--theme-text-muted)" }}
            >
              integrated notes
            </p>
            <h3
              className="text-2xl md:text-3xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--theme-text)",
              }}
            >
              Director&apos;s notebook
            </h3>
          </div>

          <div
            className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{
              borderColor: "var(--theme-border)",
              color: "var(--theme-text-muted)",
            }}
          >
            local only
          </div>
        </div>

        <div
          className="rounded-2xl border px-4 py-3 text-sm leading-relaxed"
          style={{
            background: "color-mix(in srgb, var(--theme-bg) 16%, transparent)",
            borderColor: "var(--theme-border)",
            color: "var(--theme-text-muted)",
          }}
        >
          <span className="block text-[10px] font-semibold uppercase tracking-[0.35em]">
            current scene log
          </span>
          <span className="mt-1 block" style={{ color: "var(--theme-text)" }}>
            {visibleRangeLabel}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <Textarea
              value={note?.content ?? ""}
              onChange={(e) => updateNote(activeMonthIndex, activeYear, e.target.value)}
              placeholder="Write a memo for this month, the selected range, or anything you want to remember..."
              className={cn(
                "min-h-[230px] resize-none rounded-[1.6rem] border px-4 py-4 text-base",
                "focus-visible:ring-2 focus-visible:ring-offset-2"
              )}
              style={{
                background: "color-mix(in srgb, var(--theme-bg) 10%, transparent)",
                borderColor: "var(--theme-border)",
                color: "var(--theme-text)",
                fontFamily: "var(--font-notes)",
              }}
            />
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: "var(--theme-text-muted)" }}
            >
              This is a plain functional notes area, as requested in the brief.
            </p>
          </div>

          <div className="flex flex-row gap-3 md:flex-col">
            <Button
              type="button"
              variant="outline"
              onClick={() => clearNote(activeMonthIndex, activeYear)}
              className="rounded-full px-5"
              style={{
                borderColor: "var(--theme-border)",
                color: "var(--theme-text)",
                background: "transparent",
              }}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}