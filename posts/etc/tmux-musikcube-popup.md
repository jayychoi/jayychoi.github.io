---
title: "tmux에서 플로팅 팝업으로 별도 세션 사용하기"
slug: tmux-musikcube-popup
created: 2026-02-07
category: etc
type: [til]
tags: []
---

## 목표

tmux 작업 중 어디서든 단축키 하나로 musikcube를 플로팅 팝업으로 열고, 음악을 재생한 상태로 팝업을 닫을 수 있도록 설정하는 것이다.

## display-popup

tmux 3.2부터 `display-popup` 명령이 추가되었다. 현재 창 위에 플로팅 윈도우를 띄우는 기능이다.

```bash
# 기본 사용법
tmux display-popup -w 80% -h 80% "명령어"
```

주요 옵션은 다음과 같다.

| 옵션 | 설명 |
|------|------|
| `-w`, `-h` | 팝업 너비, 높이 (퍼센트 또는 절대값) |
| `-E` | 명령이 종료되면 팝업도 닫힘 |
| `-d` | 팝업의 작업 디렉토리 지정 |

## 단순한 방법 (문제 있음)

가장 직관적인 설정은 다음과 같다.

```bash
# tmux.conf
bind-key m display-popup -E -w 80% -h 80% "musikcube"
```

이 방법은 팝업이 잘 열리지만, **팝업을 닫으면 musikcube 프로세스도 함께 종료**된다.
`display-popup`은 내부에서 실행 중인 프로세스의 생명주기를 관리하기 때문에, 팝업을 닫는 순간 musikcube에 SIGHUP이 전달되어 종료되는 것이다.

음악을 재생한 상태로 팝업만 닫으려면 다른 접근이 필요하다.

## 해결: 별도 tmux 서버 사용

musikcube를 **별도의 tmux 서버**에서 실행하고, 팝업은 그 세션에 attach/detach만 하는 것이다.

```bash
# tmux.conf
bind-key m display-popup -E -w 80% -h 80% "tmux -L Music new-session -A -s Music 'musikcube'"
```

### 동작 방식

1. `tmux -L Music` — `Music`이라는 이름의 **별도 소켓**으로 독립된 tmux 서버를 실행한다
2. `new-session -A -s Music` — `Music` 세션이 있으면 attach, 없으면 새로 생성한다
3. `'musikcube'` — 해당 세션에서 musikcube를 실행한다
4. `-E` — 팝업 내 명령(attach)이 종료되면 팝업을 닫는다

### 사용법

| 동작 | 키 |
|------|-----|
| 팝업 열기 | `prefix` → `m` |
| 팝업 닫기 (음악 유지) | `prefix` → `d` |
| 다시 열기 | `prefix` → `m` |

팝업 안에서 `prefix + d`를 누르면 별도 서버의 세션에서 detach되면서 팝업이 닫힌다.
musikcube는 별도 서버에서 계속 실행 중이므로 음악이 끊기지 않는다.
다시 `prefix + m`을 누르면 `-A` 플래그 덕분에 기존 세션에 재접속된다.
