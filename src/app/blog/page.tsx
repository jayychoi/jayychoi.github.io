import type { Metadata } from "next";
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
    <div>
      <PageHeader title="전체 글" />
      <PostList posts={posts} />
    </div>
  );
}
