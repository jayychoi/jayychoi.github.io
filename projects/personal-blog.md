---
title: 개인 웹사이트
slug: personal-website
description: Next.js 기반 정적 블로그. SQLite + 개발 전용 어드민 UI로 콘텐츠를 관리하고, Tailwind CSS로 스타일링한 개인 기술 블로그입니다.
techs:
  - Next.js
  - TypeScript
  - React
  - Tailwind CSS
  - Shadcn/ui
  - SQLite
  - Drizzle ORM
  - Velite
  - Shiki
  - Biome
status: active
startDate: 2025-01-01
github: https://github.com/jayychoi/jayychoi.github.io
url: https://jayychoi.github.io
---

공부한 것들을 기록하고 정리하기 위해 직접 만든 블로그입니다. 벨로그나 티스토리 같은 플랫폼도 있지만, 직접 만들고 원하는 대로 수정할 수 있는 블로그를 갖고 싶어서 처음부터 개발했습니다. 지금 보고 계신 이 사이트가 그 결과물입니다.

## 어떻게 만들었나요?

Next.js 16의 App Router와 정적 빌드(`output: "export"`)를 사용하여, 서버 없이 GitHub Pages에서 동작합니다. 콘텐츠는 SQLite 데이터베이스에 저장하고, 개발 모드에서만 접근 가능한 어드민 UI로 글을 작성·수정합니다. 빌드 시 SQLite에서 Markdown으로 내보낸 뒤, Velite가 JSON으로 변환하여 정적 페이지를 생성합니다.

스타일링은 Tailwind CSS 4와 Shadcn/ui를 사용했고, 코드 블록은 Shiki로 하이라이팅합니다. 라이트/다크 테마를 모두 지원하며, 코드 블록도 테마에 맞게 자동으로 색상이 전환됩니다.

## 주요 기능

- **카테고리 · 태그 · 시리즈** — 글을 다양한 기준으로 분류하고 탐색할 수 있습니다
- **전문 검색 (`⌘K`)** — Fuse.js 기반 퍼지 검색으로, 제목과 본문에서 원하는 글을 빠르게 찾을 수 있습니다
- **활동 히트맵** — GitHub 잔디처럼 글 작성 활동을 한눈에 확인할 수 있습니다
- **다크 모드** — 시스템 설정에 따라 자동 전환되며, 수동으로도 토글할 수 있습니다
- **코드 하이라이팅** — Shiki의 듀얼 테마(github-light / github-dark)로 코드를 표시합니다
- **목차(TOC)** — 게시글 옆에 자동 생성되는 목차로 긴 글도 쉽게 탐색할 수 있습니다
- **댓글** — Giscus를 연동하여 GitHub Discussions 기반으로 댓글을 남길 수 있습니다

## 콘텐츠 관리 방식

블로그 코드와 콘텐츠를 같은 리포지토리에서 관리하면서도 완전히 분리한 것이 특징입니다. Git의 고아 브랜치(orphan branch)를 활용하여, `main` 브랜치에는 앱 코드를, `content` 브랜치에는 SQLite 데이터베이스(`blog.db`)를 두었습니다. 로컬에서는 `git worktree`로 두 브랜치를 동시에 작업할 수 있습니다.

콘텐츠 관리는 개발 서버에서만 접근 가능한 어드민 UI를 통해 이루어집니다. 어드민 페이지와 API 라우트는 `.dev.tsx`/`.dev.ts` 파일 확장자를 사용하여, 프로덕션 빌드에서는 자동으로 제외됩니다. `main`에 push하면 직접 배포가 실행되고, `content`에 push하면 트리거 워크플로우가 `main`의 배포를 호출하여 자동으로 빌드하고 배포합니다.

## 배포

`main` 또는 `content` 브랜치에 push하면 GitHub Actions가 자동으로 정적 사이트를 빌드하여 GitHub Pages에 배포합니다. 소스 코드만 변경되었을 때는 Velite 캐시를, 콘텐츠만 변경되었을 때는 Next.js 컴파일 캐시를 활용하여 빌드 시간을 최소화했습니다.
