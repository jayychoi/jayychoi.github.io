import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PostList from "@/components/blog/post-list";
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
    <div>
      <PageHeader title={CATEGORY_LABELS[category] ?? category} />
      <PostList posts={posts} />
    </div>
  );
}
