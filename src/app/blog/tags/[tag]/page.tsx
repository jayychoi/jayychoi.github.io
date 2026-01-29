import PostListHeader from "@/components/blog/post-list-header";
import PostList from "@/components/blog/post-list";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag: rawTag } = await params;
  const tag = decodeURIComponent(rawTag);
  const posts = getPostsByTag(tag);

  return (
    <div>
      <PostListHeader title={`Tag: #${tag}`} />
      <PostList posts={posts} />
    </div>
  );
}
