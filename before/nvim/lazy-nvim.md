---
title: lazy.nvim
slug: nvim-lazy-nvim
created: 2025-04-04 20:49
updated:
description:
category: nvim
tags:
published: true
---

## lazy.nvim이란?

lazy.nvim은 Neovim을 위한 플러그인 매니저이다.
lua를 사용해서 쉽게 플러그인을 설치하거나 설정할 수 있고, UI를 통해 플러그인을 관리할 수도 있다.

나는 LazyVim을 쓰면서 처음 접했는데, 사용하기 괜찮아서 이걸 선택했다.

## 설정 구조

nvim은 기본적으로 `~/.config/nvim` 디렉토리를 설정으로 사용한다.
설정 디렉토리의 구조는 공식 문서에서 추천하는 방식대로 만들었다.

```text
~/.config/nvim
├── lua
│   ├── config
│   │   └── lazy.lua
│   └── plugins
│       ├── spec1.lua
│       ├── **
│       └── spec2.lua
└── init.lua
```

설정 디렉토리의 `init.lua`는 nvim을 실행할 때 바로 실행되는 스크립트이다.
그리고 `lua/` 내부의 `.lua` 파일들은 lua에서 `require()`로 불러올 수 있다.

`init.lua`에 모든 설정을 넣어도 되지만, 많은 설정과 플러그인이 필요하기 때문에 파일을 작게 나누기로 했다.

`lua/config/`는 기본적인 설정을 넣기로 했다.
`lazy.lua`는 lazy.nvim을 불러오는 파일이다.
아직은 파일이 한 개이지만, 키맵이나 글로벌 옵션 등을 추가하려고 한다.

`lua/plugins/`는 플러그인을 설정하는 디렉토리이다.
기존의 플러그인들을 설치하고 설정할 수 있다.
물론 내가 직접 플러그인을 만들 수도 있다.

## 설치

`init.lua`를 다음과 같이 작성한다.

```lua title="init.lua"
require("config.lazy")
```

이 코드는 `./lua/config/lazy.lua`를 불러오겠다는 의미이다.
그리고 `./lua/config/lazy.lua`에는 lazy.nvim을 불러오는 코드를 작성한다.
내용은 [공식 문서](https://lazy.folke.io/installation)에 잘 소개되어 있다.

```lua title="lua/config/lazy.lua"
-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end
vim.opt.rtp:prepend(lazypath)

-- Make sure to setup `mapleader` and `maplocalleader` before
-- loading lazy.nvim so that mappings are correct.
-- This is also a good place to setup other settings (vim.opt)
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"

-- Setup lazy.nvim
require("lazy").setup({
  spec = {
    -- import your plugins
    { import = "plugins" },
  },
  -- Configure any other settings here. See the documentation for more details.
  -- colorscheme that will be used when installing plugins.
  install = { colorscheme = { "habamax" } },
  -- automatically check for plugin updates
  checker = { enabled = true },
})
```

이제 nvim을 다시 시작하면(`{ import = "plugins" },{:lua}`는 주석 처리해야 한다) lazy.nvim이 적용된 nvim이 실행된다.

실행이 잘 되었는지 확인하려면 nvim을 켜고 `:Lazy`를 입력해본다.
창이 뜨면 성공이다.
