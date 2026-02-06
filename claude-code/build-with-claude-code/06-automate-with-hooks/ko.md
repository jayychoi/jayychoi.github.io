# 훅(Hooks)으로 워크플로우 자동화하기

> Claude Code가 파일을 편집하거나, 작업을 완료하거나, 입력을 기다릴 때 셸 명령을 자동으로 실행하세요. 코드 포맷팅, 알림 전송, 명령 검증, 프로젝트 규칙 적용 등이 가능합니다.

훅(Hooks)은 Claude Code의 라이프사이클 특정 시점에 실행되는 사용자 정의 셸 명령입니다. LLM이 알아서 실행하길 기대하는 대신, 특정 동작이 항상 일어나도록 결정론적으로 제어할 수 있습니다. 훅을 사용하여 프로젝트 규칙을 강제하고, 반복 작업을 자동화하며, Claude Code를 기존 도구와 통합할 수 있습니다.

결정론적 규칙이 아닌 판단이 필요한 결정에는 [프롬프트 기반 훅](#프롬프트-기반-훅)이나 [에이전트 기반 훅](#에이전트-기반-훅)을 사용하여 Claude 모델이 조건을 평가하도록 할 수도 있습니다.

Claude Code를 확장하는 다른 방법으로는 추가 지침과 실행 가능한 명령을 제공하는 [스킬(Skills)](/en/skills), 격리된 컨텍스트에서 작업을 실행하는 [서브에이전트](/en/sub-agents), 프로젝트 간 공유를 위해 확장 기능을 패키징하는 [플러그인](/en/plugins)이 있습니다.

<Tip>
  이 가이드는 일반적인 사용 사례와 시작 방법을 다룹니다. 전체 이벤트 스키마, JSON 입출력 형식, 비동기 훅 및 MCP 도구 훅 등 고급 기능에 대해서는 [훅 레퍼런스](/en/hooks)를 참조하세요.
</Tip>

## 첫 번째 훅 설정하기

훅을 만드는 가장 빠른 방법은 Claude Code의 `/hooks` 대화형 메뉴를 사용하는 것입니다. 이 연습에서는 데스크톱 알림 훅을 만들어, 터미널을 계속 주시하는 대신 Claude가 입력을 기다릴 때 알림을 받을 수 있도록 합니다.

<Steps>
  <Step title="훅 메뉴 열기">
    Claude Code CLI에서 `/hooks`를 입력합니다. 사용 가능한 모든 훅 이벤트 목록과 모든 훅을 비활성화하는 옵션이 표시됩니다. 각 이벤트는 Claude의 라이프사이클에서 커스텀 코드를 실행할 수 있는 시점에 해당합니다. `Notification`을 선택하여 Claude가 주의가 필요할 때 발동하는 훅을 만듭니다.
  </Step>

  <Step title="매처 설정하기">
    메뉴에 매처(matcher) 목록이 표시됩니다. 매처는 훅이 발동되는 시점을 필터링합니다. 매처를 `*`로 설정하면 모든 알림 유형에 대해 발동됩니다. 나중에 `permission_prompt`이나 `idle_prompt` 같은 특정 값으로 변경하여 범위를 좁힐 수 있습니다.
  </Step>

  <Step title="명령 추가하기">
    `+ Add new hook…`을 선택합니다. 이벤트가 발동될 때 실행할 셸 명령을 입력하라는 메시지가 표시됩니다. 훅은 사용자가 제공하는 모든 셸 명령을 실행할 수 있으므로, 플랫폼의 기본 알림 도구를 사용할 수 있습니다. OS에 맞는 명령을 복사하세요:

    <Tabs>
      <Tab title="macOS">
        [`osascript`](https://ss64.com/mac/osascript.html)을 사용하여 AppleScript를 통해 macOS 기본 알림을 트리거합니다:

        ```
        osascript -e 'display notification "Claude Code needs your attention" with title "Claude Code"'
        ```
      </Tab>

      <Tab title="Linux">
        대부분의 Linux 데스크톱에 알림 데몬과 함께 사전 설치된 `notify-send`를 사용합니다:

        ```
        notify-send 'Claude Code' 'Claude Code needs your attention'
        ```
      </Tab>

      <Tab title="Windows (PowerShell)">
        PowerShell을 사용하여 .NET의 Windows Forms를 통해 기본 메시지 박스를 표시합니다:

        ```
        powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Claude Code needs your attention', 'Claude Code')"
        ```
      </Tab>
    </Tabs>
  </Step>

  <Step title="저장 위치 선택하기">
    메뉴에서 훅 설정을 저장할 위치를 묻습니다. `User settings`를 선택하면 `~/.claude/settings.json`에 저장되어 모든 프로젝트에 적용됩니다. `Project settings`를 선택하면 현재 프로젝트에만 적용됩니다. 사용 가능한 모든 범위에 대해서는 [훅 저장 위치 설정](#훅-저장-위치-설정)을 참조하세요.
  </Step>

  <Step title="훅 테스트하기">
    `Esc`를 눌러 CLI로 돌아갑니다. Claude에게 권한이 필요한 작업을 요청한 후 터미널에서 벗어나세요. 데스크톱 알림이 수신되어야 합니다.
  </Step>
</Steps>

## 자동화할 수 있는 것들

훅을 사용하면 Claude Code 라이프사이클의 주요 시점에서 코드를 실행할 수 있습니다: 편집 후 파일 포맷팅, 명령 실행 전 차단, Claude가 입력을 필요로 할 때 알림 전송, 세션 시작 시 컨텍스트 주입 등. 전체 훅 이벤트 목록은 [훅 레퍼런스](/en/hooks#hook-lifecycle)를 참조하세요.

각 예제에는 [설정 파일](#훅-저장-위치-설정)에 추가할 수 있는 바로 사용 가능한 설정 블록이 포함되어 있습니다. 가장 일반적인 패턴들:

* [Claude가 입력을 기다릴 때 알림 받기](#claude가-입력을-기다릴-때-알림-받기)
* [편집 후 코드 자동 포맷팅](#편집-후-코드-자동-포맷팅)
* [보호된 파일 편집 차단](#보호된-파일-편집-차단)
* [컴팩션 후 컨텍스트 재주입](#컴팩션-후-컨텍스트-재주입)

### Claude가 입력을 기다릴 때 알림 받기

Claude가 작업을 완료하고 입력이 필요할 때마다 데스크톱 알림을 받아, 터미널을 확인하지 않고도 다른 작업으로 전환할 수 있습니다.

이 훅은 Claude가 입력이나 권한을 기다릴 때 발동하는 `Notification` 이벤트를 사용합니다. 아래 각 탭은 플랫폼의 기본 알림 명령을 사용합니다. 이것을 `~/.claude/settings.json`에 추가하거나, 위의 [대화형 연습](#첫-번째-훅-설정하기)을 사용하여 `/hooks`로 설정하세요:

<Tabs>
  <Tab title="macOS">
    ```json  theme={null}
    {
      "hooks": {
        "Notification": [
          {
            "matcher": "",
            "hooks": [
              {
                "type": "command",
                "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>

  <Tab title="Linux">
    ```json  theme={null}
    {
      "hooks": {
        "Notification": [
          {
            "matcher": "",
            "hooks": [
              {
                "type": "command",
                "command": "notify-send 'Claude Code' 'Claude Code needs your attention'"
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>

  <Tab title="Windows (PowerShell)">
    ```json  theme={null}
    {
      "hooks": {
        "Notification": [
          {
            "matcher": "",
            "hooks": [
              {
                "type": "command",
                "command": "powershell.exe -Command \"[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms'); [System.Windows.Forms.MessageBox]::Show('Claude Code needs your attention', 'Claude Code')\""
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>
</Tabs>

### 편집 후 코드 자동 포맷팅

Claude가 편집하는 모든 파일에 [Prettier](https://prettier.io/)를 자동으로 실행하여, 수동 개입 없이 포맷팅 일관성을 유지합니다.

이 훅은 `PostToolUse` 이벤트에 `Edit|Write` 매처를 사용하여, 파일 편집 도구 사용 후에만 실행됩니다. 명령은 [`jq`](https://jqlang.github.io/jq/)로 편집된 파일 경로를 추출하여 Prettier에 전달합니다. 프로젝트 루트의 `.claude/settings.json`에 추가하세요:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

<Note>
  이 페이지의 Bash 예제들은 JSON 파싱에 `jq`를 사용합니다. `brew install jq`(macOS), `apt-get install jq`(Debian/Ubuntu)로 설치하거나 [`jq` 다운로드](https://jqlang.github.io/jq/download/)를 참조하세요.
</Note>

### 보호된 파일 편집 차단

Claude가 `.env`, `package-lock.json`, `.git/` 내의 파일 등 민감한 파일을 수정하지 못하도록 합니다. Claude는 편집이 차단된 이유를 피드백으로 받아 접근 방식을 조정할 수 있습니다.

이 예제는 훅이 호출하는 별도의 스크립트 파일을 사용합니다. 스크립트는 대상 파일 경로를 보호 패턴 목록과 비교하고, 종료 코드 2로 편집을 차단합니다.

<Steps>
  <Step title="훅 스크립트 만들기">
    다음을 `.claude/hooks/protect-files.sh`로 저장하세요:

    ```bash  theme={null}
    #!/bin/bash
    # protect-files.sh

    INPUT=$(cat)
    FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

    PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

    for pattern in "${PROTECTED_PATTERNS[@]}"; do
      if [[ "$FILE_PATH" == *"$pattern"* ]]; then
        echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
        exit 2
      fi
    done

    exit 0
    ```
  </Step>

  <Step title="스크립트를 실행 가능하게 만들기 (macOS/Linux)">
    Claude Code가 실행하려면 훅 스크립트에 실행 권한이 있어야 합니다:

    ```bash  theme={null}
    chmod +x .claude/hooks/protect-files.sh
    ```
  </Step>

  <Step title="훅 등록하기">
    `.claude/settings.json`에 `Edit` 또는 `Write` 도구 호출 전에 스크립트를 실행하는 `PreToolUse` 훅을 추가합니다:

    ```json  theme={null}
    {
      "hooks": {
        "PreToolUse": [
          {
            "matcher": "Edit|Write",
            "hooks": [
              {
                "type": "command",
                "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
              }
            ]
          }
        ]
      }
    }
    ```
  </Step>
</Steps>

### 컴팩션 후 컨텍스트 재주입

Claude의 컨텍스트 윈도우가 가득 차면, 컴팩션(compaction)이 대화를 요약하여 공간을 확보합니다. 이 과정에서 중요한 세부사항이 손실될 수 있습니다. `SessionStart` 훅에 `compact` 매처를 사용하여 매 컴팩션 후 중요한 컨텍스트를 재주입할 수 있습니다.

명령이 stdout에 출력하는 모든 텍스트는 Claude의 컨텍스트에 추가됩니다. 이 예제는 프로젝트 규칙과 최근 작업을 Claude에게 상기시킵니다. 프로젝트 루트의 `.claude/settings.json`에 추가하세요:

```json  theme={null}
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing. Current sprint: auth refactor.'"
          }
        ]
      }
    ]
  }
}
```

`echo`를 `git log --oneline -5`처럼 동적 출력을 생성하는 명령으로 대체할 수 있습니다. 매 세션 시작 시 컨텍스트를 주입하려면 [CLAUDE.md](/en/memory)를 사용하는 것이 좋습니다. 환경 변수에 대해서는 레퍼런스의 [`CLAUDE_ENV_FILE`](/en/hooks#persist-environment-variables)을 참조하세요.

## 훅의 동작 방식

훅 이벤트는 Claude Code 라이프사이클의 특정 시점에 발동됩니다. 이벤트가 발동되면 매칭되는 모든 훅이 병렬로 실행되며, 동일한 훅 명령은 자동으로 중복 제거됩니다. 아래 표는 각 이벤트와 발동 시점을 보여줍니다:

| 이벤트               | 발동 시점                                                |
| :------------------- | :------------------------------------------------------- |
| `SessionStart`       | 세션이 시작되거나 재개될 때                              |
| `UserPromptSubmit`   | 프롬프트를 제출할 때, Claude가 처리하기 전               |
| `PreToolUse`         | 도구 호출이 실행되기 전. 차단 가능                       |
| `PermissionRequest`  | 권한 대화상자가 나타날 때                                |
| `PostToolUse`        | 도구 호출이 성공한 후                                    |
| `PostToolUseFailure` | 도구 호출이 실패한 후                                    |
| `Notification`       | Claude Code가 알림을 보낼 때                             |
| `SubagentStart`      | 서브에이전트가 생성될 때                                 |
| `SubagentStop`       | 서브에이전트가 완료될 때                                 |
| `Stop`               | Claude가 응답을 마칠 때                                  |
| `PreCompact`         | 컨텍스트 컴팩션 전                                       |
| `SessionEnd`         | 세션이 종료될 때                                         |

각 훅에는 실행 방식을 결정하는 `type`이 있습니다. 대부분의 훅은 셸 명령을 실행하는 `"type": "command"`를 사용합니다. 다른 두 가지 옵션은 Claude 모델을 사용하여 결정을 내립니다: 단일 턴 평가를 위한 `"type": "prompt"`와 도구 접근이 가능한 다중 턴 검증을 위한 `"type": "agent"`입니다. 자세한 내용은 [프롬프트 기반 훅](#프롬프트-기반-훅)과 [에이전트 기반 훅](#에이전트-기반-훅)을 참조하세요.

### 입력 읽기와 출력 반환

훅은 stdin, stdout, stderr, 종료 코드를 통해 Claude Code와 통신합니다. 이벤트가 발동되면 Claude Code는 이벤트별 데이터를 JSON으로 스크립트의 stdin에 전달합니다. 스크립트는 해당 데이터를 읽고, 작업을 수행한 후, 종료 코드를 통해 Claude Code에 다음 동작을 알립니다.

#### 훅 입력

모든 이벤트에는 `session_id`와 `cwd` 같은 공통 필드가 포함되지만, 각 이벤트 유형마다 다른 데이터가 추가됩니다. 예를 들어, Claude가 Bash 명령을 실행할 때 `PreToolUse` 훅은 stdin에서 다음과 같은 내용을 받습니다:

```json  theme={null}
{
  "session_id": "abc123",          // 이 세션의 고유 ID
  "cwd": "/Users/sarah/myproject", // 이벤트 발동 시 작업 디렉토리
  "hook_event_name": "PreToolUse", // 이 훅을 트리거한 이벤트
  "tool_name": "Bash",             // Claude가 사용하려는 도구
  "tool_input": {                  // Claude가 도구에 전달한 인자
    "command": "npm test"          // Bash의 경우 셸 명령
  }
}
```

스크립트는 이 JSON을 파싱하여 필드에 따라 동작할 수 있습니다. `UserPromptSubmit` 훅은 대신 `prompt` 텍스트를 받고, `SessionStart` 훅은 `source`(startup, resume, compact)를 받는 식입니다. 공유 필드는 레퍼런스의 [공통 입력 필드](/en/hooks#common-input-fields)를, 이벤트별 스키마는 각 이벤트의 섹션을 참조하세요.

#### 훅 출력

스크립트는 stdout이나 stderr에 출력하고 특정 종료 코드로 종료하여 Claude Code에 다음 동작을 알립니다. 예를 들어, 명령을 차단하려는 `PreToolUse` 훅:

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q "drop table"; then
  echo "Blocked: dropping tables is not allowed" >&2  # stderr는 Claude의 피드백이 됨
  exit 2                                               # exit 2 = 동작 차단
fi

exit 0  # exit 0 = 진행 허용
```

종료 코드에 따라 다음 동작이 결정됩니다:

* **Exit 0**: 동작이 진행됩니다. `UserPromptSubmit`과 `SessionStart` 훅의 경우, stdout에 출력한 내용이 Claude의 컨텍스트에 추가됩니다.
* **Exit 2**: 동작이 차단됩니다. stderr에 이유를 출력하면 Claude가 피드백으로 받아 조정할 수 있습니다.
* **기타 종료 코드**: 동작이 진행됩니다. stderr는 로그에 기록되지만 Claude에게는 표시되지 않습니다. `Ctrl+O`로 상세 모드를 토글하면 트랜스크립트에서 이 메시지를 볼 수 있습니다.

#### 구조화된 JSON 출력

종료 코드는 허용 또는 차단 두 가지 옵션만 제공합니다. 더 세밀한 제어를 위해, exit 0으로 종료하고 stdout에 JSON 객체를 출력할 수 있습니다.

<Note>
  stderr 메시지와 함께 exit 2로 차단하거나, 구조화된 제어를 위해 JSON과 함께 exit 0을 사용하세요. 둘을 혼합하지 마세요: exit 2일 때 Claude Code는 JSON을 무시합니다.
</Note>

예를 들어, `PreToolUse` 훅은 도구 호출을 거부하고 Claude에게 이유를 알리거나, 사용자 승인을 위해 에스컬레이션할 수 있습니다:

```json  theme={null}
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep for better performance"
  }
}
```

Claude Code는 `permissionDecision`을 읽고 도구 호출을 취소한 후, `permissionDecisionReason`을 Claude에게 피드백으로 전달합니다. `PreToolUse`에 특화된 세 가지 옵션:

* `"allow"`: 권한 프롬프트 없이 진행
* `"deny"`: 도구 호출을 취소하고 이유를 Claude에게 전달
* `"ask"`: 정상적으로 사용자에게 권한 프롬프트 표시

다른 이벤트들은 다른 결정 패턴을 사용합니다. 예를 들어, `PostToolUse`와 `Stop` 훅은 최상위 `decision: "block"` 필드를 사용하고, `PermissionRequest`는 `hookSpecificOutput.decision.behavior`를 사용합니다. 이벤트별 전체 분류는 레퍼런스의 [결정 제어 요약 표](/en/hooks#decision-control)를 참조하세요.

`UserPromptSubmit` 훅의 경우, `additionalContext`를 사용하여 Claude의 컨텍스트에 텍스트를 주입합니다. 프롬프트 기반 훅(`type: "prompt"`)은 출력을 다르게 처리합니다: [프롬프트 기반 훅](#프롬프트-기반-훅)을 참조하세요.

### 매처로 훅 필터링하기

매처가 없으면 훅은 해당 이벤트가 발생할 때마다 발동됩니다. 매처를 사용하면 범위를 좁힐 수 있습니다. 예를 들어, 모든 도구 호출 후가 아니라 파일 편집 후에만 포맷터를 실행하려면 `PostToolUse` 훅에 매처를 추가합니다:

```json  theme={null}
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "prettier --write ..." }
        ]
      }
    ]
  }
}
```

`"Edit|Write"` 매처는 도구 이름과 매칭되는 정규식 패턴입니다. Claude가 `Edit` 또는 `Write` 도구를 사용할 때만 발동되며, `Bash`, `Read` 등 다른 도구에는 발동되지 않습니다.

각 이벤트 유형은 특정 필드를 기준으로 매칭됩니다. 매처는 정확한 문자열과 정규식 패턴을 지원합니다:

| 이벤트                                                                 | 매처 필터 대상           | 매처 값 예시                                                             |
| :--------------------------------------------------------------------- | :----------------------- | :----------------------------------------------------------------------- |
| `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest` | 도구 이름                | `Bash`, `Edit\|Write`, `mcp__.*`                                         |
| `SessionStart`                                                         | 세션 시작 방법           | `startup`, `resume`, `clear`, `compact`                                  |
| `SessionEnd`                                                           | 세션 종료 이유           | `clear`, `logout`, `prompt_input_exit`, `other`                          |
| `Notification`                                                         | 알림 유형                | `permission_prompt`, `idle_prompt`, `auth_success`, `elicitation_dialog` |
| `SubagentStart`                                                        | 에이전트 유형            | `Bash`, `Explore`, `Plan`, 또는 커스텀 에이전트 이름                     |
| `PreCompact`                                                           | 컴팩션 트리거 원인       | `manual`, `auto`                                                         |
| `UserPromptSubmit`, `Stop`                                             | 매처 미지원              | 모든 발생 시 항상 발동                                                   |
| `SubagentStop`                                                         | 에이전트 유형            | `SubagentStart`와 동일한 값                                              |

다른 이벤트 유형에 대한 매처 예시들:

<Tabs>
  <Tab title="모든 Bash 명령 로깅">
    `Bash` 도구 호출만 매칭하고 각 명령을 파일에 기록합니다. `PostToolUse` 이벤트는 명령 완료 후 발동되므로 `tool_input.command`에 실행된 내용이 포함됩니다. 훅은 이벤트 데이터를 stdin에서 JSON으로 받고, `jq -r '.tool_input.command'`가 명령 문자열만 추출하여 `>>`로 로그 파일에 추가합니다:

    ```json  theme={null}
    {
      "hooks": {
        "PostToolUse": [
          {
            "matcher": "Bash",
            "hooks": [
              {
                "type": "command",
                "command": "jq -r '.tool_input.command' >> ~/.claude/command-log.txt"
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>

  <Tab title="MCP 도구 매칭">
    MCP 도구는 내장 도구와 다른 명명 규칙을 사용합니다: `mcp__<server>__<tool>`, 여기서 `<server>`는 MCP 서버 이름이고 `<tool>`은 제공하는 도구입니다. 예를 들어, `mcp__github__search_repositories` 또는 `mcp__filesystem__read_file`. 정규식 매처를 사용하여 특정 서버의 모든 도구를 대상으로 하거나, `mcp__.*__write.*` 같은 패턴으로 서버 간 매칭할 수 있습니다. 전체 예시 목록은 레퍼런스의 [MCP 도구 매칭](/en/hooks#match-mcp-tools)을 참조하세요.

    아래 명령은 훅의 JSON 입력에서 `jq`로 도구 이름을 추출하여 stderr에 출력합니다. 이는 상세 모드(`Ctrl+O`)에서 표시됩니다:

    ```json  theme={null}
    {
      "hooks": {
        "PreToolUse": [
          {
            "matcher": "mcp__github__.*",
            "hooks": [
              {
                "type": "command",
                "command": "echo \"GitHub tool called: $(jq -r '.tool_name')\" >&2"
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>

  <Tab title="세션 종료 시 정리">
    `SessionEnd` 이벤트는 세션 종료 이유에 대한 매처를 지원합니다. 이 훅은 `/clear` 실행 시에만 발동되며, 일반 종료 시에는 발동되지 않습니다:

    ```json  theme={null}
    {
      "hooks": {
        "SessionEnd": [
          {
            "matcher": "clear",
            "hooks": [
              {
                "type": "command",
                "command": "rm -f /tmp/claude-scratch-*.txt"
              }
            ]
          }
        ]
      }
    }
    ```
  </Tab>
</Tabs>

전체 매처 구문에 대해서는 [훅 레퍼런스](/en/hooks#configuration)를 참조하세요.

### 훅 저장 위치 설정

훅을 추가하는 위치에 따라 적용 범위가 결정됩니다:

| 위치                                                       | 범위                               | 공유 가능 여부                     |
| :--------------------------------------------------------- | :--------------------------------- | :--------------------------------- |
| `~/.claude/settings.json`                                  | 모든 프로젝트                      | 불가, 로컬 머신에만 저장           |
| `.claude/settings.json`                                    | 단일 프로젝트                      | 가능, 레포에 커밋 가능             |
| `.claude/settings.local.json`                              | 단일 프로젝트                      | 불가, gitignore 처리               |
| 관리형 정책 설정                                           | 조직 전체                          | 가능, 관리자 제어                  |
| [플러그인](/en/plugins) `hooks/hooks.json`                 | 플러그인 활성화 시                 | 가능, 플러그인에 번들링            |
| [스킬](/en/skills) 또는 [에이전트](/en/sub-agents) 프론트매터 | 스킬이나 에이전트 활성화 중        | 가능, 컴포넌트 파일에 정의         |

Claude Code에서 [`/hooks` 메뉴](/en/hooks#the-hooks-menu)를 사용하여 대화형으로 훅을 추가, 삭제, 조회할 수도 있습니다. 모든 훅을 한 번에 비활성화하려면 `/hooks` 메뉴 하단의 토글을 사용하거나 설정 파일에 `"disableAllHooks": true`를 설정하세요.

`/hooks` 메뉴를 통해 추가한 훅은 즉시 적용됩니다. Claude Code 실행 중에 설정 파일을 직접 편집하면 `/hooks` 메뉴에서 검토하거나 세션을 재시작해야 변경 사항이 적용됩니다.

## 프롬프트 기반 훅

결정론적 규칙이 아닌 판단이 필요한 결정에는 `type: "prompt"` 훅을 사용합니다. 셸 명령을 실행하는 대신, Claude Code가 프롬프트와 훅의 입력 데이터를 Claude 모델(기본적으로 Haiku)에 보내 결정을 내립니다. 더 높은 성능이 필요하면 `model` 필드로 다른 모델을 지정할 수 있습니다.

모델의 역할은 JSON으로 예/아니오 결정만 반환하는 것입니다:

* `"ok": true`: 동작이 진행됩니다
* `"ok": false`: 동작이 차단됩니다. 모델의 `"reason"`이 Claude에게 피드백으로 전달되어 조정할 수 있습니다.

이 예제는 `Stop` 훅을 사용하여 모델에게 요청된 모든 작업이 완료되었는지 확인합니다. 모델이 `"ok": false`를 반환하면 Claude는 계속 작업하며 `reason`을 다음 지시로 사용합니다:

```json  theme={null}
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check if all tasks are complete. If not, respond with {\"ok\": false, \"reason\": \"what remains to be done\"}."
          }
        ]
      }
    ]
  }
}
```

전체 설정 옵션에 대해서는 레퍼런스의 [프롬프트 기반 훅](/en/hooks#prompt-based-hooks)을 참조하세요.

## 에이전트 기반 훅

검증을 위해 파일을 검사하거나 명령을 실행해야 할 때는 `type: "agent"` 훅을 사용합니다. 단일 LLM 호출만 하는 프롬프트 훅과 달리, 에이전트 훅은 파일 읽기, 코드 검색, 기타 도구를 사용하여 조건을 검증한 후 결정을 반환하는 서브에이전트를 생성합니다.

에이전트 훅은 프롬프트 훅과 동일한 `"ok"` / `"reason"` 응답 형식을 사용하지만, 기본 타임아웃이 60초이고 최대 50턴의 도구 사용이 가능합니다.

이 예제는 Claude가 중단하기 전에 테스트가 통과하는지 확인합니다:

```json  theme={null}
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify that all unit tests pass. Run the test suite and check the results. $ARGUMENTS",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

훅 입력 데이터만으로 결정을 내릴 수 있을 때는 프롬프트 훅을 사용하세요. 코드베이스의 실제 상태를 확인해야 할 때는 에이전트 훅을 사용하세요.

전체 설정 옵션에 대해서는 레퍼런스의 [에이전트 기반 훅](/en/hooks#agent-based-hooks)을 참조하세요.

## 제한 사항 및 문제 해결

### 제한 사항

* 훅은 stdout, stderr, 종료 코드를 통해서만 통신합니다. 슬래시 명령이나 도구 호출을 직접 트리거할 수 없습니다.
* 훅 타임아웃은 기본 10분이며, `timeout` 필드(초 단위)로 훅별로 설정 가능합니다.
* `PostToolUse` 훅은 도구가 이미 실행되었으므로 동작을 취소할 수 없습니다.
* `PermissionRequest` 훅은 [비대화형 모드](/en/headless)(`-p`)에서 발동되지 않습니다. 자동화된 권한 결정에는 `PreToolUse` 훅을 사용하세요.
* `Stop` 훅은 Claude가 응답을 마칠 때마다 발동되며, 작업 완료 시에만 발동되는 것이 아닙니다. 사용자 인터럽트 시에는 발동되지 않습니다.

### 훅이 발동되지 않을 때

훅이 설정되었지만 실행되지 않는 경우.

* `/hooks`를 실행하고 올바른 이벤트 아래에 훅이 표시되는지 확인
* 매처 패턴이 도구 이름과 정확히 일치하는지 확인 (매처는 대소문자를 구분합니다)
* 올바른 이벤트 유형을 트리거하고 있는지 확인 (예: `PreToolUse`는 도구 실행 전, `PostToolUse`는 실행 후)
* 비대화형 모드(`-p`)에서 `PermissionRequest` 훅을 사용하는 경우, `PreToolUse`로 전환

### 출력에 훅 오류가 표시될 때

트랜스크립트에 "PreToolUse hook error: ..." 같은 메시지가 표시되는 경우.

* 스크립트가 예기치 않게 0이 아닌 코드로 종료되었습니다. 샘플 JSON을 파이핑하여 수동으로 테스트하세요:
  ```bash  theme={null}
  echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | ./my-hook.sh
  echo $?  # 종료 코드 확인
  ```
* "command not found"가 표시되면, 절대 경로 또는 `$CLAUDE_PROJECT_DIR`를 사용하여 스크립트를 참조하세요
* "jq: command not found"가 표시되면, `jq`를 설치하거나 Python/Node.js로 JSON을 파싱하세요
* 스크립트가 아예 실행되지 않으면, 실행 권한을 부여하세요: `chmod +x ./my-hook.sh`

### `/hooks`에 설정된 훅이 표시되지 않을 때

설정 파일을 편집했지만 메뉴에 훅이 표시되지 않는 경우.

* 세션을 재시작하거나 `/hooks`를 열어 리로드하세요. `/hooks` 메뉴를 통해 추가한 훅은 즉시 적용되지만, 수동 파일 편집은 리로드가 필요합니다.
* JSON이 유효한지 확인하세요 (뒤따르는 쉼표와 주석은 허용되지 않습니다)
* 설정 파일이 올바른 위치에 있는지 확인하세요: 프로젝트 훅은 `.claude/settings.json`, 전역 훅은 `~/.claude/settings.json`

### Stop 훅이 무한 루프에 빠질 때

Claude가 멈추지 않고 무한 루프로 계속 작업하는 경우.

Stop 훅 스크립트는 이미 연속 실행을 트리거했는지 확인해야 합니다. JSON 입력에서 `stop_hook_active` 필드를 파싱하고 `true`이면 조기에 종료하세요:

```bash  theme={null}
#!/bin/bash
INPUT=$(cat)
if [ "$(echo "$INPUT" | jq -r '.stop_hook_active')" = "true" ]; then
  exit 0  # Claude가 멈출 수 있도록 허용
fi
# ... 나머지 훅 로직
```

### JSON 유효성 검사 실패

훅 스크립트가 유효한 JSON을 출력하는데도 Claude Code에서 JSON 파싱 오류가 표시되는 경우.

Claude Code가 훅을 실행할 때, 프로필(`~/.zshrc` 또는 `~/.bashrc`)을 소스하는 셸을 생성합니다. 프로필에 무조건적인 `echo` 문이 포함되어 있으면 해당 출력이 훅의 JSON 앞에 추가됩니다:

```
Shell ready on arm64
{"decision": "block", "reason": "Not allowed"}
```

Claude Code는 이것을 JSON으로 파싱하려다 실패합니다. 이를 수정하려면, 셸 프로필의 echo 문을 대화형 셸에서만 실행되도록 감싸세요:

```bash  theme={null}
# ~/.zshrc 또는 ~/.bashrc에서
if [[ $- == *i* ]]; then
  echo "Shell ready"
fi
```

`$-` 변수는 셸 플래그를 포함하며 `i`는 대화형을 의미합니다. 훅은 비대화형 셸에서 실행되므로 echo가 건너뛰어집니다.

### 디버그 기법

`Ctrl+O`로 상세 모드를 토글하여 트랜스크립트에서 훅 출력을 확인하거나, `claude --debug`를 실행하여 어떤 훅이 매칭되었고 종료 코드가 무엇인지 등 전체 실행 세부사항을 확인할 수 있습니다.

## 더 알아보기

* [훅 레퍼런스](/en/hooks): 전체 이벤트 스키마, JSON 출력 형식, 비동기 훅, MCP 도구 훅
* [보안 고려사항](/en/hooks#security-considerations): 공유 또는 프로덕션 환경에 훅을 배포하기 전에 검토
* [Bash 명령 검증 예제](https://github.com/anthropics/claude-code/blob/main/examples/hooks/bash_command_validator_example.py): 완전한 참조 구현
