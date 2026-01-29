# 프로젝트 스펙

## 개요

개인 프로젝트 포트폴리오 페이지. 진행했던 프로젝트를 정리하여 보여줌.

## URL 구조

| URL | 설명 |
|-----|------|
| /projects | 프로젝트 카드 목록 |
| /projects/[slug] | 프로젝트 상세 페이지 |

## 데이터 관리

MDX 파일로 관리. 콘텐츠 서브모듈 내 `projects/` 디렉토리에 저장.

### Frontmatter 스키마

| 필드 | 필수 | 설명 |
|------|------|------|
| title | O | 프로젝트명 |
| slug | O | 고유 식별자 (URL에 사용) |
| description | O | 프로젝트 요약 |
| techs | O | 사용 기술 스택 배열 |
| status | O | 진행 상태 (`in-progress` / `completed`) |
| startDate | O | 시작일 |
| endDate | | 종료일 (진행 중이면 생략) |
| github | | GitHub 레포 URL |
| url | | 배포/데모 URL |
| thumbnail | | 썸네일 이미지 경로 (미정) |

### 예시

```yaml
title: "개인 블로그"
slug: personal-blog
description: "Next.js 기반 GitHub Pages 기술 블로그"
techs: [Next.js, TypeScript, Tailwind CSS, Velite]
status: in-progress
startDate: 2026-01-29
github: "https://github.com/jayychoi/jayychoi.github.io"
```

## 목록 페이지

- 카드 형태로 프로젝트 표시
- 카드 정보: 제목, 설명, 기술 스택, 기간, 상태, GitHub/배포 링크

## 상세 페이지

- MDX 본문으로 프로젝트 상세 설명
- 프로젝트 개요, 기술적 도전, 회고 등 자유롭게 작성

## 논의 필요 사항

- 썸네일 이미지 포함 여부
- 필터링/정렬 기능 필요 여부 (기술 스택별, 상태별 등)
