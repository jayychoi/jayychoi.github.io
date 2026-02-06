# 스킬로 Claude 확장하기

> Claude Code에서 스킬을 생성, 관리, 공유하여 Claude의 기능을 확장하세요. 커스텀 슬래시 커맨드를 포함합니다.

스킬은 Claude가 할 수 있는 일을 확장합니다. 지시사항이 담긴 `SKILL.md` 파일을 만들면 Claude가 이를 도구 모음에 추가합니다. Claude는 관련 상황에서 스킬을 자동으로 사용하거나, `/skill-name`으로 직접 호출할 수 있습니다.

<Note>
  `/help`나 `/compact` 같은 내장 커맨드는 [인터랙티브 모드](/en/interactive-mode#built-in-commands)를 참조하세요.

  **커스텀 슬래시 커맨드가 스킬로 통합되었습니다.** `.claude/commands/review.md`에 있는 파일과 `.claude/skills/review/SKILL.md`에 있는 스킬은 모두 `/review`를 생성하며 동일하게 작동합니다. 기존 `.claude/commands/` 파일은 계속 작동합니다. 스킬은 추가 기능을 제공합니다: 보조 파일용 디렉토리, [누가 호출할 수 있는지 제어](#스킬-호출-권한-제어)하는 프론트매터, Claude가 관련 상황에서 자동으로 로드하는 기능 등이 있습니다.
</Note>

Claude Code 스킬은 여러 AI 도구에서 작동하는 [Agent Skills](https://agentskills.io) 오픈 표준을 따릅니다. Claude Code는 [호출 제어](#스킬-호출-권한-제어), [서브에이전트 실행](#서브에이전트에서-스킬-실행), [동적 컨텍스트 주입](#동적-컨텍스트-주입) 등의 추가 기능으로 표준을 확장합니다.

## 시작하기

### 첫 번째 스킬 만들기

이 예제는 시각적 다이어그램과 비유를 사용하여 코드를 설명하는 스킬을 만듭니다. 기본 프론트매터를 사용하므로, 무언가가 어떻게 작동하는지 물어볼 때 Claude가 자동으로 로드하거나, `/explain-code`로 직접 호출할 수 있습니다.

<Steps>
  <Step title="스킬 디렉토리 생성">
    개인 스킬 폴더에 스킬 디렉토리를 만듭니다. 개인 스킬은 모든 프로젝트에서 사용할 수 있습니다.

    ```bash  theme={null}
    mkdir -p ~/.claude/skills/explain-code
    ```
  </Step>

  <Step title="SKILL.md 작성">
    모든 스킬에는 두 부분으로 구성된 `SKILL.md` 파일이 필요합니다: `---` 마커 사이의 YAML 프론트매터(Claude에게 언제 스킬을 사용할지 알려줌)와 스킬이 호출될 때 Claude가 따를 지시사항이 담긴 마크다운 콘텐츠. `name` 필드가 `/슬래시-커맨드`가 되며, `description`은 Claude가 자동으로 로드할지 결정하는 데 도움을 줍니다.

    `~/.claude/skills/explain-code/SKILL.md`를 생성합니다:

    ```yaml  theme={null}
    ---
    name: explain-code
    description: 시각적 다이어그램과 비유로 코드를 설명합니다. 코드가 어떻게 작동하는지 설명하거나, 코드베이스에 대해 교육하거나, 사용자가 "이것이 어떻게 작동하나요?"라고 물을 때 사용합니다.
    ---

    코드를 설명할 때 항상 포함하세요:

    1. **비유로 시작**: 코드를 일상생활의 무언가와 비교
    2. **다이어그램 그리기**: ASCII 아트로 흐름, 구조, 관계를 표시
    3. **코드 따라가기**: 단계별로 무슨 일이 일어나는지 설명
    4. **주의사항 강조**: 흔한 실수나 오해는 무엇인가?

    설명은 대화체로 유지하세요. 복잡한 개념에는 여러 비유를 사용하세요.
    ```
  </Step>

  <Step title="스킬 테스트">
    두 가지 방법으로 테스트할 수 있습니다:

    **설명과 일치하는 질문으로 Claude가 자동으로 호출하게 합니다:**

    ```
    이 코드는 어떻게 작동하나요?
    ```

    **또는 스킬 이름으로 직접 호출합니다:**

    ```
    /explain-code src/auth/login.ts
    ```

    어느 쪽이든 Claude는 설명에 비유와 ASCII 다이어그램을 포함해야 합니다.
  </Step>
</Steps>

### 스킬 저장 위치

스킬을 저장하는 위치에 따라 누가 사용할 수 있는지 결정됩니다:

| 위치     | 경로                                                     | 적용 범위                      |
| :------- | :------------------------------------------------------- | :----------------------------- |
| 엔터프라이즈 | [관리 설정](/en/permissions#managed-settings) 참조       | 조직의 모든 사용자             |
| 개인     | `~/.claude/skills/<skill-name>/SKILL.md`                 | 모든 프로젝트                  |
| 프로젝트 | `.claude/skills/<skill-name>/SKILL.md`                   | 이 프로젝트만                  |
| 플러그인 | `<plugin>/skills/<skill-name>/SKILL.md`                  | 플러그인이 활성화된 곳         |

이름이 같은 스킬이 여러 레벨에 있을 때, 더 높은 우선순위의 위치가 우선합니다: 엔터프라이즈 > 개인 > 프로젝트. 플러그인 스킬은 `plugin-name:skill-name` 네임스페이스를 사용하므로 다른 레벨과 충돌하지 않습니다. `.claude/commands/`에 파일이 있는 경우, 동일하게 작동하지만, 스킬과 커맨드가 같은 이름을 공유하면 스킬이 우선합니다.

#### 중첩된 디렉토리에서 자동 발견

하위 디렉토리의 파일을 작업할 때, Claude Code는 중첩된 `.claude/skills/` 디렉토리에서 스킬을 자동으로 발견합니다. 예를 들어, `packages/frontend/`에서 파일을 편집하면, Claude Code는 `packages/frontend/.claude/skills/`에서도 스킬을 찾습니다. 이는 패키지별로 자체 스킬이 있는 모노레포 설정을 지원합니다.

각 스킬은 `SKILL.md`를 진입점으로 하는 디렉토리입니다:

```
my-skill/
├── SKILL.md           # 메인 지시사항 (필수)
├── template.md        # Claude가 작성할 템플릿
├── examples/
│   └── sample.md      # 예상 형식을 보여주는 예제 출력
└── scripts/
    └── validate.sh    # Claude가 실행할 수 있는 스크립트
```

`SKILL.md`는 메인 지시사항을 포함하며 필수입니다. 다른 파일은 선택 사항이며, 더 강력한 스킬을 만들 수 있게 합니다: Claude가 작성할 템플릿, 예상 형식을 보여주는 예제 출력, Claude가 실행할 수 있는 스크립트, 또는 상세한 참조 문서. `SKILL.md`에서 이러한 파일을 참조하여 Claude가 각 파일의 내용과 로드 시점을 알 수 있게 하세요. 자세한 내용은 [보조 파일 추가](#보조-파일-추가)를 참조하세요.

<Note>
  `.claude/commands/`의 파일도 여전히 작동하며 동일한 [프론트매터](#프론트매터-레퍼런스)를 지원합니다. 보조 파일 같은 추가 기능을 지원하는 스킬이 권장됩니다.
</Note>

## 스킬 설정

스킬은 `SKILL.md` 상단의 YAML 프론트매터와 뒤따르는 마크다운 콘텐츠를 통해 설정됩니다.

### 스킬 콘텐츠 유형

스킬 파일에는 어떤 지시사항이든 포함할 수 있지만, 어떻게 호출하고 싶은지 생각하면 무엇을 포함할지 가이드가 됩니다:

**참조 콘텐츠**는 Claude가 현재 작업에 적용할 지식을 추가합니다. 컨벤션, 패턴, 스타일 가이드, 도메인 지식 등입니다. 이 콘텐츠는 인라인으로 실행되어 대화 컨텍스트와 함께 사용할 수 있습니다.

```yaml  theme={null}
---
name: api-conventions
description: 이 코드베이스의 API 설계 패턴
---

API 엔드포인트를 작성할 때:
- RESTful 명명 규칙 사용
- 일관된 에러 형식 반환
- 요청 유효성 검사 포함
```

**태스크 콘텐츠**는 배포, 커밋, 코드 생성 같은 특정 작업을 위한 단계별 지시사항을 제공합니다. 이는 Claude가 언제 실행할지 결정하게 하기보다 `/skill-name`으로 직접 호출하려는 작업인 경우가 많습니다. 자동 트리거를 방지하려면 `disable-model-invocation: true`를 추가하세요.

```yaml  theme={null}
---
name: deploy
description: 애플리케이션을 프로덕션에 배포
context: fork
disable-model-invocation: true
---

애플리케이션을 배포합니다:
1. 테스트 스위트 실행
2. 애플리케이션 빌드
3. 배포 타겟에 푸시
```

`SKILL.md`에는 무엇이든 포함할 수 있지만, 스킬이 어떻게 호출되길 원하는지(사용자에 의해, Claude에 의해, 또는 둘 다)와 어디에서 실행되길 원하는지(인라인 또는 서브에이전트에서) 생각하면 무엇을 포함할지 가이드가 됩니다. 복잡한 스킬의 경우, 메인 스킬을 집중적으로 유지하기 위해 [보조 파일을 추가](#보조-파일-추가)할 수도 있습니다.

### 프론트매터 레퍼런스

마크다운 콘텐츠 외에도, `SKILL.md` 파일 상단의 `---` 마커 사이에 있는 YAML 프론트매터 필드를 사용하여 스킬 동작을 설정할 수 있습니다:

```yaml  theme={null}
---
name: my-skill
description: 이 스킬이 하는 일
disable-model-invocation: true
allowed-tools: Read, Grep
---

스킬 지시사항을 여기에 작성...
```

모든 필드는 선택 사항입니다. Claude가 스킬을 언제 사용할지 알 수 있도록 `description`만 권장됩니다.

| 필드                         | 필수 여부   | 설명                                                                                                                                                  |
| :--------------------------- | :---------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                       | 아니오      | 스킬의 표시 이름. 생략하면 디렉토리 이름을 사용합니다. 소문자, 숫자, 하이픈만 사용 (최대 64자).                                                       |
| `description`                | 권장        | 스킬이 하는 일과 언제 사용할지. Claude가 스킬을 적용할 시점을 결정하는 데 사용합니다. 생략하면 마크다운 콘텐츠의 첫 번째 단락을 사용합니다.             |
| `argument-hint`              | 아니오      | 자동 완성 시 예상 인수를 나타내는 힌트. 예: `[issue-number]` 또는 `[filename] [format]`.                                                               |
| `disable-model-invocation`   | 아니오      | `true`로 설정하면 Claude가 자동으로 이 스킬을 로드하지 않습니다. `/name`으로 수동 트리거하려는 워크플로에 사용합니다. 기본값: `false`.                   |
| `user-invocable`             | 아니오      | `false`로 설정하면 `/` 메뉴에서 숨깁니다. 사용자가 직접 호출하면 안 되는 배경 지식에 사용합니다. 기본값: `true`.                                       |
| `allowed-tools`              | 아니오      | 이 스킬이 활성화되었을 때 Claude가 권한 요청 없이 사용할 수 있는 도구.                                                                                |
| `model`                      | 아니오      | 이 스킬이 활성화되었을 때 사용할 모델.                                                                                                                |
| `context`                    | 아니오      | `fork`로 설정하면 포크된 서브에이전트 컨텍스트에서 실행합니다.                                                                                         |
| `agent`                      | 아니오      | `context: fork`가 설정되었을 때 사용할 서브에이전트 유형.                                                                                              |
| `hooks`                      | 아니오      | 이 스킬의 라이프사이클에 한정된 후크. 설정 형식은 [스킬과 에이전트의 후크](/en/hooks#hooks-in-skills-and-agents)를 참조하세요.                          |

#### 사용 가능한 문자열 치환

스킬은 스킬 콘텐츠에서 동적 값을 위한 문자열 치환을 지원합니다:

| 변수                   | 설명                                                                                                                                         |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `$ARGUMENTS`           | 스킬 호출 시 전달된 모든 인수. 콘텐츠에 `$ARGUMENTS`가 없으면 인수가 `ARGUMENTS: <값>`으로 끝에 추가됩니다.                                   |
| `$ARGUMENTS[N]`        | 0 기반 인덱스로 특정 인수에 접근. 예: 첫 번째 인수는 `$ARGUMENTS[0]`.                                                                        |
| `$N`                   | `$ARGUMENTS[N]`의 축약형. 예: 첫 번째 인수는 `$0`, 두 번째 인수는 `$1`.                                                                      |
| `${CLAUDE_SESSION_ID}` | 현재 세션 ID. 로깅, 세션별 파일 생성, 스킬 출력과 세션 연관에 유용합니다.                                                                     |

**치환 사용 예제:**

```yaml  theme={null}
---
name: session-logger
description: 이 세션의 활동을 로깅
---

다음을 logs/${CLAUDE_SESSION_ID}.log에 로깅하세요:

$ARGUMENTS
```

### 보조 파일 추가

스킬은 디렉토리 내에 여러 파일을 포함할 수 있습니다. 이를 통해 `SKILL.md`는 핵심에 집중하면서 Claude가 필요할 때만 상세한 참조 자료에 접근할 수 있습니다. 대용량 참조 문서, API 사양, 예제 모음 등은 스킬이 실행될 때마다 컨텍스트에 로드될 필요가 없습니다.

```
my-skill/
├── SKILL.md (필수 - 개요 및 탐색)
├── reference.md (상세 API 문서 - 필요 시 로드)
├── examples.md (사용 예제 - 필요 시 로드)
└── scripts/
    └── helper.py (유틸리티 스크립트 - 로드가 아닌 실행)
```

`SKILL.md`에서 보조 파일을 참조하여 Claude가 각 파일의 내용과 로드 시점을 알 수 있게 하세요:

```markdown  theme={null}
## 추가 리소스

- 전체 API 상세 내용은 [reference.md](reference.md)를 참조하세요
- 사용 예제는 [examples.md](examples.md)를 참조하세요
```

<Tip>`SKILL.md`를 500줄 이하로 유지하세요. 상세한 참조 자료는 별도 파일로 이동하세요.</Tip>

### 스킬 호출 권한 제어

기본적으로 사용자와 Claude 모두 어떤 스킬이든 호출할 수 있습니다. `/skill-name`을 입력하여 직접 호출하거나, Claude가 대화에 관련될 때 자동으로 로드할 수 있습니다. 두 가지 프론트매터 필드로 이를 제한할 수 있습니다:

* **`disable-model-invocation: true`**: 사용자만 스킬을 호출할 수 있습니다. 부작용이 있거나 타이밍을 제어하고 싶은 워크플로에 사용합니다. `/commit`, `/deploy`, `/send-slack-message` 같은 경우입니다. 코드가 준비된 것처럼 보인다고 Claude가 배포를 결정하는 것은 원하지 않을 것입니다.

* **`user-invocable: false`**: Claude만 스킬을 호출할 수 있습니다. 커맨드로서 실행 가능하지 않은 배경 지식에 사용합니다. `legacy-system-context` 스킬은 구형 시스템이 어떻게 작동하는지 설명합니다. Claude는 관련될 때 이를 알아야 하지만, `/legacy-system-context`는 사용자가 취할 의미 있는 행동이 아닙니다.

이 예제는 사용자만 트리거할 수 있는 배포 스킬을 만듭니다. `disable-model-invocation: true` 필드는 Claude가 자동으로 실행하는 것을 방지합니다:

```yaml  theme={null}
---
name: deploy
description: 애플리케이션을 프로덕션에 배포
disable-model-invocation: true
---

$ARGUMENTS를 프로덕션에 배포합니다:

1. 테스트 스위트 실행
2. 애플리케이션 빌드
3. 배포 타겟에 푸시
4. 배포 성공 여부 확인
```

두 필드가 호출과 컨텍스트 로딩에 미치는 영향은 다음과 같습니다:

| 프론트매터                           | 사용자 호출 | Claude 호출 | 컨텍스트 로딩 시점                                           |
| :----------------------------------- | :---------- | :---------- | :----------------------------------------------------------- |
| (기본값)                             | 예          | 예          | 설명은 항상 컨텍스트에, 전체 스킬은 호출 시 로드             |
| `disable-model-invocation: true`     | 예          | 아니오      | 설명이 컨텍스트에 없음, 사용자 호출 시 전체 스킬 로드        |
| `user-invocable: false`              | 아니오      | 예          | 설명은 항상 컨텍스트에, 전체 스킬은 호출 시 로드             |

<Note>
  일반 세션에서 스킬 설명은 Claude가 무엇이 사용 가능한지 알 수 있도록 컨텍스트에 로드되지만, 전체 스킬 콘텐츠는 호출 시에만 로드됩니다. [미리 로드된 스킬이 있는 서브에이전트](/en/sub-agents#preload-skills-into-subagents)는 다르게 작동합니다: 전체 스킬 콘텐츠가 시작 시 주입됩니다.
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

사용자와 Claude 모두 스킬 호출 시 인수를 전달할 수 있습니다. 인수는 `$ARGUMENTS` 플레이스홀더를 통해 사용할 수 있습니다.

이 스킬은 번호로 GitHub 이슈를 수정합니다. `$ARGUMENTS` 플레이스홀더는 스킬 이름 뒤에 오는 내용으로 교체됩니다:

```yaml  theme={null}
---
name: fix-issue
description: GitHub 이슈 수정
disable-model-invocation: true
---

우리의 코딩 표준에 따라 GitHub 이슈 $ARGUMENTS를 수정하세요.

1. 이슈 설명 읽기
2. 요구사항 파악
3. 수정 구현
4. 테스트 작성
5. 커밋 생성
```

`/fix-issue 123`을 실행하면 Claude는 "우리의 코딩 표준에 따라 GitHub 이슈 123을 수정하세요..."를 받습니다.

인수를 전달했지만 스킬에 `$ARGUMENTS`가 포함되어 있지 않으면, Claude Code가 `ARGUMENTS: <입력값>`을 스킬 콘텐츠 끝에 추가하여 Claude가 입력을 확인할 수 있게 합니다.

위치별로 개별 인수에 접근하려면 `$ARGUMENTS[N]` 또는 더 짧은 `$N`을 사용하세요:

```yaml  theme={null}
---
name: migrate-component
description: 한 프레임워크에서 다른 프레임워크로 컴포넌트 마이그레이션
---

$ARGUMENTS[0] 컴포넌트를 $ARGUMENTS[1]에서 $ARGUMENTS[2]로 마이그레이션합니다.
기존의 모든 동작과 테스트를 유지하세요.
```

`/migrate-component SearchBar React Vue`를 실행하면 `$ARGUMENTS[0]`은 `SearchBar`로, `$ARGUMENTS[1]`은 `React`로, `$ARGUMENTS[2]`는 `Vue`로 교체됩니다. `$N` 축약형을 사용한 동일한 스킬:

```yaml  theme={null}
---
name: migrate-component
description: 한 프레임워크에서 다른 프레임워크로 컴포넌트 마이그레이션
---

$0 컴포넌트를 $1에서 $2로 마이그레이션합니다.
기존의 모든 동작과 테스트를 유지하세요.
```

## 고급 패턴

### 동적 컨텍스트 주입

`!`command\`\` 문법은 스킬 콘텐츠가 Claude에게 전송되기 전에 셸 커맨드를 실행합니다. 커맨드 출력이 플레이스홀더를 대체하므로 Claude는 커맨드 자체가 아닌 실제 데이터를 받습니다.

이 스킬은 GitHub CLI로 실시간 PR 데이터를 가져와 풀 리퀘스트를 요약합니다. `!`gh pr diff\`\`와 다른 커맨드가 먼저 실행되고, 그 출력이 프롬프트에 삽입됩니다:

```yaml  theme={null}
---
name: pr-summary
description: 풀 리퀘스트의 변경사항 요약
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## 풀 리퀘스트 컨텍스트
- PR 차이점: !`gh pr diff`
- PR 댓글: !`gh pr view --comments`
- 변경된 파일: !`gh pr diff --name-only`

## 당신의 태스크
이 풀 리퀘스트를 요약하세요...
```

이 스킬이 실행될 때:

1. 각 `!`command\`\`가 즉시 실행됩니다 (Claude가 보기 전에)
2. 출력이 스킬 콘텐츠의 플레이스홀더를 대체합니다
3. Claude는 실제 PR 데이터가 포함된 완전히 렌더링된 프롬프트를 받습니다

이것은 전처리이며, Claude가 실행하는 것이 아닙니다. Claude는 최종 결과만 봅니다.

<Tip>
  스킬에서 [확장 사고](/en/common-workflows#use-extended-thinking-thinking-mode)를 활성화하려면, 스킬 콘텐츠 어디에든 "ultrathink"라는 단어를 포함하세요.
</Tip>

### 서브에이전트에서 스킬 실행

격리된 환경에서 스킬을 실행하려면 프론트매터에 `context: fork`를 추가하세요. 스킬 콘텐츠가 서브에이전트를 구동하는 프롬프트가 됩니다. 대화 기록에는 접근할 수 없습니다.

<Warning>
  `context: fork`는 명시적 지시사항이 있는 스킬에만 적합합니다. 스킬이 태스크 없이 "이 API 컨벤션을 사용하세요" 같은 가이드라인만 포함하면, 서브에이전트는 가이드라인을 받지만 실행 가능한 프롬프트가 없어 의미 있는 출력 없이 반환됩니다.
</Warning>

스킬과 [서브에이전트](/en/sub-agents)는 두 방향으로 함께 작동합니다:

| 접근 방식                       | 시스템 프롬프트                           | 태스크                      | 추가로 로드                  |
| :------------------------------ | :---------------------------------------- | :-------------------------- | :--------------------------- |
| `context: fork`가 있는 스킬     | 에이전트 유형(`Explore`, `Plan` 등)에서   | SKILL.md 콘텐츠             | CLAUDE.md                    |
| `skills` 필드가 있는 서브에이전트| 서브에이전트의 마크다운 본문              | Claude의 위임 메시지        | 미리 로드된 스킬 + CLAUDE.md |

`context: fork`를 사용하면, 스킬에 태스크를 작성하고 실행할 에이전트 유형을 선택합니다. 반대 방향(스킬을 참조 자료로 사용하는 커스텀 서브에이전트 정의)은 [서브에이전트](/en/sub-agents#preload-skills-into-subagents)를 참조하세요.

#### 예제: Explore 에이전트를 사용한 리서치 스킬

이 스킬은 포크된 Explore 에이전트에서 리서치를 실행합니다. 스킬 콘텐츠가 태스크가 되고, 에이전트는 코드베이스 탐색에 최적화된 읽기 전용 도구를 제공합니다:

```yaml  theme={null}
---
name: deep-research
description: 주제를 철저히 조사
context: fork
agent: Explore
---

$ARGUMENTS를 철저히 조사하세요:

1. Glob과 Grep을 사용하여 관련 파일 찾기
2. 코드를 읽고 분석하기
3. 구체적인 파일 참조와 함께 결과 요약하기
```

이 스킬이 실행될 때:

1. 새로운 격리된 컨텍스트가 생성됩니다
2. 서브에이전트가 스킬 콘텐츠를 프롬프트로 받습니다 ("$ARGUMENTS를 철저히 조사하세요...")
3. `agent` 필드가 실행 환경(모델, 도구, 권한)을 결정합니다
4. 결과가 요약되어 메인 대화로 반환됩니다

`agent` 필드는 사용할 서브에이전트 설정을 지정합니다. 옵션에는 내장 에이전트(`Explore`, `Plan`, `general-purpose`) 또는 `.claude/agents/`의 커스텀 서브에이전트가 포함됩니다. 생략하면 `general-purpose`를 사용합니다.

### Claude의 스킬 접근 제한

기본적으로 Claude는 `disable-model-invocation: true`가 설정되지 않은 모든 스킬을 호출할 수 있습니다. `allowed-tools`를 정의한 스킬은 스킬이 활성화되어 있을 때 Claude에게 해당 도구에 대한 사용별 승인 없이 접근 권한을 부여합니다. [권한 설정](/en/permissions)은 다른 모든 도구에 대한 기본 승인 동작을 관리합니다. `/compact`나 `/init` 같은 내장 커맨드는 Skill 도구를 통해 사용할 수 없습니다.

Claude가 호출할 수 있는 스킬을 제어하는 세 가지 방법:

**모든 스킬 비활성화** - `/permissions`에서 Skill 도구를 거부합니다:

```
# 거부 규칙에 추가:
Skill
```

**특정 스킬 허용 또는 거부** - [권한 규칙](/en/permissions)을 사용합니다:

```
# 특정 스킬만 허용
Skill(commit)
Skill(review-pr *)

# 특정 스킬 거부
Skill(deploy *)
```

권한 구문: 정확한 일치는 `Skill(name)`, 접두사 일치와 인수는 `Skill(name *)`.

**개별 스킬 숨기기** - 프론트매터에 `disable-model-invocation: true`를 추가합니다. 이렇게 하면 Claude의 컨텍스트에서 스킬이 완전히 제거됩니다.

<Note>
  `user-invocable` 필드는 메뉴 가시성만 제어하며 Skill 도구 접근은 제어하지 않습니다. 프로그래밍적 호출을 차단하려면 `disable-model-invocation: true`를 사용하세요.
</Note>

## 스킬 공유

스킬은 대상에 따라 다양한 범위로 배포할 수 있습니다:

* **프로젝트 스킬**: `.claude/skills/`를 버전 관리에 커밋
* **플러그인**: [플러그인](/en/plugins)에 `skills/` 디렉토리 생성
* **관리**: [관리 설정](/en/permissions#managed-settings)을 통해 조직 전체에 배포

### 시각적 출력 생성

스킬은 모든 언어의 스크립트를 번들링하고 실행할 수 있어, 단일 프롬프트에서는 불가능한 기능을 Claude에 제공합니다. 강력한 패턴 중 하나는 시각적 출력 생성입니다: 데이터 탐색, 디버깅, 보고서 작성을 위해 브라우저에서 열리는 인터랙티브 HTML 파일입니다.

이 예제는 코드베이스 탐색기를 만듭니다: 디렉토리를 확장하고 축소할 수 있고, 파일 크기를 한눈에 볼 수 있으며, 색상으로 파일 유형을 식별할 수 있는 인터랙티브 트리 뷰입니다.

Skill 디렉토리를 생성합니다:

```bash  theme={null}
mkdir -p ~/.claude/skills/codebase-visualizer/scripts
```

`~/.claude/skills/codebase-visualizer/SKILL.md`를 생성합니다. description은 Claude에게 언제 이 Skill을 활성화할지 알려주고, 지시사항은 Claude에게 번들된 스크립트를 실행하라고 알려줍니다:

````yaml  theme={null}
---
name: codebase-visualizer
description: 코드베이스의 인터랙티브한 접이식 트리 시각화를 생성합니다. 새 저장소를 탐색하거나, 프로젝트 구조를 이해하거나, 대용량 파일을 식별할 때 사용합니다.
allowed-tools: Bash(python *)
---

# 코드베이스 시각화 도구

프로젝트의 파일 구조를 접이식 디렉토리와 함께 인터랙티브 HTML 트리 뷰로 생성합니다.

## 사용법

프로젝트 루트에서 시각화 스크립트를 실행합니다:

```bash
python ~/.claude/skills/codebase-visualizer/scripts/visualize.py .
```

현재 디렉토리에 `codebase-map.html`을 생성하고 기본 브라우저에서 엽니다.

## 시각화가 보여주는 것

- **접이식 디렉토리**: 폴더를 클릭하여 확장/축소
- **파일 크기**: 각 파일 옆에 표시
- **색상**: 파일 유형별 다른 색상
- **디렉토리 합계**: 각 폴더의 총 크기 표시
````

`~/.claude/skills/codebase-visualizer/scripts/visualize.py`를 생성합니다. 이 스크립트는 디렉토리 트리를 스캔하고 다음을 포함하는 독립형 HTML 파일을 생성합니다:

* 파일 수, 디렉토리 수, 총 크기, 파일 유형 수를 보여주는 **요약 사이드바**
* 파일 유형별(크기 기준 상위 8개) 코드베이스 분석을 보여주는 **막대 차트**
* 디렉토리를 확장하고 축소할 수 있는 **접이식 트리**, 색상 코딩된 파일 유형 표시기 포함

스크립트에는 Python이 필요하지만 내장 라이브러리만 사용하므로 설치할 패키지가 없습니다:

```python expandable theme={null}
#!/usr/bin/env python3
"""코드베이스의 인터랙티브한 접이식 트리 시각화를 생성합니다."""

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

테스트하려면, 아무 프로젝트에서 Claude Code를 열고 "이 코드베이스를 시각화해줘"라고 요청하세요. Claude가 스크립트를 실행하고, `codebase-map.html`을 생성하여 브라우저에서 엽니다.

이 패턴은 모든 시각적 출력에 적용됩니다: 의존성 그래프, 테스트 커버리지 보고서, API 문서, 데이터베이스 스키마 시각화 등. 번들된 스크립트가 무거운 작업을 처리하고 Claude가 오케스트레이션을 담당합니다.

## 문제 해결

### 스킬이 트리거되지 않을 때

Claude가 예상대로 스킬을 사용하지 않는 경우:

1. description에 사용자가 자연스럽게 말할 키워드가 포함되어 있는지 확인
2. `어떤 스킬을 사용할 수 있나요?`로 스킬이 나타나는지 확인
3. description과 더 일치하도록 요청을 다시 표현해보기
4. 스킬이 user-invocable이면 `/skill-name`으로 직접 호출

### 스킬이 너무 자주 트리거될 때

원하지 않을 때 Claude가 스킬을 사용하는 경우:

1. description을 더 구체적으로 만들기
2. 수동 호출만 원하면 `disable-model-invocation: true` 추가

### Claude가 모든 스킬을 보지 못할 때

스킬 description은 Claude가 무엇이 사용 가능한지 알 수 있도록 컨텍스트에 로드됩니다. 스킬이 많으면 문자 예산(기본 15,000자)을 초과할 수 있습니다. `/context`를 실행하여 제외된 스킬에 대한 경고를 확인하세요.

한도를 늘리려면 `SLASH_COMMAND_TOOL_CHAR_BUDGET` 환경 변수를 설정하세요.

## 관련 리소스

* **[서브에이전트](/en/sub-agents)**: 전문 에이전트에 태스크 위임
* **[플러그인](/en/plugins)**: 다른 확장과 함께 스킬 패키징 및 배포
* **[후크](/en/hooks)**: 도구 이벤트 주변의 워크플로 자동화
* **[메모리](/en/memory)**: 영속적 컨텍스트를 위한 CLAUDE.md 파일 관리
* **[인터랙티브 모드](/en/interactive-mode#built-in-commands)**: 내장 커맨드와 단축키
* **[권한](/en/permissions)**: 도구 및 스킬 접근 제어
