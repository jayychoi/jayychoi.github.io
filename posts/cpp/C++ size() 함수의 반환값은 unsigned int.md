---
title: "[C++]size() 함수의 주의점"
slug: cpp-size-return-type
created: 2024-05-30
category: cpp
tags: [cpp, algorithm, size]
---

일반적인 상황에서는 괜찮지만 `v.size() - 1`처럼 뺄셈이 들어갈 때는 `unsigned`라는 점이 문제를 일으킨다. 만약 `v`의 `size()`가 `0`이라면 `1`을 뺄 때 오버플로우가 발생하여 `UNSIGNED_INT_MAX`의 값으로 바뀐다.
따라서 뺄셈이 들어가고, `size`가 `0`이 될 가능성이 있을 때는 반드시 `(int)v.size() - 1` 이렇게 강제 형변환을 해줘야 한다.
