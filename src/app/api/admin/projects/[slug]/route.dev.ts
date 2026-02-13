import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { buildProjectMarkdown } from "@/lib/export-utils";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const project = db
    .select()
    .from(projects)
    .where(eq(projects.slug, slug))
    .get();
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();

  const result = db
    .update(projects)
    .set({
      title: body.title,
      slug: body.slug,
      description: body.description,
      techs: body.techs,
      status: body.status,
      startDate: body.startDate,
      endDate: body.endDate || null,
      github: body.github || null,
      url: body.url || null,
      thumbnail: body.thumbnail || null,
      projectType: body.projectType || "personal",
      content: body.content,
    })
    .where(eq(projects.slug, slug))
    .returning()
    .get();

  if (!result)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buildDir = resolve(process.cwd(), ".content-build", "projects");
  if (slug !== result.slug) {
    const oldPath = resolve(buildDir, `${slug}.md`);
    if (existsSync(oldPath)) rmSync(oldPath);
  }

  if (!existsSync(buildDir)) mkdirSync(buildDir, { recursive: true });
  writeFileSync(
    resolve(buildDir, `${result.slug}.md`),
    buildProjectMarkdown(result),
  );

  return NextResponse.json(result);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  db.delete(projects).where(eq(projects.slug, slug)).run();

  const filePath = resolve(
    process.cwd(),
    ".content-build",
    "projects",
    `${slug}.md`,
  );
  if (existsSync(filePath)) rmSync(filePath);

  return NextResponse.json({ ok: true });
}
