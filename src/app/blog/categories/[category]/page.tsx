import PostListHeader from "@/components/blog/post-list-header";
import PostList from "@/components/blog/post-list";
import { CATEGORY_LABELS } from "@/lib/categories";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ category: c.name }));
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
      <PostListHeader title={CATEGORY_LABELS[category] ?? category} />
      <PostList posts={posts} />
    </div>
  );
}
