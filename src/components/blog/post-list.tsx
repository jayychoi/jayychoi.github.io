import type { Post } from "#velite";
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
    <div className="divide-y divide-border">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
