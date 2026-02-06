# Claude Code 프로그래밍 방식 실행 - 심층 분석

## 1. 문서 개요

이 문서는 Claude Code를 CLI에서 비대화형(non-interactive)으로 실행하는 방법을 다룬다. 핵심은 `claude -p` 플래그를 통해 Claude Code를 스크립트, CI/CD 파이프라인, 자동화 워크플로우에 통합할 수 있다는 것이다.

## 2. 핵심 개념 분석

### 2.1 `-p` 플래그: 대화형에서 자동화로의 전환

`-p`(print) 플래그는 Claude Code의 사용 패러다임을 근본적으로 바꾼다. 대화형 도구에서 **자동화 가능한 빌딩 블록**으로 변환되며, 이는 Unix 철학의 "한 가지 일을 잘하는 프로그램"과 일맥상통한다.

**핵심 포인트**: `-p` 모드에서는 `/commit` 같은 스킬이나 내장 명령을 사용할 수 없다. 대신 수행하려는 작업을 자연어로 직접 설명해야 한다. 이는 프로그래밍 방식의 사용이 대화형 모드의 단순한 래퍼가 아니라 별도의 인터페이스임을 의미한다.

### 2.2 출력 형식의 3단계 구조

| 형식 | 용도 | 적합한 시나리오 |
|------|------|----------------|
| `text` | 사람이 읽는 출력 | 스크립트의 최종 출력, 로그 |
| `json` | 구조화된 데이터 처리 | 파이프라인 간 데이터 전달, 후처리 |
| `stream-json` | 실시간 스트리밍 | 대시보드, 실시간 모니터링, UX 피드백 |

특히 `--json-schema`를 통한 스키마 강제는 LLM 출력의 가장 큰 약점인 **비결정적 출력 형식**을 해결한다. Claude의 응답을 신뢰할 수 있는 데이터 구조로 변환하여 다운스트림 시스템과 안전하게 연동할 수 있다.

### 2.3 권한 제어: `--allowedTools`의 세밀한 제어

`--allowedTools`는 단순한 허용/거부 목록이 아니라 **접두사 매칭 기반의 권한 시스템**이다.

```
Bash(git diff *)  → git diff로 시작하는 모든 명령 허용
Bash(git diff*)   → git diff-index 등도 매칭 (의도하지 않은 결과)
```

공백 하나의 차이가 보안 경계를 결정한다. 이는 최소 권한 원칙(Principle of Least Privilege)을 CLI 수준에서 구현한 것이다.

### 2.4 대화 연속성: `--continue`와 `--resume`

세션 관리는 두 가지 수준으로 나뉜다:

- **`--continue`**: 가장 최근 대화를 자동으로 이어감 (단일 워크플로우에 적합)
- **`--resume`**: 세션 ID로 특정 대화를 재개 (병렬 워크플로우에 적합)

이는 Claude Code를 **상태를 가진(stateful) 에이전트**로 만들어, 복잡한 작업을 여러 단계로 분할하여 처리할 수 있게 한다.

## 3. 실전 활용 인사이트

### 3.1 CI/CD 파이프라인에 Claude Code 통합

가장 직접적인 활용은 CI/CD 파이프라인에서의 자동화다.

**PR 자동 리뷰 파이프라인 예시:**

```bash
# 1단계: PR diff를 보안 관점에서 리뷰
review=$(gh pr diff "$PR_NUMBER" | claude -p \
  --append-system-prompt "보안 엔지니어로서 OWASP Top 10 관점에서 리뷰하세요." \
  --output-format json \
  --json-schema '{"type":"object","properties":{"issues":{"type":"array","items":{"type":"object","properties":{"severity":{"type":"string"},"description":{"type":"string"},"file":{"type":"string"}}}},"summary":{"type":"string"}},"required":["issues","summary"]}')

# 2단계: 심각도가 높은 이슈가 있으면 PR에 코멘트
echo "$review" | jq -r '.structured_output.issues[] | select(.severity == "high")' | \
  while read issue; do
    gh pr comment "$PR_NUMBER" --body "⚠️ $(echo $issue | jq -r '.description')"
  done
```

**핵심 인사이트**: `--json-schema`로 출력 형식을 강제하면 jq, Python 등 후속 처리 도구와 안정적으로 연동할 수 있다. LLM의 출력을 프로그래밍적으로 소비할 때 가장 중요한 것은 예측 가능한 구조다.

### 3.2 코드 품질 자동화 도구 구축

```bash
# 코드베이스 전체에서 기술 부채를 스캔하고 구조화된 보고서 생성
claude -p "이 코드베이스에서 기술 부채를 식별하고 우선순위를 매겨줘" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"debt_items":{"type":"array","items":{"type":"object","properties":{"category":{"type":"string"},"priority":{"type":"string","enum":["high","medium","low"]},"file":{"type":"string"},"description":{"type":"string"},"suggestion":{"type":"string"}}}},"total_score":{"type":"number"}},"required":["debt_items","total_score"]}'
```

이를 주간 크론잡으로 설정하면 기술 부채 트래킹을 자동화할 수 있다.

### 3.3 멀티 스텝 에이전트 워크플로우

`--continue`를 활용하면 복잡한 작업을 단계별로 분할하여 처리할 수 있다. 각 단계 사이에 검증 로직을 삽입할 수 있다는 것이 핵심이다.

```bash
# 1단계: 분석
claude -p "이 프로젝트의 테스트 커버리지를 분석해줘" \
  --allowedTools "Bash,Read"

# 2단계: 중간 검증 (외부 로직)
if [ "$COVERAGE" -lt 80 ]; then
  # 3단계: 조건부 실행
  claude -p "커버리지가 낮은 모듈에 대한 테스트를 작성해줘" \
    --continue \
    --allowedTools "Bash,Read,Edit"
fi
```

**인사이트**: LLM을 단일 거대 프롬프트로 사용하는 것보다, 작은 단계로 나누고 각 단계 사이에 결정적(deterministic) 검증을 넣는 것이 더 안정적이다. `--continue`는 이러한 "인간/시스템 중재(human/system-in-the-loop)" 패턴을 자연스럽게 지원한다.

### 3.4 시스템 프롬프트를 활용한 역할 전문화

`--append-system-prompt`를 활용하면 같은 Claude Code를 다양한 전문가 역할로 활용할 수 있다:

```bash
# 보안 리뷰어
claude -p "이 코드를 리뷰해줘" --append-system-prompt "보안 엔지니어 관점으로 리뷰하세요."

# 성능 최적화 전문가
claude -p "이 코드를 리뷰해줘" --append-system-prompt "성능 엔지니어 관점으로 리뷰하세요."

# 접근성 전문가
claude -p "이 UI 코드를 리뷰해줘" --append-system-prompt "접근성 전문가 관점으로 WCAG 2.1 기준에서 리뷰하세요."
```

하나의 도구로 여러 전문가 리뷰를 자동화할 수 있다. 이를 병렬로 실행하면 종합적인 코드 리뷰 파이프라인을 구축할 수 있다.

### 3.5 스트리밍을 활용한 개발자 경험 개선

`stream-json`은 단순히 기술적 기능이 아니라 **개발자 경험(DX)**의 문제다. 긴 작업에서 진행 상황을 실시간으로 보여줌으로써:

- 작업이 진행 중인지 멈춘 것인지 파악 가능
- 중간 결과를 보고 필요시 조기 중단 가능
- 내부 도구나 대시보드에 실시간 피드백 표시 가능

## 4. 아키텍처적 시사점

### 4.1 Agent SDK의 계층 구조

문서는 CLI(`claude -p`)를 Agent SDK의 한 형태로 소개한다. 이는 다음과 같은 계층을 암시한다:

```
┌─────────────────────────────┐
│   Python/TypeScript SDK     │  ← 최대 제어 (콜백, 네이티브 객체)
├─────────────────────────────┤
│   CLI (claude -p)           │  ← 스크립트/자동화 (stdin/stdout)
├─────────────────────────────┤
│   대화형 모드 (claude)       │  ← 개발자 직접 사용
└─────────────────────────────┘
```

CLI는 "충분히 좋은" 프로그래밍 인터페이스이면서도 셸 스크립트의 조합 가능성(composability)을 최대한 활용한다. 더 세밀한 제어가 필요할 때 Python/TypeScript SDK로 전환하면 된다.

### 4.2 보안 모델

`--allowedTools`의 접두사 매칭 시스템은 편의성과 보안 사이의 트레이드오프를 잘 보여준다. 자동화 환경에서는 반드시 **최소 필요 권한만 부여**해야 한다. 특히 CI/CD에서 `Bash`를 무제한으로 허용하면 프롬프트 인젝션 공격에 취약해질 수 있다.

## 5. 결론

Claude Code의 프로그래밍 방식 실행은 단순한 "CLI 래퍼"가 아니다. 이것은 **LLM을 소프트웨어 개발 파이프라인의 일급 시민(first-class citizen)으로 통합하는 인터페이스**다. 구조화된 출력, 세밀한 권한 제어, 세션 관리를 통해 신뢰할 수 있는 자동화 워크플로우를 구축할 수 있으며, 이는 기존의 린터나 정적 분석 도구로는 불가능했던 의미론적 수준의 코드 분석과 수정을 자동화할 수 있는 가능성을 열어준다.
