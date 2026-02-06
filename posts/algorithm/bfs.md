---
title: "BFS 유형"
slug: bfs-types
created: 2025-10-09
category: algorithm
tags: []
---

## 기본 로직

1. 시작점 방문 후 큐에 삽입
2. 큐에서 점을 꺼내고, 이동할 수 있는 좌표 확보
3. 확보한 좌표가 유효한지 확인(배열 내부인지, 이동 가능한지, 이전에 방문했는지)
4. 유효하면 방문 후 큐에 삽입
5. 다시 2번으로(큐가 빌 때까지)

## 준비물

- 탐색 대상 배열
- 방문 확인 배열
- dx, dy
- 큐

## 기본형

한 점에서 시작해서 탐색해나가는 방식

```cpp
#include <bits/stdc++.h>
using namespace std;

// 탐색 대상 배열 - 값이 1이면 이동 가능, 0이면 이동 불가
int arr[n][m];

// 방문 확인 배열 - 방문했으면 1, 안했으면 0
int vis[n][m];

// dx, dy
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int main(void) {
  // 탐색에 사용할 큐
  queue<pair<int, int>> q;

  // 시작점 방문 후 큐에 삽입
  vis[0][0] = 1;
  q.push({0, 0});

  // BFS
  while (!q.empty()) {
    // 큐에서 한 점을 꺼냄
    auto [x, y] = q.front(); q.pop();

    // 꺼낸 점과 인접한 네 점을 방문한 뒤 큐에 삽입
    for (int d : {0, 1, 2, 3}) {
      // 인접한 점의 좌표
      int nx = x + dx[d];
      int ny = y + dy[d];

      // 인접한 점이 유효한지 확인
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue; // 배열을 벗어나면 스킵
      if (vis[nx][ny] || arr[nx][ny] != 1) continue; // 방문했거나 이동할 수 없으면 스킵

      // 인접한 점 방문 후 큐에 삽입
      vis[nx][ny] = 1;
      q.push({nx, ny});
    }
  }
}
```

## 점 A에서 B로 이동 가능한지 확인

탐색이 끝난 후, 방문 확인 배열에서 목표 지점에 방문했는지를 확인한다.

예) (0, 0)에서 (a, b)으로 이동할 수 있는지 확인

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int main (void) {
  queue<pair<int, int>> q;

  vis[0][0] = 1;
  q.push({0, 0});

  while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int d : {0, 1, 2, 3}) {
      int nx = x + dx[d];
      int ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (vis[nx][ny] || arr[nx][ny] != 1) continue;
      vis[nx][ny] = 1;
      q.push({nx, ny});
    }
  }

  if (vis[a][b] == 1) cout << "Success";
  else cout << "Failed";
}
```

## 탐색 면적 계산

큐에서 칸을 하나 꺼낼 때마다 카운트를 증가시킨다.

예) (0, 0)에서 이동할 수 있는 칸의 개수는?

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int cnt = 0; // 칸의 개수 저장

int main (void) {
  queue<pair<int, int>> q;

  vis[0][0] = 1;
  q.push({0, 0});

  while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    cnt++; // 큐에서 꺼내면서 방문한 칸의 개수 추가
    for (int d : {0, 1, 2, 3}) {
      int nx = x + dx[d];
      int ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (vis[nx][ny] || arr[nx][ny] != 1) continue;
      vis[nx][ny] = 1;
      q.push({nx, ny});
    }
  }

  // 방문한 칸 수
  cout << cnt;
}
```

## 덩어리 개수 계산

한 점에서 BFS로 탐색하여 방문한 칸들을 하나의 덩어리로 볼 때, 전체 덩어리 개수는?

모든 칸에 대해 가능한 경우 BFS를 시도하고, 탐색 시작 시 덩어리 카운트를 증가시킨다.

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int cnt = 0; // 덩어리 개수

int main (void) {
  // 모든 칸에 대해 시작점으로 놓고 BFS 탐색
  for (int i = 0; i < n; i++) {
    for (int j = 0; j < m; j++) {
      if (arr[i][j] != 1 || vis[i][j]) continue; // 이동할 수 없는 칸이거나 이미 방문한 칸이면 스킵
      cnt++; // 방문할 수 있다면 바로 덩어리 개수 추가

      // 기존 BFS 로직과 동일
      queue<pair<int, int>> q;
      vis[0][0] = 1;
      q.push({0, 0});
      while (!q.empty()) {
        auto [x, y] = q.front(); q.pop();
        for (int d : {0, 1, 2, 3}) {
          int nx = x + dx[d];
          int ny = y + dy[d];
          if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
          if (vis[nx][ny] || arr[nx][ny] != 1) continue;
          vis[nx][ny] = 1;
          q.push({nx, ny});
        }
      }
    }
  }

  // 총 덩어리 개수
  cout << cnt;
}
```

## 점 A에서 B로 이동할 때 최소 이동 거리

방문 확인 배열에 이동한 칸 수를 저장한다. 현재 점의 방문 확인 배열값에 1을 더해 다음 점에 저장한다.

1. 기존처럼 방문 안 한 칸은 0으로 놓고 시작점 방문 시 1을 저장한 뒤, 이동할 때마다 이전 방문값에서 1을 증가시켜 저장한다.
  단, 이렇게 하면 시작점에서도 한 칸을 이동한 것처럼 보이므로 문제 조건에 맞게 도착점의 값을 조정해야 한다. (1을 뺀다거나)
2. 방문 안 한 칸을 -1로 설정하고, 여기서부터 1씩 증가시켜 저장한다. BFS 시작 시 방문 확인 배열 전체를 -1로 초기화해야 하는 번거로움이 있다.

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int main (void) {
  queue<pair<int, int>> q;

  vis[0][0] = 1;
  q.push({0, 0});

  while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int d : {0, 1, 2, 3}) {
      int nx = x + dx[d];
      int ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (vis[nx][ny] || arr[nx][ny] != 1) continue;
      vis[nx][ny] = vis[x][y] + 1; // 이전 방문값에 1을 증가시켜 저장
      q.push({nx, ny});
    }
  }

  // (a, b)로 가기 위해 이동한 칸 수
  cout << vis[a][b];
}
```

## 여러 시작점에서 퍼져나가는 문제

특정 위치에서 물, 불, 폭탄, 바이러스, 토마토 등이 퍼져나가는 경우, 시작할 때 시작점들을 전부 큐에 넣고 시작한다.

```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int main (void) {
  queue<pair<int, int>> q;

  // 시작점을 전부 큐에 삽입
  vis[a][b] = 1;
  q.push({a, b});
  vis[c][d] = 1;
  q.push({c, d});
  vis[e][f] = 1;
  q.push({e, f});

  while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int d : {0, 1, 2, 3}) {
      int nx = x + dx[d];
      int ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (vis[nx][ny] || arr[nx][ny] != 1) continue;
      vis[nx][ny] = 1;
      q.push({nx, ny});
    }
  }
}
```












```cpp
#include <bits/stdc++.h>
using namespace std;

int arr[n][m];
int vis[n][m];
int dx[4] = {1, -1, 0, 0};
int dy[4] = {0, 0, 1, -1};

int main (void) {
  queue<pair<int, int>> q;

  vis[0][0] = 1;
  q.push({0, 0});

  while (!q.empty()) {
    auto [x, y] = q.front(); q.pop();
    for (int d : {0, 1, 2, 3}) {
      int nx = x + dx[d];
      int ny = y + dy[d];
      if (nx < 0 || ny < 0 || nx >= n || ny >= m) continue;
      if (vis[nx][ny] || arr[nx][ny] != 1) continue;
      vis[nx][ny] = 1;
      q.push({nx, ny});
    }
  }
}
```
