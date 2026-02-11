import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/post-list";
import PageHeader from "@/components/page-header";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: raw } = await params;
  const category = decodeURIComponent(raw);
  const label = CATEGORY_LABELS[category] ?? category;
  return {
    title: label,
    description: `${label} 카테고리의 글 목록`,
    openGraph: {
      title: label,
      description: `${label} 카테고리의 글 목록`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const posts = getPostsByCategory(category);

  return (
    <div className="max-w-3xl px-6 lg:px-10">
      <div className="flex max-w-prose items-center justify-between">
        <PageHeader title={CATEGORY_LABELS[category] ?? category} />
        {process.env.NODE_ENV === "development" && (
          <Link
            href={`/blog/posts/new?category=${encodeURIComponent(category)}`}
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
