"use client";

import { TextAlignStart } from "lucide-react";
import { useEffect, useState } from "react";

interface TocItem {
  title: string;
  url: string;
  items: TocItem[];
}

export default function TOC({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("h1[id], h2[id], h3[id]");
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    for (const heading of headings) {
      observer.observe(heading);
    }

    return () => observer.disconnect();
  }, []);

  if (items.length === 0) return null;

  function renderItems(tocItems: TocItem[], depth = 0) {
    return (
      <ul className={depth > 0 ? "mt-0.5 space-y-0.5" : "space-y-0.5"}>
        {tocItems.map((item) => {
          const id = item.url.replace("#", "");
          const isActive = activeId === id;

          return (
            <li key={item.url}>
              <a
                href={item.url}
                className={`block break-words py-0.5 transition-colors ${
                  depth > 0 ? "pl-4" : ""
                } ${
                  isActive
                    ? "text-accent-color font-bold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                }`}
              >
                {item.title}
              </a>
              {item.items.length > 0 && renderItems(item.items, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <nav className="sticky top-28 text-sm leading-6">
      <h3 className="mb-3 font-medium font-display text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <TextAlignStart className="h-3.5 w-3.5" />
        On this page
      </h3>
      {renderItems(items)}
    </nav>
  );
}
