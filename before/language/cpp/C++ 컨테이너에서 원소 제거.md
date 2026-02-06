---
title: '[C++]컨테이너에서 원소 제거하기'
slug: cpp-erase
created: 2024-04-29
updated:
description:
category: cpp
tags:
published: true
---

[참고: stackoverflow - Remove elements of a vector inside the loop][1]

## for loop에서 iterator로 원소 제거

```cpp
Container c; // deque, vector 등의 container
for (auto it = c.begin(); it < c.end(); /* 증가 없음 */) {
  if ( condition ) it = c.erase(it); // 조건에 맞으면 원소 삭제
  else it++; // 조건에 맞지 않으면 다음 원소로 넘어감
}
```

> loop보다 아래의 함수를 이용하는 것을 권장한다.

## `erase`-`remove_if` 사용

```cpp
Container c;
c.erase(
  std::remove_if(
    c.begin(),
    c.end(),
    condition function
  ),
  c.end()
)
```

[remove_if - cplusplus][2]
`remove_if`는 조건에 부합하는 원소들을 전부 컨테이너의 맨 뒤로 보낸다.
결과적으로 앞부분에는 지우지 않을 원소들이 순서가 보장된 상태로 위치하고, 뒷부분에는 지울 원소들이 순서가 보장되지 않은 상태로 위치한다.
그리고 지울 원소들이 있는 위치의 시작점이 되는 포인터를 반환한다.
`erase`는 지울 위치의 시작점을 받아 끝까지 삭제한다.

[1]: https://stackoverflow.com/questions/8628951/remove-elements-of-a-vector-inside-the-loop
[2]: https://cplusplus.com/reference/algorithm/remove_if/
