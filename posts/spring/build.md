---
title: "빌드"
slug: spring-build
created: 2025-04-03
category: spring
tags: []
---

## 빌드

프로젝트 루트 디렉토리에 `gradlew`라는 파일이 있다.
이 파일을 통해 빌드 명령을 실행한다.

```bash
$ ./gradlew build
```

## 빌드 파일 실행

`build/libs`에 가면 빌드된 `.jar` 파일이 있다.
이 파일을 java로 실행한다.

```bash
$ java -jar project-name-0.0.1-SNAPSHOT.jar
```

## 클린

빌드된 파일을 제거할 때 사용한다.

```bash
$ ./gradlew clean
```

이전 빌드 파일을 제거하고 다시 빌드할 수도 있다.

```bash
$ ./gradlew clean build
```
