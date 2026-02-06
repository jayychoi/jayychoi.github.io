# MCP를 통해 Claude Code를 도구에 연결하기

> Model Context Protocol을 사용하여 Claude Code를 여러분의 도구와 연결하는 방법을 알아보세요.

Claude Code는 AI-도구 통합을 위한 오픈소스 표준인 [Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction)을 통해 수백 개의 외부 도구 및 데이터 소스에 연결할 수 있습니다. MCP 서버는 Claude Code에 도구, 데이터베이스, API에 대한 접근 권한을 부여합니다.

## MCP로 할 수 있는 것

MCP 서버가 연결되면 Claude Code에 다음과 같은 요청을 할 수 있습니다:

* **이슈 트래커에서 기능 구현**: "JIRA 이슈 ENG-4521에 설명된 기능을 추가하고 GitHub에 PR을 생성해줘."
* **모니터링 데이터 분석**: "Sentry와 Statsig을 확인해서 ENG-4521에 설명된 기능의 사용량을 확인해줘."
* **데이터베이스 쿼리**: "PostgreSQL 데이터베이스를 기반으로 ENG-4521 기능을 사용한 무작위 사용자 10명의 이메일을 찾아줘."
* **디자인 통합**: "Slack에 게시된 새 Figma 디자인을 기반으로 표준 이메일 템플릿을 업데이트해줘."
* **워크플로우 자동화**: "이 10명의 사용자에게 새 기능에 대한 피드백 세션에 초대하는 Gmail 초안을 작성해줘."

## 인기 있는 MCP 서버

다음은 Claude Code에 연결할 수 있는 자주 사용되는 MCP 서버들입니다:

> **주의**: 서드파티 MCP 서버는 본인의 책임 하에 사용하세요 - Anthropic은 이러한 모든 서버의 정확성이나 보안을 검증하지 않았습니다. 설치하려는 MCP 서버를 신뢰할 수 있는지 확인하세요. 신뢰할 수 없는 콘텐츠를 가져올 수 있는 MCP 서버를 사용할 때는 프롬프트 인젝션 위험에 노출될 수 있으므로 특히 주의하세요.

> **특정 통합이 필요하신가요?** [GitHub에서 수백 개의 MCP 서버를 더 찾아보거나](https://github.com/modelcontextprotocol/servers), [MCP SDK](https://modelcontextprotocol.io/quickstart/server)를 사용하여 직접 만들 수 있습니다.

## MCP 서버 설치하기

MCP 서버는 필요에 따라 세 가지 방법으로 구성할 수 있습니다:

### 옵션 1: 원격 HTTP 서버 추가

HTTP 서버는 원격 MCP 서버에 연결하는 데 권장되는 옵션입니다. 클라우드 기반 서비스에 가장 널리 지원되는 전송 방식입니다.

```bash
# 기본 구문
claude mcp add --transport http <이름> <URL>

# 실제 예시: Notion에 연결
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Bearer 토큰을 사용하는 예시
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### 옵션 2: 원격 SSE 서버 추가

> **주의**: SSE(Server-Sent Events) 전송 방식은 더 이상 사용되지 않습니다(deprecated). 가능한 경우 HTTP 서버를 대신 사용하세요.

```bash
# 기본 구문
claude mcp add --transport sse <이름> <URL>

# 실제 예시: Asana에 연결
claude mcp add --transport sse asana https://mcp.asana.com/sse

# 인증 헤더를 사용하는 예시
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### 옵션 3: 로컬 stdio 서버 추가

stdio 서버는 로컬 머신에서 프로세스로 실행됩니다. 직접적인 시스템 접근이나 커스텀 스크립트가 필요한 도구에 이상적입니다.

```bash
# 기본 구문
claude mcp add [옵션] <이름> -- <명령어> [인수...]

# 실제 예시: Airtable 서버 추가
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

> **중요: 옵션 순서**
>
> 모든 옵션(`--transport`, `--env`, `--scope`, `--header`)은 서버 이름 **앞에** 와야 합니다. `--`(더블 대시)는 서버 이름과 MCP 서버에 전달되는 명령어 및 인수를 구분합니다.
>
> 예시:
>
> * `claude mcp add --transport stdio myserver -- npx server` → `npx server`를 실행
> * `claude mcp add --transport stdio --env KEY=value myserver -- python server.py --port 8080` → `KEY=value` 환경 변수와 함께 `python server.py --port 8080`을 실행
>
> 이렇게 하면 Claude의 플래그와 서버의 플래그 간의 충돌을 방지할 수 있습니다.

### 서버 관리하기

구성이 완료되면 다음 명령어로 MCP 서버를 관리할 수 있습니다:

```bash
# 구성된 모든 서버 나열
claude mcp list

# 특정 서버의 세부 정보 확인
claude mcp get github

# 서버 제거
claude mcp remove github

# (Claude Code 내에서) 서버 상태 확인
/mcp
```

### 동적 도구 업데이트

Claude Code는 MCP `list_changed` 알림을 지원하여, MCP 서버가 연결 해제 및 재연결 없이 사용 가능한 도구, 프롬프트, 리소스를 동적으로 업데이트할 수 있습니다. MCP 서버가 `list_changed` 알림을 보내면 Claude Code는 해당 서버에서 사용 가능한 기능을 자동으로 새로고침합니다.

> **팁**:
>
> * `--scope` 플래그를 사용하여 구성이 저장되는 위치를 지정합니다:
>   * `local` (기본값): 현재 프로젝트에서 본인만 사용 가능 (이전 버전에서는 `project`로 불림)
>   * `project`: `.mcp.json` 파일을 통해 프로젝트의 모든 구성원과 공유
>   * `user`: 모든 프로젝트에서 본인이 사용 가능 (이전 버전에서는 `global`로 불림)
> * `--env` 플래그로 환경 변수를 설정합니다 (예: `--env KEY=value`)
> * `MCP_TIMEOUT` 환경 변수를 사용하여 MCP 서버 시작 타임아웃을 구성합니다 (예: `MCP_TIMEOUT=10000 claude`는 10초 타임아웃 설정)
> * MCP 도구 출력이 10,000 토큰을 초과하면 Claude Code가 경고를 표시합니다. 이 제한을 늘리려면 `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 설정하세요 (예: `MAX_MCP_OUTPUT_TOKENS=50000`)
> * `/mcp`를 사용하여 OAuth 2.0 인증이 필요한 원격 서버에 인증합니다

> **Windows 사용자**: 네이티브 Windows(WSL 제외)에서 `npx`를 사용하는 로컬 MCP 서버는 올바른 실행을 위해 `cmd /c` 래퍼가 필요합니다.
>
> ```bash
> # Windows가 실행할 수 있는 command="cmd"을 생성합니다
> claude mcp add --transport stdio my-server -- cmd /c npx -y @some/package
> ```
>
> `cmd /c` 래퍼 없이는 Windows가 `npx`를 직접 실행할 수 없어 "Connection closed" 오류가 발생합니다.

### 플러그인 제공 MCP 서버

[플러그인](/en/plugins)은 MCP 서버를 번들로 제공하여, 플러그인이 활성화되면 자동으로 도구와 통합을 제공할 수 있습니다. 플러그인 MCP 서버는 사용자가 구성한 서버와 동일하게 작동합니다.

**플러그인 MCP 서버의 작동 방식**:

* 플러그인은 플러그인 루트의 `.mcp.json` 또는 `plugin.json` 인라인으로 MCP 서버를 정의합니다
* 플러그인이 활성화되면 해당 MCP 서버가 자동으로 시작됩니다
* 플러그인 MCP 도구는 수동으로 구성된 MCP 도구와 함께 나타납니다
* 플러그인 서버는 플러그인 설치를 통해 관리됩니다 (`/mcp` 명령이 아님)

**플러그인 MCP 구성 예시**:

플러그인 루트의 `.mcp.json`:

```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

또는 `plugin.json` 인라인:

```json
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

**플러그인 MCP 기능**:

* **자동 수명주기**: 플러그인이 활성화되면 서버가 시작되지만, MCP 서버 변경 사항(활성화 또는 비활성화)을 적용하려면 Claude Code를 재시작해야 합니다
* **환경 변수**: 플러그인 상대 경로에 `${CLAUDE_PLUGIN_ROOT}`를 사용합니다
* **사용자 환경 접근**: 수동으로 구성된 서버와 동일한 환경 변수에 접근할 수 있습니다
* **다중 전송 타입**: stdio, SSE, HTTP 전송을 지원합니다 (전송 지원은 서버마다 다를 수 있음)

**플러그인 MCP 서버 보기**:

```bash
# Claude Code 내에서 플러그인 서버를 포함한 모든 MCP 서버 확인
/mcp
```

플러그인 서버는 플러그인에서 제공된다는 것을 나타내는 표시와 함께 목록에 나타납니다.

**플러그인 MCP 서버의 장점**:

* **번들 배포**: 도구와 서버가 함께 패키징됨
* **자동 설정**: 수동 MCP 구성이 필요 없음
* **팀 일관성**: 플러그인이 설치되면 모든 사람이 동일한 도구를 사용

플러그인과 함께 MCP 서버를 번들링하는 방법에 대한 자세한 내용은 [플러그인 컴포넌트 레퍼런스](/en/plugins-reference#mcp-servers)를 참조하세요.

## MCP 설치 범위(Scope)

MCP 서버는 세 가지 범위 수준에서 구성할 수 있으며, 각각 서버 접근성과 공유를 관리하는 고유한 목적을 가지고 있습니다. 이러한 범위를 이해하면 특정 요구에 맞는 최적의 서버 구성 방법을 결정하는 데 도움이 됩니다.

### Local 범위

Local 범위 서버는 기본 구성 수준을 나타내며 프로젝트 경로 하의 `~/.claude.json`에 저장됩니다. 이 서버들은 본인에게만 비공개로 유지되며 현재 프로젝트 디렉터리에서 작업할 때만 접근할 수 있습니다. 이 범위는 개인 개발 서버, 실험적 구성, 공유해서는 안 되는 민감한 자격 증명을 포함하는 서버에 이상적입니다.

> **참고**: MCP 서버의 "local scope"라는 용어는 일반적인 로컬 설정과 다릅니다. MCP local 범위 서버는 `~/.claude.json`(홈 디렉터리)에 저장되지만, 일반 로컬 설정은 `.claude/settings.local.json`(프로젝트 디렉터리)을 사용합니다. 설정 파일 위치에 대한 자세한 내용은 [설정](/en/settings#settings-files)을 참조하세요.

```bash
# local 범위 서버 추가 (기본값)
claude mcp add --transport http stripe https://mcp.stripe.com

# 명시적으로 local 범위 지정
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### Project 범위

Project 범위 서버는 프로젝트 루트 디렉터리의 `.mcp.json` 파일에 구성을 저장하여 팀 협업을 가능하게 합니다. 이 파일은 버전 관리에 체크인하도록 설계되어 모든 팀원이 동일한 MCP 도구와 서비스에 접근할 수 있습니다. project 범위 서버를 추가하면 Claude Code가 자동으로 이 파일을 적절한 구성 구조로 생성하거나 업데이트합니다.

```bash
# project 범위 서버 추가
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

결과로 생성되는 `.mcp.json` 파일은 표준화된 형식을 따릅니다:

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

보안상의 이유로 Claude Code는 `.mcp.json` 파일의 project 범위 서버를 사용하기 전에 승인을 요청합니다. 이러한 승인 선택을 초기화해야 하는 경우 `claude mcp reset-project-choices` 명령을 사용하세요.

### User 범위

User 범위 서버는 `~/.claude.json`에 저장되며 크로스 프로젝트 접근성을 제공하여, 머신의 모든 프로젝트에서 사용할 수 있으면서 사용자 계정에 비공개로 유지됩니다. 이 범위는 개인 유틸리티 서버, 개발 도구, 또는 여러 프로젝트에서 자주 사용하는 서비스에 적합합니다.

```bash
# user 서버 추가
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### 올바른 범위 선택하기

사용 목적에 따라 범위를 선택하세요:

* **Local 범위**: 한 프로젝트에 특정한 개인 서버, 실험적 구성, 민감한 자격 증명
* **Project 범위**: 팀 공유 서버, 프로젝트 특정 도구, 협업에 필요한 서비스
* **User 범위**: 여러 프로젝트에 걸쳐 필요한 개인 유틸리티, 개발 도구, 자주 사용하는 서비스

> **MCP 서버는 어디에 저장되나요?**
>
> * **User 및 local 범위**: `~/.claude.json` (`mcpServers` 필드 또는 프로젝트 경로 하위)
> * **Project 범위**: 프로젝트 루트의 `.mcp.json` (소스 관리에 체크인)
> * **관리형**: 시스템 디렉터리의 `managed-mcp.json` ([관리형 MCP 구성](#관리형-mcp-구성) 참조)

### 범위 계층 구조와 우선순위

MCP 서버 구성은 명확한 우선순위 계층을 따릅니다. 동일한 이름의 서버가 여러 범위에 존재할 경우, 시스템은 local 범위 서버를 먼저 우선시하고, 그 다음 project 범위 서버, 마지막으로 user 범위 서버 순으로 충돌을 해결합니다. 이 설계는 필요할 때 개인 구성이 공유 구성을 재정의할 수 있도록 보장합니다.

### `.mcp.json`에서의 환경 변수 확장

Claude Code는 `.mcp.json` 파일에서 환경 변수 확장을 지원하여, 팀이 머신별 경로와 API 키와 같은 민감한 값에 대한 유연성을 유지하면서 구성을 공유할 수 있습니다.

**지원되는 구문:**

* `${VAR}` - 환경 변수 `VAR`의 값으로 확장
* `${VAR:-default}` - `VAR`가 설정되어 있으면 해당 값으로, 그렇지 않으면 `default` 사용

**확장 위치:**
환경 변수는 다음 위치에서 확장할 수 있습니다:

* `command` - 서버 실행 파일 경로
* `args` - 명령줄 인수
* `env` - 서버에 전달되는 환경 변수
* `url` - HTTP 서버 타입용
* `headers` - HTTP 서버 인증용

**변수 확장 예시:**

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

필수 환경 변수가 설정되지 않았고 기본값이 없는 경우 Claude Code는 구성을 파싱하지 못합니다.

## 실용적인 예시

### 예시: Sentry로 오류 모니터링

```bash
# 1. Sentry MCP 서버 추가
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. /mcp를 사용하여 Sentry 계정으로 인증
> /mcp

# 3. 프로덕션 이슈 디버깅
> "지난 24시간 동안 가장 흔한 오류는 무엇인가요?"
> "오류 ID abc123의 스택 트레이스를 보여주세요"
> "어떤 배포에서 이 새로운 오류가 발생했나요?"
```

### 예시: 코드 리뷰를 위한 GitHub 연결

```bash
# 1. GitHub MCP 서버 추가
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Claude Code에서 필요시 인증
> /mcp
# GitHub에 대해 "Authenticate" 선택

# 3. 이제 Claude에게 GitHub 관련 작업을 요청할 수 있습니다
> "PR #456을 리뷰하고 개선 사항을 제안해줘"
> "방금 발견한 버그에 대한 새 이슈를 생성해줘"
> "나에게 할당된 열린 PR을 모두 보여줘"
```

### 예시: PostgreSQL 데이터베이스 쿼리

```bash
# 1. 연결 문자열로 데이터베이스 서버 추가
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"

# 2. 자연어로 데이터베이스 쿼리
> "이번 달 총 매출은 얼마인가요?"
> "orders 테이블의 스키마를 보여주세요"
> "90일 동안 구매하지 않은 고객을 찾아주세요"
```

## 원격 MCP 서버 인증

많은 클라우드 기반 MCP 서버는 인증을 필요로 합니다. Claude Code는 안전한 연결을 위해 OAuth 2.0을 지원합니다.

**단계 1: 인증이 필요한 서버 추가**

예시:

```bash
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp
```

**단계 2: Claude Code 내에서 /mcp 명령 사용**

```
> /mcp
```

그런 다음 브라우저에서 로그인 단계를 따릅니다.

> **팁**:
>
> * 인증 토큰은 안전하게 저장되고 자동으로 갱신됩니다
> * `/mcp` 메뉴에서 "Clear authentication"을 사용하여 접근을 취소할 수 있습니다
> * 브라우저가 자동으로 열리지 않으면 제공된 URL을 복사하세요
> * OAuth 인증은 HTTP 서버에서 작동합니다

### 사전 구성된 OAuth 자격 증명 사용

일부 MCP 서버는 자동 OAuth 설정을 지원하지 않습니다. "Incompatible auth server: does not support dynamic client registration"과 같은 오류가 표시되면 해당 서버에는 사전 구성된 자격 증명이 필요합니다. 먼저 서버의 개발자 포털을 통해 OAuth 앱을 등록한 다음 서버를 추가할 때 자격 증명을 제공하세요.

**단계 1: 서버에 OAuth 앱 등록**

서버의 개발자 포털을 통해 앱을 생성하고 클라이언트 ID와 클라이언트 시크릿을 기록합니다.

많은 서버에서 리디렉트 URI도 필요합니다. 필요한 경우 포트를 선택하고 `http://localhost:PORT/callback` 형식의 리디렉트 URI를 등록하세요. 다음 단계에서 동일한 포트를 `--callback-port`와 함께 사용하세요.

**단계 2: 자격 증명으로 서버 추가**

다음 방법 중 하나를 선택하세요. `--callback-port`에 사용되는 포트는 사용 가능한 아무 포트나 됩니다. 이전 단계에서 등록한 리디렉트 URI와 일치하기만 하면 됩니다.

`claude mcp add` 사용:

```bash
claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

`claude mcp add-json` 사용:

```bash
claude mcp add-json my-server \
  '{"type":"http","url":"https://mcp.example.com/mcp","oauth":{"clientId":"your-client-id","callbackPort":8080}}' \
  --client-secret
```

CI / 환경 변수 사용:

```bash
MCP_CLIENT_SECRET=your-secret claude mcp add --transport http \
  --client-id your-client-id --client-secret --callback-port 8080 \
  my-server https://mcp.example.com/mcp
```

**단계 3: Claude Code에서 인증**

Claude Code에서 `/mcp`를 실행하고 브라우저 로그인 흐름을 따릅니다.

> **팁**:
>
> * 클라이언트 시크릿은 구성 파일이 아닌 시스템 키체인(macOS) 또는 자격 증명 파일에 안전하게 저장됩니다
> * 서버가 시크릿 없는 공개 OAuth 클라이언트를 사용하는 경우 `--client-secret` 없이 `--client-id`만 사용하세요
> * 이러한 플래그는 HTTP 및 SSE 전송에만 적용됩니다. stdio 서버에는 영향을 미치지 않습니다
> * `claude mcp get <name>`을 사용하여 서버에 OAuth 자격 증명이 구성되어 있는지 확인하세요

## JSON 구성에서 MCP 서버 추가

MCP 서버에 대한 JSON 구성이 있다면 직접 추가할 수 있습니다:

**단계 1: JSON에서 MCP 서버 추가**

```bash
# 기본 구문
claude mcp add-json <이름> '<json>'

# 예시: JSON 구성으로 HTTP 서버 추가
claude mcp add-json weather-api '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# 예시: JSON 구성으로 stdio 서버 추가
claude mcp add-json local-weather '{"type":"stdio","command":"/path/to/weather-cli","args":["--api-key","abc123"],"env":{"CACHE_DIR":"/tmp"}}'

# 예시: 사전 구성된 OAuth 자격 증명으로 HTTP 서버 추가
claude mcp add-json my-server '{"type":"http","url":"https://mcp.example.com/mcp","oauth":{"clientId":"your-client-id","callbackPort":8080}}' --client-secret
```

**단계 2: 서버가 추가되었는지 확인**

```bash
claude mcp get weather-api
```

> **팁**:
>
> * 셸에서 JSON이 올바르게 이스케이프되었는지 확인하세요
> * JSON은 MCP 서버 구성 스키마를 준수해야 합니다
> * `--scope user`를 사용하여 프로젝트별 구성 대신 사용자 구성에 서버를 추가할 수 있습니다

## Claude Desktop에서 MCP 서버 가져오기

Claude Desktop에서 이미 MCP 서버를 구성한 경우 가져올 수 있습니다:

**단계 1: Claude Desktop에서 서버 가져오기**

```bash
claude mcp add-from-claude-desktop
```

**단계 2: 가져올 서버 선택**

명령을 실행하면 가져올 서버를 선택할 수 있는 대화형 대화 상자가 표시됩니다.

**단계 3: 서버가 가져와졌는지 확인**

```bash
claude mcp list
```

> **팁**:
>
> * 이 기능은 macOS 및 WSL(Windows Subsystem for Linux)에서만 작동합니다
> * 해당 플랫폼의 표준 위치에서 Claude Desktop 구성 파일을 읽습니다
> * `--scope user` 플래그를 사용하여 사용자 구성에 서버를 추가하세요
> * 가져온 서버는 Claude Desktop에서와 동일한 이름을 가집니다
> * 동일한 이름의 서버가 이미 존재하면 숫자 접미사가 추가됩니다 (예: `server_1`)

## Claude Code를 MCP 서버로 사용하기

Claude Code 자체를 다른 애플리케이션이 연결할 수 있는 MCP 서버로 사용할 수 있습니다:

```bash
# Claude를 stdio MCP 서버로 시작
claude mcp serve
```

Claude Desktop에서 claude_desktop_config.json에 다음 구성을 추가하여 사용할 수 있습니다:

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> **실행 파일 경로 구성**: `command` 필드는 Claude Code 실행 파일을 참조해야 합니다. `claude` 명령이 시스템의 PATH에 없는 경우 실행 파일의 전체 경로를 지정해야 합니다.
>
> 전체 경로를 찾으려면:
>
> ```bash
> which claude
> ```
>
> 그런 다음 구성에서 전체 경로를 사용하세요:
>
> ```json
> {
>   "mcpServers": {
>     "claude-code": {
>       "type": "stdio",
>       "command": "/full/path/to/claude",
>       "args": ["mcp", "serve"],
>       "env": {}
>     }
>   }
> }
> ```
>
> 올바른 실행 파일 경로 없이는 `spawn claude ENOENT`와 같은 오류가 발생합니다.

> **팁**:
>
> * 이 서버는 Claude의 View, Edit, LS 등의 도구에 대한 접근을 제공합니다
> * Claude Desktop에서 디렉터리의 파일을 읽고, 편집하는 등의 작업을 Claude에게 요청해 보세요
> * 이 MCP 서버는 Claude Code의 도구만 MCP 클라이언트에 노출하므로, 개별 도구 호출에 대한 사용자 확인은 자체 클라이언트가 구현해야 합니다

## MCP 출력 제한 및 경고

MCP 도구가 대량의 출력을 생성할 때 Claude Code는 대화 컨텍스트의 과부하를 방지하기 위해 토큰 사용량을 관리합니다:

* **출력 경고 임계값**: MCP 도구 출력이 10,000 토큰을 초과하면 Claude Code가 경고를 표시합니다
* **구성 가능한 제한**: `MAX_MCP_OUTPUT_TOKENS` 환경 변수를 사용하여 최대 허용 MCP 출력 토큰을 조정할 수 있습니다
* **기본 제한**: 기본 최대값은 25,000 토큰입니다

대량 출력을 생성하는 도구의 제한을 늘리려면:

```bash
# MCP 도구 출력에 대한 더 높은 제한 설정
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

이는 다음과 같은 MCP 서버에서 작업할 때 특히 유용합니다:

* 대규모 데이터셋이나 데이터베이스를 쿼리하는 경우
* 상세한 보고서나 문서를 생성하는 경우
* 광범위한 로그 파일이나 디버깅 정보를 처리하는 경우

> 특정 MCP 서버에서 출력 경고가 자주 발생하면 제한을 늘리거나 서버가 응답을 페이지네이션하거나 필터링하도록 구성하는 것을 고려하세요.

## MCP 리소스 사용

MCP 서버는 파일을 참조하는 것과 유사하게 @ 멘션을 사용하여 참조할 수 있는 리소스를 노출할 수 있습니다.

### MCP 리소스 참조

**단계 1: 사용 가능한 리소스 나열**

프롬프트에 `@`를 입력하면 연결된 모든 MCP 서버에서 사용 가능한 리소스를 볼 수 있습니다. 리소스는 자동완성 메뉴에서 파일과 함께 나타납니다.

**단계 2: 특정 리소스 참조**

`@server:protocol://resource/path` 형식을 사용하여 리소스를 참조합니다:

```
> @github:issue://123을 분석하고 수정 방법을 제안해 줄 수 있나요?
```

```
> @docs:file://api/authentication에 있는 API 문서를 검토해 주세요
```

**단계 3: 여러 리소스 참조**

단일 프롬프트에서 여러 리소스를 참조할 수 있습니다:

```
> @postgres:schema://users와 @docs:file://database/user-model을 비교해 주세요
```

> **팁**:
>
> * 리소스는 참조될 때 자동으로 가져와져 첨부 파일로 포함됩니다
> * 리소스 경로는 @ 멘션 자동완성에서 퍼지 검색이 가능합니다
> * Claude Code는 서버가 지원할 때 MCP 리소스를 나열하고 읽는 도구를 자동으로 제공합니다
> * 리소스는 MCP 서버가 제공하는 모든 유형의 콘텐츠를 포함할 수 있습니다 (텍스트, JSON, 구조화된 데이터 등)

## MCP 도구 검색으로 확장하기

많은 MCP 서버가 구성되어 있으면 도구 정의가 컨텍스트 윈도우의 상당 부분을 차지할 수 있습니다. MCP 도구 검색(Tool Search)은 모든 도구를 미리 로드하는 대신 필요할 때 동적으로 로드하여 이 문제를 해결합니다.

### 작동 방식

Claude Code는 MCP 도구 설명이 컨텍스트 윈도우의 10% 이상을 차지할 때 자동으로 도구 검색을 활성화합니다. 이 [임계값을 조정](#도구-검색-구성)하거나 도구 검색을 완전히 비활성화할 수 있습니다. 활성화되면:

1. MCP 도구는 컨텍스트에 미리 로드되는 대신 지연(deferred) 됩니다
2. Claude는 필요할 때 관련 MCP 도구를 발견하기 위해 검색 도구를 사용합니다
3. Claude가 실제로 필요한 도구만 컨텍스트에 로드됩니다
4. 사용자 관점에서 MCP 도구는 이전과 동일하게 작동합니다

### MCP 서버 개발자를 위한 안내

MCP 서버를 구축하는 경우, 도구 검색이 활성화되면 서버 지침(instructions) 필드가 더 유용해집니다. 서버 지침은 [스킬](/en/skills)이 작동하는 방식과 유사하게 Claude가 언제 도구를 검색해야 하는지 이해하도록 도와줍니다.

다음을 설명하는 명확하고 설명적인 서버 지침을 추가하세요:

* 도구가 처리하는 작업 카테고리
* Claude가 도구를 검색해야 하는 시점
* 서버가 제공하는 주요 기능

### 도구 검색 구성

도구 검색은 기본적으로 auto 모드로 실행되며, MCP 도구 정의가 컨텍스트 임계값을 초과할 때만 활성화됩니다. 도구가 적으면 도구 검색 없이 정상적으로 로드됩니다. 이 기능을 사용하려면 `tool_reference` 블록을 지원하는 모델이 필요합니다: Sonnet 4 이상 또는 Opus 4 이상. Haiku 모델은 도구 검색을 지원하지 않습니다.

`ENABLE_TOOL_SEARCH` 환경 변수로 도구 검색 동작을 제어합니다:

| 값         | 동작                                                      |
| :--------- | :-------------------------------------------------------- |
| `auto`     | MCP 도구가 컨텍스트의 10%를 초과할 때 활성화 (기본값)        |
| `auto:<N>` | 사용자 정의 임계값에서 활성화, `<N>`은 백분율 (예: `auto:5`는 5%) |
| `true`     | 항상 활성화                                                |
| `false`    | 비활성화, 모든 MCP 도구를 미리 로드                          |

```bash
# 사용자 정의 5% 임계값 사용
ENABLE_TOOL_SEARCH=auto:5 claude

# 도구 검색 완전 비활성화
ENABLE_TOOL_SEARCH=false claude
```

또는 [settings.json `env` 필드](/en/settings#available-settings)에서 값을 설정하세요.

`disallowedTools` 설정을 사용하여 MCPSearch 도구를 구체적으로 비활성화할 수도 있습니다:

```json
{
  "permissions": {
    "deny": ["MCPSearch"]
  }
}
```

## MCP 프롬프트를 명령으로 사용하기

MCP 서버는 Claude Code에서 명령으로 사용할 수 있는 프롬프트를 노출할 수 있습니다.

### MCP 프롬프트 실행

**단계 1: 사용 가능한 프롬프트 확인**

`/`를 입력하면 MCP 서버의 프롬프트를 포함한 모든 사용 가능한 명령을 볼 수 있습니다. MCP 프롬프트는 `/mcp__servername__promptname` 형식으로 나타납니다.

**단계 2: 인수 없이 프롬프트 실행**

```
> /mcp__github__list_prs
```

**단계 3: 인수와 함께 프롬프트 실행**

많은 프롬프트는 인수를 받습니다. 명령 뒤에 공백으로 구분하여 전달하세요:

```
> /mcp__github__pr_review 456
```

```
> /mcp__jira__create_issue "Bug in login flow" high
```

> **팁**:
>
> * MCP 프롬프트는 연결된 서버에서 동적으로 발견됩니다
> * 인수는 프롬프트에 정의된 매개변수를 기반으로 파싱됩니다
> * 프롬프트 결과는 대화에 직접 주입됩니다
> * 서버 및 프롬프트 이름은 정규화됩니다 (공백은 밑줄로 변환)

## 관리형 MCP 구성

조직이 MCP 서버에 대한 중앙 집중식 제어가 필요한 경우 Claude Code는 두 가지 구성 옵션을 지원합니다:

1. **`managed-mcp.json`을 사용한 독점 제어**: 사용자가 수정하거나 확장할 수 없는 고정된 MCP 서버 세트 배포
2. **허용/차단 목록을 사용한 정책 기반 제어**: 사용자가 자체 서버를 추가할 수 있지만 허용되는 서버 제한

이러한 옵션을 통해 IT 관리자는 다음을 수행할 수 있습니다:

* **직원이 접근할 수 있는 MCP 서버 제어**: 조직 전체에 승인된 표준 MCP 서버 세트 배포
* **무단 MCP 서버 방지**: 사용자가 승인되지 않은 MCP 서버를 추가하지 못하도록 제한
* **MCP 완전 비활성화**: 필요한 경우 MCP 기능을 완전히 제거

### 옵션 1: managed-mcp.json을 사용한 독점 제어

`managed-mcp.json` 파일을 배포하면 모든 MCP 서버에 대한 **독점 제어**를 갖게 됩니다. 사용자는 이 파일에 정의된 것 이외의 MCP 서버를 추가, 수정 또는 사용할 수 없습니다. 완전한 제어를 원하는 조직에 가장 간단한 접근 방식입니다.

시스템 관리자가 시스템 전체 디렉터리에 구성 파일을 배포합니다:

* macOS: `/Library/Application Support/ClaudeCode/managed-mcp.json`
* Linux 및 WSL: `/etc/claude-code/managed-mcp.json`
* Windows: `C:\Program Files\ClaudeCode\managed-mcp.json`

> 이들은 관리자 권한이 필요한 시스템 전체 경로(`~/Library/...` 같은 사용자 홈 디렉터리가 아님)이며 IT 관리자가 배포하도록 설계되었습니다.

`managed-mcp.json` 파일은 표준 `.mcp.json` 파일과 동일한 형식을 사용합니다:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### 옵션 2: 허용/차단 목록을 사용한 정책 기반 제어

독점 제어 대신 관리자는 사용자가 자체 MCP 서버를 구성하되 허용되는 서버에 대한 제한을 적용할 수 있습니다. 이 접근 방식은 [관리 설정 파일](/en/settings#settings-files)의 `allowedMcpServers` 및 `deniedMcpServers`를 사용합니다.

> **옵션 선택**: 사용자 맞춤 없이 고정된 서버 세트를 배포하려면 옵션 1(`managed-mcp.json`)을 사용하세요. 정책 제약 내에서 사용자가 자체 서버를 추가할 수 있게 하려면 옵션 2(허용/차단 목록)를 사용하세요.

#### 제한 옵션

허용 목록 또는 차단 목록의 각 항목은 세 가지 방법으로 서버를 제한할 수 있습니다:

1. **서버 이름별** (`serverName`): 서버의 구성된 이름과 매칭
2. **명령별** (`serverCommand`): stdio 서버를 시작하는 데 사용된 정확한 명령과 인수를 매칭
3. **URL 패턴별** (`serverUrl`): 와일드카드 지원으로 원격 서버 URL을 매칭

**중요**: 각 항목에는 `serverName`, `serverCommand`, `serverUrl` 중 정확히 하나만 있어야 합니다.

#### 구성 예시

```json
{
  "allowedMcpServers": [
    // 서버 이름으로 허용
    { "serverName": "github" },
    { "serverName": "sentry" },

    // 정확한 명령으로 허용 (stdio 서버용)
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] },
    { "serverCommand": ["python", "/usr/local/bin/approved-server.py"] },

    // URL 패턴으로 허용 (원격 서버용)
    { "serverUrl": "https://mcp.company.com/*" },
    { "serverUrl": "https://*.internal.corp/*" }
  ],
  "deniedMcpServers": [
    // 서버 이름으로 차단
    { "serverName": "dangerous-server" },

    // 정확한 명령으로 차단 (stdio 서버용)
    { "serverCommand": ["npx", "-y", "unapproved-package"] },

    // URL 패턴으로 차단 (원격 서버용)
    { "serverUrl": "https://*.untrusted.com/*" }
  ]
}
```

#### 명령 기반 제한의 작동 방식

**정확한 매칭**:

* 명령 배열은 **정확히** 일치해야 합니다 - 명령과 모든 인수가 올바른 순서로 일치해야 합니다
* 예: `["npx", "-y", "server"]`는 `["npx", "server"]` 또는 `["npx", "-y", "server", "--flag"]`와 매칭되지 않습니다

**stdio 서버 동작**:

* 허용 목록에 **하나라도** `serverCommand` 항목이 포함되어 있으면 stdio 서버는 해당 명령 중 하나와 **반드시** 일치해야 합니다
* 명령 제한이 있을 때 stdio 서버는 이름만으로는 통과할 수 없습니다
* 이를 통해 관리자는 실행 허용되는 명령을 강제할 수 있습니다

**비-stdio 서버 동작**:

* 원격 서버(HTTP, SSE, WebSocket)는 허용 목록에 `serverUrl` 항목이 있으면 URL 기반 매칭을 사용합니다
* URL 항목이 없으면 원격 서버는 이름 기반 매칭으로 대체됩니다
* 명령 제한은 원격 서버에 적용되지 않습니다

#### URL 기반 제한의 작동 방식

URL 패턴은 `*`를 사용하여 임의의 문자 시퀀스를 매칭하는 와일드카드를 지원합니다. 이는 전체 도메인이나 서브도메인을 허용하는 데 유용합니다.

**와일드카드 예시**:

* `https://mcp.company.com/*` - 특정 도메인의 모든 경로 허용
* `https://*.example.com/*` - example.com의 모든 서브도메인 허용
* `http://localhost:*/*` - localhost의 모든 포트 허용

**원격 서버 동작**:

* 허용 목록에 **하나라도** `serverUrl` 항목이 포함되어 있으면 원격 서버는 해당 URL 패턴 중 하나와 **반드시** 일치해야 합니다
* URL 제한이 있을 때 원격 서버는 이름만으로는 통과할 수 없습니다
* 이를 통해 관리자는 허용되는 원격 엔드포인트를 강제할 수 있습니다

#### 허용 목록 동작 (`allowedMcpServers`)

* `undefined` (기본값): 제한 없음 - 사용자가 모든 MCP 서버를 구성할 수 있음
* 빈 배열 `[]`: 완전 잠금 - 사용자가 어떤 MCP 서버도 구성할 수 없음
* 항목 목록: 사용자는 이름, 명령 또는 URL 패턴으로 매칭되는 서버만 구성 가능

#### 차단 목록 동작 (`deniedMcpServers`)

* `undefined` (기본값): 차단되는 서버 없음
* 빈 배열 `[]`: 차단되는 서버 없음
* 항목 목록: 지정된 서버가 모든 범위에서 명시적으로 차단됨

#### 중요 참고 사항

* **옵션 1과 옵션 2를 결합할 수 있습니다**: `managed-mcp.json`이 존재하면 독점 제어를 가지며 사용자는 서버를 추가할 수 없습니다. 허용/차단 목록은 관리형 서버 자체에 여전히 적용됩니다.
* **차단 목록이 절대적으로 우선합니다**: 서버가 차단 목록 항목(이름, 명령 또는 URL)과 일치하면 허용 목록에 있더라도 차단됩니다
* 이름 기반, 명령 기반, URL 기반 제한이 함께 작동합니다: 서버가 이름 항목, 명령 항목 또는 URL 패턴 **중 하나**와 일치하면 통과합니다 (차단 목록에 의해 차단되지 않는 한)

> **`managed-mcp.json` 사용 시**: 사용자는 `claude mcp add`나 구성 파일을 통해 MCP 서버를 추가할 수 없습니다. `allowedMcpServers` 및 `deniedMcpServers` 설정은 실제로 로드되는 관리형 서버를 필터링하는 데 여전히 적용됩니다.
