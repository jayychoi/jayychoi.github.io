import Link from "next/link";
import type { Post } from "#velite";

interface SeriesNavProps {
  currentSlug: string;
  seriesPosts: Post[];
}

export default function SeriesNav({
  currentSlug,
  seriesPosts,
}: SeriesNavProps) {
  const currentIndex = seriesPosts.findIndex((p) => p.slug === currentSlug);
  const prev = currentIndex > 0 ? seriesPosts[currentIndex - 1] : null;
  const next =
    currentIndex < seriesPosts.length - 1
      ? seriesPosts[currentIndex + 1]
      : null;

  if (!prev && !next) return null;

  return (
    <nav className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/blog/posts/${prev.slug}`}
          className="group flex flex-col items-start"
        >
          <span className="text-xs text-muted-foreground">← 이전</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/posts/${next.slug}`}
          className="group flex flex-col items-end text-right"
        >
          <span className="text-xs text-muted-foreground">다음 →</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
