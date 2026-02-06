---
title: tailwind css에서 리스트 항목(<li>)에 숫자나 기호 표시하기
slug: blog2-tailwind-list-style
created: 2023-11-20
updated:
description:
category: blog2
tags:
published: true
---

tailwind css에서 리스트를 사용하면 앞에 목록 기호가 나타나지 않는다. `<ul>`과 `<ol>` 둘 다 그렇다.
`globals.css`에서 아래 코드를 추가하면 원래대로 돌아온다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ul,
  ol {
    list-style: revert;
  }
}
```
