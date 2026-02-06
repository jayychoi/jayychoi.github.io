---
title: Hello world 출력하기
slug: rust-hello-world
created: 2025-04-04 19:06
updated:
description:
category: rust
tags:
published: true
---

[The Rust Programming Language - 1.2 Hello, World!](https://doc.rust-lang.org/book/ch01-02-hello-world.html)

## 러스트 프로그램 작성

먼저, 러스트 파일 `main.rs`를 생성한다.
여기에 다음과 같이 코드를 작성한다.

```rust title="main.rs"
fn main() {
  println!("Hello, world!");
}
```

`main`은 러스트 프로그램에서 가장 먼저 실행되는 함수이다.
`fn` 키워드를 통해 함수를 정의한다.

`println!`은 러스트의 매크로를 호출하는 코드이다.
러스트에서는 표준 출력을 위한 매크로가 정의되어 있다.

러스트는 탭 대신 스페이스 4칸을 사용하며, 표현식이 끝날 때마다 세미콜론(`;`)을 붙여야 한다.

## 러스트 프로그램 실행

작성한 코드를 실행하기 위해서는 먼저 컴파일을 해야 한다.

```bash
$ rustc main.rs
$ ./main
Hello, world!
```

러스트는 C/C++처럼 컴파일 과정이 필요하다.
소스 코드를 컴파일하면 실행 가능한 바이너리가 생성된다.
