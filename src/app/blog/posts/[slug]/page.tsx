import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MDXContent from "@/components/blog/mdx-content";
import SeriesNav from "@/components/blog/series-nav";
import TOC from "@/components/blog/toc";
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
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <time dateTime={post.created}>
              {new Date(post.created).toLocaleDateString("ko-KR")}
            </time>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs">
                #{tag}
              </span>
            ))}
            {post.metadata.readingTime && (
              <span>{post.metadata.readingTime}분 읽기</span>
            )}
          </div>
          {post.series && (
            <div className="mt-3 text-sm text-muted-foreground">
              시리즈: {post.series}
              {post.order != null && ` (${post.order}/${seriesPosts.length})`}
            </div>
          )}
        </header>

        <MDXContent code={post.content} />

        {seriesPosts.length > 0 && (
          <SeriesNav currentSlug={post.slug} seriesPosts={seriesPosts} />
        )}
      </article>

      <div className="hidden xl:block w-56 shrink-0">
        <TOC items={post.toc} />
      </div>
    </div>
  );
}
