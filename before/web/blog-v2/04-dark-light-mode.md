---
title: 다크 모드와 라이트 모드 추가하기(next-themes + tailwindcss)
slug: blog2-themes
created: 2023-11-17 22:08:00
updated:
description:
category: blog2
tags: [dark-mode, light-mode, nextjs, github-pages, github-blog, next-themes]
published: true
---

# next-themes

[next-themes][1]는 Next.js에서 다크 모드를 쉽게 사용할 수 있도록 해 준다. next-themes에서 소개하는 특징 중 아래 내용이 마음에 들어서 선택했다.

- 단 두 줄의 코드로 다크 모드 완성
- Next.js `app` 디렉토리 지원
- 시스템 설정 사용 가능

# next-themes 설치

```sh
npm install next-themes
```

# Theme Provider 적용

`app` 라우터에서는 Provider를 별도의 파일로 만들어줘야 한다. Provider는 Client Component여야 하기 떄문이다. `app` 라우터를 사용하면 단 두 줄의 코드는 아니다.

또한, Tailwind CSS와 함께 사용하려면 `<ThemeProvider>`의 [설정](#theme-provider--tailwind-css-설정)도 변경해주어야 한다.

```tsx
// app/providers.tsx

'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
```

`app/layout.tsx`에서 `<body>` 태그의 내부를 방금 만든 `<Providers>` 컴포넌트로 감싸준다.

```tsx
// app/layout.tsx

import { Providers } from './providers'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

> Next.js Pages Router를 사용한다면 [여기][2] 참고

# Theme Provider + Tailwind CSS 설정

[ThemeProvider][3]

여러 가지 설정이 있지만, Tailwind와 사용하려면 `attribute`를 `class`로 설정해야 한다.

```tsx
// app/providers.tsx

'use client'

import { ThemeProvider } from 'next-themes'

export function Providers({ children }) {
  return <ThemeProvider attribute="class">{children}</ThemeProvider>
}
```

브라우저에서 페이지를 열고 `<html>`태그를 보면, `class`와 `style`이 다크 모드에서는 `dark`로, 라이트 모드에서는 `light`로 바뀌는 것을 알 수 있다.

```html
<!-- dark mode -->
<html class="dark" style="color-scheme: dark;" />

<!-- light mode -->
<html class="light" style="color-scheme: light;" />
```

## `attribute`를 `class`로 설정하지 않으면

기본값은 `data-theme`에 `dark`와 `light`를 저장하는 것이다. `style="color-scheme"`은 항상 바꿔준다.

```html
<!-- dark mode -->
<html data-theme="dark" style="color-scheme: dark;" />

<!-- light mode -->
<html data-theme="light" style="color-scheme: light;" />
```

다른 설정으로는 `data-*` 형식의 이름을 사용할 수 있다. (예, `data-color`)

```html
<!-- dark mode -->
<html data-color="dark" style="color-scheme: dark;" />

<!-- light mode -->
<html data-color="light" style="color-scheme: light;" />
```

> 공식 문서에는 `class` 또는 `data-*`형식이라고 하지만, 아무 문자열을 넣어도 작동하긴 했다.

## tailwind.config.ts

`tailwind.config.ts`에서 다크 모드 옵션을 추가해야 한다.

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  ...
}
export default config
```

# 전환 버튼 만들기

마침 [좋은 예제][4]를 발견해서 [버튼 코드][5]를 가져와 사용했다. 이 예제도 next-themes를 사용한다.

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return null
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      onClick={() =>
        setTheme(
          theme === 'dark' || resolvedTheme === 'dark' ? 'light' : 'dark',
        )
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-6 w-6 text-gray-900 dark:text-gray-100"
      >
        {mounted && (theme === 'dark' || resolvedTheme === 'dark') ? (
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
          />
        ) : (
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        )}
      </svg>
    </button>
  )
}

export default ThemeSwitch
```

[1]: https://github.com/pacocoursey/next-themes 'next-themes'
[2]: https://github.com/pacocoursey/next-themes#with-pages 'next-themes #with-pages'
[3]: https://github.com/pacocoursey/next-themes#themeprovider 'next-themes #themeprovider'
[4]: https://github.com/timlrx/tailwind-nextjs-starter-blog 'tailwind-nextjs starter blog'
[5]: https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/main/components/ThemeSwitch.tsx 'tailwind-nextjs blog: Theme Switch Button'
