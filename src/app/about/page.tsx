import type { Metadata } from "next";
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
      <PageHeader title="About" className="mb-8" />
      <MarkdownContent html={about.content} />
    </article>
  );
}
