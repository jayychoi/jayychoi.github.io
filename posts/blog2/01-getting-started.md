---
title: "Repository와 Next.js 프로젝트 생성"
slug: blog2-getting-started
created: 2023-11-15
category: blog2
tags: []
type: [series]
series: blog-v2
order: 2
---

## GitHub Repository 생성

GitHub Pages는 public repository에서 사용할 수 있다. 블로그 주소는 _username_.github.io 이다.
*username*은 본인의 아이디이다.

리포지토리 이름을 username.github.io로 지으면 해당 리포지토리는 `username.github.io` 주소로 접속할 수 있다.
그 외의 이름을 지으면 `username.github.io`의 하위 주소로 접속할 수 있다.
예를 들어, 리포지토리 이름이 abc라면 `username.github.io/abc`로 연결된다.

생성한 리포지토리와 로컬 저장소를 연결한다.

## Next.js 프로젝트 생성

`create-next-app`을 사용하여 Next.js 프로젝트를 생성한다.

```sh
npx create-next-app@latest
```

생성 후에는 불필요한 폴더와 파일을 삭제한다.

## GitHub Pages 테스트

생성한 리포지토리 이름이 `username.github.io`일 경우, 페이지가 잘 뜨는지 간단하게 확인하고 싶으면 프로젝트 루트 디렉토리에 `index.html`을 만들고 아무거나 입력한다.
GitHub에 push 하고 본인의 주소로 이동하면 `index.html`이 브라우저에 나타난다.

```
https://username.github.io
```
