---
title: "tmux 서버와 소켓 구조"
slug: tmux-server-socket
created: 2026-02-07
category: etc
type: [til]
tags: []
---

## tmux의 서버-클라이언트 구조

tmux는 단순한 터미널 멀티플렉서처럼 보이지만, 내부적으로는 **서버-클라이언트 구조**로 동작한다.

```
terminal ──socket──▶ tmux server ─┬─ session A ─┬─ window 1 ─┬─ pane 1
(client)                          │             │            └─ pane 2
                                  │             └─ window 2 ─── pane 1
                                  └─ session B ─── window 1 ─── pane 1
```

- **서버**: 모든 세션, 윈도우, 팬을 관리하는 백그라운드 프로세스이다. 세션 안에서 실행되는 모든 프로그램의 생명주기를 서버가 관리한다.
- **클라이언트**: 터미널이 서버에 접속하여 화면을 렌더링하는 역할이다. `tmux attach`로 접속하고 `tmux detach`로 빠져나온다.

이 구조 덕분에 터미널을 닫아도(클라이언트 종료) 서버에서 실행 중인 프로세스는 계속 살아있는 것이다.
SSH 세션이 끊어져도 작업이 유지되는 이유이기도 하다.

## 유닉스 소켓을 통한 통신

서버와 클라이언트는 **유닉스 도메인 소켓**(Unix Domain Socket)을 통해 통신한다.
유닉스 소켓은 같은 시스템 내에서 프로세스 간 통신(IPC)을 하기 위한 메커니즘으로, 파일시스템에 소켓 파일 형태로 존재한다.

소켓 파일은 `/tmp/tmux-{UID}/` 디렉토리에 위치한다.

```bash
$ ls -la /tmp/tmux-501/
srwxrwx--- jay wheel 0 B default
```

`s`로 시작하는 파일 타입이 소켓 파일이다.
`tmux`를 처음 실행하면 `default`라는 이름의 소켓 파일이 생성되고, 이후 모든 `tmux` 명령은 이 소켓을 통해 서버와 통신한다.

```bash
# 아래 두 명령은 동일하다
tmux new-session -s work
tmux -L default new-session -s work
```

`-L` 옵션을 생략하면 자동으로 `default` 소켓을 사용하는 것이다.

## -L 옵션: 별도 서버 실행

`-L` 옵션은 소켓 이름을 지정한다. 소켓이 다르면 **완전히 독립된 별도 서버**가 실행된다.

```bash
# 기본 서버 (소켓: default)
tmux new-session -s work

# 별도 서버 (소켓: Music)
tmux -L Music new-session -s Music
```

이렇게 하면 소켓이 두 개가 된다.

```bash
$ ls /tmp/tmux-501/
default    # 기본 서버
Music      # 별도 서버
```

각 소켓은 독립된 서버 프로세스를 가지며, 서로 완전히 격리되어 있다.

### 독립되는 것들

**설정 독립**

각 서버는 자체 설정을 가진다.
기본 서버에서 prefix를 `Ctrl+a`로 바꿨더라도, `-L Music`으로 띄운 서버는 기본값인 `Ctrl+b`를 사용한다.
별도 서버에 다른 설정을 적용하고 싶다면 `-f` 옵션으로 설정 파일을 지정하면 된다.

```bash
tmux -L Music -f ~/.config/tmux/music.conf new-session -s Music
```

**세션 독립**

`tmux ls`는 기본 서버의 세션만 보여준다.
별도 서버의 세션을 확인하려면 `-L` 옵션을 명시해야 한다.

```bash
# 기본 서버 세션 목록
tmux ls

# Music 서버 세션 목록
tmux -L Music ls
```

**프로세스 독립**

서버가 다르면 프로세스도 완전히 분리된다.
기본 서버를 `tmux kill-server`로 종료해도 Music 서버는 영향받지 않는다.

```bash
# 기본 서버만 종료 (Music 서버는 살아있음)
tmux kill-server

# Music 서버 종료
tmux -L Music kill-server
```

## -S 옵션: 소켓 경로 직접 지정

`-L`은 소켓 **이름**을 지정하며 파일은 `/tmp/tmux-{UID}/` 아래에 생성된다.
소켓 파일의 **전체 경로**를 직접 지정하고 싶다면 `-S` 옵션을 사용한다.

```bash
tmux -S /var/run/tmux/my-server new-session
```

`-L`과 `-S`의 차이는 다음과 같다.

| 옵션 | 소켓 경로 | 예시 |
|------|----------|------|
| `-L Music` | `/tmp/tmux-{UID}/Music` | 이름만 지정 |
| `-S /path/to/sock` | `/path/to/sock` | 전체 경로 지정 |

일반적인 용도에서는 `-L`만으로 충분하다.

## 활용 예시

별도 서버가 유용한 상황은 다음과 같다.

**설정 충돌 방지**

tmux 팝업(`display-popup`) 안에서 tmux 세션을 사용할 때, 별도 서버를 사용하면 prefix 키가 충돌하지 않는다.

```bash
# tmux.conf (prefix: Ctrl+a)
bind-key m display-popup -E -w 80% -h 80% "tmux -L Music new-session -A -s Music 'musikcube'"
# 팝업 안의 Music 서버는 prefix가 Ctrl+b이므로 충돌 없음
```

**격리된 환경 구성**

특정 프로젝트나 용도별로 서버를 완전히 분리할 수 있다.

```bash
# 개발용 서버
tmux -L dev new-session -s project

# 모니터링 전용 서버 (다른 설정 파일 사용)
tmux -L monitor -f ~/.config/tmux/monitor.conf new-session -s logs
```
