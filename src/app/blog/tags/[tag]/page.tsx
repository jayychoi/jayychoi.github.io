import type { Metadata } from "next";
import PostListHeader from "@/components/blog/post-list-header";
import PostList from "@/components/blog/post-list";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((t) => ({ tag: t.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag: raw } = await params;
  const tag = decodeURIComponent(raw);
  return {
    title: `#${tag}`,
    description: `#${tag} 태그의 글 목록`,
    openGraph: {
      title: `#${tag}`,
      description: `#${tag} 태그의 글 목록`,
    },
  };
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
