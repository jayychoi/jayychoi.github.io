---
title: 조건문
slug: java-conditional-statement
created: 2025-03-28 22:55
updated:
description:
category: java
tags:
published: true
---

## if문

```java
if ( condition ) {
  ...
} else if ( condition ) {
  ...
} else {
  ...
}
```

## switch문

```java
switch ( expression ) {
  case value1:
    ...
  case value2:
    ...
  case value3:
    ...
  default:
    ...
}
```

**Java switch문에서 사용 가능한 타입**

- 기본 정수형: byte, short, char, int
- 래퍼 클래스: Byte, Short, Character, Integer
- 열거형(enum)
- String (Java 7부터)

## 향상된 switch 표현식(Java 14+)

`->`를 사용해서 switch문의 case를 표현할 수 있다.
단, 이 경우에는 switch문은 함수처럼 작동하며 반드시 값을 반환해야 한다.
switch문에서 값을 반환하기 위해 사용하는 키워드는 `yield`이다.
일반 함수에서의 `return`과 같다.

```java
int a = switch ( expression ) {
  case value1 -> 1;
  case value2 -> 2;
  case value3 -> {
    yield 3;
  }
  default -> {
    yield 4;
  }
}
```

**특징**

- fall-through가 발생하지 않는다.
- 반드시 값을 반환해야 한다.
- 한 케이스에 여러 값을 쉼표로 묶어 표현할 수 있다.

## 삼항 연산자

`? :`
