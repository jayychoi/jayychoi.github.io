---
title: "[C++]fill(), fill_n()"
slug: cpp-fill-filln
created: 2024-03-15
category: cpp
tags: [cpp, algorithm, fill, filln]
---

## fill

### 헤더

```cpp
#include <algorithm>
```

### 정의

```cpp
template<class ForwardIt, class T>
void fill(ForwardIt first, ForwardIt last, const T& value);
```

범위(`first`와 `last`) 안의 원소를 `value`로 채운다.

## fill_n

### 헤더

```cpp
#include <algorithm>
```

### 정의

```cpp
template<class OutputIt, class Size, class T>
OutputIt fill_n(OutputIt first, Size count, const T& value);
```

`first`부터 `count`개의 원소를 `value`로 채운다.

## n차원 배열 채우기

```cpp
int d2[a][b];
int d3[a][b][c];
int d4[a][b][c][d];

int value = 1;

// fill
fill(&d2[0][0], &d2[0][0]+(a*b), value);
fill(&d3[0][0][0], &d3[0][0][0]+(a*b*c), value);
fill(&d4[0][0][0][0], &d4[0][0][0][0]+(a*b*c*d), value);
fill(&d4[0][0][0][0], &d4[0][0][0][0]+sizeof(d4), value);

// fill_n
fill_n(&d2[0][0], a*b, value);
fill_n(&d3[0][0][0], a*b*c, value);
fill_n(&d4[0][0][0][0], a*b*c*d, value);
fill_n(&d4[0][0][0][0], sizeof(d4), value);
```

> 배열 전체를 채운다면 개수(`a*b*c...`) 대신 `sizeof(d2)`로 사용할 수 있다.
