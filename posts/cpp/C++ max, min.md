---
title: "[C++]max(), min()"
slug: cpp-max-min
created: 2024-03-25
category: cpp
tags: [cpp, algorithm, max, min]
---

## max / min

```cpp
// max
int M1 = std::max(2, 5);      // 2개일 경우
int M2 = std::max({2, 5, 7}); // 3개 이상일 경우 리스트로 만들어 사용

// min
int m1 = std::min(2, 5);      // 2개일 경우
int m2 = std::min({2, 5, 7}); // 3개 이상일 경우 리스트로 만들어 사용
```

## minmax

```cpp
pair<int, int> a = std::minmax({2, 4, 1, 9, 6});
// a.first  : 1
// a.second : 9
```

## max_element / min_element

```cpp
// 이 함수는 iterator를 반환한다.
int M = *std::max_element(v.begin(), v.end());

int mIndex = std::min_element(v.begin(), v.end()) - v.begin();
```

반환값이 iterator라는 것에 주의.
요소에 하나씩 접근하여 최대/최소를 구하므로 시간복잡도는 O(n)이다.
