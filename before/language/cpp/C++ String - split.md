---
title: '[C++]문자열 split 함수 구현'
slug: cpp-string-split
created: 2024-03-29
updated:
description:
category: cpp
tags: [cpp, algorithm, string, split]
published: true
---

## stringstream 사용

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

vector<string> split(string input, char delim);

int main() {
  string line = "This is line.";
  vector<string> retult = split(line, ' ');
  for (int i = 0; i < result.size(); i++)
    cout << result[i] << ' ';
}

vector<string> split(string input, char delim) {
  vector<string> result;
  stringstream ss(input);
  string temp;

  while (getline(ss, temp, delim))
    result.push_back(temp);

  return result;
}
```
