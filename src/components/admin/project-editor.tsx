"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface ProjectData {
  title: string;
  slug: string;
  description: string;
  techs: string[];
  status: string;
  startDate: string;
  endDate: string;
  github: string;
  url: string;
  thumbnail: string;
  content: string;
}

const defaultProject: ProjectData = {
  title: "",
  slug: "",
  description: "",
  techs: [],
  status: "in-progress",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  github: "",
  url: "",
  thumbnail: "",
  content: "",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function Required() {
  return <span className="text-destructive">*</span>;
}

export default function ProjectEditor({
  initial,
  mode,
}: {
  initial?: ProjectData & { id?: number };
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [project, setProject] = useState<ProjectData>(
    initial ?? defaultProject,
  );
  const [techInput, setTechInput] = useState(initial?.techs.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [validated, setValidated] = useState(false);

  function update<K extends keyof ProjectData>(key: K, value: ProjectData[K]) {
    setProject((prev) => ({ ...prev, [key]: value }));
  }

  const slugValid = SLUG_PATTERN.test(project.slug);

  function isInvalid(value: string) {
    return validated && !value.trim();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (
      !project.title ||
      !project.slug ||
      !project.description ||
      !project.startDate ||
      !project.content
    ) {
      toast.error("필수 항목을 모두 입력해주세요.");
      return;
    }
    if (!slugValid) {
      toast.error("슬러그는 영문 소문자, 숫자, 하이픈만 사용 가능합니다.");
      return;
    }

    setSaving(true);

    try {
      const techs = techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      const payload = { ...project, techs };

      const url =
        mode === "create"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initial?.slug ?? project.slug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/projects/${data.slug ?? project.slug}`);
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
            value={project.title}
            onChange={(e) => update("title", e.target.value)}
            aria-invalid={isInvalid(project.title)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">슬러그 <Required /></Label>
          <Input
            id="slug"
            value={project.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="영문 소문자, 숫자, 하이픈"
            aria-invalid={validated && (!project.slug.trim() || !slugValid)}
          />
          {validated && project.slug && !slugValid && (
            <p className="text-xs text-destructive">영문 소문자, 숫자, 하이픈만 사용 가능합니다.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">설명 <Required /></Label>
        <Input
          id="description"
          value={project.description}
          onChange={(e) => update("description", e.target.value)}
          aria-invalid={isInvalid(project.description)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>상태</Label>
          <Select
            value={project.status}
            onValueChange={(v) => update("status", v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-progress">진행 중</SelectItem>
              <SelectItem value="active">활성</SelectItem>
              <SelectItem value="archived">보관</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">시작일 <Required /></Label>
          <Input
            id="startDate"
            type="date"
            value={project.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            aria-invalid={isInvalid(project.startDate)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">종료일</Label>
          <Input
            id="endDate"
            type="date"
            value={project.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="techs">기술 스택 (쉼표 구분)</Label>
        <Input
          id="techs"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          placeholder="Next.js, TypeScript, SQLite"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            value={project.github}
            onChange={(e) => update("github", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">프로젝트 URL</Label>
          <Input
            id="url"
            value={project.url}
            onChange={(e) => update("url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail">썸네일</Label>
          <Input
            id="thumbnail"
            value={project.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>본문 (마크다운) <Required /></Label>
        <Textarea
          value={project.content}
          onChange={(e) => update("content", e.target.value)}
          rows={15}
          className="font-mono"
          aria-invalid={isInvalid(project.content)}
        />
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
