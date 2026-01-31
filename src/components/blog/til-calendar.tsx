"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

const TIL_INTENSITY = [
  "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  "bg-emerald-500/40 text-emerald-800 dark:text-emerald-300",
  "bg-emerald-500/60 text-emerald-900 dark:text-emerald-200",
  "bg-emerald-500/80 text-white dark:text-white",
];

function getIntensityClass(count: number): string {
  const idx = Math.min(count, TIL_INTENSITY.length) - 1;
  return TIL_INTENSITY[idx];
}

interface TilCalendarProps {
  tilDateCounts: Record<string, number>;
}

export default function TilCalendar({ tilDateCounts }: TilCalendarProps) {
  const dates = Object.keys(tilDateCounts);

  const initialDate = (() => {
    if (dates.length > 0) {
      const sorted = [...dates].sort();
      const latest = sorted[sorted.length - 1];
      const [y, m] = latest.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  })();

  const [current, setCurrent] = useState(initialDate);

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const prev = () => setCurrent(new Date(year, month - 1, 1));
  const next = () => setCurrent(new Date(year, month + 1, 1));
  const goToday = () =>
    setCurrent(new Date(today.getFullYear(), today.getMonth(), 1));

  const pad = (n: number) => String(n).padStart(2, "0");

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="px-2">
      {/* Header */}
      <div className="relative flex items-center justify-center mb-2">
        <span className="text-sm font-medium">
          {year}년 {month + 1}월
        </span>
        <div className="absolute inset-0 flex items-center justify-between">
          <button
            type="button"
            onClick={prev}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label="이전 월"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-0.5">
            {!isCurrentMonth && (
              <Button
                variant="outline"
                size="icon-xs"
                className="rounded-sm text-[10px]"
                onClick={goToday}
                aria-label="오늘로 이동"
                title="오늘"
              >
                {today.getDate()}
              </Button>
            )}
            <button
              type="button"
              onClick={next}
              className="p-1 rounded hover:bg-accent transition-colors"
              aria-label="다음 월"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 text-center text-xs mb-1">
        {DAY_LABELS.map((d, i) => (
          <div
            key={d}
            className={`py-1 ${
              i === 0
                ? "text-red-500"
                : i === 6
                  ? "text-blue-500"
                  : "text-muted-foreground"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
          const count = tilDateCounts[dateStr] ?? 0;
          const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

          const dayColor =
            dayOfWeek === 0
              ? "text-red-500/50"
              : dayOfWeek === 6
                ? "text-blue-500/50"
                : "text-muted-foreground/50";

          if (count > 0) {
            return (
              <Link
                key={dateStr}
                href={`/blog/til/${dateStr}`}
                className={`block rounded-sm py-1.5 font-medium transition-colors hover:ring-1 hover:ring-emerald-500/50 ${getIntensityClass(count)}`}
              >
                {day}
              </Link>
            );
          }

          return (
            <div key={dateStr} className={`py-1.5 ${dayColor}`}>
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
