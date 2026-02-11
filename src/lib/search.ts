import { posts, projects } from "#velite";
import { decodeHtmlEntities } from "./html";

export interface SearchItem {
  href: string;
  title: string;
  description: string;
  category: string;
  tags?: string[];
  content: string;
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

export function getSearchItems(): SearchItem[] {
  const postItems: SearchItem[] = posts.map((p) => ({
    href: `/blog/posts/${p.slug}`,
    title: p.title,
    description: p.description ?? "",
    category: p.category,
    tags: p.tags,
    content: stripHtml(p.content),
  }));

  const projectItems: SearchItem[] = projects.map((p) => ({
    href: `/projects/${p.slug}`,
    title: p.title,
    description: p.description,
    category: "project",
    tags: p.techs,
    content: stripHtml(p.content),
  }));

  return [...postItems, ...projectItems];
}
