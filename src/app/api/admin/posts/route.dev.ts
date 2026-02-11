import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { buildPostMarkdown } from "@/lib/export-utils";

export async function GET() {
  const allPosts = db.select().from(posts).all();
  return NextResponse.json(allPosts);
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = db
    .insert(posts)
    .values({
      title: body.title,
      slug: body.slug,
      created: body.created,
      updated: body.updated || null,
      description: body.description || null,
      category: body.category,
      tags: body.tags,
      type: body.type || null,
      series: body.series || null,
      order: body.order ?? null,
      content: body.content,
    })
    .returning()
    .get();

  // Regenerate .md file for Velite hot reload
  const buildDir = resolve(process.cwd(), ".content-build", "posts");
  if (!existsSync(buildDir)) mkdirSync(buildDir, { recursive: true });
  writeFileSync(
    resolve(buildDir, `${result.slug}.md`),
    buildPostMarkdown(result),
  );

  return NextResponse.json(result, { status: 201 });
}
