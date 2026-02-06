import Link from "next/link";
import type { Post } from "#velite";

interface PostNavProps {
  currentSlug: string;
  allPosts: Post[];
}

export default function PostNav({ currentSlug, allPosts }: PostNavProps) {
  const currentIndex = allPosts.findIndex((p) => p.slug === currentSlug);
  // allPosts는 created 내림차순 → 다음(newer) = index - 1, 이전(older) = index + 1
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prev =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/blog/posts/${prev.slug}`}
          className="group flex flex-col items-start min-w-0 flex-1"
        >
          <span className="text-xs text-muted-foreground">← 이전 글</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors truncate max-w-full">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/blog/posts/${next.slug}`}
          className="group flex flex-col items-end text-right min-w-0 flex-1"
        >
          <span className="text-xs text-muted-foreground">다음 글 →</span>
          <span className="text-sm font-medium group-hover:text-primary transition-colors truncate max-w-full">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
