---
title: '[C++]unique() - 중복 제거'
slug: cpp-unique
created: 2024-05-22
updated:
description:
category: cpp
tags: [cpp, algorithm, unique]
published: true
---

`unique` 함수는 벡터에서 중복된(버릴) 원소들을 맨 뒤로 옮겨준다.
그리고 버릴 원소들의 시작점을 반복자로 리턴한다.
단, 이 함수는 중복된 원소가 연속적으로 존재할 때에만 작동한다.
따라서 사용 전에 정렬을 반드시 해야 한다.
정렬하지 않고 사용하면, 중복된 원소가 연속적으로 존재하는 부분에서만 중복이 제거되고 그 외에는 중복된 원소가 남아있을 수 있다.

[참고 - cppreference][1]

[1]: https://en.cppreference.com/w/cpp/algorithm/unique
