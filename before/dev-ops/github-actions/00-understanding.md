---
title: '[GitHub Actions 공식문서]GitHub Actions의 이해'
slug: github-actions-overview
created: 2023-12-01
updated:
description:
category: github-actions
tags: [github, actions, github-actions]
published: true
---

[GitHub Actions의 이해][1]

## Overview

깃허브 액션은 빌드, 테스트, 배포 파이프라인을 자동화하는 CI/CD 플랫폼이다.
워크플로우를 만들어서 풀 리퀘스트가 들어올 때마다 빌드와 테스트를 하거나 머지된 풀 리퀘스트를 배포할 수 있다.

깃허브 액션은 단순한 데브옵스를 넘어 리포지토리에 다른 이벤트가 발생해도 워크플로우를 실행할 수 있다.
예를 들어, 누군가 리포지토리에 새 이슈를 생성할 때마다 적절한 라벨을 붙이게 할 수 있다.

깃허브는 리눅스, 윈도우, 맥 가상머신을 제공하여 워크플로우를 실행한다.
데이터 센터나 클라우드의 서버에서 워크플로우를 실행할 수도 있다.

## The components of GitHub Actions

리포지토리에서 특정 이벤트가 발생할 때, GitHub Actions workflow가 실행되도록 설정할 수 있다.
풀 리퀘스트가 열리거나 이슈가 생성되는 등의 이벤트이다.

workflow는 한 개 이상의 job을 포함한다.
job은 순서대로 실행되거나 병렬로 실행된다. 각각의 job은 각기 다른 가상머신이나 컨테이너에서 실행된다.

job은 한 개 이상의 step으로 구성되어 있다.
step은 스크립트나 action을 실행한다.
스크립트는 사용자가 정의하는 것이고, action은 재사용 가능한 익스텐션이다.
action은 사용자의 workflow를 간단하게 만들어준다.

### Workflows

workflow는 설정 가능한 자동화된 프로세스이다.
workflow는 한 개 이상의 job을 실행한다.
workflow는 리포지토리 내부의 YAML 파일을 통해 정의한다.
workflow는 트리거가 발동되면 실행된다.
트리거는 리포지토리의 특정 이벤트나 정해진 시간이 될 수 있고, 수동적으로 실행할 수도 있다.

workflow는 리포지토리의 `.github/workflows` 디렉토리 안에 정의한다.
리포지토리는 여러 개의 workflow를 가질 수 있고, 각각의 workflow는 각기 다른 일을 수행할 수 있다.
예를 들어, 풀 리퀘스트를 빌드하고 테스트하는 workflow와 릴리즈가 만들어질 때마다 앱을 배포하는 workflow를 만들 수 있다.
또, 누군가 이슈를 올릴 때마다 라벨을 붙이도록 할 수도 있다.
workflow 안에서 또 다른 workflow를 참조할 수 있다. [Reusing workflows][2]

[Using workflows][3]

### Events

event는 workflow가 실행되도록 하는 특정한 작업이다.
예를 들면, 풀 리퀘스트가 생성되거나, 이슈가 열리거나, 커밋을 원격 저장소에 푸시하는 등의 작업이다.
또한, 특정 스케줄에 따라 실행하거나 REST API를 보내 실행할 수 있고, 수동으로도 실행할 수 있다.

[이벤트 전체 목록][4]

### Jobs

job은 같은 runner에서 실행되는 step들의 모임이다.
각각의 step은 실행될 쉘 스크립트이거나 action이다.
step은 순서대로 실행되고 서로에게 종속적이다.
step은 같은 runner에서 실행되기 때문에, 데이터를 공유할 수 있다.
예를 들어, 앱을 빌드하는 step을 만들고 빌드된 앱을 테스트하는 스텝을 만들 수 있다.

여러 job들 사이의 의존성도 설정할 수 있다.
기본적으로, job들간에는 의존성이 없고 각각 병렬로 실행된다.
그러나 어떤 job이 다른 job에 의존성을 갖는다면, 그 job은 의존적인 job이 끝날 때까지 기다릴 것이다.
예를 들어, 의존성이 없는 여러 아키텍처를 빌드하는 job이 있고, 빌드 전체를 패키징하는 job이 있다면, 빌드하는 job들은 병렬로 실행되고 모두 성공적으로 끝났을 때 패키징하는 job이 실행될 것이다.

[Using jobs][5]

### Actions

action은 복잡하지만 자주 반복되는 작업을 수행하는 커스텀 앱이다.
workflow 파일을 작성할 때, 반복되는 코드를 줄이기 위해 사용한다.
action은 깃허브 리포티토리를 pull 할 수 있고, 빌드 환경을 구축할 수 있고, 클라우드를 위한 인증을 설정할 수 있다.

action은 자신이 직접 만들 수도 있고, 깃허브 마켓플레이스에서 필요한 action을 찾을 수도 있다.

[Creating actions][6]

### Runners

runner는 workflow를 실행하는 서버이다.
각각의 runner는 한 번에 한 개의 job만 실행할 수 있다.
깃허브는 runner로 Ubuntu Linux, Microsoft Windows, macOS를 제공한다.
각 workflow는 새로 프로비저닝 된 가상머신에서 실행된다.

깃허브는 더 큰 구성을 위해 더 큰 runner를 제공한다. [About larger runners][7]

다른 OS나 특정 하드웨어 구성이 필요한 경우, runner를 직접 호스팅할 수 있다. [Hosting your own runners][8]

## Create an example workflow

GitHub Actions는 workflow를 정의하기 위해 YAML 문법을 사용한다.
각 workflow는 `.github/workflows` 디렉토리에 별도의 YAML 파일로 저장한다.

코드를 원격 저장소에 push할 때마다 몇 개의 명령을 실행하는 workflow를 만들어보자.
GitHub Actions는 push된 코드를 확인하고, 테스트 프레임워크인 [bats][9]를 설치하고, bats의 버전을 출력하는 명령을 실행한다.

1. 리포지토리에 `.github/workflows` 디렉토리를 생성한다.
2. `.github/workflows` 디렉토리에 `learn-github-actions.yml`파일을 생성하고 아래 코드를 추가한다.

```yml
## learn-github-actions.yml
name: learn-github-actions
run-name: ${{ github.actor }} is learning GitHub Actions
on: [push]
jobs:
  check-bats-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: '14'
      - run: npm install -g bats
      - run: bats -v
```

3. commit 후 GitHub 원격 저장소에 push한다.

이제 workflow 파일은 GitHub Actions에 설치되었고, 누군가 리포지토리에 push할 때마다 workflow가 실행될 것이다.

workflow의 실행 기록을 보려면 [Viewing the activity for a workflow run][10]

## Understanding the workflow file

위에서 작성한 `learn-github-actions.yml`에서 각 줄의 코드가 무슨 의미인지 알아보자.

### `name` - optional

```yml
name: learn-github-actions
```

workflow의 이름이다. 깃허브 리포지토리 "Actions" 탭의 workflow 이름으로 사용된다. `name`이 생략되면 파일명이 대신 사용된다.

### `run-name` - optional

```yml
run-name: ${{ github.actor }} is learning GitHub Actions
```

workflow run의 이름이다.
깃허브 리포지토리 "Actions" 탭의 workflow runs 리스트에서 사용된다.
이 예제는 `github` 컨텍스트를 사용하여 workflow를 실행시킨 유저의 이름을 표시한다.

[Workflow syntax for GitHub Actions][11]

### `on`

```yml
on: [push]
```

workflow의 트리거를 설정한다.
예제에서는 `push` 이벤트를 사용하므로, 누군가 리포지토리에 push 하거나, pull request를 merge할 때마다 workflow가 실행될 것이다.

`push`라고만 쓰면 모든 브랜치에 적용되어 어떤 브랜치든 push할 때마다 workflow가 실행된다.
특정 브랜치, 경로, 태그 등에 적용하고 싶다면 "[Workflow syntax for GitHub Actions][12]"

### `jobs`

`learn-github-actions` workflow에서 실행하는 모든 job들의 그룹이다.
이 예제에는 `check-bats-version`이라는 이름의 job 한 개만 존재한다.

### `job_id`

`check-bats-version`은 `job_id`로 사용된다.

### `runs-on`

```yml
runs-on: ubuntu-latest
```

해당 job이 `ubuntu-latest`에서 실행되도록 설정한다.

### `steps`

`check-bats-version` job에서 실행되는 모든 step들의 그룹이다.
여기에는 쉘 스크립트나 action이 포함된다.

### `uses`

```yml
- uses: actions/checkout@v4
- uses: actions/setup-node@v3
  with:
    node-version: '14'
```

`uses` 키워드는 action을 실행할 때 사용한다.

1. 첫번째 `uses`는 `actions/checkout@v4` action을 실행한다.
   이 action은 리포지토리가 runner 상에 있는지 확인하고, 해당 코드를 대상으로 스크립트나 다른 action을 실행하게 한다.
   workflow에서 리포지토리의 코드를 이용하기 위해서는 반드시 `actions/checkout` action을 사용해야 한다.

2. 두번째 `uses`는 `actions/setup-node@v3` action을 실행한다.
   이 action은 특정 버전의 Node.
   s를 설치한다.
   이 예제에서는 14이다. 그리고 `node`와 `npm` 명령을 `PATH`에 넣어준다.

### `run`

```yml
- run: npm install -g bats
- run: bats -v
```

`run` 키워드는 스크립트를 실행할 때 사용한다.
여기서는 `npm`을 이용하여 `bats`를 설치하고, `bats`의 버전을 출력한다.

## Viewing the activity for a workflow run

workflow가 발동되면, workflow를 실행하는 *workflow run*이 생성된다.
workflow run이 시작되면, 각 단계를 시각화 된 그래프로 볼 수 있고, 각각의 step을 확인할 수 있다.

[1]: https://docs.github.com/ko/actions/learn-github-actions/understanding-github-actions 'Understanding GitHub Actions'
[2]: https://docs.github.com/en/actions/using-workflows/reusing-workflows 'Reusing workflows'
[3]: https://docs.github.com/en/actions/using-workflows 'Using workflows'
[4]: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows 'Events that trigger workflows'
[5]: https://docs.github.com/en/actions/using-jobs 'Using jobs'
[6]: https://docs.github.com/en/actions/creating-actions 'Creating actions'
[7]: https://docs.github.com/en/actions/using-github-hosted-runners/about-larger-runners/about-larger-runners 'About larger runners'
[8]: https://docs.github.com/en/actions/hosting-your-own-runners 'Hosting your own runners'
[9]: https://www.npmjs.com/package/bats 'bats(testing framework)'
[10]: https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions#viewing-the-activity-for-a-workflow-run 'Viewing the activity for a workflow run'
[11]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#run-name 'Workflow syntax for GitHub Actions'
[12]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#onpushpull_requestpull_request_targetpathspaths-ignore 'Workflow syntax for GitHub Actions: on'
