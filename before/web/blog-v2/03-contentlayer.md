---
title: Contentlayer로 마크다운 파일 읽기
slug: blog2-contentlayer
created: 2023-11-16 21:58:00
updated:
description:
category: blog2
tags: [contentlayer, markdown, nextjs, github-pages, github]
published: true
---

# Contentlayer란

[Contentlayer](https://contentlayer.dev/)는 콘텐츠를 JSON으로 변환해서 쉽게 사용할 수 있게 해주는 도구이다. 프로젝트 폴더에 있는 마크다운 파일을 Next.js에서 사용하기 위해 도입했다.

## Sources

정식으로 지원하는 소스는 [파일][1]이다. (2023년 11월 기준)

- [원격 파일][contentlayer-remote](Git repository, database, API 등)과 [노션][3]은 실험적으로만 제공한다.
- Contentful은 개발 계획 중이고, Sanity는 고려하고 있다고 한다.

## Environments

정식으로 지원하는 환경은 [Next.js][4] 뿐이다. (2023년 11월 기준)

- 추가로 Remix, SvelteKit, Astro, Vite를 고려하고 있다고 한다.

# Contentlayer 설치

[공식 문서][5]

## 패키지 설치

```sh
npm install contentlayer next-contentlayer date-fns
```

### 문제

contentlayer는 Next 12, 13 버전을 필요로 하게 되어 있어서 Next 14에서 설치하려고 하니 에러가 떴다. (2023년 11월 기준)

```sh
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR!
npm ERR! While resolving: paulcjy.github.io@0.1.0
npm ERR! Found: next@14.0.2
npm ERR! node_modules/next
npm ERR!   next@"14.0.2" from the root project
npm ERR!
npm ERR! Could not resolve dependency:
npm ERR! peer next@"^12 || ^13" from next-contentlayer@0.3.4
npm ERR! node_modules/next-contentlayer
npm ERR!   next-contentlayer@"*" from the root project
npm ERR!
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

### 해결 방법

contentlayer 깃허브에 이미 해당 [이슈][6]가 올라와 있었다. Next 14에서 사용할 수 있도록 pull request가 올라왔는데 merge 되지 않았다고 한다.

임시로 `package.json`에 아래 내용을 추가하면 잘 설치된다.

```json
{
  ...
  "overrides": {
    "next-contentlayer": {
      "next": "$next"
    }
  }
}
```

## Next.js 설정

`next.config.js`에서 `nextConfig`를 `withContentlayer`로 감싸준다.

```ts
// next.config.js
const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = withContentlayer(nextConfig)
```

## TypeScript 설정

`tsconfig.json`에 아래 내용을 추가한다.

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    //  ^^^^^^^^^^^
    "paths": {
      "contentlayer/generated": ["./.contentlayer/generated"]
      // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".contentlayer/generated"
    // ^^^^^^^^^^^^^^^^^^^^^^
  ]
}
```

## .gitignore 설정

`.gitignore`에 `.contentlayer`를 추가한다.

```bash
# .gitignore

...

# contentlayer
.contentlayer
```

# 스키마 정의

## Contentlayer 설정

루트 디렉토리에 `contentlayer.config.ts`라는 파일을 만들고, 사용할 문서의 타입들을 정의한다.

`Post`라는 타입을 정의한 예시이다.

```ts
// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({ contentDirPath: 'posts', documentTypes: [Post] })
```

- `Post` 타입의 문서들은 `posts` 디렉토리 안의 마크다운 파일이어야 한다.
- `fields` 옵션은 마크다운 파일 front-matter에 반드시 있어야 하는 항목들이다.
- `computedFields` 옵션은 front-matter에는 없지만 contentlayer가 문서 객체를 만들 때 필드로 생성되는 부분이다.

## 파일 예시

### 폴더 구조 예시

```txt
posts/
├── post-01.md
├── post-02.md
└── post-03.md
```

### 마크다운 파일 예시

```txt
---
title: My First Post
date: 2021-12-24
---

Ullamco et nostrud magna commodo nostrud ...
```

# 웹페이지에 출력

`app/page.tsx`에 아래 코드를 입력한다.

```tsx
// app/page.tsx
import Link from 'next/link'
import { compareDesc, format, parseISO } from 'date-fns'
import { allPosts, Post } from 'contentlayer/generated'

function PostCard(post: Post) {
  return (
    <div className="mb-8">
      <h2 className="mb-1 text-xl">
        <Link
          href={post.url}
          className="text-blue-700 hover:text-blue-900 dark:text-blue-400"
        >
          {post.title}
        </Link>
      </h2>
      <time dateTime={post.date} className="mb-2 block text-xs text-gray-600">
        {format(parseISO(post.date), 'LLLL d, yyyy')}
      </time>
      <div
        className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </div>
  )
}

export default function Home() {
  const posts = allPosts.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">
        Next.js + Contentlayer Example
      </h1>
      {posts.map((post, idx) => (
        <PostCard key={idx} {...post} />
      ))}
    </div>
  )
}
```

`contentlayer/generated`를 import 하는 부분에서 에러가 발생한다. 서버를 시작할 때, contentlayer가 대상 폴더를 읽어서 루트 디렉토리에 `.contentlayer/generated`라는 폴더를 만드는데, 아직 서버가 실행된 적이 없어 이 폴더가 생성되지 않았기 때문이다. 서버가 실행되면 없어지니 무시해도 된다.

다음으로, 마크다운을 출력하는 페이지를 만든다.
`app/posts/[slug]/page.tsx`을 생성하고 아래 코드를 입력한다.

```tsx
// app/posts/[slug]/page.tsx
import { format, parseISO } from 'date-fns'
import { allPosts } from 'contentlayer/generated'

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }))

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)
  return { title: post.title }
}

const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.date} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.date), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div
        className="[&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
  )
}

export default PostLayout
```

앱을 실행시킨다.

```txt
npm run dev
```

페이지를 열어보면 글 목록이 있고, 제목을 클릭하면 글을 볼 수 있다.

# 주의

turbopack을 사용하니 `.contentlayer` 폴더가 아예 생성되지 않았다. 꼭 turbopack 옵션은 끄고 서버를 실행해야 한다.

[1]: https://contentlayer.dev/docs/sources/files-ae74398f 'Contentlayer > Sources > Files'
[2]: https://contentlayer.dev/docs/sources/remote-files-fbb47906 'Contentlayer > Sources > Remote Files'
[3]: https://contentlayer.dev/docs/sources/notion-b2ce5957 'Contentlayer > Sources > Notion'
[4]: https://contentlayer.dev/docs/environments/nextjs-dcf8e39e 'Contentlayer > Environments > Next.js'
[5]: https://contentlayer.dev/docs/getting-started-cddd76b7 'Contentlayer > Getting Started'
[6]: https://github.com/contentlayerdev/contentlayer/issues/588 'Contentlayer GitHub Issues: ERROR: when trying to install next-contentlayer in Next.js @14'
