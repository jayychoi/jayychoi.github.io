---
title: html로 변환한 마크다운에서 정규표현식으로 html 태그 제거
slug: blog2-extract-summary-from-html
created: 2023-11-18 23:28:00
updated:
description:
category: blog2
tags: [html, markdown, javascript, replace-all]
published: true
---

# 문제

Contentlayer의 예제를 따라하면 글 목록에 글 본문 전체가 출력된다. `app/page.tsx`의 `<PostCard>` 컴포넌트에 글 본문 전체를 넣도록 되어 있다. `<div>`에 `dangerouslySetInnerHTML`로 `post.body.html`을 통째로 전달한다.

```tsx
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
      <time
        dateTime={post.created}
        className="mb-2 block text-xs text-gray-600"
      >
        {format(parseISO(post.created), 'LLLL d, yyyy')}
      </time>
      <div
        className="text-sm [&>*]:mb-3 [&>*:last-child]:mb-0"
        dangerouslySetInnerHTML={{ __html: post.body.html }} // 이 부분
      />
    </div>
  )
}
```

그러나 나는 글 본문 전체를 넣고 싶지도 않고, 마크다운을 적용하고 싶지도 않다. 글이 길다면 앞에서부터 특정 길이만큼만 잘라서 넣고 싶다. 그리고 마크다운 문법도 제외한 플레인 텍스트만 넣고 싶다.

# 해결 방법

일단 html로 변환된 `post.body.html`에서 html 태그만 제거한다. [정규표현식][1]을 이용하면 쉽게 제거할 수 있다.

```ts
const plainText = textWithHtmlTags.replaceAll(/<.*?>/g, '')
```

글자 수 제한을 정한다. 제한을 넘지 않으면 그대로 사용한다. 제한을 넘기면 뒤를 자른 뒤 '...'을 붙인다.

```ts
const textLimit = 200
const content =
  plainText.length < textLimit
    ? plainText
    : plainText.substring(0, textLimit) + '...'
```

원래 내용이 들어가던 `<div>` 태그에서 `dangerouslySetInnerHTML` 속성을 없애고, 내부에 자른 내용을 넣었다.

```tsx
// 완성된 <PostCard> 컴포넌트
function PostCard(post: Post) {
  const plainText = post.body.html.replaceAll(/<.*?>/g, '')
  const textLimit = 200
  const content =
    plainText.length < textLimit
      ? plainText
      : plainText.substring(0, textLimit) + '...'

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
      <time
        dateTime={post.created}
        className="mb-2 block text-xs text-gray-600"
      >
        {format(parseISO(post.created), 'LLLL d, yyyy')}
      </time>
      <div>{content}</div>
    </div>
  )
}
```

# 추가: 또 다른 문제

글 본문에 html 태그가 들어갈 때가 있다. 다행히도 정규표현식 `/<.*?>/g`으로 전부 제거했을 때, 본문에 작성된 html 태그는 지워지지 않았다. 대신 처음부터 `<`가 `&#x3C;`로 바뀌어져 있었다. [`&#x3C;`][2]는 `<`의 유니코드의 헥스 코드이다.

`&#x3C;`만 다시 `<`로 바꿔주면 정상적으로 표시된다. (대소문자 주의)

```ts
const plainText = textWithHtmlTags
  .replaceAll(/<.*?>/g, '')
  .replaceAll('&#x3C;', '<')
```

[1]: ## '정규표현식 설명글'
[2]: https://www.codetable.net/hex/3c 'unicode <'
