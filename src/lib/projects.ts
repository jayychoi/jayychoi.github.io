import { type Project, projects } from "#velite";

const STATUS_ORDER: Record<string, number> = {
  active: 0,
  "in-progress": 1,
  archived: 2,
};

export function getAllProjects(): Project[] {
  return projects.sort((a, b) => {
    const statusDiff = (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9);
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
