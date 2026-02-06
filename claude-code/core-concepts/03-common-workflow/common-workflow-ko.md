# 일반적인 워크플로우

> 코드베이스 탐색, 버그 수정, 리팩토링, 테스트 작성 등 일상적인 작업을 위한 단계별 가이드입니다.

이 페이지에서는 일상적인 개발을 위한 실용적인 워크플로우를 다룹니다: 낯선 코드 탐색, 디버깅, 리팩토링, 테스트 작성, PR 생성, 세션 관리 등. 각 섹션에는 자신의 프로젝트에 맞게 활용할 수 있는 예시 프롬프트가 포함되어 있습니다. 상위 수준의 패턴과 팁은 [모범 사례](/en/best-practices)를 참조하세요.

## 새로운 코드베이스 이해하기

### 코드베이스 빠르게 파악하기

새 프로젝트에 합류하여 구조를 빠르게 파악해야 하는 상황을 가정해 보겠습니다.

**1단계: 프로젝트 루트 디렉토리로 이동**

```bash
cd /path/to/project
```

**2단계: Claude Code 시작**

```bash
claude
```

**3단계: 전체적인 개요 요청**

```
> give me an overview of this codebase
```

**4단계: 특정 컴포넌트에 대해 더 깊이 파고들기**

```
> explain the main architecture patterns used here
```

```
> what are the key data models?
```

```
> how is authentication handled?
```

> **팁:**
> * 넓은 질문부터 시작하여 특정 영역으로 좁혀가세요
> * 프로젝트에서 사용되는 코딩 규칙과 패턴에 대해 물어보세요
> * 프로젝트 고유 용어의 용어집을 요청하세요

### 관련 코드 찾기

특정 기능과 관련된 코드를 찾아야 하는 상황을 가정해 보겠습니다.

**1단계: Claude에게 관련 파일 찾기 요청**

```
> find the files that handle user authentication
```

**2단계: 컴포넌트 간 상호작용 이해하기**

```
> how do these authentication files work together?
```

**3단계: 실행 흐름 이해하기**

```
> trace the login process from front-end to database
```

> **팁:**
> * 찾고자 하는 것을 구체적으로 말하세요
> * 프로젝트의 도메인 언어를 사용하세요
> * 해당 언어용 [코드 인텔리전스 플러그인](/en/discover-plugins#code-intelligence)을 설치하면 Claude가 정확한 "정의로 이동" 및 "참조 찾기" 탐색을 수행할 수 있습니다

---

## 효율적인 버그 수정

오류 메시지를 발견하고 원인을 찾아 수정해야 하는 상황을 가정해 보겠습니다.

**1단계: Claude에게 오류 공유**

```
> I'm seeing an error when I run npm test
```

**2단계: 수정 방안 추천 요청**

```
> suggest a few ways to fix the @ts-ignore in user.ts
```

**3단계: 수정 적용**

```
> update user.ts to add the null check you suggested
```

> **팁:**
> * Claude에게 문제를 재현하고 스택 트레이스를 얻을 수 있는 명령어를 알려주세요
> * 오류를 재현하는 단계를 언급하세요
> * 오류가 간헐적인지 일관적인지 Claude에게 알려주세요

---

## 코드 리팩토링

오래된 코드를 최신 패턴과 관행으로 업데이트해야 하는 상황을 가정해 보겠습니다.

**1단계: 리팩토링 대상 레거시 코드 식별**

```
> find deprecated API usage in our codebase
```

**2단계: 리팩토링 추천 받기**

```
> suggest how to refactor utils.js to use modern JavaScript features
```

**3단계: 안전하게 변경 적용**

```
> refactor utils.js to use ES2024 features while maintaining the same behavior
```

**4단계: 리팩토링 검증**

```
> run tests for the refactored code
```

> **팁:**
> * Claude에게 최신 접근법의 이점을 설명해 달라고 요청하세요
> * 필요한 경우 하위 호환성을 유지하도록 요청하세요
> * 작고 테스트 가능한 단위로 리팩토링을 수행하세요

---

## 전문 서브에이전트 사용하기

특정 작업을 더 효과적으로 처리하기 위해 전문 AI 서브에이전트를 사용하려는 상황을 가정해 보겠습니다.

**1단계: 사용 가능한 서브에이전트 보기**

```
> /agents
```

사용 가능한 모든 서브에이전트를 표시하고 새로운 서브에이전트를 만들 수 있습니다.

**2단계: 서브에이전트 자동 사용**

Claude Code는 적절한 작업을 전문 서브에이전트에게 자동으로 위임합니다:

```
> review my recent code changes for security issues
```

```
> run all tests and fix any failures
```

**3단계: 특정 서브에이전트 명시적으로 요청**

```
> use the code-reviewer subagent to check the auth module
```

```
> have the debugger subagent investigate why users can't log in
```

**4단계: 워크플로우에 맞는 커스텀 서브에이전트 생성**

```
> /agents
```

그런 다음 "Create New subagent"를 선택하고 프롬프트에 따라 다음을 정의합니다:

* 서브에이전트의 목적을 설명하는 고유 식별자 (예: `code-reviewer`, `api-designer`)
* Claude가 이 에이전트를 사용해야 하는 시점
* 접근할 수 있는 도구
* 에이전트의 역할과 동작을 설명하는 시스템 프롬프트

> **팁:**
> * 팀 공유를 위해 `.claude/agents/`에 프로젝트별 서브에이전트를 생성하세요
> * 자동 위임을 활성화하려면 설명적인 `description` 필드를 사용하세요
> * 각 서브에이전트가 실제로 필요한 도구만 접근하도록 제한하세요
> * 자세한 예시는 [서브에이전트 문서](/en/sub-agents)를 확인하세요

---

## 안전한 코드 분석을 위한 Plan Mode 사용

Plan Mode는 Claude에게 읽기 전용 작업으로 코드베이스를 분석하여 계획을 생성하도록 지시합니다. 코드베이스 탐색, 복잡한 변경 계획 수립, 코드 리뷰를 안전하게 수행하는 데 적합합니다. Plan Mode에서 Claude는 [`AskUserQuestion`](/en/settings#tools-available-to-claude)을 사용하여 요구사항을 수집하고 목표를 명확히 한 후 계획을 제안합니다.

### Plan Mode를 사용해야 하는 경우

* **다단계 구현**: 기능이 여러 파일을 편집해야 하는 경우
* **코드 탐색**: 변경하기 전에 코드베이스를 철저히 조사하고 싶은 경우
* **대화형 개발**: Claude와 방향성을 반복적으로 논의하고 싶은 경우

### Plan Mode 사용 방법

**세션 중 Plan Mode 켜기**

세션 중에 **Shift+Tab**을 눌러 권한 모드를 순환하여 Plan Mode로 전환할 수 있습니다.

Normal Mode에서 **Shift+Tab**을 누르면 먼저 Auto-Accept Mode로 전환되며, 터미널 하단에 `⏵⏵ accept edits on`이 표시됩니다. 이후 **Shift+Tab**을 다시 누르면 Plan Mode로 전환되며, `⏸ plan mode on`이 표시됩니다.

**새 세션을 Plan Mode로 시작**

Plan Mode로 새 세션을 시작하려면 `--permission-mode plan` 플래그를 사용합니다:

```bash
claude --permission-mode plan
```

**Plan Mode에서 "헤드리스" 쿼리 실행**

`-p`를 사용하여 Plan Mode에서 직접 쿼리를 실행할 수도 있습니다 (즉, ["헤드리스 모드"](/en/headless)):

```bash
claude --permission-mode plan -p "Analyze the authentication system and suggest improvements"
```

### 예시: 복잡한 리팩토링 계획

```bash
claude --permission-mode plan
```

```
> I need to refactor our authentication system to use OAuth2. Create a detailed migration plan.
```

Claude가 현재 구현을 분석하고 종합적인 계획을 생성합니다. 후속 질문으로 다듬으세요:

```
> What about backward compatibility?
> How should we handle database migration?
```

> `Ctrl+G`를 눌러 기본 텍스트 편집기에서 계획을 열고, Claude가 진행하기 전에 직접 편집할 수 있습니다.

### Plan Mode를 기본값으로 설정

```json
// .claude/settings.json
{
  "permissions": {
    "defaultMode": "plan"
  }
}
```

추가 설정 옵션은 [설정 문서](/en/settings#available-settings)를 참조하세요.

---

## 테스트 작업

테스트되지 않은 코드에 테스트를 추가해야 하는 상황을 가정해 보겠습니다.

**1단계: 테스트되지 않은 코드 식별**

```
> find functions in NotificationsService.swift that are not covered by tests
```

**2단계: 테스트 스캐폴딩 생성**

```
> add tests for the notification service
```

**3단계: 의미 있는 테스트 케이스 추가**

```
> add test cases for edge conditions in the notification service
```

**4단계: 테스트 실행 및 검증**

```
> run the new tests and fix any failures
```

Claude는 프로젝트의 기존 패턴과 규칙을 따르는 테스트를 생성할 수 있습니다. 테스트를 요청할 때 검증하려는 동작을 구체적으로 말하세요. Claude는 기존 테스트 파일을 검토하여 이미 사용 중인 스타일, 프레임워크, 어설션 패턴에 맞춥니다.

포괄적인 커버리지를 위해, 놓칠 수 있는 엣지 케이스를 식별해 달라고 Claude에게 요청하세요. Claude는 코드 경로를 분석하고 간과하기 쉬운 오류 조건, 경계값, 예상치 못한 입력에 대한 테스트를 제안할 수 있습니다.

---

## 풀 리퀘스트 생성

Claude에게 직접 요청하거나("create a pr for my changes") `/commit-push-pr` 스킬을 사용하여 커밋, 푸시, PR 생성을 한 번에 수행할 수 있습니다.

```
> /commit-push-pr
```

Slack MCP 서버가 구성되어 있고 CLAUDE.md에 채널을 지정한 경우(예: "post PR URLs to #team-prs"), 이 스킬은 자동으로 해당 채널에 PR URL을 게시합니다.

프로세스를 더 세밀하게 제어하려면 Claude를 단계별로 안내하거나 [자체 스킬을 생성](/en/skills)하세요:

**1단계: 변경 사항 요약**

```
> summarize the changes I've made to the authentication module
```

**2단계: 풀 리퀘스트 생성**

```
> create a pr
```

**3단계: 검토 및 개선**

```
> enhance the PR description with more context about the security improvements
```

`gh pr create`를 사용하여 PR을 생성하면 세션이 자동으로 해당 PR에 연결됩니다. 나중에 `claude --from-pr <number>`로 재개할 수 있습니다.

> Claude가 생성한 PR을 제출하기 전에 검토하고, 잠재적 위험이나 고려사항을 강조해 달라고 Claude에게 요청하세요.

## 문서 작업

코드에 대한 문서를 추가하거나 업데이트해야 하는 상황을 가정해 보겠습니다.

**1단계: 문서화되지 않은 코드 식별**

```
> find functions without proper JSDoc comments in the auth module
```

**2단계: 문서 생성**

```
> add JSDoc comments to the undocumented functions in auth.js
```

**3단계: 검토 및 개선**

```
> improve the generated documentation with more context and examples
```

**4단계: 문서 검증**

```
> check if the documentation follows our project standards
```

> **팁:**
> * 원하는 문서 스타일을 지정하세요 (JSDoc, docstrings 등)
> * 문서에 예시를 포함해 달라고 요청하세요
> * 공개 API, 인터페이스, 복잡한 로직에 대한 문서를 요청하세요

---

## 이미지 작업

코드베이스에서 이미지를 다루고 Claude의 도움으로 이미지 콘텐츠를 분석하려는 상황을 가정해 보겠습니다.

**1단계: 대화에 이미지 추가**

다음 방법 중 하나를 사용할 수 있습니다:

1. Claude Code 창에 이미지를 드래그 앤 드롭
2. 이미지를 복사하고 CLI에 ctrl+v로 붙여넣기 (cmd+v 사용 금지)
3. Claude에게 이미지 경로 제공. 예: "Analyze this image: /path/to/your/image.png"

**2단계: Claude에게 이미지 분석 요청**

```
> What does this image show?
```

```
> Describe the UI elements in this screenshot
```

```
> Are there any problematic elements in this diagram?
```

**3단계: 이미지를 컨텍스트로 활용**

```
> Here's a screenshot of the error. What's causing it?
```

```
> This is our current database schema. How should we modify it for the new feature?
```

**4단계: 시각적 콘텐츠에서 코드 제안 받기**

```
> Generate CSS to match this design mockup
```

```
> What HTML structure would recreate this component?
```

> **팁:**
> * 텍스트 설명이 불분명하거나 번거로울 때 이미지를 사용하세요
> * 더 나은 컨텍스트를 위해 오류 스크린샷, UI 디자인, 다이어그램을 포함하세요
> * 대화에서 여러 이미지를 다룰 수 있습니다
> * 이미지 분석은 다이어그램, 스크린샷, 목업 등에서 작동합니다
> * Claude가 이미지를 참조할 때 (예: `[Image #1]`), `Cmd+Click` (Mac) 또는 `Ctrl+Click` (Windows/Linux)으로 링크를 클릭하여 기본 뷰어에서 이미지를 열 수 있습니다

---

## 파일 및 디렉토리 참조

@를 사용하여 Claude가 파일을 읽을 때까지 기다리지 않고 빠르게 파일이나 디렉토리를 포함할 수 있습니다.

**1단계: 단일 파일 참조**

```
> Explain the logic in @src/utils/auth.js
```

이것은 대화에 파일의 전체 내용을 포함합니다.

**2단계: 디렉토리 참조**

```
> What's the structure of @src/components?
```

이것은 파일 정보가 포함된 디렉토리 목록을 제공합니다.

**3단계: MCP 리소스 참조**

```
> Show me the data from @github:repos/owner/repo/issues
```

이것은 @server:resource 형식을 사용하여 연결된 MCP 서버에서 데이터를 가져옵니다. 자세한 내용은 [MCP 리소스](/en/mcp#use-mcp-resources)를 참조하세요.

> **팁:**
> * 파일 경로는 상대 경로 또는 절대 경로 모두 가능합니다
> * @ 파일 참조는 해당 파일의 디렉토리 및 상위 디렉토리에 있는 `CLAUDE.md`를 컨텍스트에 추가합니다
> * 디렉토리 참조는 파일 목록을 보여주며, 내용은 보여주지 않습니다
> * 하나의 메시지에서 여러 파일을 참조할 수 있습니다 (예: "@file1.js and @file2.js")

---

## 확장 사고 (사고 모드) 사용

[확장 사고](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)는 기본적으로 활성화되어 있으며, Claude가 복잡한 문제를 단계별로 추론할 수 있도록 출력 토큰 예산의 일부(최대 31,999 토큰)를 예약합니다. 이 추론 과정은 `Ctrl+O`로 토글할 수 있는 상세 모드에서 확인할 수 있습니다.

확장 사고는 복잡한 아키텍처 결정, 어려운 버그, 다단계 구현 계획, 다양한 접근법 간의 트레이드오프 평가에 특히 유용합니다. 여러 솔루션을 탐색하고, 엣지 케이스를 분석하며, 실수를 스스로 수정할 수 있는 더 많은 공간을 제공합니다.

> **참고:** "think", "think hard", "ultrathink", "think more" 같은 문구는 일반 프롬프트 지시로 해석되며 사고 토큰을 할당하지 않습니다.

### 사고 모드 설정

사고는 기본적으로 활성화되어 있지만 조정하거나 비활성화할 수 있습니다.

| 범위 | 설정 방법 | 세부사항 |
| --- | --- | --- |
| **토글 단축키** | `Option+T` (macOS) 또는 `Alt+T` (Windows/Linux) | 현재 세션에서 사고를 켜거나 끕니다. Option 키 단축키를 활성화하려면 [터미널 설정](/en/terminal-config)이 필요할 수 있습니다 |
| **전역 기본값** | `/config`를 사용하여 사고 모드 토글 | 모든 프로젝트에 걸쳐 기본값을 설정합니다. `~/.claude/settings.json`에 `alwaysThinkingEnabled`로 저장됩니다 |
| **토큰 예산 제한** | [`MAX_THINKING_TOKENS`](/en/settings#environment-variables) 환경 변수 설정 | 사고 예산을 특정 토큰 수로 제한합니다. 예: `export MAX_THINKING_TOKENS=10000` |

Claude의 사고 과정을 보려면 `Ctrl+O`를 눌러 상세 모드를 토글하면 회색 이탤릭 텍스트로 내부 추론이 표시됩니다.

### 확장 사고 토큰 예산의 작동 방식

확장 사고는 Claude가 응답하기 전에 수행할 수 있는 내부 추론의 양을 제어하는 **토큰 예산**을 사용합니다.

더 큰 사고 토큰 예산이 제공하는 것:

* 여러 솔루션 접근법을 단계별로 탐색할 수 있는 더 많은 공간
* 엣지 케이스를 분석하고 트레이드오프를 철저히 평가할 수 있는 여유
* 추론을 수정하고 실수를 스스로 교정할 수 있는 능력

사고 모드의 토큰 예산:

* 사고가 **활성화**되면, Claude는 내부 추론을 위해 출력 예산에서 최대 **31,999 토큰**을 사용할 수 있습니다
* 사고가 **비활성화**되면 (토글 또는 `/config`를 통해), Claude는 사고에 **0 토큰**을 사용합니다

**사고 예산 제한:**

* [`MAX_THINKING_TOKENS` 환경 변수](/en/settings#environment-variables)를 사용하여 사고 예산을 제한할 수 있습니다
* 설정되면 이 값이 Claude가 사고에 사용할 수 있는 최대 토큰을 제한합니다
* 유효한 토큰 범위는 [확장 사고 문서](https://docs.claude.com/en/docs/build-with-claude/extended-thinking)를 참조하세요

> **주의:** 사용된 모든 사고 토큰에 대해 요금이 부과됩니다. Claude 4 모델은 요약된 사고를 표시하더라도 마찬가지입니다.

---

## 이전 대화 재개

Claude Code를 시작할 때 이전 세션을 재개할 수 있습니다:

* `claude --continue`는 현재 디렉토리에서 가장 최근 대화를 계속합니다
* `claude --resume`은 대화 선택기를 열거나 이름으로 재개합니다
* `claude --from-pr 123`은 특정 풀 리퀘스트에 연결된 세션을 재개합니다

활성 세션 내에서는 `/resume`을 사용하여 다른 대화로 전환할 수 있습니다.

세션은 프로젝트 디렉토리별로 저장됩니다. `/resume` 선택기는 워크트리를 포함하여 동일한 Git 저장소의 세션을 표시합니다.

### 세션 이름 지정

나중에 찾기 쉽도록 세션에 설명적인 이름을 부여하세요. 이것은 여러 작업이나 기능을 작업할 때 모범 사례입니다.

**1단계: 현재 세션 이름 지정**

세션 중에 `/rename`을 사용하여 기억하기 쉬운 이름을 부여합니다:

```
> /rename auth-refactor
```

선택기에서도 세션 이름을 변경할 수 있습니다: `/resume`을 실행하고 세션으로 이동한 후 `R`을 누릅니다.

**2단계: 나중에 이름으로 재개**

명령줄에서:

```bash
claude --resume auth-refactor
```

또는 활성 세션 내에서:

```
> /resume auth-refactor
```

### 세션 선택기 사용

`/resume` 명령 (또는 인수 없이 `claude --resume`)은 다음 기능을 갖춘 대화형 세션 선택기를 엽니다:

**선택기에서의 키보드 단축키:**

| 단축키 | 동작 |
| :--- | :--- |
| `↑` / `↓` | 세션 간 이동 |
| `→` / `←` | 그룹화된 세션 확장 또는 축소 |
| `Enter` | 강조된 세션 선택 및 재개 |
| `P` | 세션 내용 미리보기 |
| `R` | 강조된 세션 이름 변경 |
| `/` | 검색하여 세션 필터링 |
| `A` | 현재 디렉토리와 모든 프로젝트 간 전환 |
| `B` | 현재 Git 브랜치의 세션으로 필터링 |
| `Esc` | 선택기 또는 검색 모드 종료 |

**세션 구성:**

선택기는 유용한 메타데이터와 함께 세션을 표시합니다:

* 세션 이름 또는 초기 프롬프트
* 마지막 활동 이후 경과 시간
* 메시지 수
* Git 브랜치 (해당되는 경우)

포크된 세션 (`/rewind` 또는 `--fork-session`으로 생성)은 루트 세션 아래에 그룹화되어 관련 대화를 쉽게 찾을 수 있습니다.

> **팁:**
> * **세션 이름을 일찍 지정하세요**: 별도의 작업을 시작할 때 `/rename`을 사용하세요. 나중에 "explain this function"보다 "payment-integration"을 찾기가 훨씬 쉽습니다
> * 현재 디렉토리에서 가장 최근 대화에 빠르게 접근하려면 `--continue`를 사용하세요
> * 어떤 세션이 필요한지 알 때는 `--resume session-name`을 사용하세요
> * 찾아보고 선택해야 할 때는 `--resume` (이름 없이)을 사용하세요
> * 스크립트에서는 비대화형 모드로 재개하려면 `claude --continue --print "prompt"`를 사용하세요
> * 선택기에서 `P`를 눌러 재개하기 전에 세션을 미리 봅니다
> * 재개된 대화는 원래와 동일한 모델 및 구성으로 시작됩니다
>
> **작동 방식:**
> 1. **대화 저장**: 모든 대화는 전체 메시지 기록과 함께 자동으로 로컬에 저장됩니다
> 2. **메시지 역직렬화**: 재개 시 전체 메시지 기록이 복원되어 컨텍스트를 유지합니다
> 3. **도구 상태**: 이전 대화의 도구 사용 및 결과가 보존됩니다
> 4. **컨텍스트 복원**: 이전의 모든 컨텍스트가 그대로 유지된 상태로 대화가 재개됩니다

---

## Git 워크트리로 병렬 Claude Code 세션 실행

여러 작업을 동시에 수행하면서 Claude Code 인스턴스 간에 완전한 코드 격리가 필요한 상황을 가정해 보겠습니다.

**1단계: Git 워크트리 이해하기**

Git 워크트리를 사용하면 동일한 저장소에서 여러 브랜치를 별도의 디렉토리에 체크아웃할 수 있습니다. 각 워크트리는 Git 히스토리를 공유하면서 격리된 파일이 있는 자체 작업 디렉토리를 가집니다. 자세한 내용은 [공식 Git 워크트리 문서](https://git-scm.com/docs/git-worktree)를 참조하세요.

**2단계: 새 워크트리 생성**

```bash
# 새 브랜치와 함께 새 워크트리 생성
git worktree add ../project-feature-a -b feature-a

# 또는 기존 브랜치로 워크트리 생성
git worktree add ../project-bugfix bugfix-123
```

이것은 저장소의 별도 작업 사본이 있는 새 디렉토리를 생성합니다.

**3단계: 각 워크트리에서 Claude Code 실행**

```bash
# 워크트리로 이동
cd ../project-feature-a

# 이 격리된 환경에서 Claude Code 실행
claude
```

**4단계: 다른 워크트리에서 Claude 실행**

```bash
cd ../project-bugfix
claude
```

**5단계: 워크트리 관리**

```bash
# 모든 워크트리 나열
git worktree list

# 완료된 워크트리 제거
git worktree remove ../project-feature-a
```

> **팁:**
> * 각 워크트리는 독립적인 파일 상태를 가지므로 병렬 Claude Code 세션에 적합합니다
> * 한 워크트리에서의 변경이 다른 워크트리에 영향을 주지 않아 Claude 인스턴스 간 간섭을 방지합니다
> * 모든 워크트리는 동일한 Git 히스토리와 원격 연결을 공유합니다
> * 장시간 실행되는 작업의 경우, 한 워크트리에서 Claude가 작업하는 동안 다른 워크트리에서 개발을 계속할 수 있습니다
> * 각 워크트리가 어떤 작업을 위한 것인지 쉽게 식별할 수 있도록 설명적인 디렉토리 이름을 사용하세요
> * 각 새 워크트리에서 프로젝트의 설정에 따라 개발 환경을 초기화하는 것을 잊지 마세요. 스택에 따라 다음이 포함될 수 있습니다:
>   * JavaScript 프로젝트: 의존성 설치 실행 (`npm install`, `yarn`)
>   * Python 프로젝트: 가상 환경 설정 또는 패키지 매니저로 설치
>   * 기타 언어: 프로젝트의 표준 설정 과정 따르기

---

## Claude를 유닉스 스타일 유틸리티로 사용

### 검증 프로세스에 Claude 추가

Claude Code를 린터나 코드 리뷰어로 사용하려는 상황을 가정해 보겠습니다.

**빌드 스크립트에 Claude 추가:**

```json
// package.json
{
    ...
    "scripts": {
        ...
        "lint:claude": "claude -p 'you are a linter. please look at the changes vs. main and report any issues related to typos. report the filename and line number on one line, and a description of the issue on the second line. do not return any other text.'"
    }
}
```

> **팁:**
> * CI/CD 파이프라인에서 자동화된 코드 리뷰를 위해 Claude를 사용하세요
> * 프로젝트에 관련된 특정 문제를 확인하도록 프롬프트를 커스터마이즈하세요
> * 다양한 유형의 검증을 위해 여러 스크립트를 생성하는 것을 고려하세요

### 파이프 입출력

데이터를 Claude로 파이프하고 구조화된 형식으로 결과를 받으려는 상황을 가정해 보겠습니다.

**Claude를 통해 데이터 파이프:**

```bash
cat build-error.txt | claude -p 'concisely explain the root cause of this build error' > output.txt
```

> **팁:**
> * 파이프를 사용하여 기존 쉘 스크립트에 Claude를 통합하세요
> * 다른 유닉스 도구와 결합하여 강력한 워크플로우를 구성하세요
> * 구조화된 출력을 위해 --output-format 사용을 고려하세요

### 출력 형식 제어

Claude의 출력을 특정 형식으로 필요로 하는 상황, 특히 Claude Code를 스크립트나 다른 도구에 통합할 때를 가정해 보겠습니다.

**1단계: 텍스트 형식 사용 (기본값)**

```bash
cat data.txt | claude -p 'summarize this data' --output-format text > summary.txt
```

이것은 Claude의 일반 텍스트 응답만 출력합니다 (기본 동작).

**2단계: JSON 형식 사용**

```bash
cat code.py | claude -p 'analyze this code for bugs' --output-format json > analysis.json
```

이것은 비용 및 기간을 포함한 메타데이터와 함께 JSON 메시지 배열을 출력합니다.

**3단계: 스트리밍 JSON 형식 사용**

```bash
cat log.txt | claude -p 'parse this log file for errors' --output-format stream-json
```

이것은 Claude가 요청을 처리하는 동안 실시간으로 일련의 JSON 객체를 출력합니다. 각 메시지는 유효한 JSON 객체이지만, 전체 출력을 연결하면 유효한 JSON이 아닙니다.

> **팁:**
> * Claude의 응답만 필요한 간단한 통합에는 `--output-format text`를 사용하세요
> * 전체 대화 로그가 필요한 경우 `--output-format json`을 사용하세요
> * 각 대화 턴의 실시간 출력을 원하면 `--output-format stream-json`을 사용하세요

---

## Claude의 기능에 대해 물어보기

Claude는 자체 문서에 대한 내장 접근 권한을 가지고 있으며 자체 기능과 제한 사항에 대한 질문에 답할 수 있습니다.

### 예시 질문

```
> can Claude Code create pull requests?
```

```
> how does Claude Code handle permissions?
```

```
> what skills are available?
```

```
> how do I use MCP with Claude Code?
```

```
> how do I configure Claude Code for Amazon Bedrock?
```

```
> what are the limitations of Claude Code?
```

> **참고:** Claude는 이러한 질문에 대해 문서 기반 답변을 제공합니다. 실행 가능한 예시와 실습 데모는 위의 특정 워크플로우 섹션을 참조하세요.

> **팁:**
> * Claude는 사용 중인 버전에 관계없이 항상 최신 Claude Code 문서에 접근할 수 있습니다
> * 구체적인 질문을 하면 자세한 답변을 받을 수 있습니다
> * Claude는 MCP 통합, 엔터프라이즈 구성, 고급 워크플로우와 같은 복잡한 기능을 설명할 수 있습니다

---

## 다음 단계

* **[모범 사례](/en/best-practices)** - Claude Code를 최대한 활용하기 위한 패턴
* **[Claude Code 작동 방식](/en/how-claude-code-works)** - 에이전트 루프와 컨텍스트 관리 이해
* **[Claude Code 확장](/en/features-overview)** - 스킬, 훅, MCP, 서브에이전트, 플러그인 추가
* **[참조 구현](https://github.com/anthropics/claude-code/tree/main/.devcontainer)** - 개발 컨테이너 참조 구현 클론
