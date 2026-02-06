---
title: "pacman 사용법"
slug: arch-pacman
created: 2024-12-18
category: arch-linux
tags: []
---

[Arch Wiki - pacman](https://wiki.archlinux.org/title/Pacman)

[Pacman Manual](https://man.archlinux.org/man/pacman.8)

## 옵션

### 주요 작업

| 옵션 | 의미    | 설명                               |
| ---- | ------- | ---------------------------------- |
| `-S` | Sync    | 저장소의 패키지 설치/업데이트      |
| `-R` | Remove  | 패키지 제거                        |
| `-Q` | Query   | 로컬 패키지 조회                   |
| `-U` | Upgrade | 로컬 패키지 파일(.pkg.tar.xz) 설치 |
| `-F` | Files   | 패키지 파일 데이터베이스 조회      |

### 하위 옵션

#### S와 같이 사용

| 옵션  | 의미        | 설명                                                    |
| ----- | ----------- | ------------------------------------------------------- |
| `-y`  | refresh     | 로컬 패키지 데이터베이스를 서버와 동기화                |
| `-u`  | upgrade     | 설치된 패키지 중 업그레이드 가능한 것을 모두 업그레이드 |
| `-s`  | search      | 저장소의 패키지를 검색                                  |
| `-i`  | info        | 패키지 정보 표시                                        |
| `-c`  | clean       | 로컬 캐시에서 오래된 패키지 제거                        |
| `-cc` | clean cache | 모든 캐시된 패키지 제거                                 |

#### R와 같이 사용

| 옵션 | 의미                   | 설명                                                               |
| ---- | ---------------------- | ------------------------------------------------------------------ |
| `-s` | recursive dependencies | 의존성 패키지도 함께 제거(다른 패키지에서 필요로 하지 않는 경우만) |
| `-n` | nosave                 | 설정 파일도 함께 제거                                              |
| `-c` | cascade                | 의존성 패키지도 전부 제거(다른 패키지에서 사용 중이더라도)         |

#### Q와 같이 사용

| 옵션 | 의미         | 설명                                      |
| ---- | ------------ | ----------------------------------------- |
| `-s` | search       | 로컬에 설치된 패키지 검색                 |
| `-i` | info         | 설치된 패키지의 정보 표시                 |
| `-l` | list         | 패키지에 포함된 모든 파일 나열            |
| `-o` | owns         | 특정 파일을 소유한 패키지 검색            |
| `-d` | dependencies | 특정 패키지의 의존성 나열                 |
| `-t` | unrequired   | 다른 패키지의 의존성이 아닌 패키지 검색   |
| `-m` | foreign      | 공식 저장소에서 설치하지 않은 패키지 검색 |
| `-n` | native       | 공식 저장소에서 설치한 패키지 검색        |

## 패키지 검색

```bash
pacman -Ss [package]       # 패키지 데이터베이스에서 검색
pacman -Qs [package]       # 이미 설치된 패키지에서 검색
```

## 패키지 설치

```bash
pacman -S [package]        # 패키지 설치
pacman -Sy [package]       # 데이터베이스 동기화 후 설치
```

## 패키지 제거

```bash
pacman -R [package]        # 단일 패키지 제거
pacman -Rs [package]       # 패키지와 의존성 제거 (사용되지 않는 의존성)
pacman -Rsc [package]      # 패키지와 모든 의존성 제거
pacman -Rn [package]       # 설정 파일 포함 완전 제거
```

## 패키지 업그레이드

```bash
pacman -Su                 # 시스템 업그레이드
pacman -Syu                # 데이터베이스 동기화 후 시스템 업그레이드 (권장)
```

## 패키지 정보 확인

```bash
pacman -Qi [package]       # 설치된 패키지의 상세 정보
pacman -Si [package]       # 원격 패키지의 상세 정보
pacman -Ql [package]       # 패키지가 설치한 파일 목록
pacman -Qo [file path]     # 특정 파일을 설치한 패키지 찾기
```

## 캐시 관리

```bash
pacman -Sc                 # 오래된 패키지 캐시 삭제
pacman -Scc                # 모든 패키지 캐시 삭제 (주의)
```

## 기타

```bash
pacman -Q                  # 설치된 모든 패키지 목록
pacman -Qdt                # 필요 없는 의존성 패키지 찾기
pacman -Qm                 # AUR 등 외부 저장소에서 설치된 패키지
```
