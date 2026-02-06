# jayychoi.github.io

개인 학습 기록 블로그. Next.js 정적 사이트로 빌드하여 GitHub Pages에 배포한다.

> https://jayychoi.github.io

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, `output: "export"`, React Compiler) |
| 언어 | TypeScript 5, React 19 |
| 콘텐츠 | Velite (Markdown → 정적 JSON) |
| 스타일링 | Tailwind CSS 4 + Shadcn/ui (New York) |
| 검색 | Fuse.js + cmdk (`⌘K`) |
| 코드 하이라이팅 | Shiki (github-light / github-dark 듀얼 테마) |
| 댓글 | Giscus (GitHub Discussions) |
| 다크모드 | next-themes |
| 린팅/포매팅 | Biome |
| 패키지 매니저 | pnpm |
| 폰트 | Pretendard (본문), Quicksand (디스플레이) |

## 브랜치 구조

이 리포지토리는 두 개의 독립된 브랜치로 운영된다.

| 브랜치 | 역할 | 내용 |
|---|---|---|
| `main` | 앱 코드 | Next.js 소스코드, 설정, 배포 워크플로우 |
| `content` | 콘텐츠 (고아 브랜치) | Markdown 게시글, 프로젝트, about, 배포 트리거 워크플로우 |

`content`는 `main`과 커밋 히스토리를 공유하지 않는 고아 브랜치(orphan branch)다. 코드 변경과 글 작성의 커밋이 서로 섞이지 않는다.

두 브랜치 중 어느 쪽에 push하든 GitHub Actions가 자동으로 빌드 및 배포한다.

## 시작하기

### 필수 요구사항

- Node.js 24+
- pnpm 10+

### 설치

```bash
git clone https://github.com/jayychoi/jayychoi.github.io.git
cd jayychoi.github.io

# content 고아 브랜치를 content/ 디렉토리에 worktree로 연결
git worktree add content content

# 의존성 설치
pnpm install
```

### 개발 서버

```bash
pnpm dev
```

`http://localhost:3000`에서 확인할 수 있다. Velite watch 모드가 자동 실행되어 콘텐츠 변경 시 핫 리로드된다.

## 명령어

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 (Velite watch 모드 자동 실행) |
| `pnpm build` | 정적 빌드 (`out/` 생성) |
| `pnpm lint` | Biome 린트 검사 |
| `pnpm format` | Biome 자동 포매팅 |
| `pnpm content` | Velite 콘텐츠만 단독 재빌드 (`velite --clean`) |

## 디렉토리 구조

```
src/
├── app/                        # App Router 페이지
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 테마, 검색 프로바이더)
│   ├── page.tsx                # 홈 (활동 히트맵 + 최근 글)
│   ├── blog/
│   │   ├── layout.tsx          # 블로그 레이아웃 (사이드바)
│   │   ├── page.tsx            # 전체 글 목록
│   │   ├── posts/[slug]/       # 개별 포스트
│   │   ├── categories/[category]/
│   │   ├── tags/[tag]/
│   │   ├── series/[series]/
│   │   └── til/[date]/
│   ├── projects/               # 프로젝트 목록 및 상세
│   └── about/
├── components/
│   ├── ui/                     # Shadcn/ui 컴포넌트
│   └── blog/                   # 블로그 전용 컴포넌트
├── lib/                        # 유틸리티 및 데이터 쿼리
└── styles/                     # 글로벌 스타일, 마크다운 타이포그래피

content/                        # content 브랜치 (git worktree)
├── posts/**/*.md               # 블로그 게시글
├── projects/**/*.md            # 프로젝트
└── about.md
```

## 콘텐츠 작성

### 게시글 작성

`content/posts/` 아래에 Markdown 파일을 생성한다.

```yaml
---
title: "제목"
slug: unique-slug
created: 2026-01-29
description: "설명"          # 선택 (없으면 본문 첫 200자)
category: "java"             # categories.ts의 id 값
tags: [tag1, tag2]
type: [til, series]          # 선택
series: "시리즈 이름"         # 선택
order: 1                     # 시리즈 내 순서, 선택
---

본문 내용...
```

### 카테고리

| 대분류 | 카테고리 |
|---|---|
| Language | java, kotlin, rust, cpp |
| Web | spring, blog2 |
| DevOps | docker, github-actions |
| Linux | arch-linux, linux |
| Algorithm | algorithm |
| Tool | nvim |
| Etc | etc |

새 카테고리 추가 시 `src/lib/categories.ts`의 `CATEGORY_GROUPS`를 수정한다.

### 콘텐츠 커밋 및 배포

`content/`는 `content` 브랜치의 worktree이므로, 앱 코드와 독립적으로 커밋하고 push한다.

```bash
cd content
git add posts/blog2/new-post.md
git commit -m "새 글 작성"
git push origin content
```

push하면 GitHub Actions가 자동으로 빌드 및 배포한다.

## 콘텐츠 빌드 파이프라인

```
content/*.md → Velite → .velite/*.json → Next.js SSG → out/*.html
```

1. `content/` 디렉토리의 Markdown 파일을 Velite가 읽음
2. Rehype 플러그인 적용 (slug → autolink-headings → shiki)
3. `.velite/` 디렉토리에 JSON 데이터 출력
4. 코드에서 `import { posts, projects, about } from "#velite"` 로 사용
5. Next.js가 정적 HTML로 빌드하여 `out/`에 출력

## 배포

`main` 또는 `content` 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포한다.

- `main` push → `deploy-pages.yml`이 직접 빌드 및 배포
- `content` push → `trigger-deploy.yml`이 `main`의 배포 워크플로우를 트리거

GitHub Actions의 `push` 트리거는 해당 브랜치에 워크플로우 파일이 있어야 동작하므로, `content` 브랜치에는 `main`의 배포를 호출하는 트리거 워크플로우를 별도로 두었다.

### 캐시 전략

| 트리거 | Next.js 컴파일 캐시 | Velite 캐시 | 효과 |
|---|---|---|---|
| content push | 히트 (소스 불변) | 미스 (콘텐츠 변경) | 컴파일 시간 절약 |
| main push | 미스 (소스 변경) | 히트 (콘텐츠 불변) | Velite 빌드 시간 절약 |

정적 페이지 생성(`next build`)은 두 경우 모두 항상 실행된다.
