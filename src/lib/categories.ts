export interface Category {
  id: string;
  label: string;
}

export interface CategoryGroup {
  label: string;
  categories: Category[];
}

/**
 * 카테고리 대분류 및 소분류 정의.
 * - id: frontmatter의 category 값
 * - label: 사이드바에 표시되는 이름
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    label: "Language",
    categories: [
      { id: "java", label: "Java" },
      { id: "kotlin", label: "Kotlin" },
      { id: "rust", label: "Rust" },
      { id: "cpp", label: "C++" },
    ],
  },
  {
    label: "Linux",
    categories: [
      { id: "linux", label: "Linux" },
      { id: "arch-linux", label: "Arch Linux" },
    ],
  },
  {
    label: "Web",
    categories: [
      { id: "spring", label: "Spring" },
      { id: "blog2", label: "블로그 만들기 v2" },
    ],
  },
  {
    label: "DevOps",
    categories: [
      { id: "docker", label: "Docker" },
      { id: "github-actions", label: "GitHub Actions" },
    ],
  },
  {
    label: "Algorithm",
    categories: [{ id: "algorithm", label: "알고리즘" }],
  },
  {
    label: "Tool",
    categories: [{ id: "nvim", label: "Neovim" }],
  },
  {
    label: "Etc",
    categories: [{ id: "etc", label: "기타" }],
  },
];

/** id → label 매핑 (카테고리 페이지 등에서 표시용) */
export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  CATEGORY_GROUPS.flatMap((g) => g.categories.map((c) => [c.id, c.label])),
);
