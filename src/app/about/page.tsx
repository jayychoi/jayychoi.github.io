import type { Metadata } from "next";
import Link from "next/link";
import { about } from "#velite";
import MarkdownContent from "@/components/blog/markdown-content";
import PageHeader from "@/components/page-header";

export const metadata: Metadata = {
  title: "소개",
  description: "개발자 소개 페이지",
  openGraph: {
    title: "소개",
    description: "개발자 소개 페이지",
  },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="About" />
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/about/edit"
            className="rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            수정
          </Link>
        )}
      </div>
      <MarkdownContent html={about.content} />
    </article>
  );
}
