---
title: '[C++] 맥에서 <bits/stdc++.h> 사용하기'
slug: bits-stdcpp-in-mac
created: 2024-04-09
updated:
description:
category: cpp
tags:
published: true
---

1. 터미널에 `gcc --version`이나 `c++ --version`을 입력하여 설치 경로를 파악한다. (내 경우에는 두 경로가 같았음)
2. 경로가 `/usr/bin`로 끝날텐데 `/usr/include`로 들어가서 `bits`라는 디렉토리를 새로 만든다.
3. `/usr/include/bits`에 `stdc++.h` 파일을 만들고 아래 코드를 붙여넣는다.

```cpp
#ifndef _GLIBCXX_NO_ASSERT
#include <cassert>
#endif
#include <cctype>
#include <cerrno>
#include <cfloat>
#include <ciso646>
#include <climits>
#include <clocale>
#include <cmath>
#include <csetjmp>
#include <csignal>
#include <cstdarg>
#include <cstddef>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>

#if __cplusplus >= 201103L
#include <ccomplex>
#include <cfenv>
#include <cinttypes>
#include <cstdbool>
#include <cstdint>
#include <ctgmath>
#include <cwchar>
#include <cwctype>
#endif

  // C++
#include <algorithm>
#include <bitset>
#include <complex>
#include <deque>
#include <exception>
#include <fstream>
#include <functional>
#include <iomanip>
#include <ios>
#include <iosfwd>
#include <iostream>
#include <istream>
#include <iterator>
#include <limits>
#include <list>
#include <locale>
#include <map>
#include <memory>
#include <new>
#include <numeric>
#include <ostream>
#include <queue>
#include <set>
#include <sstream>
#include <stack>
#include <stdexcept>
#include <streambuf>
#include <string>
#include <typeinfo>
#include <utility>
#include <valarray>
#include <vector>

#if __cplusplus >= 201103L
#include <array>
#include <atomic>
#include <chrono>
#include <condition_variable>
#include <forward_list>
#include <future>
#include <initializer_list>
#include <mutex>
#include <random>
#include <ratio>
#include <regex>
#include <scoped_allocator>
#include <system_error>
#include <thread>
#include <tuple>
#include <typeindex>
#include <type_traits>
#include <unordered_map>
#include <unordered_set>
#endif
```

4. vscode에서 `c_cpp_properties.json`을 열고 `includePath`에 `gcc`/`c++` 경로를 `/usr`까지만 입력한다.
