import Link from "next/link";
import type { Post } from "#velite";

export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group border-b border-border py-6 first:pt-0 last:border-b-0">
      <Link href={`/blog/posts/${post.slug}`} className="block space-y-2">
        <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground line-clamp-2">{post.description}</p>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.created}>
            {new Date(post.created).toLocaleDateString("ko-KR")}
          </time>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
            {post.category}
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs">
              #{tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
