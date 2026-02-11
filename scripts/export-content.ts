import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "../src/db/schema";

const BUILD_DIR = resolve(process.cwd(), ".content-build");
const DB_PATH = resolve(process.cwd(), "content", "blog.db");

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

function buildPostFrontmatter(post: typeof schema.posts.$inferSelect): string {
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
  return lines.join("\n");
}

function buildProjectFrontmatter(
  project: typeof schema.projects.$inferSelect,
): string {
  const lines: string[] = ["---"];

  lines.push(`title: ${toYamlValue(project.title)}`);
  lines.push(`slug: ${project.slug}`);
  lines.push(`description: ${toYamlValue(project.description)}`);

  const techs = project.techs as string[];
  lines.push("techs:");
  for (const tech of techs) {
    lines.push(`  - ${tech}`);
  }

  lines.push(`status: ${project.status}`);
  lines.push(`startDate: ${project.startDate}`);
  if (project.endDate) lines.push(`endDate: ${project.endDate}`);
  if (project.github) lines.push(`github: ${toYamlValue(project.github)}`);
  if (project.url) lines.push(`url: ${toYamlValue(project.url)}`);
  if (project.thumbnail)
    lines.push(`thumbnail: ${toYamlValue(project.thumbnail)}`);

  lines.push("---");
  return lines.join("\n");
}

export async function exportContent(): Promise<void> {
  if (!existsSync(DB_PATH)) {
    console.log("[export-content] blog.db not found, skipping export");
    return;
  }

  console.log("[export-content] Exporting SQLite → .content-build/");

  // Clean and recreate build directory
  if (existsSync(BUILD_DIR)) {
    rmSync(BUILD_DIR, { recursive: true });
  }
  mkdirSync(resolve(BUILD_DIR, "posts"), { recursive: true });
  mkdirSync(resolve(BUILD_DIR, "projects"), { recursive: true });

  const sqlite = new Database(DB_PATH);
  const db = drizzle(sqlite, { schema });

  // Export posts
  const allPosts = db.select().from(schema.posts).all();
  for (const post of allPosts) {
    const frontmatter = buildPostFrontmatter(post);
    const filePath = resolve(BUILD_DIR, "posts", `${post.slug}.md`);
    writeFileSync(filePath, `${frontmatter}\n\n${post.content}\n`);
  }
  console.log(`[export-content] Exported ${allPosts.length} posts`);

  // Export projects
  const allProjects = db.select().from(schema.projects).all();
  for (const project of allProjects) {
    const frontmatter = buildProjectFrontmatter(project);
    const filePath = resolve(BUILD_DIR, "projects", `${project.slug}.md`);
    writeFileSync(filePath, `${frontmatter}\n\n${project.content}\n`);
  }
  console.log(`[export-content] Exported ${allProjects.length} projects`);

  // Export about
  const aboutRow = db.select().from(schema.about).get();
  if (aboutRow) {
    writeFileSync(resolve(BUILD_DIR, "about.md"), `${aboutRow.content}\n`);
    console.log("[export-content] Exported about");
  }

  sqlite.close();
  console.log("[export-content] Done");
}

// Allow running as standalone script
const isDirectRun =
  process.argv[1]?.endsWith("export-content.ts") ||
  process.argv[1]?.endsWith("export-content.js");
if (isDirectRun) {
  exportContent();
}
