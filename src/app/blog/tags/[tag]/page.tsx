import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/post-list";
import PageHeader from "@/components/page-header";
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
    <div className="max-w-3xl px-6 lg:px-10">
      <div className="flex max-w-prose items-center justify-between">
        <PageHeader title={`Tag: #${tag}`} />
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/blog/posts/new"
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            새 글 작성
          </Link>
        )}
      </div>
      <PostList posts={posts} />
    </div>
  );
}
