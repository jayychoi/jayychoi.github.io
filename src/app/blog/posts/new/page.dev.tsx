"use client";

import { useSearchParams } from "next/navigation";
import PostEditor from "@/components/admin/post-editor";

export default function NewPostPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  return (
    <div className="max-w-3xl px-6 lg:px-10 py-8">
      <h1 className="mb-6 font-semibold text-xl">새 글 작성</h1>
      <PostEditor mode="create" defaultCategory={category} />
    </div>
  );
}
