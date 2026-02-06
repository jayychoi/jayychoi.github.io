---
title: 주석
slug: rust-comment
created: 2025-04-07 19:13
updated:
description:
category: rust
tags:
published: true
---

러스트의 주석에는 일반 주석과 문서 주석이 있다.

## 일반 주석

일반 주석은 단순히 컴파일러가 무시하기만 한다.
다른 언어에서와 마찬가지로 코드를 설명하는 역할을 한다.

- `//`
- `/* */`

```rust
// 한 줄 주석
let x = 5; // 주석 기호부터 줄의 끝까지 무시한다

// 여러 줄 주석
//
//

/* 주석 */

/*
여러
줄
주석
*/

```

## 문서 주석

문서 주석은 문서화를 위한 특별한 주석이다.
문서 주석은 마크다운 형식을 지원한다.

- `//!`: 파일(크레이트)에 대한 설명
- `///`: API(함수 등)에 대한 설명

```rust title="src/lib.rs"
//! # My Crate
//!
//! `my_crate` is a collection of utilities to make performing certain
//! calculations more convenient.

/// Adds one to the number given.
///
/// # Examples
///
/// \`\`\`
/// let arg = 5;
/// let answer = my_crate::add_one(arg);
///
/// assert_eq!(6, answer);
/// \`\`\`
pub fn add_one(x: i32) -> i32 {
    x + 1
}
```
