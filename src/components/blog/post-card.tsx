import Link from "next/link";
import type { Post } from "#velite";
import { CATEGORY_LABELS } from "@/lib/categories";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative px-4 py-6 -mx-4 transition-colors hover:bg-accent">
      <Link
        href={`/blog/posts/${post.slug}`}
        className="absolute inset-0"
        aria-label={post.title}
      />
      <div className="space-y-2">
        <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground line-clamp-2">{post.description}</p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.created}>
            {new Date(post.created).toLocaleDateString("ko-KR")}
          </time>
          <Link
            href={`/blog/categories/${post.category}`}
            className="relative z-10 text-xs px-2 py-0.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {CATEGORY_LABELS[post.category] ?? post.category}
          </Link>
          {post.series && (
            <Link
              href={`/blog/series/${post.series}`}
              className="relative z-10 text-xs px-2 py-0.5 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {post.series}
            </Link>
          )}
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tags/${tag}`}
              className="relative z-10 text-xs hover:text-foreground transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
