# 마켓플레이스를 통해 사전 구축된 플러그인 검색 및 설치

> 마켓플레이스에서 플러그인을 찾아 설치하여 Claude Code에 새로운 명령어, 에이전트, 기능을 추가하세요.

플러그인은 스킬, 에이전트, 훅, MCP 서버를 통해 Claude Code를 확장합니다. 플러그인 마켓플레이스는 직접 만들지 않고도 이러한 확장 기능을 검색하고 설치할 수 있도록 도와주는 카탈로그입니다.

자체 마켓플레이스를 만들고 배포하고 싶으시다면 [플러그인 마켓플레이스 생성 및 배포](/en/plugin-marketplaces)를 참조하세요.

## 마켓플레이스 작동 방식

마켓플레이스는 누군가가 만들어서 공유한 플러그인 카탈로그입니다. 마켓플레이스 사용은 두 단계로 이루어집니다:

<Steps>
  <Step title="마켓플레이스 추가">
    카탈로그를 Claude Code에 등록하여 사용 가능한 항목을 탐색할 수 있게 합니다. 아직 플러그인이 설치되지는 않습니다.
  </Step>

  <Step title="개별 플러그인 설치">
    카탈로그를 탐색하고 원하는 플러그인을 설치합니다.
  </Step>
</Steps>

앱 스토어를 추가하는 것과 같다고 생각하면 됩니다: 스토어를 추가하면 컬렉션을 탐색할 수 있지만, 어떤 앱을 다운로드할지는 개별적으로 선택합니다.

## 공식 Anthropic 마켓플레이스

공식 Anthropic 마켓플레이스(`claude-plugins-official`)는 Claude Code를 시작할 때 자동으로 사용 가능합니다. `/plugin`을 실행하고 **Discover** 탭으로 이동하여 사용 가능한 항목을 탐색하세요.

공식 마켓플레이스에서 플러그인을 설치하려면:

```shell  theme={null}
/plugin install plugin-name@claude-plugins-official
```

<Note>
  공식 마켓플레이스는 Anthropic에서 관리합니다. 자체 플러그인을 배포하려면 [자체 마켓플레이스를 생성](/en/plugin-marketplaces)하여 사용자에게 공유하세요.
</Note>

공식 마켓플레이스에는 여러 카테고리의 플러그인이 포함되어 있습니다:

### 코드 인텔리전스

코드 인텔리전스 플러그인은 Claude Code의 내장 LSP 도구를 활성화하여, Claude가 정의로 이동하고, 참조를 찾고, 편집 직후 타입 오류를 즉시 확인할 수 있게 합니다. 이 플러그인들은 VS Code의 코드 인텔리전스를 구동하는 것과 동일한 기술인 [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) 연결을 구성합니다.

이 플러그인들은 시스템에 언어 서버 바이너리가 설치되어 있어야 합니다. 이미 언어 서버가 설치되어 있다면, 프로젝트를 열 때 Claude가 해당 플러그인 설치를 권유할 수 있습니다.

| 언어       | 플러그인            | 필요한 바이너리                |
| :--------- | :------------------ | :--------------------------- |
| C/C++      | `clangd-lsp`        | `clangd`                     |
| C#         | `csharp-lsp`        | `csharp-ls`                  |
| Go         | `gopls-lsp`         | `gopls`                      |
| Java       | `jdtls-lsp`         | `jdtls`                      |
| Kotlin     | `kotlin-lsp`        | `kotlin-language-server`     |
| Lua        | `lua-lsp`           | `lua-language-server`        |
| PHP        | `php-lsp`           | `intelephense`               |
| Python     | `pyright-lsp`       | `pyright-langserver`         |
| Rust       | `rust-analyzer-lsp` | `rust-analyzer`              |
| Swift      | `swift-lsp`         | `sourcekit-lsp`              |
| TypeScript | `typescript-lsp`    | `typescript-language-server` |

다른 언어용 [자체 LSP 플러그인을 생성](/en/plugins-reference#lsp-servers)할 수도 있습니다.

<Note>
  플러그인 설치 후 `/plugin` 오류 탭에서 `Executable not found in $PATH`가 표시되면, 위 표에서 필요한 바이너리를 설치하세요.
</Note>

#### 코드 인텔리전스 플러그인으로 Claude가 얻는 기능

코드 인텔리전스 플러그인이 설치되고 언어 서버 바이너리가 사용 가능하면, Claude는 두 가지 기능을 얻습니다:

* **자동 진단**: Claude가 파일을 편집할 때마다 언어 서버가 변경 사항을 분석하고 오류와 경고를 자동으로 보고합니다. Claude는 컴파일러나 린터를 실행하지 않고도 타입 오류, 누락된 임포트, 구문 문제를 확인합니다. Claude가 오류를 도입하면 같은 턴에서 문제를 인지하고 수정합니다. 플러그인 설치 외에 별도의 설정이 필요하지 않습니다. "diagnostics found" 표시가 나타나면 **Ctrl+O**를 눌러 인라인으로 진단을 확인할 수 있습니다.
* **코드 탐색**: Claude는 언어 서버를 사용하여 정의로 이동, 참조 찾기, 호버 시 타입 정보 확인, 심볼 목록 보기, 구현체 찾기, 호출 계층 추적이 가능합니다. 이러한 작업은 grep 기반 검색보다 더 정확한 탐색을 제공하지만, 언어와 환경에 따라 가용성이 다를 수 있습니다.

문제가 발생하면 [코드 인텔리전스 문제 해결](#code-intelligence-issues)을 참조하세요.

### 외부 통합

이 플러그인들은 사전 구성된 [MCP 서버](/en/mcp)를 번들로 제공하여 수동 설정 없이 Claude를 외부 서비스에 연결할 수 있습니다:

* **소스 관리**: `github`, `gitlab`
* **프로젝트 관리**: `atlassian` (Jira/Confluence), `asana`, `linear`, `notion`
* **디자인**: `figma`
* **인프라**: `vercel`, `firebase`, `supabase`
* **커뮤니케이션**: `slack`
* **모니터링**: `sentry`

### 개발 워크플로우

일반적인 개발 작업을 위한 명령어와 에이전트를 추가하는 플러그인:

* **commit-commands**: 커밋, 푸시, PR 생성을 포함한 Git 커밋 워크플로우
* **pr-review-toolkit**: PR 리뷰를 위한 전문 에이전트
* **agent-sdk-dev**: Claude Agent SDK로 빌드하기 위한 도구
* **plugin-dev**: 자체 플러그인을 만들기 위한 툴킷

### 출력 스타일

Claude의 응답 방식을 커스터마이즈:

* **explanatory-output-style**: 구현 선택에 대한 교육적 인사이트
* **learning-output-style**: 스킬 빌딩을 위한 인터랙티브 학습 모드

## 실습: 데모 마켓플레이스 추가하기

Anthropic은 플러그인 시스템으로 무엇이 가능한지 보여주는 예제 플러그인이 포함된 [데모 플러그인 마켓플레이스](https://github.com/anthropics/claude-code/tree/main/plugins)(`claude-code-plugins`)도 관리하고 있습니다. 공식 마켓플레이스와 달리, 이것은 수동으로 추가해야 합니다.

<Steps>
  <Step title="마켓플레이스 추가">
    Claude Code 내에서 `anthropics/claude-code` 마켓플레이스에 대한 `plugin marketplace add` 명령어를 실행합니다:

    ```shell  theme={null}
    /plugin marketplace add anthropics/claude-code
    ```

    마켓플레이스 카탈로그를 다운로드하고 해당 플러그인을 사용할 수 있게 합니다.
  </Step>

  <Step title="사용 가능한 플러그인 탐색">
    `/plugin`을 실행하여 플러그인 관리자를 엽니다. **Tab**(또는 역방향으로 **Shift+Tab**)을 사용하여 순환할 수 있는 네 개의 탭이 있는 탭 인터페이스가 열립니다:

    * **Discover**: 모든 마켓플레이스의 사용 가능한 플러그인 탐색
    * **Installed**: 설치된 플러그인 보기 및 관리
    * **Marketplaces**: 추가된 마켓플레이스 추가, 제거 또는 업데이트
    * **Errors**: 플러그인 로딩 오류 보기

    방금 추가한 마켓플레이스의 플러그인을 보려면 **Discover** 탭으로 이동하세요.
  </Step>

  <Step title="플러그인 설치">
    플러그인을 선택하여 세부 정보를 확인한 다음 설치 범위를 선택합니다:

    * **User scope**: 모든 프로젝트에서 자신만 사용할 수 있도록 설치
    * **Project scope**: 이 리포지토리의 모든 협업자를 위해 설치
    * **Local scope**: 이 리포지토리에서 자신만 사용할 수 있도록 설치

    예를 들어, **commit-commands**(git 워크플로우 명령어를 추가하는 플러그인)를 선택하고 user scope로 설치합니다.

    명령줄에서 직접 설치할 수도 있습니다:

    ```shell  theme={null}
    /plugin install commit-commands@anthropics-claude-code
    ```

    범위에 대해 더 알아보려면 [설정 범위](/en/settings#configuration-scopes)를 참조하세요.
  </Step>

  <Step title="새 플러그인 사용">
    설치 후 플러그인의 명령어를 즉시 사용할 수 있습니다. 플러그인 명령어는 플러그인 이름으로 네임스페이스가 지정되므로, **commit-commands**는 `/commit-commands:commit`과 같은 명령어를 제공합니다.

    파일을 변경한 후 다음을 실행하여 시도해 보세요:

    ```shell  theme={null}
    /commit-commands:commit
    ```

    변경 사항을 스테이징하고, 커밋 메시지를 생성하고, 커밋을 만듭니다.

    각 플러그인은 다르게 동작합니다. 플러그인이 제공하는 명령어와 기능을 알아보려면 **Discover** 탭에서 플러그인의 설명이나 홈페이지를 확인하세요.
  </Step>
</Steps>

이 가이드의 나머지 부분에서는 마켓플레이스를 추가하고, 플러그인을 설치하고, 설정을 관리하는 모든 방법을 다룹니다.

## 마켓플레이스 추가

`/plugin marketplace add` 명령어를 사용하여 다양한 소스에서 마켓플레이스를 추가하세요.

<Tip>
  **단축어**: `/plugin marketplace` 대신 `/plugin market`을, `remove` 대신 `rm`을 사용할 수 있습니다.
</Tip>

* **GitHub 리포지토리**: `owner/repo` 형식 (예: `anthropics/claude-code`)
* **Git URL**: 모든 git 리포지토리 URL (GitLab, Bitbucket, 자체 호스팅)
* **로컬 경로**: 디렉토리 또는 `marketplace.json` 파일의 직접 경로
* **원격 URL**: 호스팅된 `marketplace.json` 파일의 직접 URL

### GitHub에서 추가

`.claude-plugin/marketplace.json` 파일이 포함된 GitHub 리포지토리를 `owner/repo` 형식으로 추가합니다—여기서 `owner`는 GitHub 사용자 이름 또는 조직이고 `repo`는 리포지토리 이름입니다.

예를 들어, `anthropics/claude-code`는 `anthropics`가 소유한 `claude-code` 리포지토리를 가리킵니다:

```shell  theme={null}
/plugin marketplace add anthropics/claude-code
```

### 다른 Git 호스트에서 추가

전체 URL을 제공하여 모든 git 리포지토리를 추가할 수 있습니다. GitLab, Bitbucket, 자체 호스팅 서버를 포함한 모든 Git 호스트에서 작동합니다:

HTTPS 사용:

```shell  theme={null}
/plugin marketplace add https://gitlab.com/company/plugins.git
```

SSH 사용:

```shell  theme={null}
/plugin marketplace add git@gitlab.com:company/plugins.git
```

특정 브랜치나 태그를 추가하려면 `#` 뒤에 ref를 붙입니다:

```shell  theme={null}
/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0
```

### 로컬 경로에서 추가

`.claude-plugin/marketplace.json` 파일이 포함된 로컬 디렉토리를 추가합니다:

```shell  theme={null}
/plugin marketplace add ./my-marketplace
```

`marketplace.json` 파일의 직접 경로를 추가할 수도 있습니다:

```shell  theme={null}
/plugin marketplace add ./path/to/marketplace.json
```

### 원격 URL에서 추가

URL을 통해 원격 `marketplace.json` 파일을 추가합니다:

```shell  theme={null}
/plugin marketplace add https://example.com/marketplace.json
```

<Note>
  URL 기반 마켓플레이스는 Git 기반 마켓플레이스에 비해 일부 제한 사항이 있습니다. 플러그인 설치 시 "path not found" 오류가 발생하면 [문제 해결](/en/plugin-marketplaces#plugins-with-relative-paths-fail-in-url-based-marketplaces)을 참조하세요.
</Note>

## 플러그인 설치

마켓플레이스를 추가한 후 플러그인을 직접 설치할 수 있습니다(기본적으로 user scope로 설치):

```shell  theme={null}
/plugin install plugin-name@marketplace-name
```

다른 [설치 범위](/en/settings#configuration-scopes)를 선택하려면 인터랙티브 UI를 사용하세요: `/plugin`을 실행하고 **Discover** 탭으로 이동한 다음 플러그인에서 **Enter**를 누릅니다. 다음 옵션이 표시됩니다:

* **User scope** (기본값): 모든 프로젝트에서 자신만 사용할 수 있도록 설치
* **Project scope**: 이 리포지토리의 모든 협업자를 위해 설치 (`.claude/settings.json`에 추가됨)
* **Local scope**: 이 리포지토리에서 자신만 사용할 수 있도록 설치 (협업자와 공유되지 않음)

관리자가 [관리 설정](/en/settings#settings-files)을 통해 설치한 **managed** scope의 플러그인도 볼 수 있으며, 이는 수정할 수 없습니다.

`/plugin`을 실행하고 **Installed** 탭으로 이동하면 범위별로 그룹화된 플러그인을 볼 수 있습니다.

<Warning>
  플러그인을 설치하기 전에 신뢰할 수 있는지 확인하세요. Anthropic은 플러그인에 포함된 MCP 서버, 파일 또는 기타 소프트웨어를 제어하지 않으며 의도한 대로 작동하는지 확인할 수 없습니다. 자세한 내용은 각 플러그인의 홈페이지를 확인하세요.
</Warning>

## 설치된 플러그인 관리

`/plugin`을 실행하고 **Installed** 탭으로 이동하여 플러그인을 보고, 활성화하고, 비활성화하거나, 제거할 수 있습니다. 플러그인 이름이나 설명으로 목록을 필터링할 수 있습니다.

직접 명령어로도 플러그인을 관리할 수 있습니다.

제거하지 않고 플러그인 비활성화:

```shell  theme={null}
/plugin disable plugin-name@marketplace-name
```

비활성화된 플러그인 다시 활성화:

```shell  theme={null}
/plugin enable plugin-name@marketplace-name
```

플러그인 완전히 제거:

```shell  theme={null}
/plugin uninstall plugin-name@marketplace-name
```

`--scope` 옵션을 사용하면 CLI 명령어에서 특정 범위를 지정할 수 있습니다:

```shell  theme={null}
claude plugin install formatter@your-org --scope project
claude plugin uninstall formatter@your-org --scope project
```

## 마켓플레이스 관리

인터랙티브 `/plugin` 인터페이스 또는 CLI 명령어를 통해 마켓플레이스를 관리할 수 있습니다.

### 인터랙티브 인터페이스 사용

`/plugin`을 실행하고 **Marketplaces** 탭으로 이동하여:

* 모든 추가된 마켓플레이스의 소스 및 상태 보기
* 새 마켓플레이스 추가
* 최신 플러그인을 가져오기 위한 마켓플레이스 목록 업데이트
* 더 이상 필요하지 않은 마켓플레이스 제거

### CLI 명령어 사용

직접 명령어로도 마켓플레이스를 관리할 수 있습니다.

모든 구성된 마켓플레이스 목록 보기:

```shell  theme={null}
/plugin marketplace list
```

마켓플레이스에서 플러그인 목록 새로 고침:

```shell  theme={null}
/plugin marketplace update marketplace-name
```

마켓플레이스 제거:

```shell  theme={null}
/plugin marketplace remove marketplace-name
```

<Warning>
  마켓플레이스를 제거하면 해당 마켓플레이스에서 설치한 모든 플러그인이 제거됩니다.
</Warning>

### 자동 업데이트 설정

Claude Code는 시작 시 마켓플레이스와 설치된 플러그인을 자동으로 업데이트할 수 있습니다. 마켓플레이스에 대해 자동 업데이트가 활성화되면, Claude Code가 마켓플레이스 데이터를 새로 고치고 설치된 플러그인을 최신 버전으로 업데이트합니다. 플러그인이 업데이트되면 Claude Code를 재시작하라는 알림이 표시됩니다.

UI를 통해 개별 마켓플레이스의 자동 업데이트를 전환합니다:

1. `/plugin`을 실행하여 플러그인 관리자를 엽니다
2. **Marketplaces**를 선택합니다
3. 목록에서 마켓플레이스를 선택합니다
4. **Enable auto-update** 또는 **Disable auto-update**를 선택합니다

공식 Anthropic 마켓플레이스는 기본적으로 자동 업데이트가 활성화되어 있습니다. 서드파티 및 로컬 개발 마켓플레이스는 기본적으로 자동 업데이트가 비활성화되어 있습니다.

Claude Code와 모든 플러그인의 자동 업데이트를 완전히 비활성화하려면 `DISABLE_AUTOUPDATER` 환경 변수를 설정하세요. 자세한 내용은 [자동 업데이트](/en/setup#auto-updates)를 참조하세요.

Claude Code 자동 업데이트는 비활성화하면서 플러그인 자동 업데이트는 유지하려면 `DISABLE_AUTOUPDATER`와 함께 `FORCE_AUTOUPDATE_PLUGINS=true`를 설정합니다:

```shell  theme={null}
export DISABLE_AUTOUPDATER=true
export FORCE_AUTOUPDATE_PLUGINS=true
```

이 설정은 Claude Code 업데이트는 수동으로 관리하면서도 자동 플러그인 업데이트는 계속 받고 싶을 때 유용합니다.

## 팀 마켓플레이스 설정

팀 관리자는 `.claude/settings.json`에 마켓플레이스 설정을 추가하여 프로젝트에 대한 자동 마켓플레이스 설치를 설정할 수 있습니다. 팀원이 리포지토리 폴더를 신뢰하면, Claude Code가 이러한 마켓플레이스와 플러그인을 설치하도록 안내합니다.

`extraKnownMarketplaces` 및 `enabledPlugins`를 포함한 전체 설정 옵션은 [플러그인 설정](/en/settings#plugin-settings)을 참조하세요.

## 문제 해결

### /plugin 명령어가 인식되지 않음

"unknown command"가 표시되거나 `/plugin` 명령어가 나타나지 않는 경우:

1. **버전 확인**: `claude --version`을 실행합니다. 플러그인에는 버전 1.0.33 이상이 필요합니다.
2. **Claude Code 업데이트**:
   * **Homebrew**: `brew upgrade claude-code`
   * **npm**: `npm update -g @anthropic-ai/claude-code`
   * **네이티브 설치 프로그램**: [설정](/en/setup)에서 설치 명령어를 다시 실행합니다
3. **Claude Code 재시작**: 업데이트 후 터미널을 재시작하고 `claude`를 다시 실행합니다.

### 일반적인 문제

* **마켓플레이스가 로딩되지 않음**: URL이 접근 가능하고 해당 경로에 `.claude-plugin/marketplace.json`이 있는지 확인합니다
* **플러그인 설치 실패**: 플러그인 소스 URL이 접근 가능하고 리포지토리가 공개(또는 접근 권한이 있는지)인지 확인합니다
* **설치 후 파일을 찾을 수 없음**: 플러그인은 캐시로 복사되므로 플러그인 디렉토리 외부의 파일을 참조하는 경로는 작동하지 않습니다
* **플러그인 스킬이 나타나지 않음**: `rm -rf ~/.claude/plugins/cache`로 캐시를 지우고, Claude Code를 재시작한 후 플러그인을 다시 설치합니다.

자세한 문제 해결 및 솔루션은 마켓플레이스 가이드의 [문제 해결](/en/plugin-marketplaces#troubleshooting)을 참조하세요. 디버깅 도구에 대해서는 [디버깅 및 개발 도구](/en/plugins-reference#debugging-and-development-tools)를 참조하세요.

### 코드 인텔리전스 문제

* **언어 서버가 시작되지 않음**: 바이너리가 설치되어 있고 `$PATH`에서 사용 가능한지 확인합니다. 자세한 내용은 `/plugin` 오류 탭을 확인하세요.
* **높은 메모리 사용량**: `rust-analyzer`나 `pyright` 같은 언어 서버는 대규모 프로젝트에서 상당한 메모리를 소비할 수 있습니다. 메모리 문제가 발생하면 `/plugin disable <plugin-name>`으로 플러그인을 비활성화하고 Claude의 내장 검색 도구를 대신 사용하세요.
* **모노레포에서의 잘못된 진단**: 워크스페이스가 올바르게 구성되지 않은 경우 언어 서버가 내부 패키지의 미해결 임포트 오류를 보고할 수 있습니다. 이는 Claude의 코드 편집 기능에는 영향을 미치지 않습니다.

## 다음 단계

* **자체 플러그인 빌드**: 스킬, 에이전트, 훅을 만들려면 [플러그인](/en/plugins)을 참조하세요
* **마켓플레이스 생성**: 팀이나 커뮤니티에 플러그인을 배포하려면 [플러그인 마켓플레이스 생성](/en/plugin-marketplaces)을 참조하세요
* **기술 참조**: 전체 사양은 [플러그인 참조](/en/plugins-reference)를 참조하세요
