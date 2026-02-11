import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { about } from "@/db/schema";

export async function GET() {
  const row = db.select().from(about).get();
  return NextResponse.json(row ?? { content: "" });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const existing = db.select().from(about).get();

  let result: typeof about.$inferSelect | undefined;
  if (existing) {
    result = db
      .update(about)
      .set({ content: body.content })
      .where(eq(about.id, existing.id))
      .returning()
      .get();
  } else {
    result = db
      .insert(about)
      .values({ content: body.content })
      .returning()
      .get();
  }
  if (!result) return NextResponse.json({ error: "Failed" }, { status: 500 });

  // Regenerate about.md
  const buildDir = resolve(process.cwd(), ".content-build");
  if (!existsSync(buildDir)) mkdirSync(buildDir, { recursive: true });
  writeFileSync(resolve(buildDir, "about.md"), `${result.content}\n`);

  return NextResponse.json(result);
}
