---
title: "[C++]동적할당"
slug: cpp-new
created: 2024-03-10
category: cpp
tags: [cpp, algorithm, new]
---

## 변수 할당

```cpp
T * p = new T;
```

```cpp
int * a = new int(0); // 값을 0으로 할당
```

```cpp
#include <iostream>

using namespace std;

int main() {
  int* p = new int;
  *p = 10;

  cout << *p << endl;

  delete p;
  return 0;
}
```

## 배열 할당

```cpp
int * arr = new int[n];
```

```cpp
#include <iostream>

using namespace std;

int main() {
  int size;
  cin >> size;

  // 배열 동적 할당
  int* list = new int[size];

  // 배열 입력
  for (int i = 0; i < size; i++) {
    cin >> list[i];
  }

  // 배열 출력
  for (int i = 0; i < size; i++) {
    cout << list[i] << endl;
  }

  // 해제
  delete[] list;
  return 0;
}
```
