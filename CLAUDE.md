# CLAUDE.md — jayychoi.github.io

## 프로젝트 개요

개인 학습 기록 블로그. Next.js 정적 사이트로 빌드하여 GitHub Pages(`jayychoi.github.io`)에 배포.

## 기술 스택

- **프레임워크:** Next.js 16 (App Router, `output: "export"`, React Compiler 활성화)
- **언어:** TypeScript 5, React 19
- **콘텐츠 관리:** SQLite (better-sqlite3 + Drizzle ORM) + 개발 전용 어드민 UI
- **콘텐츠 빌드:** Velite (Markdown → 정적 JSON, `#velite` alias로 import)
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
pnpm dev          # 개발 서버 (SQLite 내보내기 + Velite watch 모드 자동 실행)
pnpm build        # 정적 빌드 — SQLite 내보내기 + Velite + Next.js SSG (out/ 생성)
pnpm lint         # biome check
pnpm format       # biome format --write && biome check --fix
pnpm content      # SQLite → Markdown 내보내기 + velite --clean (콘텐츠만 단독 재빌드)
pnpm db:generate  # Drizzle 마이그레이션 파일 생성
pnpm db:migrate   # Drizzle 마이그레이션 실행
pnpm db:studio    # Drizzle Studio (DB 브라우저) 실행
```

## 빌드 & 검증

코드 변경 후 검증은 `pnpm build` 하나로 충분하다.

- `pnpm build` 실행 시 `export-content.ts`로 SQLite → `.content-build/` Markdown 내보내기 후, Velite가 `.velite/*.json`을 생성하고, Next.js SSG 빌드
- `pnpm dev`도 마찬가지로 내보내기 후 Velite watch 모드를 자동 실행함
- `pnpm content`는 Next.js 빌드 없이 내보내기 + 콘텐츠만 따로 재생성할 때 사용

**content 디렉토리:**
- `content/`는 프로젝트 루트에 실제로 존재함 (content 브랜치의 git worktree)
- `.gitignore`에 포함되어 있어 git status에는 안 보이지만, 디렉토리 자체는 있음
- `content/blog.db`가 콘텐츠 원본 (SQLite 데이터베이스)
- `.content-build/`는 SQLite에서 내보낸 임시 Markdown 파일 (gitignore 대상)
- `.velite/` (posts.json, projects.json, about.json)도 gitignore 대상이나 빌드 시 자동 생성됨

**빌드 시 콘텐츠 에러:**
- `pnpm content` 또는 `pnpm build` 실행 시 일부 콘텐츠의 frontmatter 에러가 출력될 수 있으나, "build finished" 메시지가 나오면 정상임

## 디렉토리 구조

```
src/
├── app/                    # App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (폰트, 테마, 검색 프로바이더)
│   ├── page.tsx            # 홈 (활동 히트맵 + 최근 글 5개)
│   ├── api/admin/          # 어드민 API (개발 전용, .dev.ts)
│   │   ├── posts/          # POST/GET /api/admin/posts, PUT/DELETE /api/admin/posts/[slug]
│   │   ├── projects/       # POST/GET /api/admin/projects, PUT/DELETE /api/admin/projects/[slug]
│   │   └── about/          # GET/PUT /api/admin/about
│   ├── blog/
│   │   ├── layout.tsx      # 블로그 레이아웃 (사이드바)
│   │   ├── page.tsx        # 전체 글 목록 (페이지네이션 10개/페이지)
│   │   ├── posts/[slug]/   # 개별 포스트 (TOC, 댓글) + /new, /edit (어드민)
│   │   ├── categories/[category]/
│   │   ├── tags/[tag]/
│   │   ├── series/[series]/
│   │   └── til/[date]/     # TIL (YYYY-MM-DD)
│   ├── projects/           # 프로젝트 목록 및 상세 + /new, /edit (어드민)
│   └── about/              # About 페이지 + /edit (어드민)
├── components/
│   ├── ui/                 # Shadcn/ui 컴포넌트 (button, badge, pagination 등)
│   ├── blog/               # 블로그 전용 (post-card, sidebar, toc, comments 등)
│   ├── admin/              # 어드민 에디터 (post-editor, project-editor, about-editor)
│   ├── activity-heatmap.tsx
│   ├── header.tsx
│   ├── search-dialog.tsx   # ⌘K 검색 다이얼로그
│   └── theme-toggle.tsx
├── db/                     # SQLite 데이터베이스 (Drizzle ORM)
│   ├── index.ts            # DB 연결 (content/blog.db)
│   └── schema.ts           # 테이블 스키마 (posts, projects, about)
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

scripts/
└── export-content.ts       # SQLite → Markdown 내보내기 스크립트

content/                    # 콘텐츠 (별도 git worktree, .gitignore에 포함)
└── blog.db                 # SQLite 데이터베이스 (콘텐츠 원본)
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

### 콘텐츠 관리 방식

콘텐츠의 원본은 SQLite 데이터베이스(`content/blog.db`)이며, 개발 모드에서 어드민 UI를 통해 CRUD한다. 어드민 페이지와 API는 `.dev.tsx`/`.dev.ts` 확장자를 사용하여 프로덕션 빌드에서 자동 제외된다(`next.config.ts`의 `pageExtensions` 설정).

### 빌드 흐름

1. `export-content.ts`가 SQLite에서 데이터를 읽어 `.content-build/`에 Markdown 파일로 내보냄
2. Velite가 `.content-build/`를 읽고 Rehype 플러그인 적용: slug → autolink-headings → shiki
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

- `content/` 디렉토리는 별도 git 브랜치의 worktree. 이 프로젝트 레포에는 포함되지 않음
- `content/blog.db`가 콘텐츠 원본. 어드민 UI 또는 Drizzle Studio로 관리
- `.content-build/`는 빌드 시 자동 생성되는 임시 Markdown 디렉토리 (gitignore 대상)
- 어드민 페이지/API는 `.dev.tsx`/`.dev.ts` 확장자로 개발 모드에서만 로드됨
- `output: "export"` 모드이므로 서버 사이드 기능(API Routes, middleware 등) 사용 불가
- `.velite/` 디렉토리는 gitignore 대상. 빌드 시 자동 생성됨
- CSS나 레이아웃이 갑자기 깨질 경우 `.next` 캐시 삭제 후 재시작: `rm -rf .next && pnpm dev`
- 현재 개발 브랜치: `v4/next16`, 메인 브랜치: `main`
