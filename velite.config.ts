import rehypeShiki from "@shikijs/rehype";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import { defineConfig, s } from "velite";

export default defineConfig({
  root: ".content-build",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  markdown: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: {
            className: ["heading-anchor"],
            ariaHidden: true,
            tabIndex: -1,
          },
          content: {
            type: "element",
            tagName: "svg",
            properties: {
              xmlns: "http://www.w3.org/2000/svg",
              width: "1em",
              height: "1em",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              className: ["heading-anchor-icon"],
            },
            children: [
              {
                type: "element",
                tagName: "path",
                properties: {
                  d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                },
                children: [],
              },
              {
                type: "element",
                tagName: "path",
                properties: {
                  d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                },
                children: [],
              },
            ],
          },
        },
      ],
      [
        // biome-ignore lint/suspicious/noExplicitAny: <following documentation>
        rehypeShiki as any,
        {
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
        },
      ],
    ],
  },
  collections: {
    posts: {
      name: "Post",
      pattern: "posts/**/*.md",
      schema: s.object({
        title: s.string().max(200),
        slug: s.slug("posts"),
        created: s.isodate(),
        updated: s.isodate().optional(),
        description: s.string().optional(),
        category: s.string(),
        tags: s.array(s.string()).optional(),
        type: s.array(s.enum(["til", "series"])).optional(),
        series: s.string().optional(),
        order: s.number().optional(),
        metadata: s.metadata(),
        toc: s.toc(),
        content: s.markdown(),
      }),
    },
    projects: {
      name: "Project",
      pattern: "projects/**/*.md",
      schema: s.object({
        title: s.string().max(200),
        slug: s.slug("projects"),
        description: s.string(),
        techs: s.array(s.string()),
        status: s.enum(["in-progress", "active", "archived"]),
        startDate: s.isodate(),
        endDate: s.isodate().optional(),
        github: s.string().optional(),
        url: s.string().optional(),
        thumbnail: s.image().optional(),
        content: s.markdown(),
      }),
    },
    about: {
      name: "About",
      pattern: "about.md",
      single: true,
      schema: s.object({
        content: s.markdown(),
      }),
    },
  },
});
