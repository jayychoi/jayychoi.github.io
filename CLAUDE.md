# CLAUDE.md — jayychoi.github.io

## 프로젝트 개요

개인 학습 기록 블로그. Next.js 정적 사이트로 빌드하여 GitHub Pages(`jayychoi.github.io`)에 배포.

## 기술 스택

- **프레임워크:** Next.js 16 (App Router, `output: "export"`, React Compiler 활성화)
- **언어:** TypeScript 5, React 19
- **콘텐츠:** Velite (Markdown → 정적 JSON, `#velite` alias로 import)
- **스타일링:** Tailwind CSS 4 + Shadcn/ui (New York 스타일) + CSS 변수 테마
- **검색:** Fuse.js + cmdk (⌘K 단축키)
- **코드 하이라이팅:** Shiki (github-light / github-dark 듀얼 테마)
- **댓글:** Giscus (GitHub Discussions)
- **다크모드:** next-themes
- **린팅/포매팅:** Biome (space 2칸 들여쓰기, import 자동 정리)
- **패키지 매니저:** pnpm
- **폰트:** Pretendard (본문), Quicksand (디스플레이)

## 주요 명령어

```bash
pnpm dev          # 개발 서버 (Velite watch 모드 자동 실행)
pnpm build        # 정적 빌드 — Velite 콘텐츠 빌드도 자동 포함 (out/ 생성)
pnpm lint         # biome check
pnpm format       # biome format --write && biome check --fix
pnpm content      # velite --clean (콘텐츠만 단독 재빌드)
```

## 빌드 & 검증

코드 변경 후 검증은 `pnpm build` 하나로 충분하다.

- `pnpm build` 실행 시 `next.config.ts`에서 Velite 빌드를 자동 트리거함 (`content/` → `.velite/*.json` → Next.js SSG)
- `pnpm dev`도 마찬가지로 Velite watch 모드를 자동 실행함
- `pnpm content`는 Next.js 빌드 없이 콘텐츠만 따로 재생성할 때 사용

**content 디렉토리:**
- `content/`는 프로젝트 루트에 실제로 존재함 (로컬에 이미 있음)
- `.gitignore`에 포함되어 있어 git status에는 안 보이지만, 디렉토리 자체는 있음
- `.velite/` (posts.json, projects.json, about.json)도 gitignore 대상이나 빌드 시 자동 생성됨

**빌드 시 콘텐츠 에러:**
- `pnpm content` 또는 `pnpm build` 실행 시 일부 콘텐츠의 frontmatter 에러가 출력될 수 있으나, "build finished" 메시지가 나오면 정상임

## 디렉토리 구조

```
src/
├── app/                    # App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 테마, 검색 프로바이더)
│   ├── page.tsx            # 홈 (활동 히트맵 + 최근 글 5개)
│   ├── blog/
│   │   ├── layout.tsx      # 블로그 레이아웃 (사이드바)
│   │   ├── page.tsx        # 전체 글 목록 (페이지네이션 10개/페이지)
│   │   ├── posts/[slug]/   # 개별 포스트 (TOC, 댓글)
│   │   ├── categories/[category]/
│   │   ├── tags/[tag]/
│   │   ├── series/[series]/
│   │   └── til/[date]/     # TIL (YYYY-MM-DD)
│   ├── projects/           # 프로젝트 목록 및 상세
│   └── about/
├── components/
│   ├── ui/                 # Shadcn/ui 컴포넌트 (button, badge, pagination 등)
│   ├── blog/               # 블로그 전용 (post-card, sidebar, toc, comments 등)
│   ├── activity-heatmap.tsx
│   ├── header.tsx
│   ├── search-dialog.tsx   # ⌘K 검색 다이얼로그
│   └── theme-toggle.tsx
├── lib/
│   ├── posts.ts            # 포스트 쿼리 (정렬, 필터, 시리즈, TIL)
│   ├── projects.ts         # 프로젝트 쿼리
│   ├── search.ts           # Fuse.js 검색 인덱스 생성
│   ├── site.ts             # 사이트 메타데이터 + Giscus 설정
│   ├── categories.ts       # 카테고리 그룹 정의
│   └── utils.ts            # 유틸리티 (cn 등)
└── styles/
    ├── globals.css          # Tailwind import
    ├── prose.css            # 마크다운 타이포그래피 커스텀
    └── shadcn.css           # Shadcn/ui 테마 변수

content/                    # 콘텐츠 (별도 git submodule, .gitignore에 포함)
├── posts/**/*.md           # 블로그 포스트
├── projects/**/*.md        # 프로젝트
└── about.md
```

## 콘텐츠 시스템

### 포스트 Frontmatter

```yaml
title: "제목"
slug: unique-slug
created: 2026-01-29
updated: 2026-01-30        # 선택
description: "설명"        # 선택 (없으면 본문 첫 200자 사용)
category: "java"           # categories.ts의 id 값
tags: [tag1, tag2]
type: [til, series]        # 선택 (TIL/시리즈 표시)
series: "시리즈 이름"       # 선택
order: 1                   # 시리즈 내 순서, 선택
```

### 카테고리 구조

Language(java, kotlin, rust, cpp), Web(spring, blog2), DevOps(docker, github-actions), Linux(arch-linux, linux), Algorithm(algorithm), Tool(nvim), Etc(etc)

새 카테고리 추가 시 `src/lib/categories.ts`의 `CATEGORY_GROUPS` 수정.

### Velite 빌드 흐름

1. `content/` 디렉토리의 Markdown 파일을 읽음
2. Rehype 플러그인 적용: slug → autolink-headings → shiki
3. `.velite/` 디렉토리에 JSON 데이터 출력
4. 코드에서 `import { posts, projects, about } from "#velite"` 로 사용

## 코딩 컨벤션

- **Biome** 설정 준수: space 2칸, import 자동 정리, recommended 규칙
- **아이콘:** lucide-react를 우선 사용. 커스텀 SVG 아이콘은 lucide에 없는 경우에만 사용
- **UI 컴포넌트:** Shadcn/ui (`src/components/ui/`)를 우선 사용. 직접 구현하기 전에 Shadcn/ui에 해당 컴포넌트가 있는지 확인
- `cn()` 유틸리티로 Tailwind 클래스 병합 (clsx + tailwind-merge)
- 모든 동적 라우트에 `generateStaticParams()` 필수 (정적 빌드)
- `dangerouslySetInnerHTML`은 Velite가 생성한 안전한 HTML에만 사용
- 한국어 UI (사이트 locale: ko_KR)

## 주의사항

- `content/` 디렉토리는 별도 git 레포 (submodule). 이 프로젝트 레포에는 포함되지 않음
- `output: "export"` 모드이므로 서버 사이드 기능(API Routes, middleware 등) 사용 불가
- `.velite/` 디렉토리는 gitignore 대상. 빌드 시 자동 생성됨
- CSS나 레이아웃이 갑자기 깨질 경우 `.next` 캐시 삭제 후 재시작: `rm -rf .next && pnpm dev`
- 현재 개발 브랜치: `v4/next16`, 메인 브랜치: `main`
