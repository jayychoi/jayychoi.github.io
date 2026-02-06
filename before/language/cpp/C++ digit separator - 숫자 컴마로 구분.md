---
title: '[C++]큰 수를 읽기 쉽게 구분하기'
slug: cpp-digit-separator
created: 2024-05-03
updated:
description:
category: cpp
tags: [cpp, algorithm]
published: true
---

작은 따옴표(`'`)를 숫자에 컴마 역할을 하도록 사용할 수 있다.
작은 따옴표는 주석과 비슷하다. 코드 실행에 영향을 주지 않는다. 잘못된 위치에 사용해도 상관은 없다.

```cpp
int n = 1'000'000'000; // ok (n = 1,000,000,000)
int m = 1'0'0'0'0'0'0; // ok (m = 1,000,000)
int a[1'000'000];      // 배열에도 사용 가능
```
