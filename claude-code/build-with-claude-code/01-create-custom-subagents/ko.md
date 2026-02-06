# 커스텀 서브에이전트 만들기

> Claude Code에서 작업별 워크플로우와 향상된 컨텍스트 관리를 위해 특화된 AI 서브에이전트를 생성하고 사용합니다.

서브에이전트는 특정 유형의 작업을 처리하는 특화된 AI 어시스턴트입니다. 각 서브에이전트는 커스텀 시스템 프롬프트, 특정 도구 접근 권한, 독립적인 권한을 가진 자체 컨텍스트 윈도우에서 실행됩니다. Claude가 서브에이전트의 설명과 일치하는 작업을 만나면, 해당 서브에이전트에 위임하여 독립적으로 작업하고 결과를 반환합니다.

서브에이전트가 도움이 되는 경우:

* **컨텍스트 보존** — 탐색과 구현을 메인 대화에서 분리하여 유지
* **제약 조건 적용** — 서브에이전트가 사용할 수 있는 도구를 제한
* **구성 재사용** — 사용자 수준 서브에이전트로 프로젝트 간 재사용
* **동작 특화** — 특정 도메인에 집중된 시스템 프롬프트로 특화
* **비용 제어** — Haiku와 같은 더 빠르고 저렴한 모델로 작업을 라우팅

Claude는 각 서브에이전트의 설명을 사용하여 작업을 위임할 시기를 결정합니다. 서브에이전트를 만들 때 Claude가 언제 사용해야 하는지 알 수 있도록 명확한 설명을 작성하세요.

Claude Code에는 **Explore**, **Plan**, **general-purpose** 같은 여러 내장 서브에이전트가 포함되어 있습니다. 특정 작업을 처리하기 위해 커스텀 서브에이전트를 만들 수도 있습니다. 이 페이지에서는 [내장 서브에이전트](#내장-서브에이전트), [자체 서브에이전트 만드는 방법](#빠른-시작-첫-번째-서브에이전트-만들기), [전체 구성 옵션](#서브에이전트-구성), [서브에이전트 작업 패턴](#서브에이전트-활용), 그리고 [예제 서브에이전트](#예제-서브에이전트)를 다룹니다.

## 내장 서브에이전트

Claude Code에는 Claude가 적절한 시기에 자동으로 사용하는 내장 서브에이전트가 포함되어 있습니다. 각 서브에이전트는 부모 대화의 권한을 상속받으며 추가적인 도구 제한이 있습니다.

<Tabs>
  <Tab title="Explore">
    코드베이스를 검색하고 분석하는 데 최적화된 빠른 읽기 전용 에이전트입니다.

    * **모델**: Haiku (빠르고, 낮은 지연 시간)
    * **도구**: 읽기 전용 도구 (Write 및 Edit 도구 접근 거부)
    * **목적**: 파일 탐색, 코드 검색, 코드베이스 탐색

    Claude는 변경 없이 코드베이스를 검색하거나 이해해야 할 때 Explore에 위임합니다. 이를 통해 탐색 결과가 메인 대화 컨텍스트에서 분리됩니다.

    Explore를 호출할 때 Claude는 철저함 수준을 지정합니다: 대상을 특정한 검색에는 **quick**, 균형 잡힌 탐색에는 **medium**, 포괄적 분석에는 **very thorough**.
  </Tab>

  <Tab title="Plan">
    계획을 제시하기 전에 컨텍스트를 수집하는 데 사용되는 [플랜 모드](/en/common-workflows#use-plan-mode-for-safe-code-analysis)용 리서치 에이전트입니다.

    * **모델**: 메인 대화에서 상속
    * **도구**: 읽기 전용 도구 (Write 및 Edit 도구 접근 거부)
    * **목적**: 계획 수립을 위한 코드베이스 리서치

    플랜 모드에서 Claude가 코드베이스를 이해해야 할 때, Plan 서브에이전트에 리서치를 위임합니다. 이는 무한 중첩(서브에이전트는 다른 서브에이전트를 생성할 수 없음)을 방지하면서 필요한 컨텍스트를 수집합니다.
  </Tab>

  <Tab title="General-purpose">
    탐색과 액션 모두를 필요로 하는 복잡한 다단계 작업을 위한 유능한 에이전트입니다.

    * **모델**: 메인 대화에서 상속
    * **도구**: 모든 도구
    * **목적**: 복잡한 리서치, 다단계 작업, 코드 수정

    작업이 탐색과 수정 모두를 필요로 하거나, 결과를 해석하기 위한 복잡한 추론이 필요하거나, 여러 종속 단계가 있을 때 Claude는 general-purpose에 위임합니다.
  </Tab>

  <Tab title="기타">
    Claude Code에는 특정 작업을 위한 추가 헬퍼 에이전트가 포함되어 있습니다. 이들은 보통 자동으로 호출되므로 직접 사용할 필요가 없습니다.

    | 에이전트           | 모델     | Claude가 사용하는 시점                                    |
    | :---------------- | :------- | :------------------------------------------------------- |
    | Bash              | 상속     | 별도의 컨텍스트에서 터미널 명령어 실행                       |
    | statusline-setup  | Sonnet   | 상태 줄을 구성하기 위해 `/statusline`을 실행할 때           |
    | Claude Code Guide | Haiku    | Claude Code 기능에 대해 질문할 때                          |
  </Tab>
</Tabs>

이러한 내장 서브에이전트 외에도 커스텀 프롬프트, 도구 제한, 권한 모드, 훅, 스킬을 사용하여 자체 서브에이전트를 만들 수 있습니다. 다음 섹션에서는 시작 방법과 서브에이전트 커스터마이징 방법을 설명합니다.

## 빠른 시작: 첫 번째 서브에이전트 만들기

서브에이전트는 YAML 프런트매터가 포함된 Markdown 파일로 정의됩니다. [수동으로 생성](#서브에이전트-파일-작성)하거나 `/agents` 명령어를 사용할 수 있습니다.

이 안내서는 `/agent` 명령어를 사용하여 사용자 수준 서브에이전트를 만드는 과정을 안내합니다. 이 서브에이전트는 코드를 검토하고 코드베이스에 대한 개선 사항을 제안합니다.

<Steps>
  <Step title="서브에이전트 인터페이스 열기">
    Claude Code에서 다음을 실행합니다:

    ```
    /agents
    ```
  </Step>

  <Step title="새로운 사용자 수준 에이전트 만들기">
    **Create new agent**를 선택한 다음 **User-level**을 선택합니다. 이렇게 하면 서브에이전트가 `~/.claude/agents/`에 저장되어 모든 프로젝트에서 사용할 수 있습니다.
  </Step>

  <Step title="Claude로 생성하기">
    **Generate with Claude**를 선택합니다. 프롬프트가 나타나면 서브에이전트를 설명합니다:

    ```
    A code improvement agent that scans files and suggests improvements
    for readability, performance, and best practices. It should explain
    each issue, show the current code, and provide an improved version.
    ```

    Claude가 시스템 프롬프트와 구성을 생성합니다. 커스터마이징하려면 `e`를 눌러 에디터에서 엽니다.
  </Step>

  <Step title="도구 선택">
    읽기 전용 리뷰어의 경우, **Read-only tools**를 제외한 모든 항목을 선택 해제합니다. 모든 도구를 선택한 상태로 두면, 서브에이전트는 메인 대화에서 사용 가능한 모든 도구를 상속받습니다.
  </Step>

  <Step title="모델 선택">
    서브에이전트가 사용할 모델을 선택합니다. 이 예제 에이전트의 경우 코드 패턴 분석에 능력과 속도의 균형이 잡힌 **Sonnet**을 선택합니다.
  </Step>

  <Step title="색상 선택">
    서브에이전트의 배경색을 선택합니다. UI에서 어떤 서브에이전트가 실행 중인지 식별하는 데 도움이 됩니다.
  </Step>

  <Step title="저장하고 사용해보기">
    서브에이전트를 저장합니다. 즉시 사용 가능합니다 (재시작 불필요). 다음과 같이 사용해 보세요:

    ```
    Use the code-improver agent to suggest improvements in this project
    ```

    Claude가 새 서브에이전트에 위임하여 코드베이스를 스캔하고 개선 제안을 반환합니다.
  </Step>
</Steps>

이제 머신의 모든 프로젝트에서 코드베이스를 분석하고 개선 사항을 제안하는 데 사용할 수 있는 서브에이전트가 생겼습니다.

Markdown 파일로 수동으로 서브에이전트를 만들거나, CLI 플래그를 통해 정의하거나, 플러그인을 통해 배포할 수도 있습니다. 다음 섹션에서는 모든 구성 옵션을 다룹니다.

## 서브에이전트 구성

### /agents 명령어 사용

`/agents` 명령어는 서브에이전트를 관리하기 위한 대화형 인터페이스를 제공합니다. `/agents`를 실행하면:

* 사용 가능한 모든 서브에이전트 보기 (내장, 사용자, 프로젝트, 플러그인)
* 가이드 설정 또는 Claude 생성으로 새 서브에이전트 만들기
* 기존 서브에이전트 구성 및 도구 접근 편집
* 커스텀 서브에이전트 삭제
* 중복이 있을 때 어떤 서브에이전트가 활성화되어 있는지 확인

서브에이전트를 만들고 관리하는 데 권장되는 방법입니다. 수동 생성이나 자동화의 경우 서브에이전트 파일을 직접 추가할 수도 있습니다.

### 서브에이전트 범위 선택

서브에이전트는 YAML 프런트매터가 포함된 Markdown 파일입니다. 범위에 따라 다른 위치에 저장합니다. 동일한 이름의 서브에이전트가 여러 개 있을 경우 우선순위가 높은 위치가 우선합니다.

| 위치                          | 범위                   | 우선순위     | 생성 방법                             |
| :--------------------------- | :---------------------- | :---------- | :------------------------------------ |
| `--agents` CLI 플래그         | 현재 세션               | 1 (최고)    | Claude Code 실행 시 JSON 전달          |
| `.claude/agents/`            | 현재 프로젝트            | 2           | 대화형 또는 수동                       |
| `~/.claude/agents/`          | 모든 프로젝트            | 3           | 대화형 또는 수동                       |
| 플러그인의 `agents/` 디렉토리  | 플러그인이 활성화된 곳    | 4 (최저)    | [플러그인](/en/plugins)과 함께 설치    |

**프로젝트 서브에이전트** (`.claude/agents/`)는 코드베이스에 특화된 서브에이전트에 이상적입니다. 버전 관리에 체크인하여 팀이 협업적으로 사용하고 개선할 수 있습니다.

**사용자 서브에이전트** (`~/.claude/agents/`)는 모든 프로젝트에서 사용할 수 있는 개인 서브에이전트입니다.

**CLI 정의 서브에이전트**는 Claude Code를 실행할 때 JSON으로 전달됩니다. 해당 세션에만 존재하며 디스크에 저장되지 않아 빠른 테스트나 자동화 스크립트에 유용합니다:

```bash  theme={null}
claude --agents '{
  "code-reviewer": {
    "description": "Expert code reviewer. Use proactively after code changes.",
    "prompt": "You are a senior code reviewer. Focus on code quality, security, and best practices.",
    "tools": ["Read", "Grep", "Glob", "Bash"],
    "model": "sonnet"
  }
}'
```

`--agents` 플래그는 [프런트매터](#지원되는-프런트매터-필드)와 동일한 필드를 가진 JSON을 받습니다. 시스템 프롬프트에는 `prompt`를 사용합니다 (파일 기반 서브에이전트의 마크다운 본문에 해당). 전체 JSON 형식은 [CLI 레퍼런스](/en/cli-reference#agents-flag-format)를 참조하세요.

**플러그인 서브에이전트**는 설치한 [플러그인](/en/plugins)에서 제공됩니다. `/agents`에서 커스텀 서브에이전트와 함께 표시됩니다. 플러그인 서브에이전트 생성에 대한 자세한 내용은 [플러그인 구성 요소 레퍼런스](/en/plugins-reference#agents)를 참조하세요.

### 서브에이전트 파일 작성

서브에이전트 파일은 구성을 위한 YAML 프런트매터와 Markdown으로 작성된 시스템 프롬프트를 사용합니다:

<Note>
  서브에이전트는 세션 시작 시 로드됩니다. 파일을 수동으로 추가하여 서브에이전트를 만든 경우, 세션을 재시작하거나 `/agents`를 사용하여 즉시 로드하세요.
</Note>

```markdown  theme={null}
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep
model: sonnet
---

You are a code reviewer. When invoked, analyze the code and provide
specific, actionable feedback on quality, security, and best practices.
```

프런트매터는 서브에이전트의 메타데이터와 구성을 정의합니다. 본문은 서브에이전트의 동작을 안내하는 시스템 프롬프트가 됩니다. 서브에이전트는 이 시스템 프롬프트(및 작업 디렉토리와 같은 기본 환경 정보)만 받으며, 전체 Claude Code 시스템 프롬프트는 받지 않습니다.

#### 지원되는 프런트매터 필드

다음 필드를 YAML 프런트매터에서 사용할 수 있습니다. `name`과 `description`만 필수입니다.

| 필드               | 필수   | 설명                                                                                                                                                                                                         |
| :---------------- | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`            | 예      | 소문자와 하이픈을 사용하는 고유 식별자                                                                                                                                                                         |
| `description`     | 예      | Claude가 이 서브에이전트에 작업을 위임해야 하는 시점                                                                                                                                                            |
| `tools`           | 아니오   | 서브에이전트가 사용할 수 있는 [도구](#사용-가능한-도구). 생략 시 모든 도구 상속                                                                                                                                    |
| `disallowedTools` | 아니오   | 거부할 도구, 상속된 또는 지정된 목록에서 제거                                                                                                                                                                    |
| `model`           | 아니오   | 사용할 [모델](#모델-선택): `sonnet`, `opus`, `haiku`, 또는 `inherit`. 기본값은 `inherit`                                                                                                                       |
| `permissionMode`  | 아니오   | [권한 모드](#권한-모드): `default`, `acceptEdits`, `dontAsk`, `bypassPermissions`, 또는 `plan`                                                                                                                  |
| `skills`          | 아니오   | 시작 시 서브에이전트의 컨텍스트에 로드할 [스킬](/en/skills). 전체 스킬 내용이 주입되며, 호출용으로만 제공되는 것이 아님. 서브에이전트는 부모 대화의 스킬을 상속하지 않음                                                       |
| `hooks`           | 아니오   | 이 서브에이전트에 한정된 [라이프사이클 훅](#서브에이전트용-훅-정의)                                                                                                                                                |

### 모델 선택

`model` 필드는 서브에이전트가 사용할 [AI 모델](/en/model-config)을 제어합니다:

* **모델 별칭**: 사용 가능한 별칭 중 하나를 사용: `sonnet`, `opus`, 또는 `haiku`
* **inherit**: 메인 대화와 동일한 모델 사용
* **생략**: 지정하지 않으면 `inherit`로 기본 설정 (메인 대화와 동일한 모델 사용)

### 서브에이전트 기능 제어

도구 접근, 권한 모드, 조건부 규칙을 통해 서브에이전트가 할 수 있는 것을 제어할 수 있습니다.

#### 사용 가능한 도구

서브에이전트는 Claude Code의 [내부 도구](/en/settings#tools-available-to-claude)를 사용할 수 있습니다. 기본적으로 서브에이전트는 MCP 도구를 포함하여 메인 대화의 모든 도구를 상속받습니다.

도구를 제한하려면 `tools` 필드(허용 목록) 또는 `disallowedTools` 필드(거부 목록)를 사용합니다:

```yaml  theme={null}
---
name: safe-researcher
description: Research agent with restricted capabilities
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit
---
```

#### 권한 모드

`permissionMode` 필드는 서브에이전트가 권한 프롬프트를 처리하는 방법을 제어합니다. 서브에이전트는 메인 대화에서 권한 컨텍스트를 상속받지만 모드를 재정의할 수 있습니다.

| 모드                 | 동작                                                              |
| :------------------ | :----------------------------------------------------------------- |
| `default`           | 프롬프트를 통한 표준 권한 확인                                       |
| `acceptEdits`       | 파일 편집 자동 수락                                                 |
| `dontAsk`           | 권한 프롬프트 자동 거부 (명시적으로 허용된 도구는 계속 작동)             |
| `bypassPermissions` | 모든 권한 확인 건너뛰기                                              |
| `plan`              | 플랜 모드 (읽기 전용 탐색)                                           |

<Warning>
  `bypassPermissions`는 주의해서 사용하세요. 모든 권한 확인을 건너뛰어 서브에이전트가 승인 없이 모든 작업을 실행할 수 있습니다.
</Warning>

부모가 `bypassPermissions`를 사용하는 경우, 이것이 우선하며 재정의할 수 없습니다.

#### 서브에이전트에 스킬 미리 로드

`skills` 필드를 사용하여 시작 시 서브에이전트의 컨텍스트에 스킬 내용을 주입합니다. 이를 통해 실행 중에 스킬을 탐색하고 로드할 필요 없이 서브에이전트에 도메인 지식을 제공합니다.

```yaml  theme={null}
---
name: api-developer
description: Implement API endpoints following team conventions
skills:
  - api-conventions
  - error-handling-patterns
---

Implement API endpoints. Follow the conventions and patterns from the preloaded skills.
```

각 스킬의 전체 내용이 서브에이전트의 컨텍스트에 주입되며, 호출용으로만 제공되는 것이 아닙니다. 서브에이전트는 부모 대화의 스킬을 상속하지 않으므로 명시적으로 나열해야 합니다.

<Note>
  이것은 [서브에이전트에서 스킬 실행](/en/skills#run-skills-in-a-subagent)의 반대입니다. 서브에이전트의 `skills`에서는 서브에이전트가 시스템 프롬프트를 제어하고 스킬 내용을 로드합니다. 스킬의 `context: fork`에서는 스킬 내용이 지정한 에이전트에 주입됩니다. 둘 다 동일한 기본 시스템을 사용합니다.
</Note>

#### 훅을 사용한 조건부 규칙

도구 사용에 대한 보다 동적인 제어를 위해 `PreToolUse` 훅을 사용하여 작업이 실행되기 전에 검증합니다. 도구의 일부 작업은 허용하면서 다른 작업은 차단해야 할 때 유용합니다.

이 예제는 읽기 전용 데이터베이스 쿼리만 허용하는 서브에이전트를 만듭니다. `PreToolUse` 훅은 각 Bash 명령어가 실행되기 전에 `command`에 지정된 스크립트를 실행합니다:

```yaml  theme={null}
---
name: db-reader
description: Execute read-only database queries
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---
```

Claude Code는 [훅 입력을 JSON으로 전달](/en/hooks#pretooluse-input)하여 stdin을 통해 훅 명령어에 전달합니다. 유효성 검사 스크립트는 이 JSON을 읽고, Bash 명령어를 추출하며, 쓰기 작업을 차단하기 위해 [종료 코드 2로 종료](/en/hooks#exit-code-2-behavior-per-event)합니다:

```bash  theme={null}
#!/bin/bash
# ./scripts/validate-readonly-query.sh

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

# SQL 쓰기 작업 차단 (대소문자 무시)
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE)\b' > /dev/null; then
  echo "Blocked: Only SELECT queries are allowed" >&2
  exit 2
fi

exit 0
```

완전한 입력 스키마는 [훅 입력](/en/hooks#pretooluse-input)을, 종료 코드가 동작에 미치는 영향은 [종료 코드](/en/hooks#exit-code-output)를 참조하세요.

#### 특정 서브에이전트 비활성화

[설정](/en/settings#permission-settings)의 `deny` 배열에 추가하여 Claude가 특정 서브에이전트를 사용하는 것을 방지할 수 있습니다. `Task(subagent-name)` 형식을 사용하며, `subagent-name`은 서브에이전트의 name 필드와 일치해야 합니다.

```json  theme={null}
{
  "permissions": {
    "deny": ["Task(Explore)", "Task(my-custom-agent)"]
  }
}
```

이것은 내장 및 커스텀 서브에이전트 모두에 적용됩니다. `--disallowedTools` CLI 플래그를 사용할 수도 있습니다:

```bash  theme={null}
claude --disallowedTools "Task(Explore)"
```

권한 규칙에 대한 자세한 내용은 [권한 문서](/en/permissions#tool-specific-permission-rules)를 참조하세요.

### 서브에이전트용 훅 정의

서브에이전트는 서브에이전트의 라이프사이클 동안 실행되는 [훅](/en/hooks)을 정의할 수 있습니다. 훅을 구성하는 두 가지 방법이 있습니다:

1. **서브에이전트의 프런트매터에서**: 해당 서브에이전트가 활성화된 동안에만 실행되는 훅 정의
2. **`settings.json`에서**: 서브에이전트가 시작하거나 중지될 때 메인 세션에서 실행되는 훅 정의

#### 서브에이전트 프런트매터의 훅

서브에이전트의 마크다운 파일에 직접 훅을 정의합니다. 이 훅은 해당 특정 서브에이전트가 활성화된 동안에만 실행되며 완료 시 정리됩니다.

모든 [훅 이벤트](/en/hooks#hook-events)가 지원됩니다. 서브에이전트에서 가장 일반적인 이벤트는:

| 이벤트        | 매처 입력   | 발생 시점                                                           |
| :------------ | :---------- | :------------------------------------------------------------------ |
| `PreToolUse`  | 도구 이름   | 서브에이전트가 도구를 사용하기 전                                      |
| `PostToolUse` | 도구 이름   | 서브에이전트가 도구를 사용한 후                                        |
| `Stop`        | (없음)      | 서브에이전트가 완료될 때 (런타임에 `SubagentStop`으로 변환)             |

이 예제는 `PreToolUse` 훅으로 Bash 명령어를 검증하고, `PostToolUse`로 파일 편집 후 린터를 실행합니다:

```yaml  theme={null}
---
name: code-reviewer
description: Review code changes with automatic linting
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-command.sh $TOOL_INPUT"
  PostToolUse:
    - matcher: "Edit|Write"
      hooks:
        - type: command
          command: "./scripts/run-linter.sh"
---
```

프런트매터의 `Stop` 훅은 자동으로 `SubagentStop` 이벤트로 변환됩니다.

#### 서브에이전트 이벤트를 위한 프로젝트 수준 훅

메인 세션에서 서브에이전트 라이프사이클 이벤트에 응답하는 훅을 `settings.json`에 구성합니다.

| 이벤트           | 매처 입력       | 발생 시점                          |
| :-------------- | :-------------- | :------------------------------- |
| `SubagentStart` | 에이전트 타입명  | 서브에이전트가 실행을 시작할 때       |
| `SubagentStop`  | (없음)          | 서브에이전트가 완료될 때             |

`SubagentStart`는 이름으로 특정 에이전트 타입을 대상으로 하는 매처를 지원합니다. `SubagentStop`은 매처 값에 관계없이 모든 서브에이전트 완료에 대해 발생합니다. 이 예제는 `db-agent` 서브에이전트가 시작될 때만 설정 스크립트를 실행하고, 서브에이전트가 중지될 때 정리 스크립트를 실행합니다:

```json  theme={null}
{
  "hooks": {
    "SubagentStart": [
      {
        "matcher": "db-agent",
        "hooks": [
          { "type": "command", "command": "./scripts/setup-db-connection.sh" }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          { "type": "command", "command": "./scripts/cleanup-db-connection.sh" }
        ]
      }
    ]
  }
}
```

완전한 훅 구성 형식은 [훅](/en/hooks)을 참조하세요.

## 서브에이전트 활용

### 자동 위임 이해하기

Claude는 요청의 작업 설명, 서브에이전트 구성의 `description` 필드, 현재 컨텍스트를 기반으로 자동으로 작업을 위임합니다. 사전 위임을 권장하려면 서브에이전트의 설명 필드에 "use proactively"와 같은 문구를 포함하세요.

특정 서브에이전트를 명시적으로 요청할 수도 있습니다:

```
Use the test-runner subagent to fix failing tests
Have the code-reviewer subagent look at my recent changes
```

### 포그라운드 또는 백그라운드에서 서브에이전트 실행

서브에이전트는 포그라운드(블로킹) 또는 백그라운드(동시)로 실행할 수 있습니다:

* **포그라운드 서브에이전트**는 완료될 때까지 메인 대화를 차단합니다. 권한 프롬프트와 [`AskUserQuestion`](/en/settings#tools-available-to-claude)과 같은 확인 질문이 사용자에게 전달됩니다.
* **백그라운드 서브에이전트**는 사용자가 계속 작업하는 동안 동시에 실행됩니다. 실행 전에 Claude Code는 서브에이전트가 필요로 하는 도구 권한을 요청하여 사전에 필요한 승인을 확보합니다. 실행 중에 서브에이전트는 이러한 권한을 상속받으며 사전 승인되지 않은 항목은 자동 거부합니다. 백그라운드 서브에이전트가 확인 질문을 해야 하는 경우 해당 도구 호출은 실패하지만 서브에이전트는 계속됩니다. MCP 도구는 백그라운드 서브에이전트에서 사용할 수 없습니다.

백그라운드 서브에이전트가 누락된 권한으로 인해 실패하면, 포그라운드에서 [재개](#서브에이전트-재개)하여 대화형 프롬프트로 재시도할 수 있습니다.

Claude는 작업에 따라 서브에이전트를 포그라운드 또는 백그라운드에서 실행할지 결정합니다. 다음과 같이 직접 지정할 수도 있습니다:

* Claude에게 "run this in the background"라고 요청
* **Ctrl+B**를 눌러 실행 중인 작업을 백그라운드로 전환

모든 백그라운드 작업 기능을 비활성화하려면 `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` 환경 변수를 `1`로 설정합니다. [환경 변수](/en/settings#environment-variables)를 참조하세요.

### 일반적인 패턴

#### 대량 출력 작업 격리

서브에이전트의 가장 효과적인 사용 중 하나는 대량의 출력을 생성하는 작업을 격리하는 것입니다. 테스트 실행, 문서 가져오기, 로그 파일 처리는 상당한 컨텍스트를 소비할 수 있습니다. 이를 서브에이전트에 위임하면 장황한 출력은 서브에이전트의 컨텍스트에 유지되고 관련 요약만 메인 대화로 반환됩니다.

```
Use a subagent to run the test suite and report only the failing tests with their error messages
```

#### 병렬 리서치 실행

독립적인 조사를 위해 여러 서브에이전트를 동시에 생성하여 작업할 수 있습니다:

```
Research the authentication, database, and API modules in parallel using separate subagents
```

각 서브에이전트는 자신의 영역을 독립적으로 탐색한 후 Claude가 결과를 종합합니다. 리서치 경로가 서로 의존하지 않을 때 가장 잘 작동합니다.

<Warning>
  서브에이전트가 완료되면 결과가 메인 대화로 반환됩니다. 각각 상세한 결과를 반환하는 많은 서브에이전트를 실행하면 상당한 컨텍스트를 소비할 수 있습니다.
</Warning>

#### 서브에이전트 체이닝

다단계 워크플로우의 경우 Claude에게 서브에이전트를 순서대로 사용하도록 요청합니다. 각 서브에이전트가 작업을 완료하고 결과를 Claude에 반환하면, Claude가 관련 컨텍스트를 다음 서브에이전트에 전달합니다.

```
Use the code-reviewer subagent to find performance issues, then use the optimizer subagent to fix them
```

### 서브에이전트와 메인 대화 중 선택

**메인 대화**를 사용하는 경우:

* 작업에 빈번한 상호작용이나 반복적 개선이 필요할 때
* 여러 단계가 상당한 컨텍스트를 공유할 때 (계획 → 구현 → 테스트)
* 빠르고 대상이 명확한 변경을 할 때
* 지연 시간이 중요할 때. 서브에이전트는 처음부터 시작하며 컨텍스트를 수집하는 데 시간이 필요할 수 있음

**서브에이전트**를 사용하는 경우:

* 작업이 메인 컨텍스트에 필요 없는 장황한 출력을 생성할 때
* 특정 도구 제한이나 권한을 적용하고 싶을 때
* 작업이 자체 완결적이고 요약을 반환할 수 있을 때

격리된 서브에이전트 컨텍스트 대신 메인 대화 컨텍스트에서 실행되는 재사용 가능한 프롬프트나 워크플로우가 필요한 경우 [스킬](/en/skills)을 고려하세요.

<Note>
  서브에이전트는 다른 서브에이전트를 생성할 수 없습니다. 워크플로우에 중첩 위임이 필요한 경우 [스킬](/en/skills)을 사용하거나 메인 대화에서 [서브에이전트를 체이닝](#서브에이전트-체이닝)하세요.
</Note>

### 서브에이전트 컨텍스트 관리

#### 서브에이전트 재개

각 서브에이전트 호출은 새로운 컨텍스트로 새 인스턴스를 생성합니다. 처음부터 시작하는 대신 기존 서브에이전트의 작업을 계속하려면 Claude에게 재개를 요청합니다.

재개된 서브에이전트는 이전의 모든 도구 호출, 결과, 추론을 포함한 전체 대화 기록을 유지합니다. 서브에이전트는 처음부터 시작하는 대신 정확히 중단된 지점부터 재개합니다.

서브에이전트가 완료되면 Claude는 해당 에이전트 ID를 받습니다. 서브에이전트를 재개하려면 Claude에게 이전 작업을 계속하도록 요청합니다:

```
Use the code-reviewer subagent to review the authentication module
[에이전트 완료]

Continue that code review and now analyze the authorization logic
[Claude가 이전 대화의 전체 컨텍스트와 함께 서브에이전트를 재개]
```

Claude에게 에이전트 ID를 명시적으로 요청하거나 `~/.claude/projects/{project}/{sessionId}/subagents/`의 트랜스크립트 파일에서 ID를 찾을 수도 있습니다. 각 트랜스크립트는 `agent-{agentId}.jsonl`로 저장됩니다.

서브에이전트 트랜스크립트는 메인 대화와 독립적으로 유지됩니다:

* **메인 대화 압축**: 메인 대화가 압축될 때 서브에이전트 트랜스크립트는 영향을 받지 않습니다. 별도의 파일에 저장됩니다.
* **세션 지속성**: 서브에이전트 트랜스크립트는 세션 내에서 유지됩니다. 동일한 세션을 재개하면 Claude Code를 재시작한 후에도 [서브에이전트를 재개](#서브에이전트-재개)할 수 있습니다.
* **자동 정리**: 트랜스크립트는 `cleanupPeriodDays` 설정(기본값: 30일)에 따라 정리됩니다.

#### 자동 압축

서브에이전트는 메인 대화와 동일한 로직을 사용하여 자동 압축을 지원합니다. 기본적으로 자동 압축은 약 95% 용량에서 트리거됩니다. 압축을 더 일찍 트리거하려면 `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`를 더 낮은 비율(예: `50`)로 설정합니다. 자세한 내용은 [환경 변수](/en/settings#environment-variables)를 참조하세요.

압축 이벤트는 서브에이전트 트랜스크립트 파일에 기록됩니다:

```json  theme={null}
{
  "type": "system",
  "subtype": "compact_boundary",
  "compactMetadata": {
    "trigger": "auto",
    "preTokens": 167189
  }
}
```

`preTokens` 값은 압축이 발생하기 전에 사용된 토큰 수를 나타냅니다.

## 예제 서브에이전트

이 예제들은 서브에이전트를 구축하기 위한 효과적인 패턴을 보여줍니다. 시작점으로 사용하거나 Claude로 커스터마이즈된 버전을 생성하세요.

<Tip>
  **모범 사례:**

  * **집중된 서브에이전트 설계:** 각 서브에이전트는 하나의 특정 작업에 뛰어나야 합니다
  * **상세한 설명 작성:** Claude는 설명을 사용하여 위임 시기를 결정합니다
  * **도구 접근 제한:** 보안과 집중을 위해 필요한 권한만 부여합니다
  * **버전 관리에 체크인:** 프로젝트 서브에이전트를 팀과 공유합니다
</Tip>

### 코드 리뷰어

코드를 수정하지 않고 검토하는 읽기 전용 서브에이전트입니다. 이 예제는 제한된 도구 접근(Edit 또는 Write 없음)과 무엇을 찾아야 하는지, 출력 형식을 어떻게 해야 하는지 정확히 지정하는 상세한 프롬프트로 집중된 서브에이전트를 설계하는 방법을 보여줍니다.

```markdown  theme={null}
---
name: code-reviewer
description: Expert code review specialist. Proactively reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.
tools: Read, Grep, Glob, Bash
model: inherit
---

You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Run git diff to see recent changes
2. Focus on modified files
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.
```

### 디버거

문제를 분석하고 수정할 수 있는 서브에이전트입니다. 코드 리뷰어와 달리 버그 수정에는 코드 수정이 필요하므로 Edit을 포함합니다. 프롬프트는 진단부터 검증까지 명확한 워크플로우를 제공합니다.

```markdown  theme={null}
---
name: debugger
description: Debugging specialist for errors, test failures, and unexpected behavior. Use proactively when encountering any issues.
tools: Read, Edit, Bash, Grep, Glob
---

You are an expert debugger specializing in root cause analysis.

When invoked:
1. Capture error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify solution works

Debugging process:
- Analyze error messages and logs
- Check recent code changes
- Form and test hypotheses
- Add strategic debug logging
- Inspect variable states

For each issue, provide:
- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach
- Prevention recommendations

Focus on fixing the underlying issue, not the symptoms.
```

### 데이터 사이언티스트

데이터 분석 작업을 위한 도메인 특화 서브에이전트입니다. 이 예제는 일반적인 코딩 작업 외의 전문 워크플로우를 위한 서브에이전트를 만드는 방법을 보여줍니다. 더 뛰어난 분석 능력을 위해 `model: sonnet`을 명시적으로 설정합니다.

```markdown  theme={null}
---
name: data-scientist
description: Data analysis expert for SQL queries, BigQuery operations, and data insights. Use proactively for data analysis tasks and queries.
tools: Bash, Read, Write
model: sonnet
---

You are a data scientist specializing in SQL and BigQuery analysis.

When invoked:
1. Understand the data analysis requirement
2. Write efficient SQL queries
3. Use BigQuery command line tools (bq) when appropriate
4. Analyze and summarize results
5. Present findings clearly

Key practices:
- Write optimized SQL queries with proper filters
- Use appropriate aggregations and joins
- Include comments explaining complex logic
- Format results for readability
- Provide data-driven recommendations

For each analysis:
- Explain the query approach
- Document any assumptions
- Highlight key findings
- Suggest next steps based on data

Always ensure queries are efficient and cost-effective.
```

### 데이터베이스 쿼리 검증기

Bash 접근을 허용하지만 읽기 전용 SQL 쿼리만 허용하도록 명령어를 검증하는 서브에이전트입니다. 이 예제는 `tools` 필드보다 더 세밀한 제어가 필요할 때 `PreToolUse` 훅을 사용하여 조건부 검증을 수행하는 방법을 보여줍니다.

```markdown  theme={null}
---
name: db-reader
description: Execute read-only database queries. Use when analyzing data or generating reports.
tools: Bash
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "./scripts/validate-readonly-query.sh"
---

You are a database analyst with read-only access. Execute SELECT queries to answer questions about the data.

When asked to analyze data:
1. Identify which tables contain the relevant data
2. Write efficient SELECT queries with appropriate filters
3. Present results clearly with context

You cannot modify data. If asked to INSERT, UPDATE, DELETE, or modify schema, explain that you only have read access.
```

Claude Code는 [훅 입력을 JSON으로 전달](/en/hooks#pretooluse-input)하여 stdin을 통해 훅 명령어에 전달합니다. 유효성 검사 스크립트는 이 JSON을 읽고, 실행 중인 명령어를 추출하여 SQL 쓰기 작업 목록과 비교합니다. 쓰기 작업이 감지되면 스크립트는 [종료 코드 2로 종료](/en/hooks#exit-code-2-behavior-per-event)하여 실행을 차단하고 stderr을 통해 Claude에 오류 메시지를 반환합니다.

프로젝트 어디에나 유효성 검사 스크립트를 생성할 수 있습니다. 경로는 훅 구성의 `command` 필드와 일치해야 합니다:

```bash  theme={null}
#!/bin/bash
# SQL 쓰기 작업을 차단하고, SELECT 쿼리를 허용

# stdin에서 JSON 입력 읽기
INPUT=$(cat)

# jq를 사용하여 tool_input에서 command 필드 추출
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$COMMAND" ]; then
  exit 0
fi

# 쓰기 작업 차단 (대소문자 무시)
if echo "$COMMAND" | grep -iE '\b(INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|TRUNCATE|REPLACE|MERGE)\b' > /dev/null; then
  echo "Blocked: Write operations not allowed. Use SELECT queries only." >&2
  exit 2
fi

exit 0
```

스크립트를 실행 가능하게 만듭니다:

```bash  theme={null}
chmod +x ./scripts/validate-readonly-query.sh
```

훅은 `tool_input.command`에 Bash 명령어가 포함된 JSON을 stdin을 통해 받습니다. 종료 코드 2는 작업을 차단하고 오류 메시지를 Claude에 피드백합니다. 종료 코드에 대한 자세한 내용은 [훅](/en/hooks#exit-code-output)을, 완전한 입력 스키마는 [훅 입력](/en/hooks#pretooluse-input)을 참조하세요.

## 다음 단계

서브에이전트를 이해했으니 다음 관련 기능을 살펴보세요:

* [플러그인으로 서브에이전트 배포](/en/plugins) — 팀이나 프로젝트 간에 서브에이전트 공유
* [Claude Code를 프로그래밍 방식으로 실행](/en/headless) — CI/CD 및 자동화를 위한 Agent SDK
* [MCP 서버 사용](/en/mcp) — 서브에이전트에 외부 도구 및 데이터 접근 권한 부여
