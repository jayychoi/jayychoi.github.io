---
title: "순열과 조합"
slug: cpp-combination-permutation
created: 2024-03-13
category: cpp
tags: []
---

## 조합 (nCr)

1. `mask`를 준비한다.
2. 뽑는 r개는 0으로, 뽑지 않는 나머지(n-r)개는 1로 설정한다.
3. `mask`를 오름차순으로 정렬한다.
4. `next_permutation`에 `mask`를 넣으면서 0인 부분을 출력한다.

```cpp
// # next_permutation
int n, r;

// num[n] = {1, 2, 3, 4, ..., n}
int num[n];
for (int i = 1; i <= n; i++)
	num[i] = i;

// mask[n] = {0, 0, 0, ..., 1, 1}
int mask[n];
for (int i = 0; i < r; i++)
	mask[i] = 0;
for (int i = r; i < n; i++)
	mask[i] = 1;

// print
do {
	for (int i = 0; i < n; i++)
		if (num[i] == 0)
			cout << num[i] << ' ';
	cout << '\n';
} while (next_permutation(num, num+n));
```

> `mask`에서 뽑는 항을 1로 설정하고, 내림차순으로 정렬한 뒤, `prev_permutation`을 사용할 수도 있다.

## 순열 (nPr)

숫자가 오름차순으로 정렬되어 있을 때, nPr을 사전 순으로 출력하기

1. 배열의 시작부터 r개의 원소를 출력한다.
2. r+1번째부터 n번째까지의 원소를 `reverse`한다.
3. `next_permutation`에 배열 전체(0-n)를 넣는다.
   > 배열에서 앞의 r개의 원소를 출력하고 바로 `next_permutation`을 사용하면, 앞의 r개의 원소는 그대로 있고 r+1부터 n까지의 원소들만 사전순으로 다음 순열이 된다.
   > 그러나 r+1부터 n까지 `reverse`하면 r+1부터 n까지의 범위로 만들 수 있는 가장 마지막 순열로 바뀌게 되고, 바로 다음 순열이 앞의 r개만 봤을 때 다음번에 해당하는 순열로 바뀐다.

```cpp
// # next_permutation
int n, r;

// num[n] = {1, 2, 3, 4, ..., n}
int num[n];

do {
	for (int i = 0; i < r; i++)
		cout << num[i] << ' ';
	cout << '\n';
	reverse(num+r, num+n);
} while (next_permutation(num, num+n));
```
