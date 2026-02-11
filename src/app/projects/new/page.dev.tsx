import ProjectEditor from "@/components/admin/project-editor";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <h1 className="mb-6 font-semibold text-xl">새 프로젝트</h1>
      <ProjectEditor mode="create" />
    </div>
  );
}
