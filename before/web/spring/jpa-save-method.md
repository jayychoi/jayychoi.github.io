---
title: '[Spring Data JPA] 저장(save)'
slug: jpa-save-method
created: 2025-09-17
updated:
description:
category: spring
tags:
published: true
---

## save 메서드

엔티티의 저장은 `CrudRepository.save()`를 사용한다. `save()`는 다음과 같은 동작을 한다.

1. 전달된 엔티티가 **새로운 엔티티인지, 아니면 데이터베이스에 존재하는 엔티티인지** 판단한다.
2. 새로운 엔티티일 경우, `entityManager.persist()`를 호출한다.
3. 존재하는 엔티티일 경우, `entityManager.merge()`를 호출한다.

`persist()`는 전달된 엔티티 객체를 영속성 컨텍스트에 등록하고, 트랜잭션이 커밋되거나 컨텍스트가 플러시될 때 데이터베이스에 INSERT SQL을 실행한다.

`merge()`는 전달된 엔티티 객체를 가지고 영속성 컨텍스트와 상호작용한다.
먼저, 영속성 컨텍스트에 ID값이 동일한 엔티티가 관리되고 있는지 확인한다.
영속성 컨텍스트에 있다면 해당 엔티티로 작업을 한다.
없다면 데이터베이스에서 조회를 시도한다.

데이터베이스에 데이터가 있다면 영속성 컨텍스트로 읽어와서 전달된 엔티티 객체로 업데이트하고, 나중에 트랜잭션 커밋 시점에 UPDATE SQL을 실행한다.
데이터베이스에도 데이터가 없다면 전달된 엔티티 객체를 새롭게 영속성 컨텍스트에 등록한다. 나중에 트랜잭션 커밋 시점에는 INSERT SQL이 실행된다.

이 때, 새로운 엔티티인지 판단(`persist()`를 호출할지 `merge()`를 호출할지 결정)하는 로직이 `isNew()` 메서드이다.

```java
@Repository
@Transactional(readOnly = true)
public class SimpleJpaRepository<T, ID> implements JpaRepositoryImplementation<T, ID> {
  ...

  @Transactional
  public <S extends T> S save(S entity) {
    Assert.notNull(entity, "Entity must not be null");
    if (this.entityInformation.isNew(entity)) {
      this.entityManager.persist(entity);
      return entity;
    } else {
      return (S)this.entityManager.merge(entity);
    }
  }
}
```

> *주의할 점은, `isNew()` 메서드는 Spring Data JPA와 다른 Spring Data에서 다르게 동작한다.*

## 엔티티 상태 감지 전략 (Spring Data Commons)

[Spring Data Commons - Entity State Detection Strategies](https://docs.spring.io/spring-data/commons/reference/is-new-state-detection.html)

| 옵션 | 설명 |
| --- | --- |
| `@Id` 속성 검사 (default) | `@Id`가 붙은 속성의 값이 `null`이거나 원시 타입 `0`일 경우 새 엔티티로 판단 |
| `@Version` 속성 검사 | `@Version`이 붙은 속성의 값이 `null`이거나 원시 타입 `0`일 경우 새 엔티티로 판단 |
| `Persistable` 구현 | 엔티티가 인터페이스 `Persistable`을 구현하면 엔티티의 `isNew()` 메서드에 판단을 위임 |

```java title="AbstractEntityInformation.java"
package org.springframework.data.repository.core.support;

import org.springframework.data.repository.core.EntityInformation;
import org.springframework.util.Assert;

public abstract class AbstractEntityInformation<T, ID> implements EntityInformation<T, ID> {

	private final Class<T> domainClass;

	public AbstractEntityInformation(Class<T> domainClass) {

		Assert.notNull(domainClass, "Domain class must not be null");

		this.domainClass = domainClass;
	}

	@Override
	public boolean isNew(T entity) {

		ID id = getId(entity);
		Class<ID> idType = getIdType();

		if (!idType.isPrimitive()) {
			return id == null;
		}

		if (id instanceof Number n) {
			return n.longValue() == 0L;
		}

		throw new IllegalArgumentException(String.format("Unsupported primitive id type %s", idType));
	}

	@Override
	public Class<T> getJavaType() {
		return this.domainClass;
	}
}
```

## 엔티티 상태 감지 전략 (Spring Data JPA)

[Spring Data JPA - Entity State Detection Strategies](https://docs.spring.io/spring-data/jpa/reference/data-commons/is-new-state-detection.html)

### 전략1: Version 속성과 Id 속성 검사 (default)

1. `@Version`이 붙은 속성을 찾는다.
    - non-primitive 타입인 경우
        - 값이 `null`인 경우: 새 엔티티로 판단
        - 값이 `null`이 아닌 경우: 기존 엔티티로 판단
    - primitive 타입인 경우: Spring Data Commons의 전략을 사용
2. `@Version`이 없다면 `@Id`가 붙은 속성을 찾는다.
    - 이후 로직은 1번과 동일

```java title="JpaMetamodelEntityInformation.java"
package org.springframework.data.jpa.repository.support;

public class JpaMetamodelEntityInformation<T, ID> extends JpaEntityInformationSupport<T, ID> {
  ...

  @Override
	public boolean isNew(T entity) {

		if (versionAttribute.isEmpty()
				|| versionAttribute.map(Attribute::getJavaType).map(Class::isPrimitive).orElse(false)) {
			return super.isNew(entity);
		}

		BeanWrapper wrapper = new DirectFieldAccessFallbackBeanWrapper(entity);

		return versionAttribute.map(it -> wrapper.getPropertyValue(it.getName()) == null).orElse(true);
	}
}
```

### 전략2: Persistable 구현

Spring Data Commons와 동일하다.

### 전략3: 커스텀 EntityInformation 구현

Spring Data Commons와 동일하다.
