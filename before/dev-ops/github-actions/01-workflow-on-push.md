---
title: '[GitHub Actions 공식문서]Workflow on.push 이벤트'
slug: github-actions-on-push
created: 2023-12-02
updated:
description:
category: github-actions
tags:
published: true
---

## `on.push.<branches|tags|branches-ignore|tags-ignore>`

`push` 이벤트를 사용할 때, 특정한 브랜치나 태그에서만 작동하도록 설정할 수 있다.

`branches` 필터를 사용하여 포함할 브랜치 이름 패턴을 지정하거나, 포함 또는 제외할 브랜치 이름 패턴을 지정한다.
특정 브랜치를 제외하기만 할 때는 `branches-ignore` 필터를 사용한다.
단, 하나의 workflow 안에서는 같은 이벤트에 대해 `branches`와 `branches-ignore`를 동시에 사용할 수 없다.

`tags` 필터를 사용하여 포함할 태그 이름 패턴을 지정하거나, 포함 또는 제외할 태그 이름 패턴을 지정한다.
특정 태그를 제외하기만 할 때는 `tags-ignore` 필터를 사용한다.
단, 하나의 workflow 안에서는 같은 이벤트에 대해 `tags`와 `tags-ignore`를 동시에 사용할 수 없다.

If you define only `tags`/`tags-ignore` or only `branches`/`branches-ignore`, the workflow won't run for events affecting the undefined Git ref.
If you define neither `tags`/`tags-ignore` or `branches`/`branches-ignore`, the workflow will run for events affecting either branches or tags.
If you define both `branches`/`branches-ignore` and [`paths`/`paths-ignore`][2], the workflow will only run when both filters are satisfied.

`branches`, `branches-ignore`, `tags`, `tags-ignore`에서는 하나 이상의 브랜치나 태그를 가리키기 위해 글롭 패턴(`*`, `**`, `+`, `?`, `!`)을 사용할 수 있다.
만약, 실제 이름에 이 문자가 포함되어 있어 글롭 패턴이 아닌 문자로서 사용하기 위해서는 `\`를 앞에 붙여 이스케이프 해야 한다.

[Filter pattern cheat sheet][3]

## 예시

### 브랜치와 태그 포함

`brances`와 `tags`에서 정의된 패턴은 Git ref의 이름과 비교된다.

```yml
on:
  push:
    # Sequence of patterns matched against refs/heads
    branches:
      - main
      - 'mona/octocat'
      - 'releases/**'
    # Sequence of patterns matched against refs/tags
    tags:
      - v2
      - v1.*
```

예를 들어, 이 workflow는 아래 목록의 브랜치나 태그에 `push` 이벤트가 발생할 때 실행된다:

- `main` 브랜치 (`refs/heads/main`)
- `mona/octocat` 브랜치 (`refs/heads/mona/octocat`)
- `releases/`로 시작하는 브랜치 (`refs/heads/releases/10` 등)
- `v2` 태그 (`refs/tags/v2`)
- `v1.`로 시작하는 태그 (`refs/tags/v1.9.1` 등)

### 브랜치와 태그 제외

`brances-ignore`와 `tags-ignore`에서 정의된 패턴은 Git ref의 이름과 비교된다.
이 패턴에 해당하는 브랜치나 태그에 대해서는 workflow가 실행되지 않는다.

```yml
on:
  push:
    # Sequence of patterns matched against refs/heads
    branches-ignore:
      - 'mona/octocat'
      - 'releases/**-alpha'
    # Sequence of patterns matched against refs/tags
    tags-ignore:
      - v2
      - v1.*
```

예를 들어, 이 workflow는 `push` 이벤트가 발생할 때 항상 실행되지만, 아래 목록의 브랜치나 태그일 때는 실행되지 않는다:

- `mona/octocat` 브랜치 (`refs/heads/mona/octocat`)
- `releases/**-alpha` 패턴과 일치하는 브랜치 (`refs/heads/releases/beta/3-alpha` 등)
- `v2` 태그 (`refs/tags/v2`)
- `v1.`로 시작하는 태그 (`refs/tags/v1.9` 등)

### 브랜치와 태그 포함과 제외

하나의 workflow 안에서는 같은 이벤트에 대해 `branches`와 `branches-ignore`를 동시에 사용할 수 없다.
`tags`와 `tags-ignore`도 마찬가지이다.
같은 이벤트에서 포함 패턴과 제외 패턴을 동시에 사용하려면, `branches`나 `tags` 필터에서 `!`를 이용하여 제외할 브랜치나 태그를 지정해야 한다.

`!`로 브랜치나 태그를 제외하려면, 반드시 `!`가 없는 브랜치나 태그가 적어도 한 개 존재해야 한다.
제외할 대상만 설정하기 원한다면, `branches-ignore`나 `tags-ignore`를 대신 사용한다.

패턴을 정의하는 순서는 중요하다.

- 포함 패턴 이후에 제외 패턴이 있다면 제외된다.
- 제외 패턴 이후에 포함 패턴이 있다면 포함된다.
  따라서, 아래 workflow에서는 `releases/10`이나 `releases/beta/mona`로 `push` 이벤트가 발생할 때는 workflow가 실행된다.
  하지만, `releases/10-alpha`나 `releases/beta/3-alpha`에서는 실행되지 않는다.
  제외 패턴인 `!releases/**-alpha`가 포함 패턴 이후에 나오기 때문이다.

```yml
on:
  push:
    branches:
      - 'releases/**'
      - '!releases/**-alpha'
```

[1]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushbranchestagsbranches-ignoretags-ignore 'on,.push event'
[2]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore 'paths/paths-ignore'
[3]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet 'Filter pattern cheat sheet'
