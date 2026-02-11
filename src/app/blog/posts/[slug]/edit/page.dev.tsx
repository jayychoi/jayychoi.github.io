"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostEditor from "@/components/admin/post-editor";

export default function EditPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<null | Record<string, unknown>>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setPost)
      .catch(() => setError("포스트를 찾을 수 없습니다."));
  }, [slug]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!post)
    return <p className="text-muted-foreground text-sm">불러오는 중...</p>;

  return (
    <div className="max-w-3xl px-6 lg:px-10 py-8">
      <h1 className="mb-6 font-semibold text-xl">글 수정</h1>
      <PostEditor
        mode="edit"
        initial={{
          id: post.id as number,
          title: post.title as string,
          slug: post.slug as string,
          created: post.created as string,
          updated: (post.updated as string) ?? "",
          description: (post.description as string) ?? "",
          category: post.category as string,
          tags: post.tags as string[],
          type: (post.type as ("til" | "series")[]) ?? [],
          series: (post.series as string) ?? "",
          order: (post.order as number) ?? null,
          content: post.content as string,
        }}
      />
    </div>
  );
}
