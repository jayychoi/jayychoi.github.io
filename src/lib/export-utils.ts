import type { posts, projects } from "@/db/schema";

function toYamlValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (
      value.includes(":") ||
      value.includes('"') ||
      value.includes("'") ||
      value.includes("#")
    ) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return `"${value}"`;
  }
  return String(value);
}

export function buildPostMarkdown(post: typeof posts.$inferSelect): string {
  const lines: string[] = ["---"];

  lines.push(`title: ${toYamlValue(post.title)}`);
  lines.push(`slug: ${post.slug}`);
  lines.push(`created: ${post.created}`);
  if (post.updated) lines.push(`updated: ${post.updated}`);
  if (post.description)
    lines.push(`description: ${toYamlValue(post.description)}`);
  lines.push(`category: ${toYamlValue(post.category)}`);

  const tags = post.tags as string[];
  if (tags.length > 0) {
    lines.push("tags:");
    for (const tag of tags) {
      lines.push(`  - ${tag}`);
    }
  } else {
    lines.push("tags: []");
  }

  const type = post.type as string[] | null;
  if (type && type.length > 0) {
    lines.push("type:");
    for (const t of type) {
      lines.push(`  - ${t}`);
    }
  }

  if (post.series) lines.push(`series: ${toYamlValue(post.series)}`);
  if (post.order !== null && post.order !== undefined)
    lines.push(`order: ${post.order}`);

  lines.push("---");
  return `${lines.join("\n")}\n\n${post.content}\n`;
}

export function buildProjectMarkdown(
  project: typeof projects.$inferSelect,
): string {
  const lines: string[] = ["---"];

  lines.push(`title: ${toYamlValue(project.title)}`);
  lines.push(`slug: ${project.slug}`);
  lines.push(`description: ${toYamlValue(project.description)}`);

  const techs = project.techs as string[];
  if (techs.length > 0) {
    lines.push("techs:");
    for (const tech of techs) {
      lines.push(`  - ${tech}`);
    }
  } else {
    lines.push("techs: []");
  }

  lines.push(`status: ${project.status}`);
  lines.push(`startDate: ${project.startDate}`);
  if (project.endDate) lines.push(`endDate: ${project.endDate}`);
  if (project.github) lines.push(`github: ${toYamlValue(project.github)}`);
  if (project.url) lines.push(`url: ${toYamlValue(project.url)}`);
  if (project.thumbnail)
    lines.push(`thumbnail: ${toYamlValue(project.thumbnail)}`);

  lines.push("---");
  return `${lines.join("\n")}\n\n${project.content}\n`;
}
