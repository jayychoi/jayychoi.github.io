---
title: final
slug: java-final
created: 2025-03-31 21:54
updated:
description:
category: java
tags:
published: true
---

## final이란?

자바에서 `final`은 한 번 할당되면 값이 변경될 수 없음을 의미하는 키워드다.
변수, 메서드, 클래스에 적용할 수 있으며 각각 다른 의미를 가진다.

## final 변수

final 변수는 상수를 선언할 때 사용한다.
한 번 값이 할당되면 이후에는 변경할 수 없다.

```java
final int MAX_SPEED = 120; // 선언과 동시에 초기화
// MAX_SPEED = 150;        // 컴파일 오류 발생

final int MIN_SPEED;       // 선언만 하고
MIN_SPEED = 0;             // 나중에 초기화 가능 (한 번만)
// MIN_SPEED = 10;         // 두 번째 할당 시도는 컴파일 오류 발생
```

## final 매개변수

메서드의 매개변수에 final을 사용하면 메서드 내에서 해당 매개변수의 값을 변경할 수 없다.

```java
void process(final int value) {
    // value = 10; // 컴파일 오류 발생
    System.out.println(value);
}
```

## final 메서드

final 메서드는 한 번 정의되면 자식 클래스에서 오버라이드(재정의)할 수 없다.
부모 클래스에서 정의한 메서드의 동작을 자식 클래스가 변경하지 못하도록 할 때 사용한다.

```java
class Parent {
    final void showInfo() {
        System.out.println("이 메서드는 오버라이드할 수 없다");
    }
}

class Child extends Parent {
    // void showInfo() { } // 컴파일 오류 발생
}
```

## final 클래스

final 클래스는 상속될 수 없다.
다른 클래스가 이 클래스를 확장할 수 없으므로 보안이나 불변성이 중요한 경우에 사용한다.
대표적인 예로 `String` 클래스가 있다.

```java
final class ImmutableClass {
    // 클래스 내용
}

// class SubClass extends ImmutableClass { } // 컴파일 오류 발생
```

## final과 참조 타입

참조 타입 변수에 final을 사용할 경우, 참조하는 객체를 다른 객체로 변경할 수 없지만, 객체 내부의 상태는 변경할 수 있다.

```java
class Data {
  int value;
}

final Data a = new Data();
// a = new Data(); // 컴파일 오류 발생

// 객체 내부의 값은 변경 가능
a.value = 5;
a.value = 10;
```

## 상수 선언에서의 final

상수를 선언할 때는 보통 `static final`을 사용한다.
이렇게 하면 클래스 로딩 시 한 번만 메모리에 할당되며, 변경되지 않는 값이 된다.

```java
public class Constants {
    public static final double PI = 3.14159;
    public static final String APP_NAME = "My App";
}
```

## final의 성능 최적화

JVM은 final 키워드가 붙은 변수와 메서드를 최적화할 수 있다.
컴파일러는 final 변수의 값을 알고 있기 때문에 인라인화하거나 다른 최적화를 수행할 수 있다.

## final 사용의 장점

1. 코드의 안정성 향상
2. 의도하지 않은 변경 방지
3. 스레드 안전성 개선
4. JVM 최적화 가능
5. 설계 의도를 명확히 표현
