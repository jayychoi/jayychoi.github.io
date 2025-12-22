export interface CategoryMenuItem {
  name: string
  slug: string
}

export interface CategoryMenuGroup {
  name: string
  children: CategoryMenuItem[]
}

export const categoryMenuItems: CategoryMenuGroup[] = [
  {
    name: 'Web',
    children: [
      { name: '개발 블로그 v2 (Next.js)', slug: 'blog2' },
      { name: 'Spring', slug: 'spring' },
    ],
  },
  {
    name: 'Linux',
    children: [
      { name: 'Linux', slug: 'linux' },
      { name: 'Arch Linux', slug: 'arch-linux' },
      { name: 'Bash', slug: 'bash' },
    ],
  },
  {
    name: 'DevOps',
    children: [
      { name: 'Docker', slug: 'docker' },
    ]
  },
  {
    name: 'Language',
    children: [
      { name: 'C++', slug: 'cpp' },
      { name: 'Rust', slug: 'rust' },
      { name: 'Java', slug: 'java' },
      { name: 'Kotlin', slug: 'kotlin' },
      { name: 'JavaScript', slug: 'javascript' },
    ],
  },
  {
    name: 'Others',
    children: [
      { name: '알고리즘', slug: 'algorithm' },
      { name: 'Neovim', slug: 'nvim' },
      { name: 'GitHub Actions', slug: 'github-actions' },
      { name: 'etc', slug: 'etc' },
    ],
  },
]

export const categoryMenuMap: Record<string, string> = categoryMenuItems.reduce(
  (acc, categoryMenuGroup) => {
    categoryMenuGroup.children.forEach((categoryMenuItem) => {
      const { name, slug } = categoryMenuItem
      acc[slug] = name
    })
    return acc
  },
  {} as Record<string, string>,
)
