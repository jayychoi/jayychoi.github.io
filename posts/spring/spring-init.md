---
title: "Spring 프로젝트 만들기"
slug: spring-init
created: 2025-04-03
category: spring
tags: []
---

## Spring Initializr

[Spring Initializr](https://start.spring.io/)에서 만들 수 있다.

2025.04.03. 기준

- Project: Gradle - Groovy
- Language: Java
- Spring Boot: 3.4.4
- Packaging: Jar
- Java: 21 (17 이상 지원)

Dependencies로는 강의에 나온 Spring Web과 Thymeleaf를 선택했다.

선택이 끝나면 `GENERATE` 버튼을 눌러서 프로젝트를 다운받는다.

## 프로젝트 열기

인텔리제이로 프로젝트를 열 때는 `build.gradle` 파일을 선택해서 열어야 한다.
올바른 버전의 JDK가 설치되어 있다면 필요한 것들이 자동으로 설치가 된다.

`build.gradle`을 선택하지 않고 프로젝트 폴더를 열었거나, 올바른 버전의 JDK가 설치되지 않으면 그냥 폴더만 열게 된다.

## 실행

`src/main/java/project-name/HelloSpringApplication.java`를 실행하면 스프링이 시작된다.
기본 포트는 8080이다.

### Gradle 설정

설정에서 Gradle 탭을 열면 `Build and run using`과 `Run tests using` 옵션이 있다.
기본값으로는 Gradle로 선택되어 있는데, Gradle로 실행하면 느린 경우가 있다고 한다.
`IntelliJ IDEA`로 바꿔준다.
