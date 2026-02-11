"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import type { SearchItem } from "@/lib/search";
import SearchDialog from "./search-dialog";

interface SearchContextValue {
  open: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

export default function SearchProvider({
  items,
  children,
}: {
  items: SearchItem[];
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);

  return (
    <SearchContext value={{ open }}>
      {children}
      <SearchDialog items={items} open={isOpen} onOpenChange={setIsOpen} />
    </SearchContext>
  );
}
