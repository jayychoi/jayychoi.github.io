import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Comments from "@/components/blog/comments";
import MarkdownContent from "@/components/blog/markdown-content";
import PostMetaBadges from "@/components/blog/post-meta-badges";
import SeriesNav from "@/components/blog/series-nav";
import TOC from "@/components/blog/toc";
import { siteConfig } from "@/lib/site";
import { getAllPosts, getPostBySlug, getPostsBySeries } from "@/lib/posts";

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

  const seriesPosts = post.series ? getPostsBySeries(post.series) : [];

  return (
    <div className="flex gap-8">
      <article className="min-w-0 flex-1">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={post.created}>
              {new Date(post.created).toLocaleDateString("ko-KR")}
            </time>
            <PostMetaBadges
              category={post.category}
              tags={post.tags}
              series={post.series}
              order={post.order}
              seriesCount={seriesPosts.length}
            />
            {post.metadata.readingTime && (
              <span>{post.metadata.readingTime}분 읽기</span>
            )}
          </div>
        </header>

        <MarkdownContent html={post.content} />

        {seriesPosts.length > 0 && (
          <SeriesNav currentSlug={post.slug} seriesPosts={seriesPosts} />
        )}

        <Comments />
      </article>

      <div className="hidden xl:block w-56 shrink-0">
        <TOC items={post.toc} />
      </div>
    </div>
  );
}
