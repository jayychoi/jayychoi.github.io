---
title: 유저와 그룹 설정
slug:
created: 2024-12-17 09:00:00
updated:
description:
category: arch-linux
tags:
published: true
---

## root(superuser) 계정

리눅스를 처음 설치하면 root(superuser) 계정만 존재한다.
루트 계정은 운영체제의 시스템의 모든 권한을 갖고 있다.
그래서 리눅스를 계속 루트 계정으로 사용하는 것은 보안적으로 매우 위험하다.
따라서 루트 계정은 시스템 관리 용도로만 사용해야 한다.

평소에 사용할 계정으로 권한이 제한된 유저를 별도로 생성하는 것이 좋다.

## 유저 생성

```bash
$ useradd -m [username]
```

`-m` 옵션은 유저를 생성하면서 홈 디렉토리를 함께 생성하는 옵션이다.

`-s` 옵션으로 기본 셸을 설정할수도 있다.
그리고 `-s` 옵션을 넣지 않았을 경우의 기본값도 설정할 수 있는데, 이건 `/etc/default/useradd`에서 설정한다.
나는 앞서 zsh를 설치했기 때문에 `/etc/default/useradd`을`SHELL=/usr/bin/zsh`로 수정했다.

## 비밀번호 설정

```bash
$ passwd [username]
```

앞서 생성한 유저 이름을 넣고 `passwd`를 실행한다.

## wheel 그룹 추가

유저를 생성하기만 하면 `sudo` 명령을 사용할 수 없다.
그래서 sudo 명령을 사용하려면 생성한 유저를 wheel 그룹에 추가해주어야 한다.

sudo를 사용할 수 있게 하는 방법은 여러 가지가 있지만 wheel 그룹에 추가하는 것이 가장 일반적이라고 한다.

```bash
$ usermod -aG wheel [username]
```

그리고 sudo 설정 파일도 약간 수정해야 한다.

```bash
$ sudo visudo

# 만약 에디터 설정이 안되어있다면 사용 가능한 에디터를 입력
$ sudo EDITOR=[editor] visudo
```

이 파일에서 `%wheel ALL=(ALL:ALL) ALL`인 줄의 주석을 제거한다.
