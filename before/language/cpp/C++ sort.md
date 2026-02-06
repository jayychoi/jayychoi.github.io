---
title: '[C++]sort()'
slug: cpp-sort
created: 2024-03-27
updated:
description:
category: cpp
tags: [cpp, algorithm, sort]
published: true
---

## 사용법

`sort` 함수 내부에 시작점과 끝점의 포인터를 입력한다.

```cpp
int arr[n];
vector<int> v;
...

sort(arr, arr + n);
sort(v.begin(), v.end());
```

`sort`는 기본적으로 오름차순으로 정렬한다. 다른 정렬 방법을 사용하고 싶으면 세 번째 인자로 비교 함수를 넣으면 된다.

```cpp
sort(first_iterator, last_iterator, comparefunc);
```

> 비교 함수는 반드시 앞에 오는 원소일 때 `true`가 반환되어야 한다.

## 내림차순 정렬

`sort`의 세 번째 인자로 비교 함수를 넣어 내림차순으로 정렬할 수 있다.
이 때 비교 함수를 직접 작성하지 않고 기본 제공되는 함수를 이용하면 편리하다.

```cpp
int arr[n];

sort(arr, arr + n, greater<>());
```

> `greater`는 두 값 중 첫번째 값이 클 경우 `true`를 반환하는 함수이다.
