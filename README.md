# jayychoi.github.io

개인 학습 기록 블로그. Next.js 정적 사이트로 빌드하여 GitHub Pages에 배포한다.

> https://jayychoi.github.io

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, `output: "export"`, React Compiler) |
| 언어 | TypeScript 5, React 19 |
| 콘텐츠 관리 | SQLite (better-sqlite3) + Drizzle ORM + 개발 전용 어드민 UI |
| 콘텐츠 빌드 | Velite (Markdown → 정적 JSON) |
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
| `content` | 콘텐츠 (고아 브랜치) | SQLite 데이터베이스(`blog.db`), 배포 트리거 워크플로우 |

`content`는 `main`과 커밋 히스토리를 공유하지 않는 고아 브랜치(orphan branch)다. 코드 변경과 콘텐츠 데이터가 서로 섞이지 않는다.

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

`http://localhost:3000`에서 확인할 수 있다. 시작 시 SQLite → Markdown 내보내기 후 Velite watch 모드가 자동 실행되어 콘텐츠 변경 시 핫 리로드된다.

개발 모드에서는 어드민 UI(`/blog/posts/new`, `/about/edit` 등)를 통해 콘텐츠를 CRUD할 수 있다.

## 명령어

| 명령어 | 설명 |
|---|---|
| `pnpm dev` | 개발 서버 (SQLite 내보내기 + Velite watch 모드 자동 실행) |
| `pnpm build` | 정적 빌드 (SQLite 내보내기 + Velite + Next.js SSG → `out/` 생성) |
| `pnpm lint` | Biome 린트 검사 |
| `pnpm format` | Biome 자동 포매팅 |
| `pnpm content` | SQLite → Markdown 내보내기 + Velite 콘텐츠 재빌드 |
| `pnpm db:generate` | Drizzle 마이그레이션 파일 생성 |
| `pnpm db:migrate` | Drizzle 마이그레이션 실행 |
| `pnpm db:studio` | Drizzle Studio (DB 브라우저) 실행 |

## 디렉토리 구조

```
src/
├── app/                        # App Router 페이지
│   ├── layout.tsx              # 루트 레이아웃 (폰트, 테마, 검색 프로바이더)
│   ├── page.tsx                # 홈 (활동 히트맵 + 최근 글)
│   ├── api/admin/              # 어드민 API (개발 전용, .dev.ts)
│   ├── blog/
│   │   ├── layout.tsx          # 블로그 레이아웃 (사이드바)
│   │   ├── page.tsx            # 전체 글 목록
│   │   ├── posts/[slug]/       # 개별 포스트 (+ /new, /edit 어드민)
│   │   ├── categories/[category]/
│   │   ├── tags/[tag]/
│   │   ├── series/[series]/
│   │   └── til/[date]/
│   ├── projects/               # 프로젝트 목록 및 상세 (+ /new, /edit 어드민)
│   └── about/                  # About 페이지 (+ /edit 어드민)
├── components/
│   ├── ui/                     # Shadcn/ui 컴포넌트
│   ├── blog/                   # 블로그 전용 컴포넌트
│   └── admin/                  # 어드민 에디터 (post, project, about)
├── db/                         # SQLite 데이터베이스 (Drizzle ORM)
│   ├── index.ts                # DB 연결
│   └── schema.ts               # 테이블 스키마 (posts, projects, about)
├── lib/                        # 유틸리티 및 데이터 쿼리
└── styles/                     # 글로벌 스타일, 마크다운 타이포그래피

scripts/
└── export-content.ts           # SQLite → Markdown 내보내기 스크립트

content/                        # content 브랜치 (git worktree)
└── blog.db                     # SQLite 데이터베이스 (콘텐츠 원본)
```

## 콘텐츠 작성

### 어드민 UI (개발 모드 전용)

개발 서버(`pnpm dev`)에서만 접근 가능한 어드민 UI로 콘텐츠를 관리한다. 프로덕션 빌드에는 포함되지 않는다.

| 기능 | 경로 |
|---|---|
| 새 글 작성 | `/blog/posts/new` |
| 글 수정 | `/blog/posts/[slug]/edit` |
| 새 프로젝트 작성 | `/projects/new` |
| 프로젝트 수정 | `/projects/[slug]/edit` |
| About 수정 | `/about/edit` |

어드민 에디터에서 저장하면 SQLite에 즉시 반영되고, `.content-build/`에 Markdown 파일이 자동 생성되어 Velite가 핫 리로드한다.

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
git add blog.db
git commit -m "새 글 작성"
git push origin content
```

push하면 GitHub Actions가 자동으로 빌드 및 배포한다.

## 콘텐츠 빌드 파이프라인

```
SQLite (blog.db) → export-content.ts → .content-build/*.md → Velite → .velite/*.json → Next.js SSG → out/*.html
```

1. `content/blog.db`의 SQLite 데이터를 `export-content.ts`가 Markdown으로 내보냄
2. `.content-build/` 디렉토리에 frontmatter 포함 Markdown 파일 생성
3. Velite가 `.content-build/`를 읽고 Rehype 플러그인 적용 (slug → autolink-headings → shiki)
4. `.velite/` 디렉토리에 JSON 데이터 출력
5. 코드에서 `import { posts, projects, about } from "#velite"` 로 사용
6. Next.js가 정적 HTML로 빌드하여 `out/`에 출력

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
