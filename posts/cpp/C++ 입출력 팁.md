---
title: "[C++]입출력 팁"
slug: cpp-io-tip
created: 2024-03-11
category: cpp
tags: []
---

## ios::sync_with_stdio(false)

```cpp
ios::sync_with_stdio(0);
```

C Stream과 C++ Stream의 동기화를 해제한다. cin/cout의 속도가 빨라지지만 절대 printf/scanf와 같이 사용하면 안 된다.

## cin.tie(nullptr)

```cpp
cin.tie(0);
```

기본값으로 cin 명령이 실행되기 전에 cout의 버퍼를 비운다.
그러나 알고리즘 문제를 채점할 때는 출력만 확인하기 때문에 입력과 출력의 순서가 꼬이는 것은 상관없다.
`cin.tie(0)`은 cout의 버퍼를 비우지 않도록 설정하여 속도를 높인다.

## endl

절대 사용 금지
