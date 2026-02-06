---
title: Cargo
slug: rust-cargo
created: 2025-04-04 19:16
updated:
description:
category: rust
tags:
published: true
---

[The Rust Programming Language - 1.3 Hello, Cargo!](https://doc.rust-lang.org/book/ch01-03-hello-cargo.html)

## Cargo란?

카고(Cargo)는 러스트에서 사용하는 빌드 시스템 및 패키지 매니저이다.
Node.js를 사용해봤어서 이해가 쉬웠다.

러스트를 설치하면 기본적으로 카고도 같이 설치가 된다.
다음 명령으로 카고가 설치되어 있는지 확인할 수 있다.

```bash
cargo 1.85.1 (d73d2caf9 2024-12-31)
$ cargo --version
```

## 카고로 프로젝트 생성하기

```bash
$ cargo new hello_cargo
    Creating binary (application) `hello_cargo` package
note: see more `Cargo.toml` keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html
```

이 명령은 `hello_cargo`라는 디렉토리를 생성하고, 내부에 필요한 파일들을 생성한다.

```text
hello_cargo/
├── .git
├── .gitignore
├── Cargo.toml
└── src/
    └── main.rs
```

- git 저장소 생성
- `Cargo.toml` 생성
- `src` 디렉토리 생성

`Cargo.toml`은 node의 `package.json`과 비슷한 파일이다.
프로젝트의 정보나 의존성 등을 담고 있다.

## 카고로 프로젝트 빌드하기

### 디버그 빌드(기본)

`cargo build`로 프로젝트를 빌드할 수 있다.

```bash
$ cargo build
   Compiling hello_cargo v0.1.0 (/Users/cjy/dev/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.68s
```

그리고 빌드 결과물은 `target/debug/`에 생성된다.
기본 빌드는 디버그 빌드이기 때문에 디버그 디렉토리에 생성되는 것이다.

### 릴리즈 빌드

릴리즈 빌드를 위해서는 `--release` 옵션을 추가한다.

```bash
$ cargo build --release
   Compiling hello_cargo v0.1.0 (/Users/cjy/dev/hello_cargo)
    Finished `release` profile [optimized] target(s) in 1.04s
```

빌드 결과물은 `target/release/`에 생성된다.
릴리즈 빌드는 컴파일이 좀 더 오래 걸리는 대신, 최적화를 진행하여 프로그램이 더 빠르게 작동한다.

## 카고로 프로젝트 실행하기

`cargo build`를 실행하고 `target/debug/`로 이동하여 바이너리 파일을 직접 실행할 수도 있지만, 카고는 더 편리한 기능을 제공한다.

`cargo run` 명령을 통해 빌드와 실행을 한 번에 할 수 있다.

```bash
$ cargo run
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running `target/debug/hello_cargo`
Hello, world!
```

## check 명령

카고에는 `cargo check`라는 명령어도 있다.
실행 파일은 생성하지 않고, 코드가 잘 컴파일되는지만 확인한다.
주기적으로 이 명령어를 실행해서 코드에 컴파일 문제가 발생하지 않는지 확인한다.
