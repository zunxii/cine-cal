"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/calendarStore";
import { cn } from "@/lib/utils";

interface MonthNavigatorProps {
  className?: string;
}

export function MonthNavigator({ className }: MonthNavigatorProps) {
  const goToPrevMonth = useCalendarStore((s) => s.goToPrevMonth);
  const goToNextMonth = useCalendarStore((s) => s.goToNextMonth);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2 py-2",
        "shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-md",
        className
      )}
      style={{
        background: "color-mix(in srgb, var(--theme-surface) 86%, transparent)",
        borderColor: "var(--theme-border)",
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Previous month"
        onClick={goToPrevMonth}
        className="h-10 w-10 rounded-full transition-transform duration-200 hover:scale-105"
        style={{ color: "var(--theme-text)" }}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div
        className="min-w-[5.5rem] px-2 text-center text-[10px] font-semibold uppercase tracking-[0.35em]"
        style={{ color: "var(--theme-text-muted)" }}
      >
        month
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Next month"
        onClick={goToNextMonth}
        className="h-10 w-10 rounded-full transition-transform duration-200 hover:scale-105"
        style={{ color: "var(--theme-text)" }}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}