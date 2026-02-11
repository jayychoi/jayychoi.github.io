import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { buildPostMarkdown } from "@/lib/export-utils";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = db.select().from(posts).where(eq(posts.slug, slug)).get();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();

  const result = db
    .update(posts)
    .set({
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
    .where(eq(posts.slug, slug))
    .returning()
    .get();

  if (!result)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If slug changed, remove old .md file
  const buildDir = resolve(process.cwd(), ".content-build", "posts");
  if (slug !== result.slug) {
    const oldPath = resolve(buildDir, `${slug}.md`);
    if (existsSync(oldPath)) rmSync(oldPath);
  }

  // Regenerate .md file
  if (!existsSync(buildDir)) mkdirSync(buildDir, { recursive: true });
  writeFileSync(
    resolve(buildDir, `${result.slug}.md`),
    buildPostMarkdown(result),
  );

  return NextResponse.json(result);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  db.delete(posts).where(eq(posts.slug, slug)).run();

  // Remove .md file
  const filePath = resolve(
    process.cwd(),
    ".content-build",
    "posts",
    `${slug}.md`,
  );
  if (existsSync(filePath)) rmSync(filePath);

  return NextResponse.json({ ok: true });
}
