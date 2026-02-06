---
title: "변수"
slug: kotlin-variable
created: 2025-04-11
category: kotlin
tags: []
---

## 변수 선언

코틀린에서는 두 가지 변수 선언 키워드가 있다.

- `val`: 불변(immutable) 변수 (자바의 `final`과 유사)
- `var`: 가변(mutable) 변수

```kotlin
val variable: Type = value
var variable: Type = value

val name: String = "My Name"
var age: Int = 30
```

## 타입 추론

초기값이 있으면 타입을 명시적으로 선언하지 않아도 알아서 타입을 추론한다.

```kotlin
val name = "My Name"  // String
var count = 10        // Int
val isValid = true    // Boolean
val pi = 3.14         // Double
```

## 자바와 코틀린의 변수 비교

| 자바                    | 코틀린                      | 설명                   |
| ----------------------- | --------------------------- | ---------------------- |
| `final int x = 5;`      | `val x = 5`                 | 불변 변수              |
| `int x = 5;`            | `var x = 5`                 | 가변 변수              |
| `String name;`          | `lateinit var name: String` | 나중에 초기화하는 변수 |
| `Integer count = null;` | `var count: Int? = null`    | nullable 변수          |
