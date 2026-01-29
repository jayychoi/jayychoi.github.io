import PostListHeader from "@/components/blog/post-list-header";
import PostList from "@/components/blog/post-list";
import { getTilDates, getTilPostsByDate } from "@/lib/posts";

export function generateStaticParams() {
  const dates = getTilDates();
  if (dates.length === 0) return [{ date: "_" }];
  return dates.map((date) => ({ date }));
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
      <PostListHeader title={`TIL: ${date}`} />
      <PostList posts={posts} />
    </div>
  );
}
