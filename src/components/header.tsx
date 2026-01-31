"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { useSearch } from "./search-provider";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";

const NAV_ITEMS = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
] as const;

const ICONS = [
  { href: "https://github.com/jayychoi", icon: GithubIcon, label: "GitHub" },
  {
    href: "https://www.linkedin.com/in/jayychoi",
    icon: LinkedinIcon,
    label: "LinkedIn",
  },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { open: openSearch } = useSearch();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.startsWith("Mac"));
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-black/60 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm font-display">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-bold">
          JayChoi
        </Link>

        <nav className="flex gap-6">
          {NAV_ITEMS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold transition-colors hover:text-foreground ${
                pathname.startsWith(href)
                  ? "text-foreground font-bold"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center">
          <button
            type="button"
            onClick={openSearch}
            className="flex items-center gap-2 mr-4 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-500 transition-colors hover:text-foreground dark:border-gray-700 dark:text-gray-400"
          >
            <span>검색</span>
            <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>

          {ICONS.map(({ href, icon: Icon, label }) => (
            <Button variant="ghost" size="icon" key={href} asChild>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground text-gray-700 dark:text-gray-300"
              >
                <Icon />
                <span className="sr-only">{label}</span>
              </Link>
            </Button>
          ))}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
