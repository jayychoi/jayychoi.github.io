import { type Post, posts } from "#velite";

// 전체 글 (created 내림차순)
export function getAllPosts(): Post[] {
  return posts.sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
  );
}

// slug로 글 조회
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

// 카테고리 필터
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

// 태그 필터
export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

// 시리즈 필터 (order 순 정렬)
export function getPostsBySeries(series: string): Post[] {
  return posts
    .filter((p) => p.series === series)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// TIL 글 필터
export function getTilPosts(): Post[] {
  return getAllPosts().filter((p) => p.type?.includes("til"));
}

// 특정 날짜 TIL (date: "YYYY-MM-DD")
export function getTilPostsByDate(date: string): Post[] {
  return getTilPosts().filter((p) => p.created.substring(0, 10) === date);
}

// 카테고리 목록 (글 수 포함)
export function getAllCategories(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    map.set(p.category, (map.get(p.category) ?? 0) + 1);
  }
  return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

// 태그 목록 (글 수 포함)
export function getAllTags(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const tag of p.tags) {
      map.set(tag, (map.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

// 시리즈 목록 (글 수 포함)
export function getAllSeries(): { name: string; count: number }[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    if (p.series) {
      map.set(p.series, (map.get(p.series) ?? 0) + 1);
    }
  }
  return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

// TIL이 있는 날짜 목록
export function getTilDates(): string[] {
  const dates = new Set<string>();
  for (const p of getTilPosts()) {
    dates.add(p.created.substring(0, 10));
  }
  return Array.from(dates).sort().reverse();
}

// TIL 날짜별 글 수
export function getTilDateCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of getTilPosts()) {
    const date = p.created.substring(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  }
  return counts;
}
