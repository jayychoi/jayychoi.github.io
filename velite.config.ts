import { defineConfig, s } from "velite";

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
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
        description: s.string(),
        category: s.string(),
        tags: s.array(s.string()),
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
        status: s.enum(["in-progress", "completed"]),
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
