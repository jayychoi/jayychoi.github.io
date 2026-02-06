# 스킬로 Claude 확장하기

> Claude Code에서 Claude의 기능을 확장하는 스킬을 생성, 관리, 공유합니다. 커스텀 슬래시 커맨드를 포함합니다.

스킬은 Claude가 할 수 있는 일을 확장합니다. 지침이 담긴 `SKILL.md` 파일을 만들면 Claude가 자신의 도구 모음에 추가합니다. Claude는 관련성이 있을 때 스킬을 자동으로 사용하며, `/skill-name`으로 직접 호출할 수도 있습니다.

<Note>
  `/help`, `/compact` 같은 내장 커맨드는 [인터랙티브 모드](/en/interactive-mode#built-in-commands)를 참고하세요.

  **커스텀 슬래시 커맨드가 스킬로 통합되었습니다.** `.claude/commands/review.md`에 있는 파일과 `.claude/skills/review/SKILL.md`에 있는 스킬 모두 `/review`를 생성하며 동일하게 작동합니다. 기존 `.claude/commands/` 파일은 계속 작동합니다. 스킬은 추가 기능을 제공합니다: 보조 파일을 위한 디렉토리, [호출 주체를 제어](#호출-주체-제어하기)하기 위한 프론트매터, 그리고 관련성이 있을 때 Claude가 자동으로 로드하는 기능.
</Note>

Claude Code 스킬은 여러 AI 도구에서 작동하는 [Agent Skills](https://agentskills.io) 오픈 표준을 따릅니다. Claude Code는 [호출 제어](#호출-주체-제어하기), [서브에이전트 실행](#서브에이전트에서-스킬-실행하기), [동적 컨텍스트 주입](#동적-컨텍스트-주입) 같은 추가 기능으로 표준을 확장합니다.

## 시작하기

### 첫 번째 스킬 만들기

이 예제는 Claude에게 시각적 다이어그램과 비유를 사용하여 코드를 설명하도록 가르치는 스킬을 만듭니다. 기본 프론트매터를 사용하므로, 무언가가 어떻게 작동하는지 물어볼 때 Claude가 자동으로 로드할 수 있고, `/explain-code`로 직접 호출할 수도 있습니다.

<Steps>
  <Step title="스킬 디렉토리 생성">
    개인 스킬 폴더에 스킬 디렉토리를 만듭니다. 개인 스킬은 모든 프로젝트에서 사용할 수 있습니다.

    ```bash  theme={null}
    mkdir -p ~/.claude/skills/explain-code
    ```
  </Step>

  <Step title="SKILL.md 작성">
    모든 스킬에는 두 부분으로 구성된 `SKILL.md` 파일이 필요합니다: Claude에게 스킬 사용 시기를 알려주는 YAML 프론트매터(`---` 마커 사이)와 스킬이 호출될 때 Claude가 따르는 마크다운 내용. `name` 필드는 `/슬래시-커맨드`가 되며, `description`은 Claude가 자동으로 로드할 시기를 결정하는 데 도움을 줍니다.

    `~/.claude/skills/explain-code/SKILL.md`를 생성합니다:

    ```yaml  theme={null}
    ---
    name: explain-code
    description: 시각적 다이어그램과 비유를 사용하여 코드를 설명합니다. 코드 작동 방식을 설명하거나, 코드베이스에 대해 가르치거나, 사용자가 "이게 어떻게 작동하나요?"라고 물을 때 사용합니다.
    ---

    코드를 설명할 때 항상 다음을 포함하세요:

    1. **비유로 시작하기**: 코드를 일상생활의 무언가와 비교
    2. **다이어그램 그리기**: ASCII 아트를 사용하여 흐름, 구조 또는 관계를 표시
    3. **코드 따라가기**: 무슨 일이 일어나는지 단계별로 설명
    4. **주의점 강조**: 흔한 실수나 오해는 무엇인가?

    설명은 대화체로 유지하세요. 복잡한 개념에는 여러 비유를 사용하세요.
    ```
  </Step>

  <Step title="스킬 테스트">
    두 가지 방법으로 테스트할 수 있습니다:

    **설명과 일치하는 질문으로 Claude가 자동 호출하게 하기:**

    ```
    이 코드는 어떻게 작동하나요?
    ```

    **또는 스킬 이름으로 직접 호출하기:**

    ```
    /explain-code src/auth/login.ts
    ```

    어느 방법이든 Claude는 설명에 비유와 ASCII 다이어그램을 포함해야 합니다.
  </Step>
</Steps>

### 스킬이 위치하는 곳

스킬을 저장하는 위치에 따라 누가 사용할 수 있는지 결정됩니다:

| 위치     | 경로                                                     | 적용 범위                        |
| :------- | :------------------------------------------------------- | :------------------------------- |
| 엔터프라이즈 | [관리 설정](/en/permissions#managed-settings) 참고      | 조직의 모든 사용자               |
| 개인     | `~/.claude/skills/<skill-name>/SKILL.md`                 | 모든 프로젝트                    |
| 프로젝트 | `.claude/skills/<skill-name>/SKILL.md`                   | 해당 프로젝트만                  |
| 플러그인 | `<plugin>/skills/<skill-name>/SKILL.md`                  | 플러그인이 활성화된 곳           |

같은 이름의 스킬이 여러 레벨에 존재할 경우, 우선순위가 높은 위치가 우선합니다: 엔터프라이즈 > 개인 > 프로젝트. 플러그인 스킬은 `plugin-name:skill-name` 네임스페이스를 사용하므로 다른 레벨과 충돌하지 않습니다. `.claude/commands/`에 파일이 있는 경우 동일하게 작동하지만, 스킬과 커맨드가 같은 이름을 공유하면 스킬이 우선합니다.

#### 중첩 디렉토리에서의 자동 검색

하위 디렉토리의 파일로 작업할 때, Claude Code는 중첩된 `.claude/skills/` 디렉토리에서 스킬을 자동으로 검색합니다. 예를 들어 `packages/frontend/`의 파일을 편집 중이라면, Claude Code는 `packages/frontend/.claude/skills/`에서도 스킬을 찾습니다. 이는 패키지별로 고유한 스킬이 있는 모노레포 구조를 지원합니다.

각 스킬은 `SKILL.md`를 진입점으로 하는 디렉토리입니다:

```
my-skill/
├── SKILL.md           # 메인 지침 (필수)
├── template.md        # Claude가 채울 템플릿
├── examples/
│   └── sample.md      # 예상 형식을 보여주는 예제 출력
└── scripts/
    └── validate.sh    # Claude가 실행할 수 있는 스크립트
```

`SKILL.md`는 메인 지침을 포함하며 필수입니다. 다른 파일은 선택 사항이며 더 강력한 스킬을 구축할 수 있게 해줍니다: Claude가 채울 템플릿, 예상 형식을 보여주는 예제 출력, Claude가 실행할 수 있는 스크립트, 또는 상세한 참조 문서. 이 파일들을 `SKILL.md`에서 참조하여 Claude가 각 파일의 내용과 로드 시기를 알 수 있도록 하세요. 자세한 내용은 [보조 파일 추가](#보조-파일-추가)를 참고하세요.

<Note>
  `.claude/commands/`의 파일도 계속 작동하며 동일한 [프론트매터](#프론트매터-레퍼런스)를 지원합니다. 보조 파일 같은 추가 기능을 지원하므로 스킬이 권장됩니다.
</Note>

## 스킬 구성

스킬은 `SKILL.md` 상단의 YAML 프론트매터와 그 뒤에 오는 마크다운 내용을 통해 구성됩니다.

### 스킬 콘텐츠 유형

스킬 파일에는 어떤 지침이든 포함할 수 있지만, 호출 방식을 고려하면 무엇을 포함할지 결정하는 데 도움이 됩니다:

**참조 콘텐츠**는 Claude가 현재 작업에 적용하는 지식을 추가합니다. 컨벤션, 패턴, 스타일 가이드, 도메인 지식 등입니다. 이 콘텐츠는 인라인으로 실행되어 Claude가 대화 컨텍스트와 함께 사용할 수 있습니다.

```yaml  theme={null}
---
name: api-conventions
description: 이 코드베이스의 API 설계 패턴
---

API 엔드포인트를 작성할 때:
- RESTful 네이밍 규칙 사용
- 일관된 에러 형식 반환
- 요청 유효성 검사 포함
```

**작업 콘텐츠**는 배포, 커밋, 코드 생성 같은 특정 작업에 대한 단계별 지침을 Claude에게 제공합니다. Claude가 실행 시기를 결정하게 하기보다 `/skill-name`으로 직접 호출하는 경우가 많습니다. Claude가 자동으로 트리거하지 못하게 하려면 `disable-model-invocation: true`를 추가하세요.

```yaml  theme={null}
---
name: deploy
description: 애플리케이션을 프로덕션에 배포
context: fork
disable-model-invocation: true
---

애플리케이션 배포:
1. 테스트 스위트 실행
2. 애플리케이션 빌드
3. 배포 대상에 푸시
```

`SKILL.md`에는 무엇이든 포함할 수 있지만, 스킬 호출 방식(사용자, Claude, 또는 둘 다)과 실행 위치(인라인 또는 서브에이전트)를 고려하면 포함할 내용을 결정하는 데 도움이 됩니다. 복잡한 스킬의 경우 메인 스킬에 집중하기 위해 [보조 파일을 추가](#보조-파일-추가)할 수도 있습니다.

### 프론트매터 레퍼런스

마크다운 내용 외에 `SKILL.md` 파일 상단의 `---` 마커 사이에 YAML 프론트매터 필드를 사용하여 스킬 동작을 구성할 수 있습니다:

```yaml  theme={null}
---
name: my-skill
description: 이 스킬이 하는 일
disable-model-invocation: true
allowed-tools: Read, Grep
---

스킬 지침을 여기에 작성...
```

모든 필드는 선택 사항입니다. Claude가 스킬 사용 시기를 알 수 있도록 `description`만 권장됩니다.

| 필드                        | 필수 여부   | 설명                                                                                                                                                  |
| :-------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                      | 아니오      | 스킬의 표시 이름. 생략하면 디렉토리 이름을 사용합니다. 소문자, 숫자, 하이픈만 사용 가능(최대 64자).                                                    |
| `description`               | 권장        | 스킬의 기능과 사용 시기. Claude가 스킬 적용 시기를 결정하는 데 사용합니다. 생략하면 마크다운 내용의 첫 번째 단락을 사용합니다.                           |
| `argument-hint`             | 아니오      | 자동완성 중 예상 인수를 나타내는 힌트. 예: `[issue-number]` 또는 `[filename] [format]`.                                                                |
| `disable-model-invocation`  | 아니오      | `true`로 설정하면 Claude가 이 스킬을 자동으로 로드하지 않습니다. `/name`으로 수동 트리거하려는 워크플로에 사용. 기본값: `false`.                         |
| `user-invocable`            | 아니오      | `false`로 설정하면 `/` 메뉴에서 숨깁니다. 사용자가 직접 호출하면 안 되는 배경 지식에 사용. 기본값: `true`.                                               |
| `allowed-tools`             | 아니오      | 이 스킬이 활성화되었을 때 Claude가 권한 요청 없이 사용할 수 있는 도구.                                                                                  |
| `model`                     | 아니오      | 이 스킬이 활성화되었을 때 사용할 모델.                                                                                                                  |
| `context`                   | 아니오      | 포크된 서브에이전트 컨텍스트에서 실행하려면 `fork`로 설정.                                                                                               |
| `agent`                     | 아니오      | `context: fork` 설정 시 사용할 서브에이전트 유형.                                                                                                        |
| `hooks`                     | 아니오      | 이 스킬의 라이프사이클에 한정된 훅. 구성 형식은 [스킬과 에이전트의 훅](/en/hooks#hooks-in-skills-and-agents)을 참고하세요.                                |

#### 사용 가능한 문자열 치환

스킬은 스킬 콘텐츠에서 동적 값을 위한 문자열 치환을 지원합니다:

| 변수                   | 설명                                                                                                                                        |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `$ARGUMENTS`           | 스킬 호출 시 전달된 모든 인수. 콘텐츠에 `$ARGUMENTS`가 없으면 인수가 `ARGUMENTS: <값>`으로 끝에 추가됩니다.                                   |
| `$ARGUMENTS[N]`        | 0부터 시작하는 인덱스로 특정 인수에 접근. 예: 첫 번째 인수는 `$ARGUMENTS[0]`.                                                                 |
| `$N`                   | `$ARGUMENTS[N]`의 축약형. 예: 첫 번째 인수는 `$0`, 두 번째는 `$1`.                                                                           |
| `${CLAUDE_SESSION_ID}` | 현재 세션 ID. 로깅, 세션별 파일 생성, 또는 스킬 출력과 세션을 연관시키는 데 유용합니다.                                                       |

**치환 사용 예제:**

```yaml  theme={null}
---
name: session-logger
description: 이 세션의 활동을 기록
---

logs/${CLAUDE_SESSION_ID}.log에 다음을 기록하세요:

$ARGUMENTS
```

### 보조 파일 추가

스킬은 디렉토리에 여러 파일을 포함할 수 있습니다. 이를 통해 `SKILL.md`는 핵심 사항에 집중하고 Claude가 필요할 때만 상세한 참조 자료에 접근할 수 있습니다. 대용량 참조 문서, API 명세, 또는 예제 모음은 스킬이 실행될 때마다 컨텍스트에 로드할 필요가 없습니다.

```
my-skill/
├── SKILL.md (필수 - 개요 및 탐색)
├── reference.md (상세 API 문서 - 필요 시 로드)
├── examples.md (사용 예제 - 필요 시 로드)
└── scripts/
    └── helper.py (유틸리티 스크립트 - 로드하지 않고 실행)
```

`SKILL.md`에서 보조 파일을 참조하여 Claude가 각 파일의 내용과 로드 시기를 알 수 있도록 합니다:

```markdown  theme={null}
## 추가 리소스

- 전체 API 세부 정보는 [reference.md](reference.md)를 참고하세요
- 사용 예제는 [examples.md](examples.md)를 참고하세요
```

<Tip>`SKILL.md`는 500줄 이하로 유지하세요. 상세한 참조 자료는 별도의 파일로 이동하세요.</Tip>

### 호출 주체 제어하기

기본적으로 사용자와 Claude 모두 스킬을 호출할 수 있습니다. `/skill-name`을 입력하여 직접 호출할 수 있고, Claude는 대화에 관련이 있을 때 자동으로 로드할 수 있습니다. 두 개의 프론트매터 필드로 이를 제한할 수 있습니다:

* **`disable-model-invocation: true`**: 사용자만 스킬을 호출할 수 있습니다. 부작용이 있거나 타이밍을 제어하고 싶은 워크플로에 사용합니다. `/commit`, `/deploy`, `/send-slack-message` 같은 것들이 해당됩니다. 코드가 준비된 것처럼 보인다고 Claude가 배포를 결정하는 것은 원하지 않을 것입니다.

* **`user-invocable: false`**: Claude만 스킬을 호출할 수 있습니다. 커맨드로서는 실행 가능한 동작이 아닌 배경 지식에 사용합니다. `legacy-system-context` 스킬은 이전 시스템의 작동 방식을 설명합니다. Claude가 관련 시 이를 알아야 하지만, `/legacy-system-context`는 사용자에게 의미 있는 동작이 아닙니다.

이 예제는 사용자만 트리거할 수 있는 배포 스킬을 만듭니다. `disable-model-invocation: true` 필드가 Claude가 자동으로 실행하는 것을 방지합니다:

```yaml  theme={null}
---
name: deploy
description: 애플리케이션을 프로덕션에 배포
disable-model-invocation: true
---

$ARGUMENTS를 프로덕션에 배포:

1. 테스트 스위트 실행
2. 애플리케이션 빌드
3. 배포 대상에 푸시
4. 배포 성공 여부 확인
```

두 필드가 호출 및 컨텍스트 로딩에 미치는 영향은 다음과 같습니다:

| 프론트매터                         | 사용자 호출 가능 | Claude 호출 가능 | 컨텍스트 로딩 시기                                         |
| :--------------------------------- | :------------- | :--------------- | :--------------------------------------------------------- |
| (기본값)                            | 예             | 예               | 설명이 항상 컨텍스트에, 전체 스킬은 호출 시 로드            |
| `disable-model-invocation: true`   | 예             | 아니오           | 설명이 컨텍스트에 없음, 전체 스킬은 사용자 호출 시 로드     |
| `user-invocable: false`            | 아니오         | 예               | 설명이 항상 컨텍스트에, 전체 스킬은 호출 시 로드            |

<Note>
  일반 세션에서는 Claude가 사용 가능한 것을 알 수 있도록 스킬 설명이 컨텍스트에 로드되지만, 전체 스킬 내용은 호출 시에만 로드됩니다. [사전 로드된 스킬을 가진 서브에이전트](/en/sub-agents#preload-skills-into-subagents)는 다르게 작동합니다: 전체 스킬 내용이 시작 시 주입됩니다.
</Note>

### 도구 접근 제한

`allowed-tools` 필드를 사용하여 스킬이 활성화되었을 때 Claude가 사용할 수 있는 도구를 제한합니다. 이 스킬은 Claude가 파일을 탐색할 수 있지만 수정할 수 없는 읽기 전용 모드를 만듭니다:

```yaml  theme={null}
---
name: safe-reader
description: 변경 없이 파일 읽기
allowed-tools: Read, Grep, Glob
---
```

### 스킬에 인수 전달

사용자와 Claude 모두 스킬을 호출할 때 인수를 전달할 수 있습니다. 인수는 `$ARGUMENTS` 플레이스홀더를 통해 사용 가능합니다.

이 스킬은 번호로 GitHub 이슈를 수정합니다. `$ARGUMENTS` 플레이스홀더는 스킬 이름 뒤에 오는 것으로 대체됩니다:

```yaml  theme={null}
---
name: fix-issue
description: GitHub 이슈 수정
disable-model-invocation: true
---

코딩 표준에 따라 GitHub 이슈 $ARGUMENTS를 수정하세요.

1. 이슈 설명 읽기
2. 요구사항 이해
3. 수정 구현
4. 테스트 작성
5. 커밋 생성
```

`/fix-issue 123`을 실행하면 Claude는 "코딩 표준에 따라 GitHub 이슈 123을 수정하세요..."를 받습니다.

인수와 함께 스킬을 호출했지만 스킬에 `$ARGUMENTS`가 포함되어 있지 않으면, Claude Code는 스킬 내용 끝에 `ARGUMENTS: <입력값>`을 추가하여 Claude가 입력한 내용을 볼 수 있도록 합니다.

위치별로 개별 인수에 접근하려면 `$ARGUMENTS[N]` 또는 축약형 `$N`을 사용합니다:

```yaml  theme={null}
---
name: migrate-component
description: 하나의 프레임워크에서 다른 프레임워크로 컴포넌트 마이그레이션
---

$ARGUMENTS[0] 컴포넌트를 $ARGUMENTS[1]에서 $ARGUMENTS[2]로 마이그레이션하세요.
기존의 모든 동작과 테스트를 보존하세요.
```

`/migrate-component SearchBar React Vue`를 실행하면 `$ARGUMENTS[0]`이 `SearchBar`로, `$ARGUMENTS[1]`이 `React`로, `$ARGUMENTS[2]`가 `Vue`로 대체됩니다. `$N` 축약형을 사용한 동일한 스킬:

```yaml  theme={null}
---
name: migrate-component
description: 하나의 프레임워크에서 다른 프레임워크로 컴포넌트 마이그레이션
---

$0 컴포넌트를 $1에서 $2로 마이그레이션하세요.
기존의 모든 동작과 테스트를 보존하세요.
```

## 고급 패턴

### 동적 컨텍스트 주입

`!`command\`\` 구문은 스킬 내용이 Claude에게 전송되기 전에 셸 명령을 실행합니다. 명령 출력이 플레이스홀더를 대체하므로 Claude는 명령 자체가 아닌 실제 데이터를 받습니다.

이 스킬은 GitHub CLI로 실시간 PR 데이터를 가져와 풀 리퀘스트를 요약합니다. `!`gh pr diff\`\`와 다른 명령들이 먼저 실행되고, 그 출력이 프롬프트에 삽입됩니다:

```yaml  theme={null}
---
name: pr-summary
description: 풀 리퀘스트의 변경사항 요약
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## 풀 리퀘스트 컨텍스트
- PR diff: !`gh pr diff`
- PR 댓글: !`gh pr view --comments`
- 변경된 파일: !`gh pr diff --name-only`

## 작업
이 풀 리퀘스트를 요약하세요...
```

이 스킬이 실행될 때:

1. 각 `!`command\`\`가 즉시 실행됩니다 (Claude가 보기 전에)
2. 출력이 스킬 내용의 플레이스홀더를 대체합니다
3. Claude는 실제 PR 데이터가 포함된 완전히 렌더링된 프롬프트를 받습니다

이것은 전처리이며, Claude가 실행하는 것이 아닙니다. Claude는 최종 결과만 봅니다.

<Tip>
  스킬에서 [확장된 사고](/en/common-workflows#use-extended-thinking-thinking-mode)를 활성화하려면 스킬 내용 어디에든 "ultrathink"이라는 단어를 포함하세요.
</Tip>

### 서브에이전트에서 스킬 실행하기

스킬을 격리된 환경에서 실행하려면 프론트매터에 `context: fork`를 추가하세요. 스킬 내용이 서브에이전트를 구동하는 프롬프트가 됩니다. 대화 기록에 접근할 수 없습니다.

<Warning>
  `context: fork`는 명시적 지침이 있는 스킬에서만 의미가 있습니다. 스킬이 작업 없이 "이 API 규칙을 사용하세요" 같은 가이드라인만 포함하면, 서브에이전트가 가이드라인을 받지만 실행 가능한 프롬프트가 없어 의미 있는 출력 없이 반환됩니다.
</Warning>

스킬과 [서브에이전트](/en/sub-agents)는 두 방향으로 함께 작동합니다:

| 접근 방식                    | 시스템 프롬프트                            | 작업                        | 추가 로드                    |
| :--------------------------- | :---------------------------------------- | :-------------------------- | :--------------------------- |
| `context: fork`가 있는 스킬   | 에이전트 유형에서 (`Explore`, `Plan` 등)    | SKILL.md 내용               | CLAUDE.md                    |
| `skills` 필드가 있는 서브에이전트 | 서브에이전트의 마크다운 본문               | Claude의 위임 메시지          | 사전 로드된 스킬 + CLAUDE.md  |

`context: fork`를 사용하면 스킬에 작업을 작성하고 실행할 에이전트 유형을 선택합니다. 반대로 (스킬을 참조 자료로 사용하는 커스텀 서브에이전트를 정의하는 방법)는 [서브에이전트](/en/sub-agents#preload-skills-into-subagents)를 참고하세요.

#### 예제: Explore 에이전트를 사용한 리서치 스킬

이 스킬은 포크된 Explore 에이전트에서 리서치를 실행합니다. 스킬 내용이 작업이 되며, 에이전트는 코드베이스 탐색에 최적화된 읽기 전용 도구를 제공합니다:

```yaml  theme={null}
---
name: deep-research
description: 주제를 철저히 조사
context: fork
agent: Explore
---

$ARGUMENTS를 철저히 조사하세요:

1. Glob과 Grep을 사용하여 관련 파일 찾기
2. 코드 읽기 및 분석
3. 구체적인 파일 참조와 함께 발견사항 요약
```

이 스킬이 실행될 때:

1. 새로운 격리된 컨텍스트가 생성됩니다
2. 서브에이전트가 스킬 내용을 프롬프트로 받습니다 ("$ARGUMENTS를 철저히 조사하세요...")
3. `agent` 필드가 실행 환경(모델, 도구, 권한)을 결정합니다
4. 결과가 요약되어 메인 대화로 반환됩니다

`agent` 필드는 사용할 서브에이전트 구성을 지정합니다. 옵션에는 내장 에이전트(`Explore`, `Plan`, `general-purpose`) 또는 `.claude/agents/`의 커스텀 서브에이전트가 포함됩니다. 생략하면 `general-purpose`를 사용합니다.

### Claude의 스킬 접근 제한

기본적으로 Claude는 `disable-model-invocation: true`가 설정되지 않은 모든 스킬을 호출할 수 있습니다. `allowed-tools`를 정의한 스킬은 스킬이 활성화되었을 때 해당 도구에 대한 사용별 승인 없이 Claude에게 접근 권한을 부여합니다. [권한 설정](/en/permissions)은 다른 모든 도구에 대한 기본 승인 동작을 여전히 관리합니다. `/compact`, `/init` 같은 내장 커맨드는 Skill 도구를 통해 사용할 수 없습니다.

Claude가 호출할 수 있는 스킬을 제어하는 세 가지 방법:

**모든 스킬 비활성화** - `/permissions`에서 Skill 도구를 거부합니다:

```
# 거부 규칙에 추가:
Skill
```

**특정 스킬 허용 또는 거부** - [권한 규칙](/en/permissions) 사용:

```
# 특정 스킬만 허용
Skill(commit)
Skill(review-pr *)

# 특정 스킬 거부
Skill(deploy *)
```

권한 구문: `Skill(name)`은 정확한 일치, `Skill(name *)`은 인수를 포함한 접두사 일치.

**개별 스킬 숨기기** - 프론트매터에 `disable-model-invocation: true`를 추가합니다. 이는 Claude의 컨텍스트에서 스킬을 완전히 제거합니다.

<Note>
  `user-invocable` 필드는 메뉴 가시성만 제어하며 Skill 도구 접근은 제어하지 않습니다. 프로그래밍 방식의 호출을 차단하려면 `disable-model-invocation: true`를 사용하세요.
</Note>

## 스킬 공유

스킬은 대상에 따라 다른 범위로 배포할 수 있습니다:

* **프로젝트 스킬**: `.claude/skills/`를 버전 관리에 커밋
* **플러그인**: [플러그인](/en/plugins)에 `skills/` 디렉토리 생성
* **관리형**: [관리 설정](/en/permissions#managed-settings)을 통해 조직 전체에 배포

### 시각적 출력 생성

스킬은 모든 언어로 된 스크립트를 번들링하고 실행할 수 있어 단일 프롬프트로는 불가능한 기능을 Claude에게 제공합니다. 강력한 패턴 중 하나는 시각적 출력 생성입니다: 데이터 탐색, 디버깅, 또는 보고서 생성을 위해 브라우저에서 열리는 인터랙티브 HTML 파일입니다.

이 예제는 코드베이스 탐색기를 만듭니다: 디렉토리를 펼치고 접을 수 있고, 파일 크기를 한눈에 볼 수 있으며, 색상으로 파일 유형을 식별할 수 있는 인터랙티브 트리 뷰입니다.

스킬 디렉토리를 생성합니다:

```bash  theme={null}
mkdir -p ~/.claude/skills/codebase-visualizer/scripts
```

`~/.claude/skills/codebase-visualizer/SKILL.md`를 생성합니다. 설명은 Claude에게 이 스킬을 활성화할 시기를 알려주고, 지침은 Claude에게 번들된 스크립트를 실행하도록 합니다:

````yaml  theme={null}
---
name: codebase-visualizer
description: 코드베이스의 인터랙티브 접이식 트리 시각화를 생성합니다. 새 저장소를 탐색하거나, 프로젝트 구조를 이해하거나, 대용량 파일을 식별할 때 사용합니다.
allowed-tools: Bash(python *)
---

# 코드베이스 시각화 도구

프로젝트의 파일 구조를 접을 수 있는 디렉토리와 함께 인터랙티브 HTML 트리 뷰로 생성합니다.

## 사용법

프로젝트 루트에서 시각화 스크립트를 실행합니다:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```

현재 디렉토리에 `codebase-map.html`을 생성하고 기본 브라우저에서 엽니다.

## 시각화가 보여주는 것

- **접이식 디렉토리**: 폴더를 클릭하여 펼치기/접기
- **파일 크기**: 각 파일 옆에 표시
- **색상**: 파일 유형별 다른 색상
- **디렉토리 합계**: 각 폴더의 총 크기 표시
````

`~/.claude/skills/codebase-visualizer/scripts/visualize.py`를 생성합니다. 이 스크립트는 디렉토리 트리를 스캔하고 다음을 포함하는 자체 완결형 HTML 파일을 생성합니다:

* 파일 수, 디렉토리 수, 총 크기, 파일 유형 수를 보여주는 **요약 사이드바**
* 파일 유형별(크기 기준 상위 8개) 코드베이스를 분류하는 **막대 차트**
* 디렉토리를 펼치고 접을 수 있는 **접이식 트리** (색상 코드 파일 유형 표시기 포함)

스크립트는 Python이 필요하지만 내장 라이브러리만 사용하므로 설치할 패키지가 없습니다:

```python expandable theme={null}
#!/usr/bin/env python3
"""코드베이스의 인터랙티브 접이식 트리 시각화를 생성합니다."""

import json
import sys
import webbrowser
from pathlib import Path
from collections import Counter

IGNORE = {'.git', 'node_modules', '__pycache__', '.venv', 'venv', 'dist', 'build'}

def scan(path: Path, stats: dict) -> dict:
    result = {"name": path.name, "children": [], "size": 0}
    try:
        for item in sorted(path.iterdir()):
            if item.name in IGNORE or item.name.startswith('.'):
                continue
            if item.is_file():
                size = item.stat().st_size
                ext = item.suffix.lower() or '(no ext)'
                result["children"].append({"name": item.name, "size": size, "ext": ext})
                result["size"] += size
                stats["files"] += 1
                stats["extensions"][ext] += 1
                stats["ext_sizes"][ext] += size
            elif item.is_dir():
                stats["dirs"] += 1
                child = scan(item, stats)
                if child["children"]:
                    result["children"].append(child)
                    result["size"] += child["size"]
    except PermissionError:
        pass
    return result

def generate_html(data: dict, stats: dict, output: Path) -> None:
    ext_sizes = stats["ext_sizes"]
    total_size = sum(ext_sizes.values()) or 1
    sorted_exts = sorted(ext_sizes.items(), key=lambda x: -x[1])[:8]
    colors = {
        '.js': '#f7df1e', '.ts': '#3178c6', '.py': '#3776ab', '.go': '#00add8',
        '.rs': '#dea584', '.rb': '#cc342d', '.css': '#264de4', '.html': '#e34c26',
        '.json': '#6b7280', '.md': '#083fa1', '.yaml': '#cb171e', '.yml': '#cb171e',
        '.mdx': '#083fa1', '.tsx': '#3178c6', '.jsx': '#61dafb', '.sh': '#4eaa25',
    }
    lang_bars = "".join(
        f'<div class="bar-row"><span class="bar-label">{ext}</span>'
        f'<div class="bar" style="width:{(size/total_size)*100}%;background:{colors.get(ext,"#6b7280")}"></div>'
        f'<span class="bar-pct">{(size/total_size)*100:.1f}%</span></div>'
        for ext, size in sorted_exts
    )
    def fmt(b):
        if b < 1024: return f"{b} B"
        if b < 1048576: return f"{b/1024:.1f} KB"
        return f"{b/1048576:.1f} MB"

    html = f'''<!DOCTYPE html>
<html><head>
  <meta charset="utf-8"><title>Codebase Explorer</title>
  <style>
    body {{ font: 14px/1.5 system-ui, sans-serif; margin: 0; background: #1a1a2e; color: #eee; }}
    .container {{ display: flex; height: 100vh; }}
    .sidebar {{ width: 280px; background: #252542; padding: 20px; border-right: 1px solid #3d3d5c; overflow-y: auto; flex-shrink: 0; }}
    .main {{ flex: 1; padding: 20px; overflow-y: auto; }}
    h1 {{ margin: 0 0 10px 0; font-size: 18px; }}
    h2 {{ margin: 20px 0 10px 0; font-size: 14px; color: #888; text-transform: uppercase; }}
    .stat {{ display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #3d3d5c; }}
    .stat-value {{ font-weight: bold; }}
    .bar-row {{ display: flex; align-items: center; margin: 6px 0; }}
    .bar-label {{ width: 55px; font-size: 12px; color: #aaa; }}
    .bar {{ height: 18px; border-radius: 3px; }}
    .bar-pct {{ margin-left: 8px; font-size: 12px; color: #666; }}
    .tree {{ list-style: none; padding-left: 20px; }}
    details {{ cursor: pointer; }}
    summary {{ padding: 4px 8px; border-radius: 4px; }}
    summary:hover {{ background: #2d2d44; }}
    .folder {{ color: #ffd700; }}
    .file {{ display: flex; align-items: center; padding: 4px 8px; border-radius: 4px; }}
    .file:hover {{ background: #2d2d44; }}
    .size {{ color: #888; margin-left: auto; font-size: 12px; }}
    .dot {{ width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }}
  </style>
</head><body>
  <div class="container">
    <div class="sidebar">
      <h1>📊 Summary</h1>
      <div class="stat"><span>Files</span><span class="stat-value">{stats["files"]:,}</span></div>
      <div class="stat"><span>Directories</span><span class="stat-value">{stats["dirs"]:,}</span></div>
      <div class="stat"><span>Total size</span><span class="stat-value">{fmt(data["size"])}</span></div>
      <div class="stat"><span>File types</span><span class="stat-value">{len(stats["extensions"])}</span></div>
      <h2>By file type</h2>
      {lang_bars}
    </div>
    <div class="main">
      <h1>📁 {data["name"]}</h1>
      <ul class="tree" id="root"></ul>
    </div>
  </div>
  <script>
    const data = {json.dumps(data)};
    const colors = {json.dumps(colors)};
    function fmt(b) {{ if (b < 1024) return b + ' B'; if (b < 1048576) return (b/1024).toFixed(1) + ' KB'; return (b/1048576).toFixed(1) + ' MB'; }}
    function render(node, parent) {{
      if (node.children) {{
        const det = document.createElement('details');
        det.open = parent === document.getElementById('root');
        det.innerHTML = `<summary><span class="folder">📁 ${{node.name}}</span><span class="size">${{fmt(node.size)}}</span></summary>`;
        const ul = document.createElement('ul'); ul.className = 'tree';
        node.children.sort((a,b) => (b.children?1:0)-(a.children?1:0) || a.name.localeCompare(b.name));
        node.children.forEach(c => render(c, ul));
        det.appendChild(ul);
        const li = document.createElement('li'); li.appendChild(det); parent.appendChild(li);
      }} else {{
        const li = document.createElement('li'); li.className = 'file';
        li.innerHTML = `<span class="dot" style="background:${{colors[node.ext]||'#6b7280'}}"></span>${{node.name}}<span class="size">${{fmt(node.size)}}</span>`;
        parent.appendChild(li);
      }}
    }}
    data.children.forEach(c => render(c, document.getElementById('root')));
  </script>
</body></html>'''
    output.write_text(html)

if __name__ == '__main__':
    target = Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
    stats = {"files": 0, "dirs": 0, "extensions": Counter(), "ext_sizes": Counter()}
    data = scan(target, stats)
    out = Path('codebase-map.html')
    generate_html(data, stats, out)
    print(f'Generated {out.absolute()}')
    webbrowser.open(f'file://{out.absolute()}')
```

테스트하려면 아무 프로젝트에서 Claude Code를 열고 "이 코드베이스를 시각화해 줘"라고 요청하세요. Claude가 스크립트를 실행하고 `codebase-map.html`을 생성하여 브라우저에서 엽니다.

이 패턴은 모든 시각적 출력에 적용됩니다: 의존성 그래프, 테스트 커버리지 보고서, API 문서, 또는 데이터베이스 스키마 시각화. 번들된 스크립트가 무거운 작업을 처리하고 Claude가 오케스트레이션을 담당합니다.

## 트러블슈팅

### 스킬이 트리거되지 않는 경우

Claude가 예상대로 스킬을 사용하지 않는 경우:

1. 설명에 사용자가 자연스럽게 말할 키워드가 포함되어 있는지 확인
2. `사용 가능한 스킬이 무엇인가요?`에서 스킬이 나타나는지 확인
3. 설명과 더 잘 일치하도록 요청을 다시 표현해 보기
4. 스킬이 사용자 호출 가능하면 `/skill-name`으로 직접 호출

### 스킬이 너무 자주 트리거되는 경우

Claude가 원하지 않을 때 스킬을 사용하는 경우:

1. 설명을 더 구체적으로 만들기
2. 수동 호출만 원하면 `disable-model-invocation: true` 추가

### Claude가 모든 스킬을 인식하지 못하는 경우

Claude가 사용 가능한 것을 알 수 있도록 스킬 설명이 컨텍스트에 로드됩니다. 스킬이 많으면 문자 예산(기본 15,000자)을 초과할 수 있습니다. `/context`를 실행하여 제외된 스킬에 대한 경고를 확인하세요.

한도를 늘리려면 `SLASH_COMMAND_TOOL_CHAR_BUDGET` 환경 변수를 설정하세요.

## 관련 리소스

* **[서브에이전트](/en/sub-agents)**: 전문 에이전트에게 작업 위임
* **[플러그인](/en/plugins)**: 다른 확장 기능과 함께 스킬 패키징 및 배포
* **[훅](/en/hooks)**: 도구 이벤트 주변의 워크플로 자동화
* **[메모리](/en/memory)**: 영구 컨텍스트를 위한 CLAUDE.md 파일 관리
* **[인터랙티브 모드](/en/interactive-mode#built-in-commands)**: 내장 커맨드와 단축키
* **[권한](/en/permissions)**: 도구 및 스킬 접근 제어
