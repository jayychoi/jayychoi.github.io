"use client";

import GiscusComponent from "@giscus/react";
import { useTheme } from "next-themes";
import { giscusConfig } from "@/lib/site";

export default function Comments() {
  const { resolvedTheme } = useTheme();

  if (!giscusConfig.repo || !giscusConfig.repoId) return null;

  return (
    <section className="mt-12">
      <GiscusComponent
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        lang="ko"
      />
    </section>
  );
}
