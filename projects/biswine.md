---
title: Biswine
slug: biswine
description: 와인 홍보 및 이벤트 안내를 위한 블로그 서비스. NestJS + React 풀스택으로 개발하고, Docker Compose로 AWS EC2에 배포했습니다.
techs:
  - React
  - TypeScript
  - NestJS
  - Prisma
  - MySQL
  - TailwindCSS
  - Tiptap
  - Docker
  - Nginx
  - AWS EC2
status: active
startDate: 2025-11-25
url: https://www.biswine.co.kr
---

와인 관련 소식과 이벤트를 안내하기 위해 만든 블로그 서비스입니다. 프론트엔드부터 백엔드, 인프라까지 직접 구축했습니다.

## 어떻게 만들었나요?

프론트엔드는 React 19와 Vite로 SPA를 구성하고, TanStack Query와 Zustand로 서버/클라이언트 상태를 관리합니다. UI는 TailwindCSS v4와 Shadcn/ui를 사용했습니다. 게시글 작성에는 Tiptap 기반의 WYSIWYG 에디터를 도입하여, 텍스트 스타일링부터 이미지 삽입(드래그 앤 드롭, 붙여넣기)까지 지원합니다.

백엔드는 NestJS로 REST API를 구성하고, Prisma ORM으로 MySQL 8.4 데이터베이스와 연동합니다. JWT 기반 인증(Access Token + Refresh Token)을 구현했으며, Refresh Token은 bcrypt로 해시화하여 DB에 저장하고 HttpOnly 쿠키로 전송합니다.

## 인프라

AWS EC2(t3.micro) 단일 인스턴스에 Docker Compose로 Nginx, NestJS, MySQL 세 컨테이너를 운영합니다. Nginx가 리버스 프록시 역할을 하면서 React 정적 파일도 서빙하고, Let's Encrypt로 HTTPS를 적용했습니다. RDS나 ALB 대신 EC2 내부에서 모두 처리하여 비용을 절감했고, EBS 볼륨에 DB 데이터와 이미지를 저장하여 서버 이전 시에도 함께 이동할 수 있도록 했습니다.

## 주요 기능

- **WYSIWYG 에디터** — Tiptap 기반으로 텍스트 스타일링, 제목, 목록, 인용문, 이미지 삽입을 지원합니다
- **이미지 최적화** — Sharp를 사용하여 업로드된 이미지를 WebP로 자동 변환하고, 매일 미사용 이미지를 정리합니다
- **JWT 인증** — Access Token 만료 시 Axios Interceptor로 자동 갱신하며, Rate Limiting으로 brute-force 공격을 방지합니다
- **무한 스크롤** — IntersectionObserver와 TanStack Query의 useInfiniteQuery로 게시글 목록을 페이지네이션합니다
- **타입 안전성** — Monorepo 구조에서 프론트엔드와 백엔드가 타입 정의 패키지를 공유하여 API 계약을 보장합니다

## 보안

Helmet.js로 HTTP 보안 헤더를 설정하고, class-validator로 요청 데이터를 검증합니다. Docker 네트워크를 프론트엔드와 백엔드로 분리하여 외부에서 DB에 직접 접근할 수 없도록 했습니다.
