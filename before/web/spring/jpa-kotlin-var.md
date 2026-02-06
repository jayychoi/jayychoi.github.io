---
title: "[JPA] Kotlin에서의 Entity"
slug: jpa-kotlin-entity
created: 2025-04-21 23:43
updated:
description:
category: spring
tags:
published: true
---

[Spring Guide - Spring Boot and Kotlin](https://spring.io/guides/tutorials/spring-boot-kotlin)

## val과 var

코틀린에서 엔티티를 정의할 때는 `data class`가 아닌 일반 `class`를 사용하고, `val`이 아닌 `var`를 사용한다.

### 1. 프록시 생성 메커니즘

JPA는 엔티티 객체에 대한 지연 로딩(lazy loading)을 구현하기 위해 프록시 객체를 생성한다.
이 프록시 객체는 원본 클래스를 상속하여 생성되는데, 원본 클래스(엔티티 클래스)의 속성이 `val`이면 하위 클래스(프록시)에서 해당 속성의 값을 설정할 수 없어 프록시 생성이 불가능하다.

### 2. 기본 생성자 필요

JPA는 엔티티를 인스턴스화할 때 기본 생성자를 사용한다.
그런데 기본 생성자의 조건은 파라미터가 하나도 없어야 한다.
하지만 `data class`에 속성이 `val`로 선언되어 있으면, 모든 값을 생성 시점에 제공해야 하므로 기본 생성자를 만들 수 없다.

### 3. 상태 변경 필요

JPA는 영속성 컨텍스트(persistence context)에서 엔티티의 상태를 관리하면서 필요에 따라 속성값을 변경한다.
`val` 속성은 한 번 초기화하면 값을 변경할 수 없어 JPA와 충돌할 수 있다.

## 기본 생성자


## Primary Key의 타입과 기본값

nullable 타입으로 정의하고 기본값은 `null`로 설정해야 한다.

그냥 Spring Data에서는 `0`도 가능하지만, Spring Data JPA에서는 반드시 `null`을 사용해야 한다.

