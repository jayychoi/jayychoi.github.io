---
title: "[플러그인] which-key.nvim"
slug: nvim-which-key
created: 2025-04-04
category: nvim
tags: []
---

## whick-key.nvim

[whick-key](https://github.com/folke/which-key.nvim)

이 플러그인은 키맵을 보여준다.
현재 어떤 키를 눌렀을 때 어떤 동작을 하는지 팝업창을 띄워 표시한다.

플러그인이 많아지고 기능이 복잡해지면 눈으로 기능을 확인하면서 사용하는 것이 편하다.

## 설정

preset 말고는 딱히 설정이 필요없었다.

### preset

팝업창의 형태를 설정한다.

- `classic`(default): 화면 아래에 전체적으로 표시
- `modern`: 화면 아래에 팝업창 형태로 넓게 표시
- `helix`: 화면 오른쪽 아래에 작은 팝업창 형태로 세로 목록 표시

helix 스타일이 가장 깔끔하고 LazyVim에서도 사용하던 형태여서 이걸 선택했다.
