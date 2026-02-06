---
title: Utterances로 깃허브 페이지(Next.js)에 댓글 기능 만들기
slug: blog2-utterances
created: 2023-12-11 22:22:00
updated:
description:
category: blog2
tags: [nextjs, github, github-pages, blog, utterances, comment]
published: true
---

# Utterances

블로그에 댓글 기능을 추가하려고 알아보다가 [utterances][1]라는 좋은 앱을 발견했다. 깃허브의 이슈를 데이터베이스처럼 사용하여 댓글 기능을 사용하게 해주는 앱이다. 오픈소스이고 완전 무료이다. 백엔드가 없는 상황에 정말 딱 맞는 앱이었다.

- 오픈소스이다.
- 추적이 없고, 광고가 없다. 항상 무료.
- lock-in이 없다. 모든 데이터는 깃허브 이슈에 저장된다.
- 깃허브에서 사용하는 [Primer][2]로 스타일한다.
- 다크 모드를 지원한다.
- 가볍다. 바닐라 타입스크립트이고 폰트 다운로드가 없다.

여러 블로그에서 [disqus][3]와 많이 비교하는데, disqus는 무료로 사용하려면 광고가 많이 붙고 무겁다고 한다. 반면에 utterances는 광고도 전혀 없고 무료에 가볍다.

# 설치

[여기][4]에서 설치할 수 있다. 깃허브 블로그에만 적용할거라서 블로그 리포지토리를 선택하고 설치했다.

전체 리포지토리를 대상으로 설치할 수도 있다.

# 설정

설치가 끝나면 자동으로 설정 페이지로 넘어간다. [utterances][1] 페이지와 똑같이 생겨서 뭔가 싶었지만 이 페이지에서 설정을 진행한다.

설정이 끝나면 설정한 내용을 바탕으로 삽입 가능한 코드가 생성된다. 이 코드를 복사해서 페이지에 삽입하면 된다.

## How it works

utterances를 설치하면, 깃허브의 [issue search API][5]를 사용하여각 페이지와 연결된 이슈(댓글)를 찾는다. 이슈와 페이지는 `pathname`, `url`, `title`로 연결된다. 페이지와 연결된 이슈가 없다면 첫번째 댓글을 달 때 [utterance-bot][6]이 자동으로 이슈를 생성한다.

댓글을 달기 위해서 사용자는 GitHub OAuth flow를 이용하여 utterances 앱에 권한을 부여해야 한다. 아니면, 깃허브 이슈에 직접 댓글을 달 수도 있다.

## Configuration

### Repository

아래의 'repo' 칸에 utterances를 연결할 리포지토리를 `owner/repo` 형식으로 입력한다.

1. 리포지토리는 public이어야 한다. private 리포지토리에서는 다른 사람들이 이슈나 댓글을 읽을 수 없다.
2. utterances 앱이 리포지토리에 설치되어 있어야 한다. 설치가 안되어있으면 댓글을 작성할 수 없다.
3. utterances를 사용하려는 리포지토리가 포크라면, `settings` 탭에서 `issue` 기능을 켜야한다.

### Blog Post - Issue Mapping

간단하게 위의 셋 중 하나를 선택하면 된다. `pathname`, `url`, `title`이다. 셋 다 첫 댓글을 쓸 때 자동으로 이슈를 생성해준다.

- `pathname`: 블로그 포스트의 URL 컴포넌트로 댓글을 불러온다.
- `url`: 블로그 포스트의 전체 URL로 댓글을 불러온다.
- `title`: 블로그 포스트의 제목으로 댓글을 불러온다.

# 문제

Next.js에서 적용하려고 보니 `<script>`태그에는 `repo` 속성을 사용할 수 없어서 문제가 발생했다. 해결을 위해 [여기(example for react use)][7]를 참고했다.

나는 다크 모드와 라이트 모드를 둘 다 사용하기 때문에 코드를 약간 수정했다. next-themes로 다크/라이트 모드를 구현할 때 사용할 수 있다.

```tsx
'use client'

import { useTheme } from 'next-themes'

export const Utterances = () => {
  const { theme } = useTheme()

  return (
    <section
      style={{ width: '100%' }}
      ref={(element) => {
        if (!element) return

        const scriptElement = document.createElement('script')
        scriptElement.setAttribute('src', 'https://utteranc.es/client.js')
        scriptElement.setAttribute('repo', 'paulcjy/paulcjy.github.io')
        scriptElement.setAttribute('issue-term', 'pathname')
        scriptElement.setAttribute('label', '✨💬✨')
        scriptElement.setAttribute(
          'theme',
          theme === 'light' ? 'github-light' : 'github-dark',
        )
        scriptElement.setAttribute('crossorigin', 'anonymous')
        scriptElement.setAttribute('async', 'true')
        element.replaceChildren(scriptElement)
      }}
    />
  )
}
```

[1]: https://utteranc.es/
[2]: https://primer.style/
[3]: https://disqus.com/
[4]: https://github.com/apps/utterances
[5]: https://docs.github.com/en/rest/search?apiVersion=2022-11-28#search-issues
[6]: https://github.com/utterances-bot
