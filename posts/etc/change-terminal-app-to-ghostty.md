---
title: "터미널 앱을 Alacritty에서 Ghostty로 변경"
slug: change-terminal-app-to-ghostty
created: 2026-02-11
description: "Alacritty의 한글 입력 버그를 해결하지 못해 Ghostty로 전환한 이유와 과정"
category: etc
tags: [terminal, ghostty, alacritty, macos]
type: [til]
---

## Alacritty

나는 alacritty를 터미널 앱으로 사용했었다. 데스크탑은 리눅스를 쓰고 노트북은 맥을 쓰기 때문에 크로스플랫폼 앱이 필요했다. 게다가 alacritty는 매우 가볍고 성능이 좋아서 내 마음에 쏙 들었다. tmux도 함께 사용하기 때문에 터미널 앱 자체의 기능은 불필요했다.

그런데 alacritty는 치명적인 문제가 있었다. 바로 한글 입력에 버그가 있다는 점이다.

1. 한글 입력 상태에서 스페이스를 누르면 스페이스가 2번 입력된다. ([alacritty/alacritty#8079](https://github.com/alacritty/alacritty/issues/8079))
2. 한글 조합 중 ASCII 키를 누르면 입력이 씹힌다. ([alacritty/alacritty#6942](https://github.com/alacritty/alacritty/issues/6942))

터미널 사용 빈도가 매우 높고, 에디터로 vim까지 사용하는 나로서는 이 문제가 굉장히 불편했다. 당장은 임시로 구름 한글 입력기를 설치해서 그럭저럭 사용할 수 있었지만, 문제가 완전히 해결되지는 않았다. 그래서 어떻게든 해결해보고자 Rust 언어도 학습하고 alacritty 소스 코드도 뜯어보았다.

그 결과, 문제는 alacritty에서 GUI를 위해 사용하는 라이브러리 winit에 macOS 입력 신호를 잘못 조합하는 문제가 있었다. 원인을 찾았으니 일단 어찌저찌 해결해서 PR을 날렸지만 아직 검토되지는 않았다.(2026-02-11 기준, [rust-windowing/winit#4478](https://github.com/rust-windowing/winit/pull/4478))

## Ghostty

ghostty는 최근 유행하는 터미널 앱인 것 같았다. SketchyBar를 사용하면서 엄청 많이 봤는데, 이걸로 터미널 앱을 전환하는 사람도 매우 많이 봤다.
내가 터미널 앱을 찾을 당시(2024년)에는 없었던 앱이다. 그 때는 alacritty와 kitty를 비교하며 선택했던 것 같다.

왜 이렇게 사람들이 많이 쓰는지 알아보다가 성능도 좋다는 것을 발견했다. 난 가볍고 빠르면 장땡이기 때문에 바로 클로드한테 성능 비교를 해달라고 했다. alacritty가 더 빠르긴 하지만 ghostty도 체감 못할 정도로 충분히 빠르다고 한다.

가장 불편했던 한글 입력도 테스트해봤다. 매우 잘 작동했다. 그리고 ghostty 또한 크로스플랫폼 앱이라서 리눅스, 윈도우에서도 사용 가능하다. 그래서 바로 터미널 앱을 ghostty로 바꿔버렸다.

ghostty의 개발자는 Mitchell Hashimoto라는 사람인데, HashiCorp의 공동 창업자다. 자신이 쓰는 도구는 다 직접 개발해서 사용한다고 한다. ghostty는 그 중에서도 완성도가 높아서 오픈소스로 공개한 것이다. 이런 사람이 있다는 게 놀라웠다. 나도 언젠가 개발 실력이 충분히 쌓여서 내가 원하는 도구를 직접 만들어 쓰는 경지에 이르렀으면 좋겠다.

단점은 개발 언어가 생소한 zig여서 내가 직접 기여할 생각은 별로 들지 않을 것 같다.

## 사용 후기

전환한 뒤 한동안 써봤는데, alacritty와 체감 차이는 전혀 없다. 성능도 비슷하고 가볍다. 설정 방식은 alacritty의 TOML과 달리 ghostty는 자체 설정 파일 포맷을 사용하는데, 이것도 충분히 직관적이고 공식 문서가 잘 정리되어 있어서 적응하는 데 어려움은 없었다. 한글 입력 문제도 완전히 사라졌으니 충분히 만족스럽다.