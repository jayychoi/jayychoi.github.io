import type { Metadata } from "next";
import PageHeader from "@/components/page-header";
import PostList from "@/components/blog/post-list";
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
    <div>
      <PageHeader title={`TIL: ${date}`} />
      <PostList posts={posts} />
    </div>
  );
}
