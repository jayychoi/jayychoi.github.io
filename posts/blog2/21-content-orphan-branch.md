---
title: "블로그 콘텐츠를 고아 브랜치로 관리하기"
slug: content-orphan-branch
created: 2026-02-06
description: "별도 리포지토리로 관리하던 블로그 콘텐츠를 같은 리포지토리의 고아 브랜치로 통합한 과정"
category: blog2
tags: [git, github-actions]
---

## 기존 방식: 별도 리포지토리

블로그 코드와 콘텐츠를 분리하고 싶어서 콘텐츠를 별도 리포지토리(`blog-content`)로 관리하고 있었다. 로컬에서는 블로그 프로젝트의 `content/` 디렉토리에 별도로 clone해서 사용했고, `.gitignore`에 `content/`를 추가해서 블로그 코드 리포지토리에는 포함되지 않게 했다.

이 구조에서 GitHub Actions로 배포하려면 빌드 과정에서 콘텐츠 리포지토리를 별도로 checkout해야 한다.

```yaml
- name: Checkout content
  uses: actions/checkout@v4
  with:
    repository: jayychoi/blog-content
    path: content
```

## 문제점

별도 리포지토리 방식은 몇 가지 불편한 점이 있었다.

1. **리포지토리를 두 개 관리해야 한다.** 코드를 수정하면 블로그 리포지토리에 push하고, 글을 수정하면 콘텐츠 리포지토리에 push해야 한다.
2. **CI에서 크로스 리포지토리 접근이 필요하다.** 콘텐츠 리포지토리가 private이면 GitHub Actions에서 접근하기 위해 Personal Access Token을 시크릿으로 등록해야 한다.
3. **로컬 환경 설정이 번거롭다.** 프로젝트를 처음 clone한 후 `content/` 디렉토리에 콘텐츠 리포지토리를 별도로 clone하는 과정이 필요하다.

콘텐츠를 private으로 유지해야 하는 상황이 아니라면, 이 복잡함은 불필요하다.

## 대안: 고아 브랜치

Git의 고아 브랜치(orphan branch)는 기존 브랜치와 커밋 히스토리를 공유하지 않는 독립적인 브랜치다. 같은 리포지토리 안에 있지만 완전히 분리된 히스토리를 가진다.

블로그 코드는 `main` 브랜치에, 콘텐츠는 `content` 고아 브랜치에 두면 하나의 리포지토리에서 두 가지를 독립적으로 관리할 수 있다.

### 별도 리포지토리 vs 고아 브랜치

| | 고아 브랜치 | 별도 리포지토리 |
|---|---|---|
| GitHub Actions | 같은 리포라 토큰 불필요 | private이면 PAT 필요 |
| 관리 대상 | 리포지토리 1개 | 리포지토리 2개 |
| 접근 권한 | 리포 visibility 동일 | 독립 설정 가능 |
| git 히스토리 | 브랜치가 독립적이라 간섭 없음 | 완전히 분리 |

별도 리포지토리가 유리한 경우는 **코드는 public, 콘텐츠는 private**으로 두고 싶을 때뿐이다. 이 블로그는 둘 다 public이라 고아 브랜치 방식이 더 적합했다.

## 고아 브랜치 만들기

기존 `content/` 디렉토리의 파일들을 고아 브랜치로 옮겼다. `git worktree`를 사용하면 현재 작업 트리를 건드리지 않고 다른 브랜치를 조작할 수 있다.

```bash
# 고아 브랜치를 worktree로 생성 (git 2.42+)
git worktree add --orphan -b content /tmp/blog-content-orphan

# 콘텐츠 파일 복사 (.git 제외)
rsync -av --exclude='.git' content/ /tmp/blog-content-orphan/

# 커밋
cd /tmp/blog-content-orphan
git add .
git commit -m "콘텐츠 초기화"

# 정리 후 push
cd -
git worktree remove /tmp/blog-content-orphan
git push origin content
```

## GitHub Actions 워크플로우

고아 브랜치 방식으로 바꾸면 워크플로우가 단순해진다. `repository` 대신 `ref`만 지정하면 같은 리포지토리의 다른 브랜치를 checkout할 수 있다.

```yaml
- name: Checkout
  uses: actions/checkout@v4

- name: Checkout content
  uses: actions/checkout@v4
  with:
    ref: content
    path: content
```

별도 리포지토리 방식에서는 `repository: jayychoi/blog-content`를 지정해야 했고, private이면 `token: ${{ secrets.CONTENT_PAT }}`까지 필요했다. 고아 브랜치는 같은 리포지토리이므로 아무 설정도 필요 없다.

### Velite 빌드 타이밍 문제

배포 워크플로우를 작성하고 push했더니 빌드에서 에러가 발생했다.

```
Module not found: Can't resolve '#velite'
```

이 블로그는 Velite를 사용해서 Markdown을 JSON으로 변환하고, 코드에서 `#velite` alias로 import한다. `next.config.ts`에서 Velite 빌드를 자동 트리거하는데, 문제는 이 호출이 비동기라는 점이다.

```ts
// next.config.ts
import("velite").then((m) => m.build({ watch: isDev, clean: !isDev }));
```

`await` 없이 fire-and-forget으로 실행되기 때문에, Next.js가 모듈을 해석할 때 Velite가 아직 `.velite/` 디렉토리를 생성하지 못한 상태일 수 있다. 로컬에서는 이전 빌드의 `.velite/`가 남아있어서 문제가 없지만, CI는 클린 환경이라 `.velite/`가 존재하지 않는다.

해결 방법은 Next.js 빌드 전에 Velite를 먼저 실행하는 것이다.

```yaml
- name: Build content
  run: pnpm content  # velite --clean

- name: Build
  run: pnpm build
```

## 로컬 개발 환경: git worktree

고아 브랜치 방식에서 로컬로 글을 작성하려면, `content` 브랜치를 `content/` 디렉토리에 worktree로 연결한다.

```bash
git worktree add content content
```

이렇게 하면 `content/` 디렉토리가 `content` 브랜치의 작업 트리가 된다. 블로그 코드는 `main` 브랜치에서, 글 작성은 `content/` 디렉토리에서 각각 독립적으로 커밋하고 push할 수 있다.

```bash
# 블로그 코드 수정 후
git add src/components/header.tsx
git commit -m "헤더 스타일 수정"
git push origin main

# 글 작성 후
cd content
git add posts/blog2/new-post.md
git commit -m "새 글 작성"
git push origin content
cd ..
```

프로젝트를 처음 clone할 때도 한 줄이면 된다.

```bash
git clone https://github.com/jayychoi/jayychoi.github.io.git
cd jayychoi.github.io
git worktree add content content
```
