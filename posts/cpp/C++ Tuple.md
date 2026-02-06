---
title: "[C++]Tuple(튜플)"
slug: cpp-tuple
created: 2024-03-16
category: cpp
tags: [cpp, algorithm, tuple]
---

## 헤더

```cpp
#include <tuple>
```

## 선언

```cpp
tuple<int, string, char> t1(20, "hello", 'c');

tuple<int, string, char> t2;
t2 = make_tuple(30, "world", 'd');
```

## 접근

```cpp
int a = get<0>(t1);
string b = get<1>(t1);
char c = get<2>(t1);
```

## 분해

```cpp
int x;
string y;
char z;

tie(x, y, z) = t2;
// x = 30, y = "world", z = 'd'
```
