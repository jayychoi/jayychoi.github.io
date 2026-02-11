# 프로젝트 개요

## 소개

GitHub Pages 기반 개인 웹사이트. 학습 기록 및 포트폴리오 목적.
지식을 체계적으로 작성/관리하고 쉽게 인출할 수 있는 개인 지식 관리 시스템.

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (Static Export) |
| 스타일링 | Tailwind CSS |
| 콘텐츠 관리 | SQLite (better-sqlite3 + Drizzle ORM) + 개발 전용 어드민 UI |
| 콘텐츠 빌드 | Velite (Markdown → 정적 JSON) |
| 패키지 매니저 | pnpm |
| 배포 | GitHub Pages (GitHub Actions) |
| 댓글 | giscus (예정) |

## 네비게이션 구조

### 글로벌 헤더

```
[블로그] [프로젝트] [About]
```

### 페이지 구성

| 페이지 | 설명 | 스펙 문서 |
|--------|------|-----------|
| / | 랜딩 페이지 (미정) | - |
| /blog | 전체 글 목록 (기본: 카테고리 사이드바) | [BLOG.md](./BLOG.md) |
| /blog/categories/[category] | 특정 카테고리 글 목록 | [BLOG.md](./BLOG.md) |
| /blog/til/[date] | 특정 날짜 TIL 목록 | [BLOG.md](./BLOG.md) |
| /blog/tags/[tag] | 특정 태그 글 목록 | [BLOG.md](./BLOG.md) |
| /blog/series/[series] | 특정 시리즈 글 목록 | [BLOG.md](./BLOG.md) |
| /blog/posts/[slug] | 게시글 상세 (모든 글 공통) | [BLOG.md](./BLOG.md) |
| /projects | 프로젝트 카드 목록 | [PROJECTS.md](./PROJECTS.md) |
| /projects/[slug] | 프로젝트 상세 | [PROJECTS.md](./PROJECTS.md) |
| /about | About 페이지 | [ABOUT.md](./ABOUT.md) |

## 저장소 구조

콘텐츠와 코드를 별도 브랜치로 완전 분리. 메인 레포에 콘텐츠 관련 커밋이 남지 않음.

```
jayychoi.github.io/          # 메인 레포 (코드, 설정, 스펙)
└── content/                  # .gitignore로 제외, content 브랜치의 git worktree
    └── blog.db               # SQLite 데이터베이스 (콘텐츠 원본)
```

- **로컬**: `git worktree add content content`로 content 고아 브랜치를 content/ 디렉토리에 연결
- **CI**: GitHub Actions에서 빌드 전 content 브랜치를 content/에 체크아웃
- 코드 변경과 콘텐츠 데이터 이력이 완전히 분리됨

## 콘텐츠 관리

### 어드민 UI (개발 모드 전용)

개발 서버(`pnpm dev`)에서만 접근 가능한 웹 기반 어드민 UI로 콘텐츠를 관리한다. `.dev.tsx`/`.dev.ts` 파일 확장자를 사용하여 프로덕션 빌드에서 자동 제외된다.

| 기능 | 경로 |
|---|---|
| 새 글 작성 | `/blog/posts/new` |
| 글 수정 | `/blog/posts/[slug]/edit` |
| 새 프로젝트 작성 | `/projects/new` |
| 프로젝트 수정 | `/projects/[slug]/edit` |
| About 수정 | `/about/edit` |

### DB 관리 도구

```bash
pnpm db:studio    # Drizzle Studio (웹 기반 DB 브라우저) 실행
pnpm db:generate  # 스키마 변경 시 마이그레이션 파일 생성
pnpm db:migrate   # 마이그레이션 실행
```

## 이후 계획

- 학습 대시보드 (월별 작성량, 카테고리별 분포 통계)
- 스니펫 저장소
- 일기 기능

## 디렉토리 구조

```
├── content/               # Git Worktree (content 브랜치)
│   └── blog.db            # SQLite 데이터베이스
├── scripts/
│   └── export-content.ts  # SQLite → Markdown 내보내기
├── src/
│   ├── app/               # Next.js App Router
│   │   └── api/admin/     # 어드민 API (개발 전용)
│   ├── components/
│   │   └── admin/         # 어드민 에디터 컴포넌트
│   ├── db/                # Drizzle ORM (스키마, DB 연결)
│   ├── lib/
│   └── styles/
├── public/
├── velite.config.ts       # Velite 설정 (.content-build/ 읽기)
├── drizzle.config.ts      # Drizzle 설정
├── next.config.ts
└── package.json
```
