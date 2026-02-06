---
title: '[Next.js]빌드 에러: Warning Assign arrow function to a variable before exporting as module default import no-anonymous-default-export'
created: 2023-11-23
slug: blog2-const-page-error
updated:
description:
category: blog2
tags:
published: true
---

Next.js에서 `page.tsx`에 이름 없이 arrow function만 사용했다. 어차피 이름은 사용되지 않고 `export default`가 페이지 컴포넌트로 사용되기 때문이다.

```tsx
export default () => {
	return (
		...
	)
}
```

개발 서버에서는 잘 작동했지만, 빌드할 때는 에러가 발생했다. no-anonymous-default-export인 것을 보니 이름을 꼭 붙여야 하는 것 같다. 그래서 이름을 붙이고 그냥 함수로 바꿨다.

```tsx
export default function Page() {
	return (
		...
	)
}
```
