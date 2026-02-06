---
title: 개인 블로그
slug: personal-blog
description: Next.js 기반 정적 블로그. Velite로 Markdown 콘텐츠를 관리하고, Tailwind CSS로 스타일링한 개인 기술 블로그입니다.
techs:
  - Next.js
  - TypeScript
  - React
  - Tailwind CSS
  - Shadcn/ui
  - Velite
  - Shiki
  - Biome
status: active
startDate: 2025-01-01
github: https://github.com/jayychoi/jayychoi.github.io
url: https://jayychoi.github.io
---

공부한 것들을 기록하고 정리하기 위해 직접 만든 블로그예요. 벨로그나 티스토리 같은 플랫폼도 있지만, 내 손으로 만들고 원하는 대로 고칠 수 있는 블로그를 갖고 싶어서 처음부터 직접 만들었어요. 지금 보고 계신 이 사이트가 바로 그 결과물입니다.

## 어떻게 만들었나요?

Next.js 16의 App Router와 정적 빌드(`output: "export"`)를 사용해서, 서버 없이 GitHub Pages에서 바로 돌아가요. 글은 Markdown으로 작성하고, Velite가 이걸 JSON으로 변환해서 Next.js가 빌드할 때 사용합니다. 별도의 데이터베이스나 CMS 없이 Markdown 파일만으로 모든 콘텐츠를 관리할 수 있어요.

스타일링은 Tailwind CSS 4와 Shadcn/ui를 사용했고, 코드 블록은 Shiki로 하이라이팅해요. 라이트/다크 테마 둘 다 지원하고, 코드 블록도 테마에 맞게 자동으로 색상이 바뀝니다.

## 주요 기능

- **카테고리 · 태그 · 시리즈** — 글을 다양한 기준으로 분류하고 탐색할 수 있어요
- **전문 검색 (`⌘K`)** — Fuse.js 기반 퍼지 검색으로, 제목과 본문에서 원하는 글을 빠르게 찾을 수 있어요
- **활동 히트맵** — GitHub 잔디처럼 글 작성 활동을 한눈에 볼 수 있어요
- **다크 모드** — 시스템 설정에 따라 자동 전환되고, 수동으로도 토글할 수 있어요
- **코드 하이라이팅** — Shiki의 듀얼 테마(github-light / github-dark)로 깔끔하게 코드를 보여줘요
- **목차(TOC)** — 게시글 옆에 자동 생성되는 목차로 긴 글도 쉽게 탐색할 수 있어요
- **댓글** — Giscus를 연동해서 GitHub Discussions 기반으로 댓글을 남길 수 있어요

## 콘텐츠 관리 방식

재미있는 점은 블로그 코드와 콘텐츠를 같은 리포지토리에서 관리하면서도 완전히 분리했다는 거예요. Git의 고아 브랜치(orphan branch)를 활용해서, `main` 브랜치에는 앱 코드가, `content` 브랜치에는 Markdown 게시글이 들어있어요. 로컬에서는 `git worktree`로 두 브랜치를 동시에 작업할 수 있고, 어느 브랜치에 push하든 GitHub Actions가 자동으로 빌드하고 배포합니다.

## 배포

`main` 또는 `content` 브랜치에 push하면 GitHub Actions가 자동으로 정적 사이트를 빌드해서 GitHub Pages에 배포해요. 소스 코드만 바뀌었을 때는 Velite 캐시를, 콘텐츠만 바뀌었을 때는 Next.js 컴파일 캐시를 활용해서 빌드 시간을 줄였어요.
