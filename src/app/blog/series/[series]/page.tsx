import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PostList from "@/components/blog/post-list";
import { getAllSeries, getPostsBySeries } from "@/lib/posts";

export function generateStaticParams() {
  const series = getAllSeries();
  if (series.length === 0) return [{ series: "_" }];
  return series.map((s) => ({ series: s.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series: raw } = await params;
  const series = decodeURIComponent(raw);
  return {
    title: `시리즈: ${series}`,
    description: `${series} 시리즈의 글 목록`,
    openGraph: {
      title: `시리즈: ${series}`,
      description: `${series} 시리즈의 글 목록`,
    },
  };
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
    <div className="max-w-3xl px-6 lg:px-10">
      <PageHeader title={`Series: ${series}`} />
      <PostList posts={posts} />
    </div>
  );
}
