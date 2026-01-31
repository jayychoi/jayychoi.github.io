"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function tooltipText(date: string, count: number): string {
  const d = new Date(date);
  const month = MONTH_NAMES[d.getMonth()];
  const day = ordinal(d.getDate());
  if (count === 0) return `No posts on ${month} ${day}.`;
  if (count === 1) return `1 post on ${month} ${day}.`;
  return `${count} posts on ${month} ${day}.`;
}

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-muted";
  if (count === 1) return "bg-emerald-500/30";
  if (count === 2) return "bg-emerald-500/50";
  if (count === 3) return "bg-emerald-400/70";
  return "bg-emerald-300";
}

type Cell = { date: string; count: number } | null;

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function buildWeeks(
  startDate: Date,
  endDate: Date,
  dateCounts: Record<string, number>,
): Cell[][] {
  const weeks: Cell[][] = [];
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    const week: Cell[] = [];
    if (weeks.length === 0) {
      const startDay = current.getDay();
      for (let d = 0; d < startDay; d++) week.push(null);
      for (let d = startDay; d < 7; d++) {
        if (current > end) {
          week.push(null);
          continue;
        }
        const dateStr = formatDate(current);
        week.push({ date: dateStr, count: dateCounts[dateStr] ?? 0 });
        current.setDate(current.getDate() + 1);
      }
    } else {
      for (let d = 0; d < 7; d++) {
        if (current > end) {
          week.push(null);
          continue;
        }
        const dateStr = formatDate(current);
        week.push({ date: dateStr, count: dateCounts[dateStr] ?? 0 });
        current.setDate(current.getDate() + 1);
      }
    }
    weeks.push(week);
  }

  return weeks;
}

function getLastYearRange(): [Date, Date] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - 364 - dayOfWeek);
  return [start, today];
}

function getYearRange(year: number): [Date, Date] {
  return [new Date(year, 0, 1), new Date(year, 11, 31)];
}

function buildMonthColspans(weeks: Cell[][]) {
  const labels: { label: string; col: number }[] = [];
  let lastMonth = -1;

  for (let i = 0; i < weeks.length; i++) {
    const firstDay = weeks[i].find((c) => c !== null);
    if (!firstDay) continue;
    const month = new Date(firstDay.date).getMonth();
    if (month !== lastMonth) {
      labels.push({ label: MONTH_LABELS[month], col: i });
      lastMonth = month;
    }
  }

  const result: { label: string; colspan: number }[] = [];

  // Spacer if first month doesn't start at column 0
  if (labels.length > 0 && labels[0].col > 0) {
    result.push({ label: "", colspan: labels[0].col });
  }

  const maxLabels = 12;
  const shown = labels.slice(0, maxLabels);

  for (let i = 0; i < shown.length; i++) {
    const nextCol =
      i + 1 < shown.length ? shown[i + 1].col : weeks.length;
    result.push({ label: shown[i].label, colspan: nextCol - shown[i].col });
  }

  return result;
}

function getAvailableYears(dateCounts: Record<string, number>): number[] {
  const years = new Set<number>();
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  for (const date of Object.keys(dateCounts)) {
    years.add(parseInt(date.substring(0, 4)));
  }
  return Array.from(years).sort((a, b) => b - a);
}

interface ActivityHeatmapProps {
  dateCounts: Record<string, number>;
}

export default function ActivityHeatmap({ dateCounts }: ActivityHeatmapProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const availableYears = useMemo(
    () => getAvailableYears(dateCounts),
    [dateCounts],
  );

  const [startDate, endDate] = useMemo(
    () =>
      selectedYear === null ? getLastYearRange() : getYearRange(selectedYear),
    [selectedYear],
  );

  const weeks = useMemo(
    () => buildWeeks(startDate, endDate, dateCounts),
    [startDate, endDate, dateCounts],
  );

  const monthColspans = useMemo(() => buildMonthColspans(weeks), [weeks]);

  return (
    <div className="flex flex-col">
      {/* Year navigation */}
      <div className="mb-3 flex flex-wrap items-center gap-1">
        <Button
          variant={selectedYear === null ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setSelectedYear(null)}
        >
          Last year
        </Button>
        {availableYears.map((year) => (
          <Button
            key={year}
            variant={selectedYear === year ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSelectedYear(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      {/* Contribution table — GitHub style */}
      <TooltipProvider delayDuration={0}>
        <table
          style={{
            borderSpacing: "3px",
            borderCollapse: "separate",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr style={{ height: "13px" }}>
              <td style={{ width: "28px" }} />
              {monthColspans.map((m, i) => (
                <td
                  key={i}
                  colSpan={m.colspan}
                  style={{ position: "relative" }}
                >
                  {m.label && (
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ position: "absolute", top: 0 }}
                    >
                      {m.label}
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <tr key={dayIndex} style={{ height: "10px" }}>
                <td style={{ position: "relative", width: "28px" }}>
                  {DAY_LABELS[dayIndex] && (
                    <span
                      className="text-xs text-muted-foreground"
                      style={{ position: "absolute", bottom: "-3px" }}
                    >
                      {DAY_LABELS[dayIndex]}
                    </span>
                  )}
                </td>
                {weeks.map((week, wi) => {
                  const cell = week[dayIndex];
                  if (!cell) {
                    return <td key={wi} style={{ width: "10px", height: "10px" }} />;
                  }
                  return (
                    <Tooltip key={wi}>
                      <TooltipTrigger asChild>
                        <td
                          style={{ width: "10px", height: "10px" }}
                          className={`rounded-[2px] ${getIntensityClass(cell.count)}`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        style={{ pointerEvents: "none" }}
                      >
                        {tooltipText(cell.date, cell.count)}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TooltipProvider>

      {/* Legend */}
      <div className="mt-2 mr-8 flex items-center gap-1 self-end text-xs text-muted-foreground">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-[10px] w-[10px] rounded-[2px] ${getIntensityClass(level)}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
