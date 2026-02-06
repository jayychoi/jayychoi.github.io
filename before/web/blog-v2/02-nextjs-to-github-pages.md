---
title: Next.js 프로젝트를 GitHub Pages에 업로드하기
slug: blog2-deploy-to-github-pages
created: 2023-11-15 23:21:00
updated:
description:
category: blog2
tags:
published: true
---

[Next.js 예제](https://github.com/vercel/next.js/tree/canary/examples/github-pages)

1. GitHub Repository를 생성한다.
2. Next.js 프로젝트를 생성한다.
3. `.gitignore`에서 `/out/` 부분을 제거한다.
4. `next.config.js`를 수정한다. [이동](#nextconfigjs-수정)
5. `package.json`에 `deploy` 스크립트를 추가한다. [이동](#deploy-스크립트)
6. 코드를 `main` 브랜치에 push 한다.
7. `deploy` 스크립트를 실행한다. 자동으로 `gh-pages` 브랜치가 생성되고 빌드된 코드가 push된다.
8. 깃허브에서 해당 리포지토리의 **Settings > Pages > Branch**에 가서 브랜치는 `gh-pages`로, 폴더는 `/(root)`로 설정하고 저장한다.
9. 변경사항을 적용하고 싶을 때 `deploy` 스크립트를 실행한다.

# next.config.js 수정

```ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/<리포지토리 이름>',
}

module.exports = nextConfig
```

`output`은 `'export'`로 설정한다.

`basePath`는 리포지토리 이름이 _username_.github.io라면 추가하지 않아도 된다.
아닐 때에만 리포지토리 이름을 적어준다.

# deploy 스크립트

```json
{
	"scripts": {
		...
		"deploy": "next build && touch out/.nojekyll && git add out/ && git commit -m \"Deploy\" && git subtree push --prefix out origin gh-pages"
	},
	...
}
```

다음 스크립트를 `deploy`로 설정한다.

```
next build && touch out/.nojekyll && git add out/ && git commit -m \"Deploy\" && git subtree push --prefix out origin gh-pages
```

# 주의

위 방법으로 배포할 때는 `next.config.js`에 반드시 `output` 옵션이 있어야 한다. 그러나 `output` 옵션을 넣으면 `npm run dev`로 개발 서버를 실행할 때, `generateStaticParams()`로 dynamic route segments를 정적으로 생성하는 데 문제가 있다.

참고: []()
