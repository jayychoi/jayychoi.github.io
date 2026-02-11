import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Comments from "@/components/blog/comments";
import MarkdownContent from "@/components/blog/markdown-content";
import PostMetaBadges from "@/components/blog/post-meta-badges";
import PostNav from "@/components/blog/series-nav";
import TOC from "@/components/blog/toc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `${siteConfig.url}/blog/posts/${post.slug}`,
      publishedTime: post.created,
      modifiedTime: post.updated,
      tags: post.tags,
      authors: [siteConfig.author],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,48rem)_16rem] xl:gap-10">
      <article className="min-w-0 px-6 lg:px-10">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            {process.env.NODE_ENV === "development" && (
              <Link
                href={`/blog/posts/${post.slug}/edit`}
                className="shrink-0 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                수정
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.created}>
              {new Date(post.created).toLocaleDateString("ko-KR")}
            </time>
            <PostMetaBadges
              category={post.category}
              tags={post.tags}
              series={post.series}
              order={post.order}
            />
            {post.metadata.readingTime && (
              <span>{post.metadata.readingTime}분 읽기</span>
            )}
          </div>
        </header>

        <MarkdownContent html={post.content} />

        <PostNav currentSlug={post.slug} allPosts={allPosts} />

        <Comments />
      </article>

      <div className="hidden xl:block ml-4">
        <TOC items={post.toc} />
      </div>
    </div>
  );
}
