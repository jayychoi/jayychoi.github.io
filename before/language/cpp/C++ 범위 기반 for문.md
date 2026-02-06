---
title: '[C++]범위기반 for문(Range-based for loop)'
slug: cpp-range-based-for
created: 2024-03-13
updated:
description:
category: cpp
tags:
published: true
---

[Microsoft - 범위 기반 for문](https://learn.microsoft.com/ko-kr/cpp/cpp/range-based-for-statement-cpp?view=msvc-170)

```cpp
for ( range-declaration : range-expression ) {
  loop-statements
}
```

반복할 수 있는 항목들에 대해 루프를 생성한다. 범위는 `begin()`과 `end()`로 정의되어야 한다.
루프 내부에서는 각 항목들의 복사본을 사용한다.

```cpp
int x[10] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };

// 특정 타입을 선언하여 사용하는 것은 추천하지 않는다
for ( int y : x ) {
  cout << y << ' ';
}

// auto 키워드를 이용하는 것을 추천한다
for ( auto y : x ) {
  cout << y << ' ';
}

// 값을 변경할 때는 참조자를 사용한다
for ( auto &y : x ) {
  cout << y << ' ';
}

// 값을 변경하지 않을 때는 상수 참조자를 사용한다
for ( const auto &y : x ) {
  cout << y << ' ';
}

```

범위 기반 for문의 루프는 `break`, `return`, `goto`가 실행되면 종료된다.
`continue`가 실행되면 현재의 루프만 종료한다.

## 범위 기반 for문의 특징

- 자동으로 배열을 인식한다.
- `.begin()`과 `.end()`가 있는 컨테이너를 인식한다.
- 나머지에 대해서는 `begin()`/`end()` argument-dependent lookup을 사용한다.
