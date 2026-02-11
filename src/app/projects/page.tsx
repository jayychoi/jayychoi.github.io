import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { getAllProjects } from "@/lib/projects";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  "in-progress": {
    label: "개발 중",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  active: {
    label: "운영 중",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  archived: {
    label: "종료",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG["in-progress"];
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export const metadata: Metadata = {
  title: "프로젝트",
  description: "진행한 프로젝트 목록",
  openGraph: {
    title: "프로젝트",
    description: "진행한 프로젝트 목록",
  },
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Projects" />
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/projects/new"
            className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
          >
            새 프로젝트
          </Link>
        )}
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">프로젝트가 없습니다.</p>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block rounded-lg border p-6 transition-colors hover:bg-gray-500/5 hover:border-foreground/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold no-underline">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.techs.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {new Date(project.startDate).toLocaleDateString("ko-KR")}
                {" ~ "}
                {project.endDate &&
                  new Date(project.endDate).toLocaleDateString("ko-KR")}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
