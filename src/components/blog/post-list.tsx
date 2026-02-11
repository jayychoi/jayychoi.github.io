"use client";

import { useState } from "react";
import type { Post } from "#velite";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { extractPlainText } from "@/lib/html";
import PostCard from "./post-card";

const POSTS_PER_PAGE = 10;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  // 7개 이하면 전부 표시
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // 연속 5개 윈도우 계산
  let start = current - 2;
  let end = current + 2;

  if (start < 2) {
    start = 2;
    end = 6;
  }
  if (end > total - 1) {
    end = total - 1;
    start = total - 5;
  }

  const pages: (number | "...")[] = [1];
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);

  return pages;
}

export default function PostList({ posts }: { posts: Post[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paged = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  );

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        글이 없습니다.
      </div>
    );
  }

  return (
    <div className="max-w-prose divide-y divide-border">
      {paged.map((post) => (
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

      {totalPages > 1 && (
        <Pagination className="pt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers(currentPage, totalPages).map((p, i) => (
              <PaginationItem key={`${p}-${i}`} className="max-sm:hidden">
                {p === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={p === currentPage}
                    onClick={() => setCurrentPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <span className="px-2 text-sm text-muted-foreground sm:hidden">
              {currentPage} / {totalPages}
            </span>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
