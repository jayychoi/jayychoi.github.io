---
title: "정적 HTML 서빙"
slug: spring-static-html-serving
created: 2025-04-03
category: spring
tags: []
---

## 정적 폴더 사용

[공식 문서 - Welcome Page](https://docs.spring.io/spring-boot/reference/web/reactive.html#web.reactive.webflux.welcome-page)

Spring Boot는 정적 리소스를 위한 기본 설정을 제공한다.
`src/main/resources/static`를 사용하면 된다.

여기에 하위 폴더를 만들어 URL 경로를 구성할 수 있다.

```text
src/main/resources/static/
├── index.html                  # localhost:8080/ 또는 localhost:8080/index.html
├── css/
│   └── style.css               # localhost:8080/css/style.css
├── js/
│   └── script.js               # localhost:8080/js/script.js
├── about/
│   └── index.html              # localhost:8080/about/ 또는 localhost:8080/about/index.html
└── products/
    └── item.html               # localhost:8080/products/item.html
```

## Controller와 View Resolver 활용

컨트롤러와 템플릿 엔진을 사용하면 동적 데이터나 복잡한 URL도 쉽게 처리할 수 있다.
HTML 템플릿은 `src/main/resources/templates`에 저장한다.

```html title="src/main/resources/templates/page1.html"
<p th:text="${message}">hello world page1</p>
```

```html title="src/main/resources/templates/page2.html"
<p th:text="${message}">hello world page2</p>
```

```java title="src/main/java/project-name/Controller.java"
@Controller
public class Controller {

  @GetMapping("/page1")
  public String page1(Model model) {
    model.addAttribute("message", "message for page1");
    return "page1"
  }

  @GetMapping("/page2")
  public String page2(Model model) {
    model.addAttribute("message", "message for page2");
    return "page2"
  }
}
```

컨트롤러에서 `@GetMapping(){:java}`에 전달된 문자열은 URL을 뜻한다.
`/page1`로 접속했을 때 `page1` 메서드가 실행된다.

메서드가 리턴하는 문자열은 템플릿 파일의 이름을 뜻한다.
`page1`을 리턴한다면, `src/main/resources/templates/page1.html`을 돌려준다.
