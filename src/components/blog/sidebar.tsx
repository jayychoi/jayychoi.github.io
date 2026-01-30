"use client";

import Link from "next/link";
import { useState } from "react";

type TabType = "categories" | "til" | "tags" | "series";

export interface SidebarProps {
  categoryGroups: {
    label: string;
    items: { id: string; label: string; count: number }[];
  }[];
  tags: { name: string; count: number }[];
  series: { name: string; count: number }[];
  tilDates: string[];
}

const TABS: { key: TabType; label: string }[] = [
  { key: "categories", label: "카테고리" },
  { key: "til", label: "TIL" },
  { key: "tags", label: "태그" },
  { key: "series", label: "시리즈" },
];

export default function Sidebar({
  categoryGroups,
  tags,
  series,
  tilDates,
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<TabType>("categories");

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
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <nav className="mt-4 space-y-4">
        {activeTab === "categories" &&
          categoryGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 pb-1 text-sm font-bold text-foreground">
                {group.label}
              </p>
              {group.items.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/blog/categories/${cat.id}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <span>{cat.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          ))}

        {activeTab === "til" &&
          (tilDates.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              TIL 글이 없습니다.
            </p>
          ) : (
            tilDates.map((date) => (
              <Link
                key={date}
                href={`/blog/til/${date}`}
                className="block rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                {date}
              </Link>
            ))
          ))}

        {activeTab === "tags" &&
          (tags.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              태그가 없습니다.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2 px-3 py-2">
              {tags.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/blog/tags/${tag.name}`}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm hover:bg-accent transition-colors"
                >
                  <span>#{tag.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {tag.count}
                  </span>
                </Link>
              ))}
            </div>
          ))}

        {activeTab === "series" &&
          (series.length === 0 ? (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              시리즈가 없습니다.
            </p>
          ) : (
            series.map((s) => (
              <Link
                key={s.name}
                href={`/blog/series/${s.name}`}
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{s.name}</span>
                <span className="text-muted-foreground text-xs">{s.count}</span>
              </Link>
            ))
          ))}
      </nav>
    </aside>
  );
}
