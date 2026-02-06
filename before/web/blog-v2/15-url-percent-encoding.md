---
title: 퍼센트(%)로 인코딩된 URL 깔끔하게 정리하기
created: 2023-12-10 23:05:00
slug: blog2-prevent-url-encoding
updated:
description:
category: blog2
tags:
published: true
---

# 배경

게시판 이름은 게시글을 담은 폴더의 이름으로 설정했다. 그랬더니 띄어쓰기나 특수문자가 있을 경우 `%`가 들어간 문자로 변환이 되어버렸다.

```
paulcjy.github.io/blog/GitHub%20Pages%20+%20Next.js/12-sticky-header
```

그래서 띄어쓰기나 특수문자를 `-`로 변경해서 URL을 깔끔하게 만들고 싶었다.

> 이것을 [퍼센트 인코딩][1]이라고 한다. URL에서 특정 의미를 갖는 문자를 `%`를 사용하여 인코딩한다. 인코딩이 필요한 특수문자는 `:`, `/`, `?`, `#`, `[`, `]`, `@`, `!`, `$`, `&`, `'`, `(`, `)`, `*`, `+`, `,`, `;`, `=`, `%`, ` `이다.

# Contentlayer 속성 추가

게시판이나 게시글의 URL은 폴더와 파일의 이름을 contentlayer의 속성으로 추가하여 만들었다. 기존에는 이름을 그대로 가져와서 속성으로 사용했기 때문에 URL을 변경하려면 이 단계에서 수정해야 했다.

게시판 이름은 메뉴 이름으로도 사용해야 하기 때문에 URL용 속성과 메뉴용 속성을 따로 만들었다.

```ts
const board = post._raw.sourceFileDir
  .split('/')[1]
  .replace(/[:/?#\[\]@!$&'()*+,;=% ]+/g, '-')
```

폴더 이름(게시판 이름)을 가져온 뒤, 퍼센트 인코딩이 되는 문자 20개를 `-`로 변경했다. 또한, 단순히 특수문자를 `-`로만 변경하면 변경할 문자가 연속적으로 나타나는 경우 불필요하게 `-`가 반복되기 때문에 연속적인 특수문자는 전부 한 개로 치환하도록 했다.

# 메뉴 변경

`menu.ts`는 게시판 정보를 담당한다. 폴더 이름(게시판 이름)을 두 개로 나눠서 `name`에는 원래 문자열을 그대로 저장하고, `id`에 URL로 사용할 문자열을 저장했다.

`name`은 메뉴 컴포넌트를 만들 때 사용하고, `id`는 URL을 만들 때와 게시판/게시글을 찾을 때 사용한다.

# 페이지 변경

`[board]/page.tsx`와 `[board]/[post]/page.tsx`에서 한 개만 사용하던 게시판 이름을 경우에 따라 `name`과 `id`로 나누어 사용하는 것으로 변경했다.

[1]: https://developer.mozilla.org/ko/docs/Glossary/Percent-encoding 'MDN: Percent-encoding'
