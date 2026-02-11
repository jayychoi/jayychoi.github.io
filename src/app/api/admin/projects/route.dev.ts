import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { buildProjectMarkdown } from "@/lib/export-utils";

export async function GET() {
  const allProjects = db.select().from(projects).all();
  return NextResponse.json(allProjects);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = db
    .insert(projects)
    .values({
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
      content: body.content,
    })
    .returning()
    .get();

  const buildDir = resolve(process.cwd(), ".content-build", "projects");
  if (!existsSync(buildDir)) mkdirSync(buildDir, { recursive: true });
  writeFileSync(
    resolve(buildDir, `${result.slug}.md`),
    buildProjectMarkdown(result),
  );

  return NextResponse.json(result, { status: 201 });
}
