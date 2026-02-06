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

# MySQL 글로벌 락

## 글로벌 락이란?

글로벌 락은 MySQL에서 제공하는 **가장 범위가 넓은 잠금**이다. MySQL 엔진 레벨의 락으로, MySQL 서버 전체에 영향을 미친다. 글로벌 락이 획득되면 해당 MySQL 서버의 모든 테이블에 대한 변경 작업이 차단된다.

글로벌 락에는 두 종류가 있다.

- 전통적인 글로벌 락 (`FLUSH TABLES WITH READ LOCK`)
- 백업 락 (`LOCK INSTANCE FOR BACKUP`)

## 전통적인 글로벌 락

```sql
-- 글로벌 락 획득
FLUSH TABLES WITH READ LOCK;

-- 작업 수행

-- 락 해제
UNLOCK TABLES;
```

이 락을 획득하면 모든 테이블에 대해 `SELECT`는 가능하지만 DDL과 DML은 모두 차단된다. MySQL 엔진 레벨의 락이기 때문에 스토리지 엔진에 관계없이 해당 MySQL 서버의 모든 테이블에 영향을 미친다.

**내부 동작 과정:**

1. 진행 중인 모든 쿼리와 트랜잭션이 완료될 때까지 대기
2. 글로벌 락 획득
3. 열린 테이블을 모두 닫고 플러시
4. 새로운 쓰기 작업 차단

문제는 락이 걸린 동안 아무런 쓰기 작업도 할 수 없기 때문에 락이 길어질수록 서비스 중단 시간이 길어진다는 것이다.

## 백업 락

```sql
-- 백업 락 획득
LOCK INSTANCE FOR BACKUP;

-- 작업 수행

-- 락 해제
UNLOCK INSTANCE;
```

### 백업 락이 등장한 배경

기존 글로벌 락은 데이터의 일관성을 위해 모든 DML과 DDL을 차단한다. 그래서 백업을 할 경우 서비스가 중단된다. 이전에 주로 사용하던 MyISAM은 트랜잭션을 지원하지 않기 때문에 데이터의 일관성을 위해서는 물리적으로 모든 쓰기를 막아야만 했다.

하지만 InnoDB가 기본 스토리지 엔진이 되면서 트랜잭션을 사용할 수 있게 되었고, DML을 허용하면서도 일관된 백업이 가능해졌다. 그래서 조금 더 가벼운 글로벌 락인 백업 락이 MySQL 8.0부터 도입되었다.

### 백업 락의 특징

백업 락은 DML은 허용하지만 DDL은 차단한다. 추가로 `REPAIR TABLE`, `OPTIMIZE TABLE`, 사용자 관리 등 일부 관리 작업도 차단한다. 이를 통해 서비스를 중단하지 않고도 백업이 가능하다.

**내부 동작 과정:**

1. 백업 락 요청: 진행 중인 DDL이 완료될 때까지 대기
2. 백업 락 획득: DDL 차단 시작 (DML은 계속 허용)
3. 백업 락 해제: DDL 차단 해제

백업 락은 InnoDB의 내부 동작에 전혀 관여하지 않는다. DML 처리, Redo Log 기록, Buffer Pool 관리, Checkpoint(Redo Log를 데이터 파일에 반영) 모두 정상적으로 수행된다. 백업 락은 오직 **DDL만 차단**한다.

### Redo Log 백업의 중요성

백업 락을 획득하더라도 DML은 정상적으로 실행되기 때문에, 데이터 파일을 백업할 때 Redo Log도 반드시 함께 백업해야 한다.

백업 중에도 Checkpoint가 발생하여 Buffer Pool의 Dirty Page가 데이터 파일에 반영된다. 따라서 복사 중인 데이터 파일은 일부는 백업 시작 시점, 일부는 중간 시점의 데이터가 섞인 불완전한 상태가 될 수 있다. 복원 시 Redo Log를 적용해야 일관된 상태로 복구할 수 있다.

**Redo Log 백업 타이밍**

Redo Log는 순환 구조로 동작하기 때문에, 데이터 파일 복사가 끝난 후에 Redo Log를 복사하면 이미 덮어씌워져 유실될 수 있다. 따라서 Redo Log는 데이터 복사와 **동시에** 또는 **이전에** 보존해야 한다.

- **XtraBackup**: 별도 스레드가 Redo Log를 실시간으로 추적하며 복사한다.
- **Redo Log Archiving** (MySQL 8.0.17+): MySQL 서버가 Redo Log를 덮어쓰기 전에 아카이브 디렉토리에 보존한다.

## 백업 락 vs mysqldump --single-transaction

일관된 백업을 위한 두 가지 접근 방식이 있다.

| 항목             | 백업 락                                | mysqldump --single-transaction |
| ---------------- | -------------------------------------- | ------------------------------ |
| 백업 유형        | 물리적 백업 (파일 복사)                | 논리적 백업 (SQL 덤프)         |
| 일관성 보장 방식 | Redo Log 기반 복구                     | MVCC 스냅샷                    |
| DML              | 허용 (현재 데이터에 반영됨)            | 허용 (스냅샷에서 안 보임)      |
| DDL              | 차단                                   | 허용 (충돌 위험)               |
| 사용 도구        | XtraBackup, MySQL Enterprise Backup 등 | mysqldump                      |
| 백업/복원 속도   | 빠름                                   | 느림                           |
| 스토리지 엔진    | 모든 엔진                              | InnoDB 전용                    |

**백업 락**은 "현재를 보면서 구조 변경만 막는" 방식이고, **--single-transaction**은 "MVCC를 활용해 과거 스냅샷을 보는" 방식이다.

## 참고: 글로벌 락 관련 명령어

```sql
-- 대기 중인 잠금 확인
SHOW PROCESSLIST;
SELECT * FROM performance_schema.metadata_locks;
```

| 변수명              | 설명                          |
| ------------------- | ----------------------------- |
| `lock_wait_timeout` | 메타데이터 잠금 대기 시간(초) |
| `read_only`         | 서버 읽기 전용 모드           |
| `super_read_only`   | SUPER 권한 사용자도 읽기 전용 |
