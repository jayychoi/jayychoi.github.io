---
title: Null Safety와 Nullable
slug: kotlin-null-safety
created: 2025-04-13 00:44
updated:
description:
category: kotlin
tags:
published: true
---

## Null Safety와 Nullable

자바에서 `NullPointerException`은 흔한 런타임 에러다.
코틀린은 이 에러를 컴파일 시점에서 방지할 수 있도록 설계했다.

코틀린에서는 기본적으로 모든 타입이 null을 허용하지 않는다.
null 값을 사용해야 하는 경우, 반드시 nullable 타입으로 선언해야 한다.

nullable 타입은 타입 뒤에 `?`를 붙여 선언할 수 있다.

```kotlin
// nullable 타입 선언
var name: String? = null

// String과 null 모두 사용 가능
name = "John"
name = null
```

## Nullable 타입에 안전하게 접근하기

nullable 타입이어도 값이 `null`인 상태에서 접근하면 문제가 된다.
그래서 코틀린에서는 nullable 타입에 안전하게 접근할 수 있는 연산자들을 제공한다.

### 안전 호출 연산자 (Safe Call Operator)

nullable 객체의 속성이나 메서드에 접근할 때는 `?.`를 사용한다.
객체가 `null`일 경우 표현식이 `null`이 된다.

````kotlin
```kotlin
val name: String? = null

// name == null : null 반환
// name != null : name.length 반환
val length: Int? = name?.length
````

### 엘비스 연산자 (Elvis Operator)

null 대신 기본값을 제공하고 싶을 때 사용한다.

```kotlin
val name: String? = null

// name == null : 0 반환
// name != null : name.length 반환
val length: Int = name?.length ?: 0
```

> 자바스크립트의 `??`와 같은 역할이다.

### 안전한 캐스팅 (Safe Cast)

캐스팅이 실패하면 `null`을 반환한다.

```kotlin
val data: Any = "Hello"

val text: String? = data as? String   // 성공: text = "Hello"

val number: Int? = data as? Int       // 실패: number = null
```

### not-null 단언 연산자 (Not-null Assertion Operator)

값이 절대 `null`이 아님을 컴파일러에게 알린다.
혹시라도 값이 `null`일 수도 있으므로 위험성이 있다.
만일 런타임에서 실제로 `null`일 경우 `NullPointerException`이 발생한다.

```kotlin
val name: String? = null
val length: Int = name!!.length   // NullPointerException 발생
```

## 스마트 캐스트 (Smart Cast)

코틀린은 조건문에서 null 체크를 할 경우, 해당 블럭 안에서는 자동으로 not-null로 취급한다.

```kotlin
val name: String? = null

if (name != null) {
  // 이 블럭 안에서는 name은 String으로 취급한다

  return name.length    // .length로 바로 접근 가능 (name?.length를 사용하지 않아도 됨)
}
```
