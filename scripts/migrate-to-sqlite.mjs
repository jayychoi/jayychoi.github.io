import Database from "better-sqlite3";
import matter from "gray-matter";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const CONTENT = join(ROOT, "content");
const DB_PATH = join(CONTENT, "blog.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// --- helpers ---

function walkMd(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkMd(full));
    } else if (entry.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function toJson(val) {
  if (val == null) return null;
  if (Array.isArray(val)) return JSON.stringify(val);
  return JSON.stringify(val);
}

// --- clear tables ---

db.exec("DELETE FROM posts");
db.exec("DELETE FROM projects");
db.exec("DELETE FROM about");
db.exec("DELETE FROM sqlite_sequence WHERE name IN ('posts','projects','about')");

// --- posts ---

const insertPost = db.prepare(`
  INSERT INTO posts (title, slug, created, updated, description, category, tags, type, series, "order", content)
  VALUES (@title, @slug, @created, @updated, @description, @category, @tags, @type, @series, @order, @content)
`);

const postsDir = join(CONTENT, "posts");
const postFiles = walkMd(postsDir);
let postCount = 0;
let skipped = [];

const insertPosts = db.transaction(() => {
  for (const file of postFiles) {
    const raw = readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    if (!data.title || !data.slug || !data.category) {
      skipped.push(file.replace(CONTENT + "/", ""));
      continue;
    }

    insertPost.run({
      title: data.title,
      slug: data.slug,
      created: String(data.created),
      updated: data.updated ? String(data.updated) : null,
      description: data.description ?? null,
      category: data.category,
      tags: toJson(data.tags ?? []),
      type: toJson(data.type) ?? null,
      series: data.series ?? null,
      order: data.order ?? null,
      content: content.trim(),
    });
    postCount++;
  }
});
insertPosts();

// --- projects ---

const insertProject = db.prepare(`
  INSERT INTO projects (title, slug, description, techs, status, start_date, end_date, github, url, thumbnail, content)
  VALUES (@title, @slug, @description, @techs, @status, @startDate, @endDate, @github, @url, @thumbnail, @content)
`);

const projectsDir = join(CONTENT, "projects");
const projectFiles = walkMd(projectsDir);
let projectCount = 0;

const insertProjects = db.transaction(() => {
  for (const file of projectFiles) {
    const raw = readFileSync(file, "utf-8");
    const { data, content } = matter(raw);

    if (!data.title || !data.slug) {
      skipped.push(file.replace(CONTENT + "/", ""));
      continue;
    }

    insertProject.run({
      title: data.title,
      slug: data.slug,
      description: data.description ?? "",
      techs: toJson(data.techs ?? []),
      status: data.status ?? "active",
      startDate: String(data.startDate ?? data.start_date ?? ""),
      endDate: data.endDate ? String(data.endDate) : (data.end_date ? String(data.end_date) : null),
      github: data.github ?? null,
      url: data.url ?? null,
      thumbnail: data.thumbnail ?? null,
      content: content.trim(),
    });
    projectCount++;
  }
});
insertProjects();

// --- about ---

const aboutFile = join(CONTENT, "about.md");
const aboutRaw = readFileSync(aboutFile, "utf-8");
const { content: aboutContent } = matter(aboutRaw);

db.prepare("INSERT INTO about (content) VALUES (?)").run(aboutContent.trim());

// --- done ---

db.close();

console.log(`Done! posts: ${postCount}, projects: ${projectCount}, about: 1`);
if (skipped.length) {
  console.log(`Skipped ${skipped.length} file(s) (missing frontmatter):`);
  for (const s of skipped) console.log(`  - ${s}`);
}
