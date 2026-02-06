# Claude Code를 프로그래밍 방식으로 실행하기

> Agent SDK를 사용하여 CLI, Python 또는 TypeScript에서 Claude Code를 프로그래밍 방식으로 실행할 수 있습니다.

[Agent SDK](https://platform.claude.com/docs/en/agent-sdk/overview)는 Claude Code를 구동하는 것과 동일한 도구, 에이전트 루프, 컨텍스트 관리 기능을 제공합니다. 스크립트 및 CI/CD를 위한 CLI로 사용하거나, 완전한 프로그래밍 제어를 위해 [Python](https://platform.claude.com/docs/en/agent-sdk/python) 및 [TypeScript](https://platform.claude.com/docs/en/agent-sdk/typescript) 패키지로 사용할 수 있습니다.

<Note>
  CLI는 이전에 "헤드리스 모드"라고 불렸습니다. `-p` 플래그와 모든 CLI 옵션은 동일하게 작동합니다.
</Note>

CLI에서 Claude Code를 프로그래밍 방식으로 실행하려면 `-p`와 프롬프트, 그리고 원하는 [CLI 옵션](/en/cli-reference)을 함께 전달합니다:

```bash  theme={null}
claude -p "auth.py의 버그를 찾아서 수정해줘" --allowedTools "Read,Edit,Bash"
```

이 페이지에서는 CLI(`claude -p`)를 통한 Agent SDK 사용법을 다룹니다. 구조화된 출력, 도구 승인 콜백, 네이티브 메시지 객체를 지원하는 Python 및 TypeScript SDK 패키지에 대해서는 [Agent SDK 전체 문서](https://platform.claude.com/docs/en/agent-sdk/overview)를 참조하세요.

## 기본 사용법

`-p`(또는 `--print`) 플래그를 `claude` 명령에 추가하면 비대화형으로 실행됩니다. 모든 [CLI 옵션](/en/cli-reference)은 `-p`와 함께 사용할 수 있으며, 다음을 포함합니다:

* `--continue`: [대화 이어가기](#대화-이어가기)
* `--allowedTools`: [도구 자동 승인](#도구-자동-승인)
* `--output-format`: [구조화된 출력](#구조화된-출력-받기)

이 예제는 Claude에게 코드베이스에 대한 질문을 하고 응답을 출력합니다:

```bash  theme={null}
claude -p "인증 모듈은 무엇을 하나요?"
```

## 예제

CLI에서 자주 사용되는 패턴들을 소개합니다.

### 구조화된 출력 받기

`--output-format`을 사용하여 응답 형식을 제어합니다:

* `text` (기본값): 일반 텍스트 출력
* `json`: 결과, 세션 ID, 메타데이터가 포함된 구조화된 JSON
* `stream-json`: 실시간 스트리밍을 위한 줄바꿈 구분 JSON

이 예제는 프로젝트 요약을 세션 메타데이터와 함께 JSON으로 반환하며, 텍스트 결과는 `result` 필드에 포함됩니다:

```bash  theme={null}
claude -p "이 프로젝트를 요약해줘" --output-format json
```

특정 스키마에 맞는 출력을 얻으려면 `--output-format json`과 `--json-schema`, 그리고 [JSON Schema](https://json-schema.org/) 정의를 함께 사용합니다. 응답에는 요청에 대한 메타데이터(세션 ID, 사용량 등)가 포함되며, 구조화된 출력은 `structured_output` 필드에 담깁니다.

이 예제는 함수 이름을 추출하여 문자열 배열로 반환합니다:

```bash  theme={null}
claude -p "auth.py에서 주요 함수 이름을 추출해줘" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}'
```

<Tip>
  [jq](https://jqlang.github.io/jq/) 같은 도구를 사용하여 응답을 파싱하고 특정 필드를 추출할 수 있습니다:

  ```bash  theme={null}
  # 텍스트 결과 추출
  claude -p "이 프로젝트를 요약해줘" --output-format json | jq -r '.result'

  # 구조화된 출력 추출
  claude -p "auth.py에서 함수 이름을 추출해줘" \
    --output-format json \
    --json-schema '{"type":"object","properties":{"functions":{"type":"array","items":{"type":"string"}}},"required":["functions"]}' \
    | jq '.structured_output'
  ```
</Tip>

### 응답 스트리밍

`--output-format stream-json`에 `--verbose`와 `--include-partial-messages`를 함께 사용하면 토큰이 생성되는 대로 수신할 수 있습니다. 각 줄은 이벤트를 나타내는 JSON 객체입니다:

```bash  theme={null}
claude -p "재귀를 설명해줘" --output-format stream-json --verbose --include-partial-messages
```

다음 예제는 [jq](https://jqlang.github.io/jq/)를 사용하여 텍스트 델타만 필터링하고 스트리밍 텍스트만 표시합니다. `-r` 플래그는 원시 문자열(따옴표 없이)을 출력하고, `-j`는 줄바꿈 없이 연결하여 토큰이 연속적으로 스트리밍됩니다:

```bash  theme={null}
claude -p "시를 써줘" --output-format stream-json --verbose --include-partial-messages | \
  jq -rj 'select(.type == "stream_event" and .event.delta.type? == "text_delta") | .event.delta.text'
```

콜백과 메시지 객체를 사용한 프로그래밍 방식의 스트리밍에 대해서는 Agent SDK 문서의 [실시간 응답 스트리밍](https://platform.claude.com/docs/en/agent-sdk/streaming-output)을 참조하세요.

### 도구 자동 승인

`--allowedTools`를 사용하면 Claude가 특정 도구를 프롬프트 없이 사용할 수 있습니다. 이 예제는 테스트 스위트를 실행하고 실패를 수정하며, Claude가 Bash 명령 실행과 파일 읽기/편집을 허가 요청 없이 수행할 수 있도록 합니다:

```bash  theme={null}
claude -p "테스트 스위트를 실행하고 실패한 항목을 수정해줘" \
  --allowedTools "Bash,Read,Edit"
```

### 커밋 생성하기

이 예제는 스테이징된 변경사항을 검토하고 적절한 메시지로 커밋을 생성합니다:

```bash  theme={null}
claude -p "스테이징된 변경사항을 확인하고 적절한 커밋을 만들어줘" \
  --allowedTools "Bash(git diff *),Bash(git log *),Bash(git status *),Bash(git commit *)"
```

`--allowedTools` 플래그는 [권한 규칙 구문](/en/settings#permission-rule-syntax)을 사용합니다. 끝의 ` *`는 접두사 매칭을 활성화하므로, `Bash(git diff *)`는 `git diff`로 시작하는 모든 명령을 허용합니다. `*` 앞의 공백이 중요합니다: 공백 없이 `Bash(git diff*)`로 쓰면 `git diff-index`도 매칭됩니다.

<Note>
  `/commit` 같은 사용자 호출 [스킬](/en/skills)과 [내장 명령](/en/interactive-mode#built-in-commands)은 대화형 모드에서만 사용 가능합니다. `-p` 모드에서는 수행하려는 작업을 직접 설명하세요.
</Note>

### 시스템 프롬프트 커스터마이징

`--append-system-prompt`를 사용하면 Claude Code의 기본 동작을 유지하면서 지시사항을 추가할 수 있습니다. 이 예제는 PR diff를 Claude에 파이프하고 보안 취약점 검토를 지시합니다:

```bash  theme={null}
gh pr diff "$1" | claude -p \
  --append-system-prompt "당신은 보안 엔지니어입니다. 취약점을 검토하세요." \
  --output-format json
```

기본 프롬프트를 완전히 대체하는 `--system-prompt` 등 더 많은 옵션은 [시스템 프롬프트 플래그](/en/cli-reference#system-prompt-flags)를 참조하세요.

### 대화 이어가기

`--continue`를 사용하면 가장 최근 대화를 이어갈 수 있고, `--resume`에 세션 ID를 지정하면 특정 대화를 이어갈 수 있습니다. 이 예제는 리뷰를 실행한 후 후속 프롬프트를 전송합니다:

```bash  theme={null}
# 첫 번째 요청
claude -p "이 코드베이스의 성능 이슈를 검토해줘"

# 가장 최근 대화 이어가기
claude -p "이제 데이터베이스 쿼리에 집중해줘" --continue
claude -p "발견된 모든 이슈의 요약을 생성해줘" --continue
```

여러 대화를 동시에 진행하는 경우, 세션 ID를 캡처하여 특정 대화를 재개할 수 있습니다:

```bash  theme={null}
session_id=$(claude -p "리뷰를 시작해줘" --output-format json | jq -r '.session_id')
claude -p "리뷰를 계속해줘" --resume "$session_id"
```

## 다음 단계

<CardGroup cols={2}>
  <Card title="Agent SDK 빠른 시작" icon="play" href="https://platform.claude.com/docs/en/agent-sdk/quickstart">
    Python 또는 TypeScript로 첫 번째 에이전트 구축하기
  </Card>

  <Card title="CLI 레퍼런스" icon="terminal" href="/en/cli-reference">
    모든 CLI 플래그 및 옵션 살펴보기
  </Card>

  <Card title="GitHub Actions" icon="github" href="/en/github-actions">
    GitHub 워크플로우에서 Agent SDK 사용하기
  </Card>

  <Card title="GitLab CI/CD" icon="gitlab" href="/en/gitlab-ci-cd">
    GitLab 파이프라인에서 Agent SDK 사용하기
  </Card>
</CardGroup>
