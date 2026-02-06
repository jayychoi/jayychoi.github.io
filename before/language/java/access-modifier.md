---
title: 접근 제어자
slug: java-access-modifier
created: 2025-03-31 20:32
updated:
description:
category: java
tags:
published: true
---

## 접근 제어자란?

접근 제어자는 클래스, 메서드, 변수 등의 접근 범위를 제한하는 키워드다.
자바에서는 네 가지 접근 제어자를 제공한다.

- public
- protected
- default (package-private)
- private

## public

가장 개방적인 접근 제어자다.

- **접근 범위**: 어디서든 접근 가능하다.
- **사용 위치**: 클래스, 메서드, 변수, 생성자
- **특징**: 다른 패키지에서도 자유롭게 접근할 수 있다.

```java
public class Example {
    public int value;

    public void method() {
        // 코드 구현
    }
}
```

## protected

상속 관계에서 중요한 역할을 하는 접근 제어자다.

- **접근 범위**: 같은 패키지 내 또는 다른 패키지의 자식 클래스에서 접근 가능하다.
- **사용 위치**: 메서드, 변수, 생성자 (클래스에는 사용 불가)
- **특징**: 상속을 통한 확장성을 보장하면서도 일정 수준의 캡슐화를 제공한다.

```java
public class Parent {
    protected int value;

    protected void method() {
        // 코드 구현
    }
}

class Child extends Parent {
    void example() {
        value = 10; // 접근 가능
        method(); // 접근 가능
    }
}
```

## default (package-private)

자바에서 접근 제어자를 명시하지 않을 때 적용되는 기본 접근 제어자다.

- **접근 범위**: 같은 패키지 내에서만 접근 가능하다.
- **사용 위치**: 클래스, 메서드, 변수, 생성자
- **특징**: 명시적인 키워드가 없으며, 아무것도 지정하지 않으면 default 접근 제어자가 적용된다.

```java
class Example { // default 접근 제어자
    int value; // default 접근 제어자

    void method() { // default 접근 제어자
        // 코드 구현
    }
}
```

## private

가장 제한적인 접근 제어자다.

- **접근 범위**: 해당 클래스 내에서만 접근 가능하다.
- **사용 위치**: 메서드, 변수, 생성자 (클래스에는 내부 클래스가 아닌 경우 사용 불가)
- **특징**: 완전한 캡슐화를 제공하며, 클래스 내부 구현을 외부로부터 숨긴다.

```java
public class Example {
    private int value;

    private void method() {
        // 코드 구현
    }

    public void publicMethod() {
        value = 10; // 같은 클래스 내부에서는 접근 가능
        method(); // 같은 클래스 내부에서는 접근 가능
    }
}
```

## 접근 제어자의 접근 범위 요약

| 접근 제어자 | 같은 클래스 | 같은 패키지 | 다른 패키지의 자식 클래스 | 다른 패키지 |
| ----------- | ----------- | ----------- | ------------------------- | ----------- |
| public      | ✅          | ✅          | ✅                        | ✅          |
| protected   | ✅          | ✅          | ✅                        | ❌          |
| default     | ✅          | ✅          | ❌                        | ❌          |
| private     | ✅          | ❌          | ❌                        | ❌          |

## 활용 예시

### 캡슐화의 구현

```java
public class Person {
    private String name; // 외부에서 직접 접근 불가
    private int age;     // 외부에서 직접 접근 불가

    // 게터와 세터를 통한 제어된 접근
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        if (age >= 0) { // 유효성 검사
            this.age = age;
        }
    }
}
```

### 상속과 접근 제어

```java
public class Shape {
    protected double area; // 자식 클래스에서 접근 가능

    protected void calculateArea() {
        // 기본 구현
    }

    public double getArea() {
        return area;
    }
}

public class Circle extends Shape {
    private double radius;

    public Circle(double radius) {
        this.radius = radius;
        calculateArea(); // protected 메서드 접근 가능
    }

    @Override
    protected void calculateArea() {
        area = Math.PI * radius * radius; // protected 변수 접근 가능
    }
}
```

## 주의사항

1. 클래스 레벨에서는 public과 default만 사용할 수 있다. (내부 클래스 제외)
2. 인터페이스의 모든 메서드는 기본적으로 public abstract다.
3. 인터페이스의 모든 변수는 기본적으로 public static final이다.
4. 접근 제어자를 적절히 사용하면 코드의 안정성과 유지보수성이 향상된다.
