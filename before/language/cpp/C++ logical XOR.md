---
title: '[C++]XOR'
slug: cpp-logical-xor
created: 2024-05-19
updated:
description:
category: cpp
tags: [cpp, algorithm, xor]
published: true
---

## XOR

XOR(exclusive or) 연산은 두 논리값이 같으면 0, 다르면 1을 반환하는 연산이다.

## bool type

두 변수가 bool type이라면 `!=`를 통해 쉽게 XOR을 구할 수 있다

## 나머지 type

두 변수가 bool type이 아니라면 `!`를 통해 변수를 먼저 bool type으로 변환한 뒤 `!=`를 사용하면 된다.

```cpp
int a = 5;
int b = 10;

if (!a != !b) cout << true;
else cout << false;
```
