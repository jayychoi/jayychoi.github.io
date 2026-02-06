---
title: "[JPA] Entity"
slug: jpa-entity
created: 2025-04-21
category: spring
tags: []
---

[Jakarta Persistence - 2. Entities](https://jakarta.ee/specifications/persistence/3.2/jakarta-persistence-spec-3.2#entities)

## Entity

엔티티는 가벼운 persistent domain object이다.
엔티티는 상속, 다형성 연관관계, 다형성 쿼리를 지원한다.

주로 엔티티 클래스를 정의하여 사용한다.
엔티티 클래스는 보조 클래스를 활용할 수 있는데, 헬퍼 클래스나 엔티티의 상태를 나타내는 클래스 등이 있다.

## Entity Class

엔티티 클래스의 선언은 `@Entity` 어노테이션을 사용한다.
(혹은 XML로 선언할 수도 있다.)

엔티티 클래스의 조건 및 특징은 다음과 같다.

- 최상위 클래스이거나 정적 내부 클래스여야 한다.
- enum, record, interface는 사용할 수 없다.
- 매개변수가 없고 public 또는 protected인 생성자가 있어야 한다. (다른 추가 생성자가 있어도 된다)
- 엔티티 클래스는 final이면 안 된다.
- 엔티티 클래스의 모든 메서드와 persistent 인스턴스 변수는 final이면 안 된다.
- 엔티티는 추상 클래스일 수도 있다.
- 엔티티는 다른 클래스(엔티티 혹은 비엔티티)를 상속받을 수 있다.
- 다른 비엔티티 클래스가 엔티티 클래스를 확장할 수도 있다.

엔티티 클래스의 인스턴스 변수는 반드시 메서드를 사용해서만 접근해야 한다.
외부에서 직접 접근해서는 안된다.
이는 데이터 무결성을 보장하기 위함이다.
객체지향 설계의 중요한 부분이고, 엔티티의 상태가 항상 유효한 상태로 유지되도록 도와준다.

## Persistent Instance Variable

Persistent Instance Variable(영속적 인스턴스 변수)이란 데이터베이스의 컬럼이라고 생각하면 된다.
실제로 데이터베이스에 저장되는 엔티티의 필드를 의미한다.
보통 `@Column` 어노테이션이 붙는다.
아무 어노테이션도 없다면 JPA가 기본 설정으로 매핑이 된다.
(역시 영속적 인스턴스 변수이다)

엔티티를 정의하면서 데이터베이스에 저장되지 않는 필드를 추가할 수도 있다.
이것은 `@Transient`를 붙여서 표현하거나 정적 변수로 선언한다.

엔티티 클래스 조건에서 봤듯이, 영속적 인스턴스 변수는 final로 선언할 수 없다.
그러나 비영속적 인스턴스 변수는 final 선언이 가능하다.
