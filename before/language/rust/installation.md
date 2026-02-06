---
title: Rust 설치
slug: rust-installation
created: 2025-04-03 00:16
updated:
description:
category: rust
tags:
published: true
---

[The Rust Programming Language - 1.1 Installation](https://doc.rust-lang.org/book/ch01-01-installation.html)

## rustup

Rust 설치를 위해서 rustup이라는 CLI 도구를 사용한다.
`rustup`은 Rust 버전과 관련 도구를 관리해준다.

## `rustup` 설치

Linux나 macOS에서는 터미널에서 다음 명령을 입력하여 `rustup`을 설치할 수 있다.

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

이 명령은 `rustup`을 설치하고, `rustup`은 최신 버전(latest stable)의 Rust를 설치한다.
`Rust is installed now. Great!`가 출력되면 성공적으로 설치된 것이다.

> ***링커(linker)***도 필요한데, 이건 이미 설치되어 있을 가능성이 높다.
> GCC나 Clang이 설치되어 있다면 링커도 이미 있다.
> macOS에서 링커가 없다면 `xcode-select --install`로 C 컴파일러를 설치할 수 있다.

윈도우에서의 설치는 공식 문서 참고

## Rust 설치 확인

Rust가 성공적으로 설치되었다면, 쉘에서 버전이 출력되어야 한다.

```bash
$ rustc --version
rustc x.y.z (abcabcabc yyyy-mm-dd)
```

만약 버전이 출력되지 않으면 시스템 환경 변수에 제대로 등록되었는지 확인한다.

```bash
# Linux or macOS
$ echo $PATH
```

## 업데이트와 제거

최신 버전으로 업데이트하려면 다음 명령을 실행한다.

```bash
rustup update
```

Rust와 `rustup`을 삭제하려면 다음 명령을 실행한다.

```bash
rustup self uninstall
```

## 로컬 공식 문서

Rust를 설치하면 공식 문서도 함께 설치된다.

```bash
```
