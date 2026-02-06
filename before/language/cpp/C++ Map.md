---
title: '[C++]Map'
slug: cpp-map
created: 2024-05-21
updated: 2025-10-09
description:
category: cpp
tags: [cpp, algorithm, map]
published: true
---

## 선언

```cpp
#include <map>
using namespace std;

map<string, int> m;
```

## map iterator

```cpp
iterator it; // m의 특정 요소라고 가정

pair<const srting, int> pair = *it;

// 키, 값 접근법
auto [key, value] = *it;
it->first; // key
it->second; // value
(*it).first // key
(*it).second // value
```

## 삽입/수정

### 1. operator[]

주의! 키가 있으면 수정, 키가 없으면 자동으로 기본값(0, "", false 등)으로 생성

```cpp
m["k1"] = 100; // 생성
m["k1"] += 10; // 수정
```

### 2. insert()

키가 없는 경우에만 삽입

```cpp
pair<iterator, bool> result = m.insert({"k2", 200});
auto [it, success] = result;
```

### 3. emplace()

성능 최적화용. 복잡한 객체를 저장하거나 성능이 중요할 때 사용.

## 접근/검색

### 1. operator[]

주의! 키가 없어도 자동으로 생성됨

```cpp
int value = m["k3"]; // 0
```

### 2. at()

키가 없으면 예외 발생

```cpp
try {
  int value = m.at["k4"];
} catch (const out_of_range& e) {
  cout << "키 없음";
}
```

### 3. 안전한 접근 - find(), count()

- `find()`: 키가 있으면 iterator, 없으면 `m.end()` 리턴
- `count()`: 키가 있으면 1, 없으면 0 리턴

```cpp
// find
auto it = m.find("k");
if (it != m.end()) {
  auto [key, value] = *it;
  cout << "키: " << key << endl;
  cout << "값: " << value << endl;
} else {
  cout << "키 없음";
}

// count
if (m.count("k") > 0) {
  cout << "키 있음";
} else {
  cout "키 없음";
}
```

## 삭제

```cpp
m.erase("key"); // 키로 삭제
m.clear();      // iterator로 삭제
m.erase(it);    // 전체 삭제
```

## 크기/상태

```cpp
int size = m.size();
bool empty = m.empty();
```

## 순회

```cpp
for (auto& [key, value] : m) { ... }

for (auto it = m.begin(); it != m.end(); it++) {
  auto [key, value] = *it;
  it->first; // key
  it->second; // value
}

for (auto& pair : m) {
  auto [key, value] = pair;
  pair.first; // key
  pair.second; // value
}
```
