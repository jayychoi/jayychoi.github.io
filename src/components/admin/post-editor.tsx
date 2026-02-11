"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Markdown from "react-markdown";
import { toast } from "sonner";
import { CATEGORY_GROUPS } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface PostData {
  title: string;
  slug: string;
  created: string;
  updated: string;
  description: string;
  category: string;
  tags: string[];
  type: ("til" | "series")[];
  series: string;
  order: number | null;
  content: string;
}

const defaultPost: PostData = {
  title: "",
  slug: "",
  created: new Date().toISOString().slice(0, 10),
  updated: "",
  description: "",
  category: "",
  tags: [],
  type: [],
  series: "",
  order: null,
  content: "",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function Required() {
  return <span className="text-destructive">*</span>;
}

export default function PostEditor({
  initial,
  mode,
  defaultCategory,
}: {
  initial?: PostData & { id?: number };
  mode: "create" | "edit";
  defaultCategory?: string;
}) {
  const router = useRouter();
  const [post, setPost] = useState<PostData>(
    initial ?? { ...defaultPost, category: defaultCategory ?? "" },
  );
  const [tagInput, setTagInput] = useState(initial?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [validated, setValidated] = useState(false);

  function update<K extends keyof PostData>(key: K, value: PostData[K]) {
    setPost((prev) => ({ ...prev, [key]: value }));
  }

  const slugValid = SLUG_PATTERN.test(post.slug);

  function isInvalid(value: string) {
    return validated && !value.trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (!post.title || !post.slug || !post.created || !post.category || !post.content) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!slugValid) {
      toast.error("슬러그는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.");
      return;
    }

    setSaving(true);

    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = { ...post, tags };

      const url =
        mode === "create"
          ? "/api/admin/posts"
          : `/api/admin/posts/${initial?.slug ?? post.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/blog/posts/${data.slug ?? post.slug}`);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error ?? res.statusText);
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">제목 <Required /></Label>
          <Input
            id="title"
            value={post.title}
            onChange={(e) => update("title", e.target.value)}
            aria-invalid={isInvalid(post.title)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">슬러그 <Required /></Label>
          <Input
            id="slug"
            value={post.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="영문 소문자, 숫자, 하이픈"
            aria-invalid={validated && (!post.slug.trim() || !slugValid)}
          />
          {validated && post.slug && !slugValid && (
            <p className="text-xs text-destructive">영문 소문자, 숫자, 하이픈만 사용 가능합니다.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="created">작성일 <Required /></Label>
          <Input
            id="created"
            type="date"
            value={post.created}
            onChange={(e) => update("created", e.target.value)}
            aria-invalid={isInvalid(post.created)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="updated">수정일</Label>
          <Input
            id="updated"
            type="date"
            value={post.updated}
            onChange={(e) => update("updated", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>카테고리 <Required /></Label>
          <Select
            value={post.category}
            onValueChange={(v) => update("category", v)}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={isInvalid(post.category)}
            >
              <SelectValue placeholder="선택..." />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_GROUPS.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명</Label>
        <Input
          id="description"
          value={post.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="비워두면 본문 첫 200자 사용"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">태그 (쉼표 구분)</Label>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <fieldset className="space-y-2">
          <Label asChild>
            <legend>타입</legend>
          </Label>
          <div className="flex gap-4">
            {(["til", "series"] as const).map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Checkbox
                  id={`type-${t}`}
                  checked={post.type.includes(t)}
                  onCheckedChange={(checked) => {
                    const next = checked
                      ? [...post.type, t]
                      : post.type.filter((x) => x !== t);
                    update("type", next);
                  }}
                />
                <Label htmlFor={`type-${t}`} className="font-normal">
                  {t.toUpperCase()}
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
        <div className="space-y-2">
          <Label htmlFor="series">시리즈</Label>
          <Input
            id="series"
            value={post.series}
            onChange={(e) => update("series", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">순서</Label>
          <Input
            id="order"
            type="number"
            value={post.order ?? ""}
            onChange={(e) =>
              update("order", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>본문 (마크다운) <Required /></Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setPreview(!preview)}
          >
            {preview ? "편집" : "미리보기"}
          </Button>
        </div>
        {preview ? (
          <div className="prose prose-sm dark:prose-invert min-h-[400px] max-w-none rounded-md border bg-muted/30 p-4">
            <Markdown>{post.content}</Markdown>
          </div>
        ) : (
          <Textarea
            value={post.content}
            onChange={(e) => update("content", e.target.value)}
            rows={20}
            className="font-mono"
            aria-invalid={isInvalid(post.content)}
          />
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "저장 중..." : mode === "create" ? "작성" : "수정"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          취소
        </Button>
      </div>
    </form>
  );
}
