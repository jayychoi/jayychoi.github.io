import { ExternalLink, Github } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownContent from "@/components/blog/markdown-content";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { siteConfig } from "@/lib/site";

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

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${siteConfig.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-3xl py-8">
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <PageHeader title={project.title} />
          {process.env.NODE_ENV === "development" && (
            <Link
              href={`/projects/${project.slug}/edit`}
              className="shrink-0 rounded-md border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              수정
            </Link>
          )}
        </div>
        <p className="mt-2 text-muted-foreground">{project.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${(STATUS_CONFIG[project.status] ?? STATUS_CONFIG["in-progress"]).className}`}
          >
            {
              (STATUS_CONFIG[project.status] ?? STATUS_CONFIG["in-progress"])
                .label
            }
          </span>
          <span>
            {new Date(project.startDate).toLocaleDateString("ko-KR")}
            {" ~ "}
            {project.endDate &&
              new Date(project.endDate).toLocaleDateString("ko-KR")}
          </span>
        </div>

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

        {(project.github || project.url) && (
          <div className="mt-4 flex gap-3">
            {project.github && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github />
                  GitHub
                </a>
              </Button>
            )}
            {project.url && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  배포 사이트
                </a>
              </Button>
            )}
          </div>
        )}
      </header>

      <MarkdownContent html={project.content} />
    </article>
  );
}
