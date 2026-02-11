import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/post-list";
import PageHeader from "@/components/page-header";
import { getTilDates, getTilPostsByDate } from "@/lib/posts";

export function generateStaticParams() {
  const dates = getTilDates();
  if (dates.length === 0) return [{ date: "_" }];
  return dates.map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `TIL: ${date}`,
    description: `${date}에 작성한 TIL 글 목록`,
    openGraph: {
      title: `TIL: ${date}`,
      description: `${date}에 작성한 TIL 글 목록`,
    },
  };
}

export default async function TilDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const posts = getTilPostsByDate(date);

  return (
    <div className="max-w-3xl px-6 lg:px-10">
      <div className="flex max-w-prose items-center justify-between">
        <PageHeader title={`TIL: ${date}`} />
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
