"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectEditor from "@/components/admin/project-editor";

export default function EditProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<null | Record<string, unknown>>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/projects/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setProject)
      .catch(() => setError("프로젝트를 찾을 수 없습니다."));
  }, [slug]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!project)
    return <p className="text-muted-foreground text-sm">불러오는 중...</p>;

  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-6 font-semibold text-xl">프로젝트 수정</h1>
      <ProjectEditor
        mode="edit"
        initial={{
          id: project.id as number,
          title: project.title as string,
          slug: project.slug as string,
          description: project.description as string,
          techs: project.techs as string[],
          status: project.status as string,
          startDate: project.startDate as string,
          endDate: (project.endDate as string) ?? "",
          github: (project.github as string) ?? "",
          url: (project.url as string) ?? "",
          thumbnail: (project.thumbnail as string) ?? "",
          content: project.content as string,
        }}
      />
    </div>
  );
}
