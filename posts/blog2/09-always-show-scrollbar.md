---
title: "스크롤바 항상 보이게 하기"
slug: blog2-always-show-scrollbar
created: 2023-11-18
category: blog2
tags: [css, scroll, scroll-bar, tailwind]
type: [series]
series: blog-v2
order: 10
---

길이가 짧은 페이지에는 스크롤바가 없고, 길이가 길어지면 스크롤바가 생기니 페이지를 이동할 때마다 화면이 좌우로 조금씩 왔다갔다 했다. 그래서 항상 스크롤바를 띄우기로 했다.

`<html>` 태그에 `overflow-y: scroll` 속성을 추가한다.

## tailwind css

```html
<html className="overflow-y-scroll" />
```

## CSS

```css
html {
  overflow-y: scroll;
}
```

## 주의

tailwind css를 사용하고 있어서 `<html>` 태그에 `className`으로 스크롤바를 넣으려고 했다. 그랬더니 다크/라이트 모드에서 사용하는 클래스가 지워지고 `overflow-y-scroll`만 남게 되어 다크/라이트 모드가 작동하지 않게 되었다. 기존에 사용하던 next-themes를 덮어씌워서 생기는 문제였다.

그래서 `globals.css`에 스타일을 추가하는 방식을 사용했다.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    overflow-y: scroll;
  }
}
```
