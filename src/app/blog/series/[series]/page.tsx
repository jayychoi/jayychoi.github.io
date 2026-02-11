import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/post-list";
import PageHeader from "@/components/page-header";
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
      <div className="flex max-w-prose items-center justify-between">
        <PageHeader title={`Series: ${series}`} />
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
