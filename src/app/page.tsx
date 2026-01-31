import Link from "next/link";
import ActivityHeatmap from "@/components/activity-heatmap";
import PostCard from "@/components/blog/post-card";
import PageHeader from "@/components/page-header";
import { extractPlainText } from "@/lib/html";
import { getAllPosts, getPostDateCounts } from "@/lib/posts";

export default function Home() {
  const dateCounts = getPostDateCounts();
  const recentPosts = getAllPosts().slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl py-8">
      <ActivityHeatmap dateCounts={dateCounts} />

      <hr className="my-8" />

      <PageHeader title="최근 게시글" />

      <div className="divide-y">
        {recentPosts.map((post) => (
          <PostCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            description={post.description || extractPlainText(post.content)}
            created={post.created}
            category={post.category}
            tags={post.tags}
            series={post.series}
            order={post.order}
          />
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          전체 글 보기 →
        </Link>
      </div>
    </div>
  );
}
