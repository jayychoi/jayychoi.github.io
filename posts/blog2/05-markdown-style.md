---
title: "마크다운에 깃허브 스타일 적용하기"
slug: blog2-github-style-markdown
created: 2023-11-18
category: blog2
tags: [markdown, github]
type: [series]
series: blog-v2
order: 6
---

## github-markdown-css

이전에는 직접 마크다운 스타일도 만들어봤지만 너무 귀찮고, 익숙한 깃허브 스타일을 사용해보고 싶어서 검색해봤다. [github-markdown-css][1]를 바로 찾을 수 있었다.

[사용법][2]은 간단하다. CSS 파일(`github-markdown.css` 등)을 import 하고, 마크다운을 감싸고 있는 컨테이너 태그에 `markdown-body`를 클래스로 추가하면 끝이다.

- [`github-markdown.css`][3]: 다크 모드 + 라이트 모드
- [`github-markdown-dark.css`][4]: 다크 모드
- [`github-markdown-light.css`][5]: 라이트 모드

### `app/layout.tsx`에 import

```ts
import 'your_css_file.css'
```

### 클래스 추가

Contentlayer 예제에서 작성한 `posts/[slug]/page.tsx`에서 마크다운이 들어간 부분의 `<div>` 태그의 `class`에 `markdown-body`를 추가한다.

```tsx
const PostLayout = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug)
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`)

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        <time dateTime={post.created} className="mb-1 text-xs text-gray-600">
          {format(parseISO(post.created), 'LLLL d, yyyy')}
        </time>
        <h1 className="text-3xl font-bold">{post.title}</h1>
      </div>
      <div
        className="markdown-body [&>*]:mb-3 [&>*:last-child]:mb-0" // 여기
        dangerouslySetInnerHTML={{ __html: post.body.html }}
      />
    </article>
  )
}
```

다크 모드나 라이트 모드 한 개만 사용할거라면 여기까지가 끝이다.

## CSS 파일 수정

다크 모드와 라이트 모드를 전환시킨다면, [`github-markdown.css`][3]를 사용하는 것이 편하다.

단, 파일을 수정해야 한다. 이 파일은 다크 모드와 라이트 모드를 미디어 쿼리로 구분한다. 나는 tailwind를 사용하기 때문에 다크 모드와 라이트 모드를 `<html>` 태그의 `class`로 구분한다. 그래서 미디어 쿼리로 작동하는 방식을 `class`로 바꿔주어야 한다.

```css
/* 미디어 쿼리 방식(원본 파일) */
@media (prefers-color-scheme: dark) {
  .markdown-body,
  [data-theme='dark'] {
    /* 다크 모드 색상 정의 */
    ...;
  }
}
@media (prefers-color-scheme: light) {
  .markdown-body,
  [data-theme='light'] {
    /* 라이트 모드 색상 정의 */
    ...;
  }
}
```

원래 이랬던 파일을 이렇게 바꿔준다.

```css
/* tailwind css 방식 */
html,
html[class='dark'] {
  /* 다크 모드 색상 정의 */
  ...;
}
html[class='light'] {
  /* 라이트 모드 색상 정의 */
  ...;
}
```

이렇게 하면 다크 모드와 라이트 모드를 전환할 때, 마크다운으로 작성한 부분도 깃허브 스타일로 잘 전환된다.

만약 전환되지 않는다면, next-themes의 `ThemeProvider` 설정을 잘 했는지 확인한다. `attribute="class"`를 넣어줘야 한다.

### 주의: 배경색 바꾸기

github-markdown-css에서 제공하는 CSS 파일에는 배경색이 지정되어 있다. 배경색을 수정하지 않고 그대로 사용한다면 자신이 만든 페이지의 배경색 위에 깃허브 색상이 나타나게 된다.

`--color-canvas-default`의 값을 `transparent`로 바꾸면 해결된다.

[1]: https://github.com/sindresorhus/github-markdown-css 'github-markdown-css'
[2]: https://github.com/sindresorhus/github-markdown-css#usage 'github-markdown-css Usage'
[3]: https://github.com/sindresorhus/github-markdown-css/blob/main/github-markdown.css 'github-markdown.css'
[4]: https://github.com/sindresorhus/github-markdown-css/blob/main/github-markdown-dark.css 'github-markdown-dark.css'
[5]: https://github.com/sindresorhus/github-markdown-css/blob/main/github-markdown-light.css 'github-markdown-light.css'
