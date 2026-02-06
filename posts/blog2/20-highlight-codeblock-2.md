---
title: "Contentlayer에서 깃허브 스타일(starry-night)로 코드블럭 하이라이트"
slug: blog2-starry-night
created: 2023-12-15
category: blog2
tags: []
type: [series]
series: blog-v2
order: 21
---

## 문제

처음 마크다운 스타일을 적용할 때, Contentlayer에서 제공하는 예시를 따라 highlight.js를 이용하여 코드블럭을 하이라이팅 했다. 작동은 잘 됐지만 아쉬운 점이 있었다. GitHub Actions에 관한 글을 썼는데, workflow를 작성할 때 사용하는 yml 파일의 하이라이팅이 깃허브와 달랐다.

highlight.js - yml

![highlight.js yml][1]

github markdown - yml

![github yml][2]

## starry-night

깃허브는 코드블럭 하이라이팅에 [PrettyLights][3]를 사용한다. `PrettyLights`는 closed source이다. 그리고 누군가가 `PrettyLights`를 비슷하게 만들었는데, JavaScript로 만든 오픈 소스가 [starry-night][4]이다.

![starry-night html][5]

깃허브 코드블럭의 소스를 보면 `<div>` 태그의 클래스명에는 `highlight`, `highlight-language-type`이 들어가고, 코드블럭 내부의 `<span>` 태그에는 `pl-`이라는 접두사가 붙는다. `pl`이 `PrettyLights`이다.

## Contentlayer + starry-night

Contentlayer와 함께 사용하려면 `starry-night`-`rehype`가 필요하다. [starry-night example: integrate with unified, remark, and rehype][6]에서 친절하게 `rehype` 코드까지 제공한다.

### 설치

`starry-night`를 설치하고, `rehype`를 위해서 두 개의 패키지를 더 설치한다.

```sh
npm install @woorm/starry-night hast-util-to-string unist-util-visit
```

### rehype

`rehype-starry-night.js` 파일을 만든 뒤 아래 코드를 붙여넣는다.

> `starry-night`에서 제공하는 코드를 그대로 사용하니, 몇몇 언어는 하이라이팅이 지원되지 않았다. 이유는 예시 코드가 `common`에 해당하는 언어들만을 대상으로 했기 때문이었다. 그래서 `common`을 `all`로 바꿔줬다.

```ts
/**
 * @typedef {import('@wooorm/starry-night').Grammar} Grammar
 * @typedef {import('hast').ElementContent} ElementContent
 * @typedef {import('hast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration (optional)
 * @property {Array<Grammar> | null | undefined} [grammars]
 *   Grammars to support (default: `common`).
 */

import { all, createStarryNight } from '@wooorm/starry-night' // 'common' 대신 'all' 사용
import { toString } from 'hast-util-to-string'
import { visit } from 'unist-util-visit'

/**
 * Highlight code with `starry-night`.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeStarryNight(options) {
  const settings = options || {}
  const grammars = settings.grammars || all // 'common' 대신 'all' 사용
  const starryNightPromise = createStarryNight(grammars)
  const prefix = 'language-'

  /**
   * Transform.
   *
   * @param {Root} tree
   *   Tree.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  return async function (tree) {
    const starryNight = await starryNightPromise

    visit(tree, 'element', function (node, index, parent) {
      if (!parent || index === undefined || node.tagName !== 'pre') {
        return
      }

      const head = node.children[0]

      if (!head || head.type !== 'element' || head.tagName !== 'code') {
        return
      }

      const classes = head.properties.className

      if (!Array.isArray(classes)) return

      const language = classes.find(function (d) {
        return typeof d === 'string' && d.startsWith(prefix)
      })

      if (typeof language !== 'string') return

      const scope = starryNight.flagToScope(language.slice(prefix.length))

      // Maybe warn?
      if (!scope) return

      const fragment = starryNight.highlight(toString(head), scope)
      const children = /** @type {Array<ElementContent>} */ fragment.children

      parent.children.splice(index, 1, {
        type: 'element',
        tagName: 'div',
        properties: {
          className: [
            'highlight',
            'highlight-' + scope.replace(/^source\./, '').replace(/\./g, '-'),
          ],
        },
        children: [
          { type: 'element', tagName: 'pre', properties: {}, children },
        ],
      })
    })
  }
}
```

### Contentlayer 적용

`contentlayer.config.js`에서 `rehype` 설정을 한다. `makeSource`의 `markdown` > `rehypePlugins`에 넣는다.

```ts
import { makeSource } from '@contentlayer/source-files'
import rehypeStarryNight from './../rehype-starry-night.js'

export default makeSource({
  // ...
  markdown: { rehypePlugins: [rehypeStarryNight] },
})
```

주의할 점은 `rehype` 플러그인을 import 할 때 `#`이나 `@`같은 경로 alias를 사용하면 안된다. Contentlayer가 생성하는 파일에서는 적용이 되지 않으므로 상대경로로 입력해야 한다.

이렇게 하면 하이라이팅은 적용되지 않지만 html 클래스명에는 `PrettyLights`가 적용된 것을 볼 수 있다. CSS 파일만 세팅해주면 하이라이팅도 적용된다.

![plain text with PrettyLights][7]

![html with PrettyLights][8]

## GitHub Markdown CSS

[마크다운에 깃허브 스타일 적용하기][9] 참고

해당 CSS 파일에는 기본적으로 `PrettyLights` 하이라이팅이 포함되어 있다. `starry-night`만 잘 적용되었다면 코드블럭은 자동으로 하이라이팅이 될 것이다.

별도로 수정해야 하는 부분은 두 가지이다.

- 다크 모드와 라이트 모드를 구분하는 부분을 미디어 쿼리에서 클래스로 바꾸기
- 배경색(`--color-canvas-default`)을 지정된 색상에서 `transparent`로 바꾸기

## 후기

`starry-night`도 깃허브에서 사용하는 코드 하이라이팅을 완벽하게 지원하지는 못했다. [깃허브 이슈][10]에서 이유를 찾을 수 있었다.

깃허브는 코드 하이라이팅에 두 가지 도구를 사용한다. `PrettyLights`와 `TreeLights`이다. `TreeLights`도 closed source이다. `starry-night`는 `PrettyLights`를 똑같이 구현한 것이지만, `TreeLights`는 구현하지 못했다고 한다. 따라서 깃허브의 코드 하이라이팅 중 `TreeLights`로 하이라이팅 하는 언어는 `starry-night`로 따라할 수 없다.

`TreeLights`가 사용되는 언어는 다음과 같다:

- C
- C#
- CSS
- CodeQL
- EJS
- Elixir
- ERB
- Gleam
- Go
- HTML
- Java
- JS
- Nix
- PHP
- Python
- RegEx
- Ruby
- Rust
- TLA
- TS

참고: [What is `PrettyLights`?][11]

[1]: https://github.com/paulcjy/paulcjy.github.io/assets/86853786/dba4cddd-d11a-4593-b7f5-59927ad3ec98 'highlight.js yml'
[2]: https://github.com/paulcjy/paulcjy.github.io/assets/86853786/fd8c51b6-40db-40e4-8009-26110ed69094 'github yml'
[3]: https://github.com/wooorm/starry-night#what-is-prettylights 'starry-night github - PrettyLights'
[4]: https://github.com/wooorm/starry-night 'starry-night github'
[5]: https://github.com/paulcjy/paulcjy.github.io/assets/86853786/ced5f9c5-6fd9-42f9-a1d3-729f544d2bf7 'starry-night html'
[6]: https://github.com/wooorm/starry-night/#example-integrate-with-unified-remark-and-rehype 'starry-night github - rehype'
[7]: https://github.com/paulcjy/paulcjy.github.io/assets/86853786/15f59864-5149-42ea-bc82-2a0c56301604 'plain text with PrettyLights'
[8]: https://github.com/paulcjy/paulcjy.github.io/assets/86853786/869549d8-9906-4c0d-a7d0-a2cc682ad0bf 'starry-night html 2'
[9]: https://paulcjy.github.io/blog/GitHub-Pages-Next.js/05-markdown-style 'github-markdown'
[10]: https://github.com/wooorm/starry-night/issues/10 'starry-night: Highlight differences with GitHub'
[11]: https://github.com/wooorm/starry-night#what-is-prettylights 'starry-night: What is PrettyLights?'
