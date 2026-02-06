---
title: 반복문
slug: java-loop
created: 2025-03-28 23:41
updated:
description:
tags:
category: java
published: true
---

## while문

```java
while ( condition ) {
  ...
}
```

## do-while문

```java
do {
  ...
} while ( condition );
```

## for문

```java
for (int i = 0; i < n; i++) {
  ...
}
```

## for-each문

```java
for (type var : arr | collection) {
  ...
}
```

## 레이블(label)

레이블은 중첩된 반복문에서 특정 반복문을 대상으로 break 또는 continue를 적용할 때 사용한다.

```java
outerLoop: for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (i == 1 && j == 1) {
            break outerLoop;  // 바깥쪽 반복문까지 종료
        }
        System.out.println("i = " + i + ", j = " + j);
    }
}
```
