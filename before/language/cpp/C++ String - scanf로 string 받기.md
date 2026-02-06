---
title: '[C++]scanf()로 string 입력받기'
slug: cpp-scanf-string
created: 2024-03-14
updated:
description:
category: cpp
tags: [cpp, algorithm, scanf, string]
published: true
---

`scanf`로는 `string` 변수에 바로 저장할 수 없다.
먼저 `char`배열에 `scanf`로 저장한 뒤 `string` 변수에 할당해야 한다.

```cpp
char input[100];
string str;

scanf("%s", input);
str = input;
```
