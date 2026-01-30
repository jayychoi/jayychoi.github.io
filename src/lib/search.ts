import { posts } from "#velite";
import { decodeHtmlEntities } from "./html";

export interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

export function getSearchItems(): SearchItem[] {
  return posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description ?? "",
    category: p.category,
    tags: p.tags,
    content: stripHtml(p.content),
  }));
}
