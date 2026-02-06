---
title:
slug:
created:
updated:
description:
category:
tags:
# published: true
---

# MySQL 테이블 락

## 테이블 락이란?

테이블 락은 MySQL에서 동시성 제어를 위해 사용하는 가장 기본적인 락이다. 여러 세션이 동시에 같은 테이블에 접근할 때, 데이터의 무결성을 보장하기 위해 테이블 전체에 락을 건다.

**테이블 락이 필요한 이유:**

- 데이터 일관성 보장: 여러 클라이언트가 동시에 같은 데이터를 수정하는 것을 방지
- 읽기/쓰기 충돌 방지: 데이터를 읽는 동안 변경되는 것을 방지
- 트랜잭션 처리

하지만 InnoDB를 기본 스토리지 엔진으로 사용하는 지금, 테이블 락의 중요성은 예전만큼 크지 않다. InnoDB는 스토리지 엔진 레벨에서 레코드 기반의 락을 제공하고, MVCC(다중 버전 동시성 제어)를 통해 일반 SELECT는 락 없이도 일관된 읽기가 가능하기 때문이다.

MySQL은 크게 MySQL 엔진 레벨과 스토리지 엔진 레벨로 나뉘는데, 테이블 락은 MySQL 엔진 레벨에서 동작한다. InnoDB를 사용하는 경우, 일반적인 DML(SELECT, INSERT, UPDATE, DELETE)에서 MySQL 엔진은 테이블 락을 사용하지 않고 InnoDB의 레코드 락에 맡긴다. 단, 명시적으로 `LOCK TABLES`를 사용하면 InnoDB 테이블에도 테이블 락이 걸린다.

DDL(ALTER TABLE, DROP TABLE 등)의 경우에는 메타데이터 락(MDL)이 사용된다. 이는 테이블 락과는 별개의 메커니즘으로, 테이블 구조 변경 중에 다른 세션이 해당 테이블에 접근하는 것을 제어한다.

## 테이블 락의 종류

테이블 락은 4종류가 있다.

- READ (공유 락, Shared Lock)
- READ LOCAL
- WRITE (배타 락, Exclusive Lock)
- LOW_PRIORITY WRITE

### READ 락

```sql
LOCK TABLES table_name READ;
```

READ 락이 걸리면 모든 세션이 해당 테이블에 대해 읽기만 가능하고 쓰기는 불가능하다. 락을 건 세션도 마찬가지로 쓰기가 불가능하다. 여러 세션이 동시에 READ 락을 획득하는 것이 가능하기 때문에 공유 락(Shared Lock)으로도 부른다.

### READ LOCAL 락

```sql
LOCK TABLES table_name READ LOCAL;
```

MyISAM에서만 의미가 있는 테이블 락이다. InnoDB에서는 일반 READ 락과 동일하게 동작한다.

READ 락과 유사하지만 다른 세션의 동시 INSERT를 허용한다. 단, 테이블 끝에 추가하는 INSERT만 허용하며 기존 데이터와 충돌하지 않는 경우에만 가능하다.

### WRITE 락

```sql
LOCK TABLES table_name WRITE;
```

락을 건 세션만 읽기/쓰기가 가능하다. 다른 모든 세션은 읽기/쓰기가 불가능하다. 가장 제한적인 락이고, 동시에 하나의 세션만 획득 가능하기 때문에 배타 락(Exclusive Lock)으로도 부른다.

### LOW_PRIORITY WRITE 락

```sql
LOCK TABLES table_name LOW_PRIORITY WRITE;
```

일반 WRITE 락과 동일한 배타적 특성을 가지지만, 락 획득 우선순위가 다르다. 이 락을 요청하면 대기 큐에 있는 READ 락 요청들이 먼저 처리된 후에야 WRITE 락을 획득한다. 쓰기 작업의 우선순위를 읽기보다 낮추기 때문에 LOW_PRIORITY이다.

읽기 위주의 시스템에서 쓰기 작업이 읽기를 지연시키는 것을 방지할 때 유용하다.

## 락 호환성

두 개의 락이 동시에 존재할 수 있는지를 나타내는 호환성 매트릭스

|                | READ 요청        | WRITE 요청  |
| -------------- | ---------------- | ----------- |
| **READ 보유**  | 호환 (동시 가능) | 충돌 (대기) |
| **WRITE 보유** | 충돌 (대기)      | 충돌 (대기) |

## LOCK TABLES 문법

### 기본 문법

```sql
LOCK TABLES
    table_name [AS alias] {READ [LOCAL] | [LOW_PRIORITY] WRITE}
    [, table_name [AS alias] {READ [LOCAL] | [LOW_PRIORITY] WRITE}] ...
```

### 다중 테이블 락

여러 테이블에 동시에 락을 걸 수 있다:

```sql
LOCK TABLES
    employees READ,
    departments WRITE,
    salaries READ;
```

필요한 모든 테이블을 한 번의 `LOCK TABLES` 문으로 잠가야 한다. 새로운 `LOCK TABLES`를 실행하면 기존 락은 자동으로 해제된다.

### 별칭 사용 시 주의

별칭을 사용할 경우, 별칭으로 락을 걸어야 한다:

```sql
LOCK TABLES employees AS e READ;

SELECT * FROM employees AS e;  -- 성공
SELECT * FROM employees;       -- 실패! 락이 'e'에만 걸림
```

### 락 해제

```sql
UNLOCK TABLES;
```

락이 자동으로 해제되는 경우:

- 세션 종료
- 새로운 `LOCK TABLES` 실행
- `START TRANSACTION` 실행 (암시적 UNLOCK)

## 테이블 락의 동작 방식

모든 테이블은 항상 락 없음, READ 락, WRITE 락 중 하나의 상태에 있다. READ 락은 다른 READ 락과 동시에 존재할 수 있지만, 그 외의 조합은 전부 대기해야 한다.

### 락 큐

각 테이블은 두 가지를 관리한다:

1. 현재 락을 보유하고 있는 세션들
2. 락을 요청하고 대기 중인 세션들의 큐

### 락 요청 처리 흐름

락 요청이 들어오면 현재 락 상태에 따라 결과가 결정된다.

#### 락이 없는 경우

락이 없다면 READ 락이든 WRITE 락이든 즉시 획득한다.

#### READ 락이 걸린 경우

**새로운 READ 요청:** 대기 큐에 WRITE 요청이 있는지 여부에 따라 동작이 달라진다.

- WRITE 요청이 없다면 새 요청이 즉시 READ 락을 획득한다.
- WRITE 요청이 있다면 새 요청은 대기한다.

이는 WRITE 락 요청의 기아(Starvation)를 방지하기 위해서이다. 만약 WRITE가 대기 중인데 새로운 READ를 먼저 처리한다면, READ가 계속 들어올 경우 WRITE는 영원히 대기하게 된다.

**새로운 WRITE 요청:** 대기 큐에 들어간다.

#### WRITE 락이 걸린 경우

WRITE 락이 걸린 상태에서는 모든 요청이 대기 큐에 들어간다.

### 락 해제 시 처리 흐름

현재 락 보유자가 락을 해제하면, 대기 큐의 요청들이 순서대로 처리된다:

1. 락 보유자가 모두 사라지면 대기 큐 선두의 요청이 락을 획득한다.
2. 선두가 READ 락이면, 연속된 READ 요청들도 함께 락을 획득한다. 단, 중간에 WRITE 요청이 있으면 그 뒤의 READ는 대기한다.
3. 선두가 WRITE 락이면, 해당 세션만 락을 획득하고 나머지는 계속 대기한다.

### 다중 테이블 락과 데드락 방지

여러 테이블에 락을 걸 때, MySQL은 내부적으로 테이블들을 정해진 순서로 정렬한 뒤 순서대로 락을 획득한다. 이렇게 하면 데드락을 방지할 수 있다.

예를 들어, **두 세션이 거의 동시에 요청**했을 때 정렬 없이 요청 순서대로 획득한다면:

```
세션1: LOCK TABLES A WRITE, B WRITE
세션2: LOCK TABLES B WRITE, A WRITE

시간 순서:
1: 세션1이 A 테이블 락 획득
2: 세션2가 B 테이블 락 획득
3: 세션1이 B 테이블 락 요청 -> 대기 (세션2가 보유 중)
4: 세션2가 A 테이블 락 요청 -> 대기 (세션1이 보유 중)
-> 데드락
```

정렬된 순서로 획득하면:

```
세션1: LOCK TABLES A WRITE, B WRITE → 내부 정렬 후 A, B 순서로 획득
세션2: LOCK TABLES B WRITE, A WRITE → 내부 정렬 후 A부터 시도, 세션1이 A를 보유 중이므로 대기

시간 순서:
1: 세션1이 A 테이블 락 획득
2: 세션2가 A 테이블 락 요청 -> 대기 (세션1이 보유 중)
3: 세션1이 B 테이블 락 획득
4: 세션1의 작업이 끝나고 UNLOCK
5: 세션2가 A 테이블 락 획득
6: 세션2가 B 테이블 락 획득
7: 세션2의 작업이 끝나고 UNLOCK
```

`LOCK TABLES`는 요청한 모든 테이블의 락을 획득해야만 반환된다. 따라서 원자적으로 여러 테이블에 락을 걸 수 있다.
