---
title: '[Next.js]Error: Page ~ is missing param ~ in generateStaticParams(), which is required with output export config'
created: 2023-11-21
slug: blog2-generate-static-params-error
updated:
description:
category: blog2
tags:
published: true
---

게시판 이름을 그대로 URL에서 사용하다보니 URL에 특수문자가 포함되는 경우가 생겼다. 특수문자가 URL에 포함되지 않을 때는 `next.config.js`에 `output: 'export'` 설정이 있든 없든 개발 서버가 잘 실행되었다. 하지만 URL에 특수문자가 들어가니 `output: 'export'` 설정을 추가한 상태로 개발 서버를 실행(`npm run dev`)하니 이런 에러가 떴다.

```
Page ~ is missing param ~ in generateStaticParams(), which is required with output export config'
```

해결하려고 시도했지만 방법을 찾을 수 없어서 개발과 배포를 분리하기로 했다. 개발 중에는 `output: 'export'` 설정을 없애고, 배포(build와 export)할 때만 이 설정을 추가했다.

이렇게 하니 개발 도중에 불필요한 `/out` 폴더가 매번 생성되지 않는 점은 좋았다.
