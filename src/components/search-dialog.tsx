"use client";

import { Command } from "cmdk";
import Fuse from "fuse.js";
import { FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { SearchItem } from "@/lib/search";

interface SearchDialogProps {
  items: SearchItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SearchDialog({
  items,
  open,
  onOpenChange,
}: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 2 },
          { name: "description", weight: 1.5 },
          { name: "content", weight: 1 },
          { name: "category", weight: 1 },
          { name: "tags", weight: 1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
      }),
    [items],
  );

  const results = query
    ? fuse.search(query, { limit: 10 }).map((r) => r.item)
    : items.slice(0, 10);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function select(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      shouldFilter={false}
      label="글 검색"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
        onKeyDown={() => {}}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="글 검색..."
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <Command.List className="max-h-72 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </Command.Empty>

          {results.map((item) => (
            <Command.Item
              key={item.href}
              value={item.title}
              onSelect={() => select(item.href)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm aria-selected:bg-accent"
            >
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.title}</p>
                {item.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </div>
            </Command.Item>
          ))}
        </Command.List>
      </div>
    </Command.Dialog>
  );
}
