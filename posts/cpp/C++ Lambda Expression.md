---
title: "[C++]람다 표현식(Lambda Expression)"
slug: cpp-lambda-expression
created: 2024-05-18
updated: 2025-10-09
category: cpp
tags: [cpp, algorithm, lambda]
---

## 기본 문법

```cpp
[capture](parameters) -> return-type {
  body
}
```

## 캡처 방식

| 코드   | 설명    |
|--------------- | --------------- |
| `[]`   | 아무것도 캡처하지 않음   |
| `[=]`   | 모든 외부 변수를 값으로 복사   |
| `[&]`   | 모든 외부 변수를 참조로 캡처   |
| `[x]`   | 변수 `x``만 값으로 복사   |
| `[&x]`   | 변수 `x``만 참조로 캡처   |
| `[x, &y]`   | `x`는 값으로, `y`는 참조로 캡처|
| `[=, &x]`   | 모든 변수는 값으로 복사, `x`만 참조로 캡처|
| `[&, x]`   | 모든 변수는 참조로 캡처, `x`만 값으로 복사|

> 지금까지 알고리즘 문제를 풀면서 캡처를 할 일은 거의 없었던 것 같다.

## 활용 예시

### 1. 필터링

```cpp
vector<int> v = { ... };

// C++17
v.erase(
  remove_if(v.begin(), v.end(), [](int n) { return n % 2 != 0; }),
  v.end()
);

// C++20
erase_if(v, [](int v) { return n % 2 != 0; });
```

### 2. 정렬

```cpp
vector<int> v = { ... };

sort(v.begin(), v.end(), [](int a, int b) { return a > b; }); // 내림차순
sort(v.begin(), v.end(), greater<>()); // 위와 동일(더 간단)
```

객체를 정렬한다면 람다를 사용해야 한다.

## 참고

- [모두의 코드 - 람다 함수][1]
- [devkoriel - Modern C++ lambda의 특징과 사용법][2]
- [cppreference - Lambda expressions][3]
- [GeeksforGeeks - Lambda expression in C++][4]

[1]: https://modoocode.com/196
[2]: https://blog.koriel.kr/modern-cpp-lambdayi-teugjinggwa-sayongbeob/
[3]: https://en.cppreference.com/w/cpp/language/lambda
[4]: https://www.geeksforgeeks.org/lambda-expression-in-c/
