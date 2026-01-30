export const siteConfig = {
  name: "최재영의 개발 일지",
  url: "https://jayychoi.github.io",
  description: "개발과 기술에 대한 기록",
  author: "최재영",
  locale: "ko_KR",
} as const;

export const giscusConfig = {
  repo: "jayychoi/jayychoi.github.io" as `${string}/${string}`,
  repoId: "R_kgDOKvyANA",
  category: "Announcements",
  categoryId: "DIC_kwDOKvyANM4C1pkQ",
} as const;
