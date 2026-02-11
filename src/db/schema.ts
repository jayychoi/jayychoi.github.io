import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  created: text("created").notNull(),
  updated: text("updated"),
  description: text("description"),
  category: text("category").notNull(),
  tags: text("tags", { mode: "json" }).notNull().$type<string[]>(),
  type: text("type", { mode: "json" }).$type<("til" | "series")[]>(),
  series: text("series"),
  order: integer("order"),
  content: text("content").notNull(),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  techs: text("techs", { mode: "json" }).notNull().$type<string[]>(),
  status: text("status").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  github: text("github"),
  url: text("url"),
  thumbnail: text("thumbnail"),
  content: text("content").notNull(),
});

export const about = sqliteTable("about", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
});
