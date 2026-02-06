---
title: "[C++]Stack(스택)"
slug: cpp-stack
created: 2024-03-18
category: cpp
tags: [cpp, algorithm, stack]
---

## 헤더

```cpp
#include <stack>
```

## 선언

```cpp
stack<int> s;
```

## 함수

| 함수  | 설명                                    |
| ----- | --------------------------------------- |
| push  | 맨 위에 값을 추가한다.                  |
| pop   | 맨 위의 값을 삭제한다.                  |
| top   | 맨 위의 값을 반환한다.                  |
| size  | 스택에 들어있는 요소의 개수를 반환한다. |
| empty | 스택이 비어있는지 확인한다.             |
| swap  | 두 스택의 내용을 서로 바꾼다.           |

### push

```cpp
void push(value_type&& value);

stack.push(value);
```

### pop

```cpp
void pop();

stack.pop();
```

### top

```cpp
reference top();

value_type& value = stack.top();
```

### size

```cpp
size_type size() const;

int size = stack.size();
```

### empty

```cpp
bool empty() const;

bool isEmpty = stack.empty();
```

### swap

```cpp
void swap(stack& other);
```

## 스택 초기화

```cpp
stack s;

while (!s.empty()) s.pop();
```

## 참고

- https://en.cppreference.com/w/cpp/container/stack
