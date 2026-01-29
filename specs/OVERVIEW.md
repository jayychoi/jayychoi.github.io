# 프로젝트 개요

## 소개

GitHub Pages 기반 개인 웹사이트. 학습 기록 및 포트폴리오 목적.
지식을 체계적으로 작성/관리하고 쉽게 인출할 수 있는 개인 지식 관리 시스템.

## 기술 스택

| 항목 | 선택 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (Static Export) |
| 스타일링 | Tailwind CSS |
| 콘텐츠 관리 | Velite (MDX) |
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

콘텐츠와 코드를 별도 레포지토리로 완전 분리. 메인 레포에 콘텐츠 관련 커밋이 남지 않음.

```
jayychoi.github.io/          # 메인 레포 (코드, 설정, 스펙)
└── content/                  # .gitignore로 제외, 별도 레포 클론
    ├── posts/
    ├── projects/
    └── about.mdx
```

- **로컬**: content/ 디렉토리에 콘텐츠 레포(jayychoi/blog-content)를 별도 클론
- **CI**: GitHub Actions에서 빌드 전 콘텐츠 레포를 content/에 클론
- 코드 변경과 콘텐츠 작성 이력이 완전히 분리됨

## CLI 도구

콘텐츠 작성과 관리를 위한 CLI 스크립트 모음.

### 새 글 생성

- 대화형(선택형) CLI로 frontmatter 생성
- 콘텐츠 타입 선택 → 필수 필드 입력 → MDX 파일 생성

```bash
pnpm new        # 타입 선택, 제목, 태그, 카테고리 등 대화형 입력
```

### slug 변경 (리네임)

- 모든 MDX 파일에서 해당 slug 참조를 일괄 치환

```bash
pnpm rename-slug <old-slug> <new-slug>
```

### 링크 검증

- 모든 내부 링크의 유효성 검사 (빌드 시 자동 실행도 가능)

```bash
pnpm check-links
```

## 이후 계획

- 학습 대시보드 (월별 작성량, 카테고리별 분포 통계)
- 스니펫 저장소
- 일기 기능

## 디렉토리 구조 (예정)

```
├── content/               # Git Submodule (콘텐츠 전용 레포)
│   ├── posts/
│   ├── til/
│   ├── series/
│   └── projects/
├── scripts/               # CLI 도구
│   ├── new.ts
│   ├── rename-slug.ts
│   └── check-links.ts
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
├── velite.config.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```
