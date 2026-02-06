---
title: "[C++]iota() - Python의 range같은 함수"
slug: cpp-iota
created: 2024-04-15
category: cpp
tags: [cpp, algorithm, iota, range]
---

[cpp reference][1]

주어진 범위 안에 특정 값부터 시작해서 1씩 증가하는 값을 채우는 함수

```cpp
// value부터 1씩 증가하는 값으로 채운다.
void iota(ForwardIt first, ForwardIt last, T value)
{
    for (; first != last; ++first, ++value)
        *first = value;
}
```

## 사용법

```cpp
list<int> l(10);
iota(l.begin(), l.end(), 0);
// l = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}

vector<int> v(5);
iota(v.begin(), v.end(), 11);
// v = {11, 12, 13, 14, 15}

int arr[5];
iota(arr, arr+5, 1);
// arr = {1, 2, 3, 4, 5}
```

## 참고

[generate][2]

[1]: https://en.cppreference.com/w/cpp/algorithm/iota
[2]: https://en.cppreference.com/w/cpp/algorithm/generate
