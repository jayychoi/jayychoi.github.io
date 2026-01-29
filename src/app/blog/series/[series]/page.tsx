import PostListHeader from "@/components/blog/post-list-header";
import PostList from "@/components/blog/post-list";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";

export function generateStaticParams() {
  const series = getAllSeries();
  if (series.length === 0) return [{ series: "_" }];
  return series.map((s) => ({ series: s.name }));
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: rawSeries } = await params;
  const series = decodeURIComponent(rawSeries);
  const posts = getPostsBySeries(series);

  return (
    <div>
      <PostListHeader title={`Series: ${series}`} />
      <PostList posts={posts} />
    </div>
  );
}
