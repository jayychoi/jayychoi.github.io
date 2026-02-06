---
title: 헤더(메뉴바) 뒤로 내용이 비치게 하기 - CSS opacity, blur
slug: blog2-header-opacity
created: 2023-11-21
updated:
description:
category: blog2
tags:
published: true
---

# 투명도(opacity)

[`opacity`][1]는 0에서 1 사이의 값을 가진다. opacity는 불투명도라는 뜻이라서 0은 완전 투명, 1은 완전 불투명을 의미한다. CSS에서는 `opacity: 0`의 형식으로 지정할 수 있다. 숫자도 가능하고 퍼센트(%)도 가능하다.

```css
opacity: 0.9;
opacity: 90%;
```

**tailwind**에서는 색상 뒤에 `/`를 쓰고 0~100의 값을 입력하면 된다.

```html
<!-- 완전 투명 -->
<header className="bg-white/0">...</header>

<!-- 완전 불투명 -->
<header className="bg-white/100">...</header>
```

# 블러(blur)

블러를 줄 때는 [`backdrop-filter`][2] 속성을 사용한다. 필터의 종류는 굉장히 많다.

- blur
- brightness
- contrast
- drop-shadow
- grayscale
- hue-rotate
- invert
- opacity
- sepia
- saturate

`backdrop-filter: blur(2px)` 형식으로 사용한다. 픽셀 값이 커질수록 더 많이 뭉개진다.

**tailwind**에서는 [`backdrop-blur-size`][3] 형식으로 사용한다. `size` 자리에 정도를 지정한다.

[1]: https://developer.mozilla.org/en-US/docs/Web/CSS/opacity 'mdn opacity'
[2]: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter 'mdn backdrop-filter'
[3]: https://tailwindcss.com/docs/backdrop-blur 'tailwind backdrop-filter'
