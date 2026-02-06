---
title: "Contentlayer에서 highlight.js로 코드블럭 하이라이트"
slug: blog2-highlight-js
created: 2023-11-18
category: blog2
tags: [contentlayer, markdown, highlight-js]
type: [series]
series: blog-v2
order: 7
---

마크다운에 깃허브 스타일을 적용했지만, 코드블럭은 하이라이트되지 않는다. Contentlayer에서는 플러그인 설치와 설정만 하면 쉽게 코드를 하이라이트 할 수 있다. Contentlayer 공식 문서에서 [rehype-highlight][2]를 사용했기 때문에 그대로 따라했다.

[Contentlayer 마크다운 하이라이트 예시][1]

## rehype-highlight 설치

[rehype-highlight][2]는 [highlight.js][3]를 이용해서 만든 rehype 플러그인이다. 단, `6.0.0` 버전을 설치해야 한다. 최신 버전인 `7.0.0`을 설치하면 작동하지 않는다.

```txt
npm install rehype-highlight@6.0.0
```

## contentlayer.config.js 설정

설정 파일 `contentlayer.config.js`에서 `makeSource`의 `markdown` > `rehypePlugins`에 설치한 `rehype-highlight`를 넣어준다.

```ts
import { makeSource } from '@contentlayer/source-files'
import rehypeHighlight from 'rehype-highlight'

export default makeSource({
  // ...
  markdown: { rehypePlugins: [rehypeHighlight] },
})
```

공식 문서에는 플러그인에 `highlight`라고 적어놨지만, `rehypeHighlight`를 입력하면 vscode에서 자동으로 완성해준다.

### 테스트

rehype-highlight가 잘 적용되었는지 확인하려면, 페이지에 접속해서 코드블럭 부분을 개발자 도구로 확인해보면 된다. `<pre>`태그 내부에 있는 `<code>`태그 혹은 `<span>`태그에 클래스로 `hljs`가 들어있으면 작동하는 것이다.

```html
<code class="hljs language-ts">
  <span class="hljs-keyword">import</span> { makeSource }
  <span class="hljs-keyword">from</span>
  <span class="hljs-string">'@contentlayer/source-files'</span>
  <span class="hljs-keyword">import</span> rehypeHighlight
  <span class="hljs-keyword">from</span>
  <span class="hljs-string">'rehype-highlight'</span>
  <span class="hljs-keyword">export</span>
  <span class="hljs-keyword">default</span>
  <span class="hljs-title function_">makeSource</span>({
  <span class="hljs-comment">// ...</span>
  <span class="hljs-attr">markdown</span>: {
  <span class="hljs-attr">rehypePlugins</span>: [rehypeHighlight] }, })
</code>
```

`<span>`태그의 클래스에서 'hljs-' 오른쪽에 있는 부분이 해당 코드를 어떤 색으로 칠해야 하는지를 나타낸다.

## CSS 파일 다운

rehype-highlight를 적용하더라도 CSS 파일을 불러오지 않으면 코드에 색상이 적용되지 않는다. CSS는 원하는 스타일을 알아서 찾아야 한다.
단, rehype 플러그인으로 rehype-highlight를 사용했으므로 CSS 파일은 반드시 highlight.js에서 찾아야 한다.

### highlight.js에서 가져오기

나는 GitHub의 마크다운 스타일을 적용하고 싶어서 코드블럭도 GitHub 스타일로 했다. CSS 파일을 쉽게 찾기 위해 [highlight.js][3]을 설치했다.

```sh
npm install highlight.js
```

`node_modules/highlight.js/styles`를 열어보면 굉장히 많은 CSS 파일을 찾을 수 있다. 하나하나가 다 코드블럭 CSS 파일들이다. `.min.css`는 크기를 줄인 파일, `.css`는 일반 CSS 파일이다. 다크 모드와 라이트 모드가 필요해서 `github-dark.css`와 `github.css`를 가져왔고, 파일을 얻은 뒤에는 highlight.js를 삭제했다. `.min.css`를 가져오면 수정이 어렵다.

**패키지 설치가 싫다면 [highlight.js 리포지토리][4]에서도 가져올 수 있다.**

### 다크 모드 / 라이트 모드 합치기

각 파일에는 클래스와 색상이 바로 연결되어 있다. Tailwind CSS로 다크 모드와 라이트 모드를 사용하기 위해 `<html>`태그의 `class`를 `dark`와 `light`로 바꿔줄 것이기 때문에 이것을 이용해서 두 파일을 합쳤다.

먼저, 각 파일에 있는 색상 코드를 변수로 만들어준다. 변수 이름은 자유롭게 짓는다. 다크 모드와 라이트 모드에서 같은 이름의 변수를 사용해야 한다.

```css
html,
html[class='light'] {
  --color-hljs-color: #24292e;
  --color-hljs-background: #ffffff;
  ...;
}
html[class='dark'] {
  --color-hljs-color: #c9d1d9;
  --color-hljs-background: #0d1117;
  ...;
}
```

그리고 원래 색상 코드가 있던 자리에 해당 변수를 넣어준다.

```css
.hljs {
	color: var(--color-hljs-background);
}

...

.hljs-section {
	color: var(--color-section);
	font-weight: bold;
}

...
```

> 혹시나 이 작업이 귀찮다면 내가 [합쳐놓은 파일][5]을 사용해도 된다.

### CSS 적용

`/app/layout`에 CSS 파일을 import 한다.

[1]: https://contentlayer.dev/docs/reference/source-files/make-source-a5ba4922#markdown 'Contentlayer API: makeSource'
[2]: https://www.npmjs.com/package/rehype-highlight 'rehype-highlight'
[3]: https://highlightjs.org/ 'highlight.js'
[4]: https://github.com/highlightjs/highlight.js/tree/main/src/styles 'highlight.js GitHub Repository: /src/styles'
[5]: /github-markdown-codeblock.css 'github-markdown-codeblock.css'
