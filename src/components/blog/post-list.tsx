import type { Post } from "#velite";
import { extractPlainText } from "@/lib/html";
import PostCard from "./post-card";

export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        글이 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-prose divide-y divide-border">
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          slug={post.slug}
          title={post.title}
          description={post.description || extractPlainText(post.content)}
          created={post.created}
          category={post.category}
          tags={post.tags}
          series={post.series}
          order={post.order}
        />
      ))}
    </div>
  );
}
