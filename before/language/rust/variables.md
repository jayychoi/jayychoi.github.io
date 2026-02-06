---
title: 변수
slug: rust-variables
created: 2025-04-04 19:48
updated:
description:
category: rust
tags:
published: true
---

## 변수 선언과 초기화

러스트에서 변수는 기본적으로 불변(immutable)이다.
이는 안전성과 동시성 활용을 위한 것이다.
특정 변수 이름에 값이 한번 묶이면, 그 값은 바꿀 수 없다.

```rust
let x = 5;

// x = 6; // Compile Error: cannot assign twice to immutable variable 'x'
```

변수를 가변으로 만드려면 `mut` 키워트를 추가하면 된다.

```rust
let mut x = 5;

x = 6; // 가능
```

## 상수

상수(constant)는 항상 불변인 값이다.

```rust
const PI: u32 = 3.14;
```

상수는 값을 바꾸지 못한다는 점에서 불변 변수와 비슷하지만, 약간의 차이가 있다.

1. 상수는 `mut`와 함께 사용할 수 없다.
2. 상수는 `const` 키워드로 선언한다.
3. 상수는 **_타입_**을 반드시 명시해야 한다.
4. 상수는 반드시 **_상수 표현식_**으로만 설정될 수 있고, 런타임에서만 계산되는 결괏값으로는 설정할 수 없다.
5. 상수는 전역 스코프에서 선언이 가능하다.

상수는 컴파일 시점에 값이 평가된다.
그리고 실제 메모리를 할당하지 않고, 사용하는 모든 위치에 값이 직접 복사된다.
따라서 상수에는 런타임에 계산되는 값을 할당할 수 없다.

> 상수의 이름을 짓는 관례는 전부 대문자로 snake case를 사용하는 것이다.

## 섀도잉

러스트에서는 새 변수를 이전 변수명과 같은 이름으로 선언할 수 있다.
여기서 첫 번째 변수는 두 번째 변수에 의해 가려졌다고 해서 섀도잉(shadowing)이라고 표현한다.

```rust
fn main() {
  let x = 5;

  let x = x + 1; // shadowing

  {
    let x = x * 2; // shadowing
    println!("x: {x}");
  }

  println!("x: {x}");
}
```

`x`에는 먼저 5가 묶인다.
다음으로 `let x = `를 통해 새로운 변수 `x`를 만들고, 기존 `x`에 `1`을 더한 값을 묶는다.
여기서 섀도잉이 한 번 발생한다.
`x`라는 이름으로 서로 다른 두 개의 변수가 생성되었다.

그리고 중괄호로 만든 스코프 안에서 새로운 변수 `x`를 생성한다.
여기에는 기존 `x`에 `2`를 곱한 값을 묶는다.
그래서 스코프 내부의 `x`는 `12`가 된다.

스코프를 빠져나오면 스코프 안에서의 섀도잉이 끝나고, `x`는 다시 `6`으로 돌아온다.

```bash
$ cargo run
   Compiling hello_cargo v0.1.0 (/Users/cjy/dev/hello_cargo)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.64s
     Running `target/debug/hello_cargo`
x: 12
x: 6
```

### 섀도잉과 `mut`의 차이점

섀도잉은 `let mut`로 가변 변수를 정의하는 것과는 다르다.
`mut`를 사용하면 언제든지 바뀔 수 있는 값이다.
그러나 섀도잉은 `let`을 사용하여 값을 변형하면서도 변형이 끝나면 불변으로 유지할 수 있다.
또한, 섀도잉은 `let`으로 완전히 새로운 변수를 만들기 때문에 같은 이름으로 다른 타입의 값도 저장할 수 있다.
