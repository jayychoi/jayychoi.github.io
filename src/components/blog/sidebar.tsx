"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import TilCalendar from "./til-calendar";

type TabType = "categories" | "til" | "tags" | "series";

export interface SidebarProps {
  categoryGroups: {
    label: string;
    items: { id: string; label: string; count: number }[];
  }[];
  tags: { name: string; count: number }[];
  series: { name: string; count: number }[];
  tilDates: string[];
  tilDateCounts: Record<string, number>;
}

const TABS: { key: TabType; label: string }[] = [
  { key: "categories", label: "카테고리" },
  { key: "til", label: "TIL" },
  { key: "tags", label: "태그" },
  { key: "series", label: "시리즈" },
];

function groupTilDates(tilDates: string[]) {
  const groups: Record<string, Record<string, string[]>> = {};
  for (const date of tilDates) {
    const [y, m] = date.split("-");
    (groups[y] ??= {})[m] ??= [];
    groups[y][m].push(date);
  }
  return groups;
}

function TilDateList({
  tilDates,
  tilDateCounts,
  pathname,
}: {
  tilDates: string[];
  tilDateCounts: Record<string, number>;
  pathname: string;
}) {
  const groups = groupTilDates(tilDates);
  const years = Object.keys(groups).sort().reverse();

  const now = new Date();
  const currentYear = String(now.getFullYear());
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [openYears, setOpenYears] = useState<Set<string>>(
    () => new Set(groups[currentYear] ? [currentYear] : []),
  );
  const [openMonths, setOpenMonths] = useState<Set<string>>(() => {
    const key = `${currentYear}-${currentMonth}`;
    return groups[currentYear]?.[currentMonth] ? new Set([key]) : new Set();
  });

  const toggleYear = (y: string) =>
    setOpenYears((prev) => {
      const next = new Set(prev);
      next.has(y) ? next.delete(y) : next.add(y);
      return next;
    });

  const toggleMonth = (key: string) =>
    setOpenMonths((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  return (
    <div className="border-t border-border pt-3">
      {years.map((y) => {
        const yearOpen = openYears.has(y);
        const months = Object.keys(groups[y]).sort().reverse();

        return (
          <div key={y}>
            <button
              type="button"
              onClick={() => toggleYear(y)}
              className="flex w-full items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-900 dark:text-gray-200 hover:bg-accent rounded-md transition-colors"
            >
              {yearOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
              {y}년
            </button>

            {yearOpen &&
              months.map((m) => {
                const monthKey = `${y}-${m}`;
                const monthOpen = openMonths.has(monthKey);
                const dates = groups[y][m];

                return (
                  <div key={monthKey}>
                    <button
                      type="button"
                      onClick={() => toggleMonth(monthKey)}
                      className="flex w-full items-center gap-1 pl-7 pr-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-400 hover:bg-accent rounded-md transition-colors"
                    >
                      {monthOpen ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      {Number(m)}월
                    </button>

                    {monthOpen &&
                      dates.map((date) => {
                        const href = `/blog/til/${date}`;
                        const isActive = pathname === href;
                        return (
                          <Link
                            key={date}
                            href={href}
                            className={`flex items-center justify-between rounded-md pl-12 pr-3 py-1.5 text-sm transition-colors ${
                              isActive
                                ? "bg-accent-color/10 text-accent-color font-semibold"
                                : "text-gray-600 dark:text-gray-400 hover:bg-accent"
                            }`}
                          >
                            <span>{date}</span>
                            <span className="text-xs text-muted-foreground">
                              {tilDateCounts[date]}
                            </span>
                          </Link>
                        );
                      })}
                  </div>
                );
              })}
          </div>
        );
      })}
    </div>
  );
}

export default function Sidebar({
  categoryGroups,
  tags,
  series,
  tilDates,
  tilDateCounts,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("categories");
  const pathname = usePathname();

  return (
    <aside className="w-full">
      <div className="flex border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "border-b-2 border-accent-color text-accent-color"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <nav className="mt-4 space-y-6">
        {activeTab === "categories" &&
          categoryGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1 text-sm font-bold text-gray-900 dark:text-gray-200">
                {group.label}
              </p>
              {group.items.map((cat) => {
                const href = `/blog/categories/${cat.id}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-accent-color/10 text-accent-color font-semibold"
                        : "text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-gray-900 dark:hover:text-gray-300"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}

        {activeTab === "til" && (
          <>
            <TilCalendar tilDateCounts={tilDateCounts} />
            {tilDates.length > 0 && (
              <TilDateList
                tilDates={tilDates}
                tilDateCounts={tilDateCounts}
                pathname={pathname}
              />
            )}
          </>
        )}

        {activeTab === "tags" &&
          (tags.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              태그가 없습니다.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 px-3 py-2">
              {tags.map((tag) => {
                const href = `/blog/tags/${tag.name}`;
                const isActive = pathname === href;
                return (
                  <Badge
                    key={tag.name}
                    variant={isActive ? "default" : "secondary"}
                    asChild
                    className={
                      isActive
                        ? "bg-accent-color text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    <Link href={href}>
                      #{tag.name}
                      <span
                        className={
                          isActive ? "text-white/70" : "text-muted-foreground"
                        }
                      >
                        {tag.count}
                      </span>
                    </Link>
                  </Badge>
                );
              })}
            </div>
          ))}

        {activeTab === "series" &&
          (series.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              시리즈가 없습니다.
            </p>
          ) : (
            series.map((s) => {
              const href = `/blog/series/${s.name}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={s.name}
                  href={href}
                  className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-accent-color/10 text-accent-color font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:bg-accent hover:text-gray-900 dark:hover:text-gray-300"
                  }`}
                >
                  <span>{s.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {s.count}
                  </span>
                </Link>
              );
            })
          ))}
      </nav>
    </aside>
  );
}
