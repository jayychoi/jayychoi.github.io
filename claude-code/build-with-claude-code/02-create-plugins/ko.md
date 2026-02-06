# 플러그인 만들기

> 스킬, 에이전트, 훅, MCP 서버를 활용하여 Claude Code를 확장하는 커스텀 플러그인을 만드세요.

플러그인을 사용하면 프로젝트와 팀 간에 공유할 수 있는 커스텀 기능으로 Claude Code를 확장할 수 있습니다. 이 가이드에서는 스킬, 에이전트, 훅, MCP 서버를 포함한 플러그인을 직접 만드는 방법을 다룹니다.

기존 플러그인을 설치하고 싶으신가요? [플러그인 탐색 및 설치](/ko/discover-plugins)를 참고하세요. 전체 기술 사양은 [플러그인 레퍼런스](/ko/plugins-reference)를 확인하세요.

## 플러그인 vs 독립 실행형 구성, 언제 무엇을 사용할까

Claude Code는 커스텀 스킬, 에이전트, 훅을 추가하는 두 가지 방법을 지원합니다:

| 접근 방식                                                    | 스킬 이름             | 적합한 용도                                                                                      |
| :---------------------------------------------------------- | :------------------- | :---------------------------------------------------------------------------------------------- |
| **독립 실행형** (`.claude/` 디렉토리)                         | `/hello`             | 개인 워크플로우, 프로젝트별 커스터마이징, 빠른 실험                                                  |
| **플러그인** (`.claude-plugin/plugin.json`이 있는 디렉토리)    | `/plugin-name:hello` | 팀원과 공유, 커뮤니티 배포, 버전 관리된 릴리스, 프로젝트 간 재사용                                     |

**독립 실행형 구성을 사용해야 할 때**:

* 단일 프로젝트에서만 Claude Code를 커스터마이징하는 경우
* 구성이 개인적이고 공유할 필요가 없는 경우
* 패키징하기 전에 스킬이나 훅을 실험하는 경우
* `/hello`나 `/review` 같은 짧은 스킬 이름을 원하는 경우

**플러그인을 사용해야 할 때**:

* 팀이나 커뮤니티와 기능을 공유하고 싶은 경우
* 여러 프로젝트에서 동일한 스킬/에이전트가 필요한 경우
* 확장 기능의 버전 관리와 쉬운 업데이트가 필요한 경우
* 마켓플레이스를 통해 배포하는 경우
* `/my-plugin:hello`과 같은 네임스페이스가 적용된 스킬 이름을 사용할 수 있는 경우 (네임스페이스는 플러그인 간 충돌을 방지합니다)

<Tip>
  빠른 반복 작업을 위해 `.claude/`의 독립 실행형 구성으로 시작한 후, 공유할 준비가 되면 [플러그인으로 변환](#기존-구성을-플러그인으로-변환)하세요.
</Tip>

## 빠른 시작

이 빠른 시작 가이드에서는 커스텀 스킬이 포함된 플러그인을 만드는 과정을 안내합니다. 매니페스트(플러그인을 정의하는 구성 파일)를 만들고, 스킬을 추가한 다음, `--plugin-dir` 플래그를 사용하여 로컬에서 테스트합니다.

### 사전 요구 사항

* Claude Code [설치 및 인증 완료](/ko/quickstart#step-1-install-claude-code)
* Claude Code 버전 1.0.33 이상 (확인: `claude --version`)

<Note>
  `/plugin` 명령이 보이지 않으면 Claude Code를 최신 버전으로 업데이트하세요. 업그레이드 방법은 [문제 해결](/ko/troubleshooting)을 참고하세요.
</Note>

### 첫 번째 플러그인 만들기

<Steps>
  <Step title="플러그인 디렉토리 생성">
    모든 플러그인은 매니페스트와 스킬, 에이전트, 훅을 포함하는 자체 디렉토리에 위치합니다. 지금 하나 만들어 봅시다:

    ```bash  theme={null}
    mkdir my-first-plugin
    ```
  </Step>

  <Step title="플러그인 매니페스트 생성">
    `.claude-plugin/plugin.json`에 있는 매니페스트 파일은 플러그인의 정체성(이름, 설명, 버전)을 정의합니다. Claude Code는 이 메타데이터를 사용하여 플러그인 관리자에 플러그인을 표시합니다.

    플러그인 폴더 안에 `.claude-plugin` 디렉토리를 생성합니다:

    ```bash  theme={null}
    mkdir my-first-plugin/.claude-plugin
    ```

    그런 다음 `my-first-plugin/.claude-plugin/plugin.json`을 다음 내용으로 생성합니다:

    ```json my-first-plugin/.claude-plugin/plugin.json theme={null}
    {
    "name": "my-first-plugin",
    "description": "기본을 배우기 위한 인사 플러그인",
    "version": "1.0.0",
    "author": {
    "name": "Your Name"
    }
    }
    ```

    | 필드           | 용도                                                                                                    |
    | :------------ | :----------------------------------------------------------------------------------------------------- |
    | `name`        | 고유 식별자이자 스킬 네임스페이스. 스킬 이름 앞에 이 값이 붙습니다 (예: `/my-first-plugin:hello`).             |
    | `description` | 플러그인을 탐색하거나 설치할 때 플러그인 관리자에 표시됩니다.                                                  |
    | `version`     | [시맨틱 버저닝](/ko/plugins-reference#version-management)을 사용하여 릴리스를 추적합니다.                     |
    | `author`      | 선택 사항. 저작자 표시에 유용합니다.                                                                       |

    `homepage`, `repository`, `license` 등 추가 필드에 대해서는 [전체 매니페스트 스키마](/ko/plugins-reference#plugin-manifest-schema)를 참고하세요.
  </Step>

  <Step title="스킬 추가">
    스킬은 `skills/` 디렉토리에 위치합니다. 각 스킬은 `SKILL.md` 파일을 포함하는 폴더입니다. 폴더 이름이 스킬 이름이 되며, 플러그인의 네임스페이스가 접두사로 붙습니다 (`my-first-plugin`이라는 플러그인의 `hello/`는 `/my-first-plugin:hello`가 됩니다).

    플러그인 폴더에 스킬 디렉토리를 생성합니다:

    ```bash  theme={null}
    mkdir -p my-first-plugin/skills/hello
    ```

    그런 다음 `my-first-plugin/skills/hello/SKILL.md`를 다음 내용으로 생성합니다:

    ```markdown my-first-plugin/skills/hello/SKILL.md theme={null}
    ---
    description: 친근한 메시지로 사용자에게 인사합니다
    disable-model-invocation: true
    ---

    사용자에게 따뜻하게 인사하고 오늘 어떻게 도와줄 수 있는지 물어보세요.
    ```
  </Step>

  <Step title="플러그인 테스트">
    `--plugin-dir` 플래그와 함께 Claude Code를 실행하여 플러그인을 로드합니다:

    ```bash  theme={null}
    claude --plugin-dir ./my-first-plugin
    ```

    Claude Code가 시작되면 새 명령을 사용해 봅니다:

    ```shell  theme={null}
    /my-first-plugin:hello
    ```

    Claude가 인사말로 응답하는 것을 볼 수 있습니다. `/help`를 실행하면 플러그인 네임스페이스 아래에 명령이 나열됩니다.

    <Note>
      **왜 네임스페이스를 사용할까요?** 플러그인 스킬은 항상 네임스페이스가 적용됩니다 (`/greet:hello`처럼). 여러 플러그인이 같은 이름의 스킬을 가질 때 충돌을 방지하기 위해서입니다.

      네임스페이스 접두사를 변경하려면 `plugin.json`의 `name` 필드를 업데이트하세요.
    </Note>
  </Step>

  <Step title="스킬 인수 추가">
    사용자 입력을 받아 스킬을 동적으로 만들 수 있습니다. `$ARGUMENTS` 플레이스홀더는 스킬 이름 뒤에 사용자가 입력하는 텍스트를 캡처합니다.

    `hello.md` 파일을 업데이트합니다:

    ```markdown my-first-plugin/commands/hello.md theme={null}
    ---
    description: 개인화된 메시지로 사용자에게 인사합니다
    ---

    # Hello 명령

    "$ARGUMENTS"라는 이름의 사용자에게 따뜻하게 인사하고 오늘 어떻게 도와줄 수 있는지 물어보세요. 인사를 개인적이고 격려하는 내용으로 만드세요.
    ```

    변경 사항을 적용하려면 Claude Code를 재시작한 다음, 이름과 함께 명령을 사용해 봅니다:

    ```shell  theme={null}
    /my-first-plugin:hello Alex
    ```

    Claude가 이름을 불러 인사할 것입니다. 스킬에 인수를 전달하는 방법에 대한 자세한 내용은 [스킬](/ko/skills#pass-arguments-to-skills)을 참고하세요.
  </Step>
</Steps>

플러그인을 성공적으로 만들고 테스트했습니다. 핵심 구성 요소는 다음과 같습니다:

* **플러그인 매니페스트** (`.claude-plugin/plugin.json`): 플러그인의 메타데이터를 설명합니다
* **명령 디렉토리** (`commands/`): 커스텀 스킬을 포함합니다
* **스킬 인수** (`$ARGUMENTS`): 동적 동작을 위한 사용자 입력을 캡처합니다

<Tip>
  `--plugin-dir` 플래그는 개발 및 테스트에 유용합니다. 다른 사람과 플러그인을 공유할 준비가 되면 [플러그인 마켓플레이스 생성 및 배포](/ko/plugin-marketplaces)를 참고하세요.
</Tip>

## 플러그인 구조 개요

스킬이 포함된 플러그인을 만들었지만, 플러그인에는 커스텀 에이전트, 훅, MCP 서버, LSP 서버 등 훨씬 더 많은 것을 포함할 수 있습니다.

<Warning>
  **흔한 실수**: `commands/`, `agents/`, `skills/`, `hooks/`를 `.claude-plugin/` 디렉토리 안에 넣지 마세요. `.claude-plugin/` 안에는 `plugin.json`만 들어갑니다. 다른 모든 디렉토리는 플러그인 루트 레벨에 있어야 합니다.
</Warning>

| 디렉토리           | 위치         | 용도                                              |
| :---------------- | :---------- | :---------------------------------------------- |
| `.claude-plugin/` | 플러그인 루트 | `plugin.json` 매니페스트만 포함 (필수)                |
| `commands/`       | 플러그인 루트 | 마크다운 파일 형태의 스킬                             |
| `agents/`         | 플러그인 루트 | 커스텀 에이전트 정의                                 |
| `skills/`         | 플러그인 루트 | `SKILL.md` 파일이 있는 에이전트 스킬                  |
| `hooks/`          | 플러그인 루트 | `hooks.json`의 이벤트 핸들러                         |
| `.mcp.json`       | 플러그인 루트 | MCP 서버 구성                                      |
| `.lsp.json`       | 플러그인 루트 | 코드 인텔리전스를 위한 LSP 서버 구성                   |

<Note>
  **다음 단계**: 더 많은 기능을 추가할 준비가 되셨나요? [더 복잡한 플러그인 개발](#더-복잡한-플러그인-개발)로 이동하여 에이전트, 훅, MCP 서버, LSP 서버를 추가하세요. 모든 플러그인 구성 요소의 전체 기술 사양은 [플러그인 레퍼런스](/ko/plugins-reference)를 참고하세요.
</Note>

## 더 복잡한 플러그인 개발

기본 플러그인에 익숙해지면 더 정교한 확장 기능을 만들 수 있습니다.

### 플러그인에 스킬 추가

플러그인에 [에이전트 스킬](/ko/skills)을 포함하여 Claude의 기능을 확장할 수 있습니다. 스킬은 모델이 호출하는 방식입니다: Claude가 작업 컨텍스트에 따라 자동으로 사용합니다.

플러그인 루트에 `SKILL.md` 파일이 포함된 스킬 폴더가 있는 `skills/` 디렉토리를 추가합니다:

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
└── skills/
    └── code-review/
        └── SKILL.md
```

각 `SKILL.md`에는 `name`과 `description` 필드가 있는 프론트매터와 지침이 필요합니다:

```yaml  theme={null}
---
name: code-review
description: 코드를 모범 사례와 잠재적 문제에 대해 리뷰합니다. 코드 리뷰, PR 확인, 코드 품질 분석 시 사용합니다.
---

코드를 리뷰할 때 다음을 확인하세요:
1. 코드 구성 및 구조
2. 에러 처리
3. 보안 문제
4. 테스트 커버리지
```

플러그인을 설치한 후 Claude Code를 재시작하여 스킬을 로드합니다. 점진적 공개 및 도구 제한을 포함한 전체 스킬 작성 가이드는 [에이전트 스킬](/ko/skills)을 참고하세요.

### 플러그인에 LSP 서버 추가

<Tip>
  TypeScript, Python, Rust 같은 일반적인 언어의 경우 공식 마켓플레이스에서 사전 빌드된 LSP 플러그인을 설치하세요. 아직 지원되지 않는 언어에 대한 지원이 필요할 때만 커스텀 LSP 플러그인을 만드세요.
</Tip>

LSP(Language Server Protocol) 플러그인은 Claude에게 실시간 코드 인텔리전스를 제공합니다. 공식 LSP 플러그인이 없는 언어를 지원해야 하는 경우, 플러그인에 `.lsp.json` 파일을 추가하여 직접 만들 수 있습니다:

```json .lsp.json theme={null}
{
  "go": {
    "command": "gopls",
    "args": ["serve"],
    "extensionToLanguage": {
      ".go": "go"
    }
  }
}
```

플러그인을 설치하는 사용자는 자신의 머신에 해당 언어 서버 바이너리가 설치되어 있어야 합니다.

전체 LSP 구성 옵션은 [LSP 서버](/ko/plugins-reference#lsp-servers)를 참고하세요.

### 복잡한 플러그인 구성

많은 구성 요소가 있는 플러그인의 경우 기능별로 디렉토리 구조를 구성합니다. 전체 디렉토리 레이아웃과 구성 패턴은 [플러그인 디렉토리 구조](/ko/plugins-reference#plugin-directory-structure)를 참고하세요.

### 플러그인 로컬 테스트

개발 중 플러그인을 테스트하려면 `--plugin-dir` 플래그를 사용합니다. 설치 없이 플러그인을 직접 로드합니다.

```bash  theme={null}
claude --plugin-dir ./my-plugin
```

플러그인을 변경할 때마다 Claude Code를 재시작하여 업데이트를 적용합니다. 플러그인 구성 요소를 테스트합니다:

* `/command-name`으로 명령을 사용해 봅니다
* `/agents`에서 에이전트가 표시되는지 확인합니다
* 훅이 예상대로 작동하는지 검증합니다

<Tip>
  여러 플러그인을 동시에 로드하려면 플래그를 여러 번 지정할 수 있습니다:

  ```bash  theme={null}
  claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
  ```
</Tip>

### 플러그인 문제 디버깅

플러그인이 예상대로 작동하지 않는 경우:

1. **구조 확인**: 디렉토리가 `.claude-plugin/` 안이 아닌 플러그인 루트에 있는지 확인합니다
2. **구성 요소 개별 테스트**: 각 명령, 에이전트, 훅을 별도로 확인합니다
3. **검증 및 디버깅 도구 사용**: CLI 명령과 문제 해결 기법은 [디버깅 및 개발 도구](/ko/plugins-reference#debugging-and-development-tools)를 참고하세요

### 플러그인 공유

플러그인을 공유할 준비가 되면:

1. **문서 추가**: 설치 및 사용 방법이 포함된 `README.md`를 작성합니다
2. **플러그인 버전 관리**: `plugin.json`에서 [시맨틱 버저닝](/ko/plugins-reference#version-management)을 사용합니다
3. **마켓플레이스 생성 또는 사용**: 설치를 위해 [플러그인 마켓플레이스](/ko/plugin-marketplaces)를 통해 배포합니다
4. **다른 사람과 테스트**: 더 넓은 배포 전에 팀원들이 플러그인을 테스트하도록 합니다

플러그인이 마켓플레이스에 등록되면 다른 사람들은 [플러그인 탐색 및 설치](/ko/discover-plugins)의 안내에 따라 설치할 수 있습니다.

<Note>
  전체 기술 사양, 디버깅 기법, 배포 전략에 대해서는 [플러그인 레퍼런스](/ko/plugins-reference)를 참고하세요.
</Note>

## 기존 구성을 플러그인으로 변환

이미 `.claude/` 디렉토리에 스킬이나 훅이 있다면, 더 쉬운 공유와 배포를 위해 플러그인으로 변환할 수 있습니다.

### 마이그레이션 단계

<Steps>
  <Step title="플러그인 구조 생성">
    새 플러그인 디렉토리를 생성합니다:

    ```bash  theme={null}
    mkdir -p my-plugin/.claude-plugin
    ```

    `my-plugin/.claude-plugin/plugin.json`에 매니페스트 파일을 생성합니다:

    ```json my-plugin/.claude-plugin/plugin.json theme={null}
    {
      "name": "my-plugin",
      "description": "독립 실행형 구성에서 마이그레이션됨",
      "version": "1.0.0"
    }
    ```
  </Step>

  <Step title="기존 파일 복사">
    기존 구성을 플러그인 디렉토리에 복사합니다:

    ```bash  theme={null}
    # 명령 복사
    cp -r .claude/commands my-plugin/

    # 에이전트 복사 (있는 경우)
    cp -r .claude/agents my-plugin/

    # 스킬 복사 (있는 경우)
    cp -r .claude/skills my-plugin/
    ```
  </Step>

  <Step title="훅 마이그레이션">
    설정에 훅이 있다면 hooks 디렉토리를 생성합니다:

    ```bash  theme={null}
    mkdir my-plugin/hooks
    ```

    `my-plugin/hooks/hooks.json`에 훅 구성을 생성합니다. `.claude/settings.json` 또는 `settings.local.json`에서 `hooks` 객체를 복사합니다. 형식은 동일합니다. 명령은 stdin으로 JSON 형태의 훅 입력을 받으므로, `jq`를 사용하여 파일 경로를 추출합니다:

    ```json my-plugin/hooks/hooks.json theme={null}
    {
      "hooks": {
        "PostToolUse": [
          {
            "matcher": "Write|Edit",
            "hooks": [{ "type": "command", "command": "jq -r '.tool_input.file_path' | xargs npm run lint:fix" }]
          }
        ]
      }
    }
    ```
  </Step>

  <Step title="마이그레이션된 플러그인 테스트">
    플러그인을 로드하여 모든 것이 작동하는지 확인합니다:

    ```bash  theme={null}
    claude --plugin-dir ./my-plugin
    ```

    각 구성 요소를 테스트합니다: 명령을 실행하고, `/agents`에서 에이전트가 표시되는지 확인하고, 훅이 올바르게 트리거되는지 검증합니다.
  </Step>
</Steps>

### 마이그레이션 시 변경되는 사항

| 독립 실행형 (`.claude/`)       | 플러그인                          |
| :---------------------------- | :------------------------------- |
| 하나의 프로젝트에서만 사용 가능   | 마켓플레이스를 통해 공유 가능        |
| `.claude/commands/`에 파일 위치 | `plugin-name/commands/`에 파일 위치 |
| `settings.json`에 훅 정의      | `hooks/hooks.json`에 훅 정의       |
| 공유하려면 수동 복사 필요        | `/plugin install`로 설치           |

<Note>
  마이그레이션 후 중복을 피하기 위해 `.claude/`에서 원본 파일을 제거할 수 있습니다. 플러그인 버전이 로드될 때 우선 적용됩니다.
</Note>

## 다음 단계

이제 Claude Code의 플러그인 시스템을 이해했으니, 목표에 따라 다음 경로를 추천합니다:

### 플러그인 사용자를 위해

* [플러그인 탐색 및 설치](/ko/discover-plugins): 마켓플레이스를 탐색하고 플러그인을 설치합니다
* [팀 마켓플레이스 구성](/ko/discover-plugins#configure-team-marketplaces): 팀을 위한 저장소 수준 플러그인을 설정합니다

### 플러그인 개발자를 위해

* [마켓플레이스 생성 및 배포](/ko/plugin-marketplaces): 플러그인을 패키징하고 공유합니다
* [플러그인 레퍼런스](/ko/plugins-reference): 전체 기술 사양
* 특정 플러그인 구성 요소에 대해 더 깊이 알아보기:
  * [스킬](/ko/skills): 스킬 개발 상세 정보
  * [서브에이전트](/ko/sub-agents): 에이전트 구성 및 기능
  * [훅](/ko/hooks): 이벤트 처리 및 자동화
  * [MCP](/ko/mcp): 외부 도구 통합
