"use client";

import Link from "next/link";
import { useState } from "react";
import PostMetaBadges from "./post-meta-badges";

interface PostCardProps {
  slug: string;
  title: string;
  description?: string;
  created: string;
  category: string;
  tags: string[];
  series?: string;
  order?: number;
}

export default function PostCard({
  slug,
  title,
  description,
  created,
  category,
  tags,
  series,
  order,
}: PostCardProps) {
  const [badgeHover, setBadgeHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const showCardHighlight = cardHover && !badgeHover;

  return (
    <article
      className="relative px-4 py-6 -mx-4 transition-colors"
      style={
        showCardHighlight ? { backgroundColor: "var(--accent)" } : undefined
      }
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => setCardHover(false)}
    >
      <Link
        href={`/blog/posts/${slug}`}
        className="absolute inset-0"
        aria-label={title}
      />
      <div className="space-y-2">
        <h2
          className="text-xl font-bold transition-colors"
          style={showCardHighlight ? { color: "var(--primary)" } : undefined}
        >
          {title}
        </h2>
        {description && (
          <p className="text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={created}>
            {new Date(created).toLocaleDateString("ko-KR")}
          </time>
          <div
            className="flex flex-wrap items-center gap-2"
            onMouseEnter={() => setBadgeHover(true)}
            onMouseLeave={() => setBadgeHover(false)}
          >
            <PostMetaBadges
              category={category}
              tags={tags}
              series={series}
              order={order}
              linkClassName="relative z-10"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
