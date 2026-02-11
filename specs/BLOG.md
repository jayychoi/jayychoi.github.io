# 블로그 스펙

## 사이드바

URL과 독립적으로 React state로 관리. 사용자가 자유롭게 전환 가능.

| 사이드바 메뉴 | 표시 내용 |
|---------------|-----------|
| 카테고리 (기본) | 카테고리 목록, 선택 시 해당 카테고리 글 필터 |
| TIL | 달력 뷰 + 날짜 그룹 목록 (토글 전환) |
| 태그 | 태그 목록, 선택 시 해당 태그 글 필터 |
| 시리즈 | 시리즈 목록, 선택 시 해당 시리즈 글 목록 |

## URL 구조

URL은 글 목록 필터링이 필요한 경우에만 사용.

| URL | 설명 |
|-----|------|
| /blog | 전체 글 목록 (기본: 카테고리 사이드바) |
| /blog/categories/[category] | 특정 카테고리 글 목록 |
| /blog/til/[date] | 특정 날짜 TIL 목록 |
| /blog/tags/[tag] | 특정 태그 글 목록 |
| /blog/series/[series] | 특정 시리즈 글 목록 |
| /blog/posts/[slug] | 게시글 상세 (모든 글 공통) |

## 콘텐츠 구조

모든 콘텐츠는 SQLite 데이터베이스(`content/blog.db`)에 저장된다. 개발 모드의 어드민 UI(`/blog/posts/new`, `/blog/posts/[slug]/edit`)를 통해 작성/수정하며, 빌드 시 Markdown으로 내보내져 Velite가 처리한다.

모든 글은 기본적으로 Post이며, 추가 속성(til, series)을 통해 다양한 뷰에서 노출 가능.

### 데이터 스키마

| 필드 | 필수 | 설명 |
|------|------|------|
| title | O | 글 제목 |
| slug | O | 고유 식별자 (URL, 내부 링크에 사용) |
| created | O | 작성일 |
| updated | | 수정일 |
| description | O | 글 요약 |
| category | O | 대분류 (frontend, backend, language, devops 등) |
| tags | O | 세부 키워드 배열 |
| type | | 배열. `til`, `series` 조합 가능 (없으면 일반 글) |
| series | | 시리즈명 (type에 series 포함 시 필수) |
| order | | 시리즈 내 순서 (type에 series 포함 시 필수) |

### 예시

```yaml
# 일반 글
title: "클로저 정리"
slug: closure
created: 2026-01-29
description: "JavaScript 클로저 개념 정리"
category: language
tags: [javascript]
```

```yaml
# TIL
title: "React.memo는 언제 쓰는가"
slug: react-memo-usage
created: 2026-01-29
description: "React.memo의 적절한 사용 시점"
category: frontend
tags: [react]
type: [til]
```

```yaml
# 시리즈 글
title: "React 딥다이브 - 3. Reconciliation"
slug: react-deep-dive-reconciliation
created: 2026-01-29
description: "React의 재조정 알고리즘 분석"
category: frontend
tags: [react]
type: [series]
series: "React 딥다이브"
order: 3
```

```yaml
# TIL이면서 시리즈인 글
title: "Git 핵심 개념 - 1. HEAD란?"
slug: git-core-head
created: 2026-01-29
description: "Git HEAD 개념 정리"
category: devops
tags: [git]
type: [til, series]
series: "Git 핵심 개념"
order: 1
```

## 내부 링크

위키 스타일 링크 문법으로 글 간 연결. slug를 고유 식별자로 사용.

### 문법

```markdown
[[클로저]]                    # slug가 제목과 일치하면 자동 매칭
[[클로저 정리|closure]]       # [[표시 텍스트|slug]]
```

### slug 변경 대응

- 어드민 UI에서 slug 변경 시 DB에 즉시 반영
- 빌드 타임에 깨진 링크 검증 (존재하지 않는 slug 참조 시 경고/에러)

## 기능

### 다크모드

- 시스템 설정 감지 + 수동 토글
- 상태 localStorage 저장

### 검색

- 빌드 타임에 검색 인덱스 생성
- 제목, 태그, 본문 내용 검색
- 모든 콘텐츠 타입 통합 검색

### 카테고리 & 태그

- 카테고리: 대분류 (frontend, backend, language, devops 등)
- 태그: 세부 키워드 (react, typescript, docker 등)
- 카테고리별/태그별 필터링

### 댓글

- giscus (GitHub Discussions 기반)
- 모든 게시글 상세 페이지에 적용

### 목차 네비게이션

- 글 본문의 heading 기반 자동 생성
- 현재 읽고 있는 섹션 하이라이트
- 사이드바 또는 플로팅 형태

### 관련 글 추천

- 빌드 타임에 태그/카테고리 유사도 기반 계산
- 글 하단에 관련 글 3개 표시

### 시리즈 네비게이션

- 같은 시리즈 내 이전/다음 글 이동
- 시리즈 전체 목록 표시
