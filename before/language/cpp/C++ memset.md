---
title: '[C++]memset()'
slug: cpp-memset
created: 2024-03-12
updated:
description:
category: cpp
tags: [cpp, algorithm, memset]
published: true
---

[cpp reference][1]

## 헤더

```cpp
#include <memory.h>
#include <string.h>
```

## 사용법

```cpp
memset(시작주소, 입력값, 개수);
```

`memset`은 바이트 단위로 값을 변경한다. 그래서 입력값에 0이나 -1이 아닌 다른 정수를 넣을 수 없다. `char`로는 잘 동작한다.

## 참고

[[C++ fill, fill_n]]

[1]: https://en.cppreference.com/w/cpp/string/byte/memset
