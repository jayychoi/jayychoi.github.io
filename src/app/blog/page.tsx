import type { Metadata } from "next";
import Link from "next/link";
import PostList from "@/components/blog/post-list";
import PageHeader from "@/components/page-header";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "블로그",
  description: "개발과 기술에 대한 글 모음",
  openGraph: {
    title: "블로그",
    description: "개발과 기술에 대한 글 모음",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl px-6 lg:px-10">
      <div className="flex max-w-prose items-center justify-between">
        <PageHeader title="전체 글" />
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
