---
title: GitHub Actions로 배포 자동화
created: 2023-12-05
slug: blog2-deploy-with-github-actions
updated:
description:
category: blog2
tags:
published: true
---

# 자동화를 시도한 이유

개발 코드와 배포 코드가 다르다보니 새로운 기능을 추가할 때마다 매번 별도로 배포를 해야 했다. 초반에는 `npm run deploy`만 실행하면 돼서 간단했는데, 여러 기능이 추가되면서 문제가 발생했다.

1. `/out` 디렉토리를 개발 코드에 포함시켜야 한다. `.gitignore`로 제외하면 배포 시에도 제외되어 정상적으로 배포되지 않는다.
2. `next.config.js`에서 `output: 'export'` 설정을 추가하면 개발 서버 상에서 url 인코딩 문제가 발생한다. 그래서 개발 중에는 이 설정을 제거해야 하고, 배포할 때는 이 설정을 추가해야 한다.

그래서 배포할 때마다 두 파일을 수정했다. 개발할 때는 `.gitignore`로 `/out`을 제외시키고 `next.config.js`에서 `output: 'export'`를 없앤다. 반대로 배포할 때는 `/out`을 포함시키고 `output: 'export'`를 추가한다.

이렇게 작업하다보니 커밋할 때마다 개발용인지 배포용인지 확인해야 했고, 계속 두 파일을 수정해가면서 커밋하게 되었다. 그러다가 헷갈려서 반대로 커밋한 적도 있다. 실수할 때마다 `git reset`을 해야 했다. 집중하지 않으면 커밋이 완전히 꼬여버리는 상황이 된 것이다. 설정이 제대로 되었는지 확인하는 것에 신경을 많이 썼고 불편함을 느꼈다.

# GitHub Actions 도입

GitHub Actions를 쓰면 두 가지 장점이 있었다. 첫째는 당연히 자동화다. 내가 배포할 때마다 하는 작업들을 자동으로 처리할 수 있다. 둘째는 별도의 공간(runner)에서 커밋을 푸시한다는 점이다. 배포를 위해 수정했던 파일을 다시 일일이 되돌리지 않아도 개발용 브랜치에 영향이 없다.

## 1안

가장 먼저 떠올린 방법은 지금처럼 두 개의 브랜치를 운영하는 것이었다. `main` 브랜치(개발용)에 `push` 이벤트가 발생하면 workflow를 실행하여 `gh-pages` 브랜치(배포용)에 배포한다. 장점은 개발 중간에 푸시하기만 하면 배포까지 자동으로 된다는 것이다.

단점도 있었다. 푸시가 바로 배포로 이어지기 때문에 내가 원하는 시점의 코드로 배포할 수 없다. ~~개발 중간에 푸시 를 해야할 때, 배포가 불가능한 상태라고 하더라도 자동으로 배포가 된다. 이렇게 되면 에러가 나서 배포가 되지 않고 내 블로그는 접속이 안될 것이다.~~

> 실제로 불완전한 상태로 푸시를 해 보니, 배포 과정에서 에러가 발생해도 블로그는 접속이 잘 됐다. 배포에 실패하면 마지막으로 성공한 상태를 유지시킨다.

## 2안

브랜치를 총 3개 사용하는 방법을 생각했다. `main`, `development`, `gh-pages`(배포용)을 만들어서 `development` 브랜치에서 개발을 한다. 배포할 때는 `main` 브랜치에 pull request로 병합한다. `main`에서 `push` 이벤트가 발생할 때 배포 workflow가 실행되도록 한다.

이렇게 하면 수동으로 pull request를 처리해야 한다는 단점이 있지만, 내가 원하는 시점에 배포가 가능하다.

> 이것도 직접 사용해보니 불편했다. pull request와 merge하는 과정이 오히려 시간을 더 쓰게 만들었다. 배포에 에러가 나서 코드를 간단히 수정할 때마다 pr을 올리고 merge해야하기 때문에 기존 방법보다 더 번거로웠다.

## 결과

결국은 1안을 선택했다. 내가 원했던 것은 2안이었지만, 실제로 해 보니 pr과 merge 과정이 더 귀찮았다. 어차피 배포에 실패해도 블로그는 정상적으로 접속이 되기 때문에 걱정을 덜 수 있었다. 원하는 시점에 배포하는 것은 로컬에서 여러 작업을 끝내고 언제 푸시하느냐로 어느정도 선택할 수 있었다.

# 실패

```yml
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v3
        with:
          node-version: lts/*
      - run: |
          npm ci
          sed -i 's/\/\/ //g' next.config.js
          sed -i 's/\/out\///g' .gitignore
          npm run build
          touch out/.nojekyll
          git config --global user.name 'paulcjy'
          git config --global user.email 'paulcjy@naver.com'
          git add out/
          git commit -m 'Deploy'
          git subtree push --prefix out origin gh-page
```

처음으로 시도한 workflow이다. 작동 방식은 배포를 위해 내가 수동으로 하던 작업들을 그대로 workflow로 옮긴 것이다.

- `main` 브랜치에 `push` 이벤트(push, merge 등)가 발생할 때 실행된다.
- `ubuntu-latest`에서 실행한다.
- `actions/checkout@v4`로 리포지토리의 코드를 runner로 가져온다.
- `actions/setup-node@v3`로 Node.js를 설치한다. 버전도 설정할 수 있다.
- 스크립트 실행을 통해 배포한다.
  - `sed` 명령어로 `next.config.js`와 `.gitignore`에서 수정해야 하는 부분을 수정했다.
  - `/out` 디렉토리만 `gh-pages` 브랜치에 푸시한다.

## 문제

이전에 수동으로 하던 작업/스크립트 실행을 그대로 하는거라 잘 작동할거라 예상했지만, 전혀 아니었다. 많은 문제가 있었고 이 방법은 결국 사용이 불가능했다. 사실 더 간단하고 좋은 방법이 있어서 이 방법을 고집할 필요가 없었다.

1. 내가 발행한 Personal access token은 workflow에 접근할 권한이 없었다. [여기][1]에서 권한을 수정하면 된다.
2. 원래 `npm run deploy`에서 빌드할 때 실행되던 스크립트는 `next build`였지만 터미널에서 한 줄씩 명령을 입력할 때는 작동하지 않는다. (`npx`를 사용해야 하는 듯) 그래서 `npm run build`를 대신 사용했다.
3. `posts` 폴더도 `.gitignore`에 추가했는데 `posts` 폴더가 깃허브에 업로드되지 않다보니 runner에서 내 글을 읽을 방법이 없었다. 결국 `posts`도 깃에 추가했다.
4. `gh-pages`에 푸시할 때 유저 정보가 없어서 푸시가 안됐다. `git config --global user.name`, `git config --global user.email`로 정보를 등록한다.
5. runner 상에서는 로컬 리포지토리가 깃허브에 로그인 되어 있지 않아서 푸시가 안됐다. 해결은 로그인하는게 아니었고, 리포지토리의 Settings > Actions > General > Workflow permissions에서 권한을 'Read and write permissions'로 설정해야 한다.

여러 문제를 다 해결했는데, 결과적으로는 배포용 브랜치인 `gh-pages`에 푸시가 되지 않았다. 원격 저장소의 커밋이 로컬보다 앞서있어서 `git pull`을 먼저 하라고 떴다. 그러나 `git pull`을 해도 푸시는 되지 않았다.

# 해결

다른 배포 방법이 있었다. GitHub Actions를 통해 workflow 안에서 직접 배포하는 방법이다.

나는 그동안 배포용 브랜치를 만들고 거기에 `/out` 폴더를 넣어야지만 배포가 되는 것으로 알고 있었다. GitHub Actions와 GitHub Pages에 대해 자세히 공부한 적이 없고, 예제에서 그 방식을 사용했기 때문이다.

하지만 배포용 브랜치를 이용한 배포도 깃허브 내부적으로는 GitHub Actions를 통해 배포하는 것이었다. 그래서 나도 한 workflow 내에서 배포까지 직접 해보기로 했다.

## 현재 사용 중인 workflow

[배포 소스 설정][2]에서 `GitHub Actions`를 선택하자마자 Next.js를 배포하는 workflow를 추천해줬다. 이 파일을 바탕으로 내가 필요한 부분만 수정해서 사용했다.

```yml
# Sample workflow for building and deploying a Next.js site to GitHub Pages
#
# To get started with Next.js see: https://nextjs.org/docs/getting-started
#
name: Deploy Next.js site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['main']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: lts/*
      - name: Install dependencies
        run: npm ci
      - name: Add export configuration
        run: sed -i 's/\/\/ //g' next.config.js
      - name: Build and static export with Next.js
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./out

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

`permissions`와 `concurrency`는 원래 있던대로 뒀는데, workflow가 잘 작동했기 때문에 딱히 알아보지는 않았다.

중요한 부분은 GitHub Actions로 직접 GitHub Pages를 배포하는 것이다.

- 배포를 위해서는 `/out` 폴더를 생성하기 위해 `next.config.js`에 `output: 'export'`가 있어야 한다.
- 빌드 후 생성되는 `/out` 폴더를 `actions/upload-pages-artifact`에 업로드 한다.
- 배포는 `actions/deploy-pages`로 한다. 파일을 `actions/upload-pages-artifact`에 업로드했다면, `actions/deploy-pages`는 자동으로 그 파일을 가져와서 배포한다고 한다.

이렇게 하니 배포 과정이 훨씬 깔끔해졌다. 이제는 로컬에서 작업한 커밋을 원격 저장소에 푸시하기만 하면 자동으로 빌드와 배포까지 된다. 브랜치도 한 개로 줄어들었고, 수동으로 해야하는 작업들이 전혀 없다.

[1]: https://github.com/settings/tokens 'personal access token setting'
[2]: https://github.com/paulcjy/paulcjy.github.io/settings/pages
