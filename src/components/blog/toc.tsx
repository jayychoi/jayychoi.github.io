"use client";

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

  function renderItems(items: TocItem[], depth = 0) {
    return (
      <ul className={depth > 0 ? "ml-4 mt-1" : "space-y-1"}>
        {items.map((item) => {
          const id = item.url.replace("#", "");
          return (
            <li key={item.url}>
              <a
                href={item.url}
                className={`block py-1 text-sm transition-colors ${
                  activeId === id
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
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
    <nav className="sticky top-24">
      <h3 className="mb-3 text-sm font-semibold">목차</h3>
      {renderItems(items)}
    </nav>
  );
}
