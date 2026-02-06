---
title: "encodeURI와 encodeURIComponent"
slug: blog2-encode-uri
created: 2023-11-20
category: blog2
tags: []
type: [series]
series: blog-v2
order: 17
---

## 문제 상황

게시판, 게시글의 url이 잘 작동하다가 'GitHub Pages + Next.js'라는 이름의 게시판을 만드니 작동하지 않았다. 폴더명을 그대로 url로 만들어서 url에는 인코딩 된 폴더명(게시판 이름)이 사용되었다. 그래서 게시글을 찾을 때는 게시판 이름 부분을 디코드 해서 필터 함수로 비교했는데, 콘솔에 출력해보니 결과가 다음과 같았다.

`GitHub Pages + Next.js` > `GitHub%20Pages%20%2B%20Next.js` > `GitHub Pages %2B Next.js`

`+`는 `%2B`로 인코딩 되었지만, 디코딩 했을 때는 그대로 `%2B`였다.

## encodeURI와 encodeURIComponent의 차이점

[stackoverflow: What is the difference between decodeURIComponent and decodeURI?][1]

- `encodeURI`/`decodeURI`는 url 전체를 인코딩/디코딩하는 함수이다.
- `encodeURIComponent`/`decodeURIComponent`는 url의 한 부분만 인코딩/디코딩하는 함수이다. 구분자(`;`, `/`, `?`, `:`, `@`, `&`, `=`, `+`, `$`, `#`)를 모두 인코딩/디코딩한다.

따라서, `encodeURIComponent`/`decodeURIComponent`를 사용하면 위 구분자들도 전부 문자열로 취급해서 인코딩/디코딩 해버린다.

## 원인

`decodeURI`를 사용해서 생긴 문제였다. `decodeURI`는 구분자 `+`를 디코딩하지 않았다.

## 해결 방법

`decodeURI` 대신 `decodeURIComponent`를 사용한다.

[1]: https://stackoverflow.com/questions/747641/what-is-the-difference-between-decodeuricomponent-and-decodeuri
