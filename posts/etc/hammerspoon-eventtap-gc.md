---
title: "Hammerspoon eventtap이 몇 분 후 멈추는 이유"
slug: hammerspoon-eventtap-gc
created: 2026-02-07
category: etc
type: [til]
tags: []
---

## 증상

Hammerspoon에서 `hs.eventtap`으로 키보드 이벤트를 가로채는 설정을 했는데, 몇 분만 지나면 동작이 완전히 멈추는 현상이 발생했다.
메뉴바에서 Reload Config를 누르면 다시 동작하지만, 또 몇 분 후에 멈추는 것이 반복되었다.

문제가 된 코드는 다음과 같다.

```lua
-- layers.lua
local layerTap = eventtap.new({ types.keyDown, types.keyUp }, function(e)
    -- 콜백 로직 ...
end)

layerTap:start()
```

## 원인: Lua 가비지 컬렉션

`layerTap`이 파일 스코프의 **로컬 변수**이다. `require("layers")`로 이 파일이 실행된 후, `layerTap`을 참조하는 곳이 없어진다.

콜백 클로저는 `activeLayer`, `layers` 같은 다른 변수만 캡처하고, `layerTap` 자체는 참조하지 않는다. Lua의 클로저는 실제로 참조하는 upvalue만 캡처하기 때문이다.

결과적으로 `layerTap`은 어디에서도 참조되지 않는 상태가 되고, Lua GC가 이 객체를 수거하면 eventtap이 파괴되어 동작이 멈추는 것이다.
GC 타이밍이 비결정적이기 때문에 "몇 분 후에 멈춘다"는 증상으로 나타난다.

## 해결

`layerTap`이 GC되지 않도록 강한 참조를 유지하면 된다.

```lua
-- layers.lua
local layerTap = eventtap.new({ types.keyDown, types.keyUp }, function(e)
    -- 콜백 로직 ...
end)

layerTap:start()

return layerTap
```

```lua
-- init.lua
_G.layerTap = require("layers")
```

`_G`는 Lua의 글로벌 테이블이다. 여기에 저장하면 프로그램이 살아있는 동안 GC되지 않는다.

## 교훈

Hammerspoon에서 `hs.eventtap`, `hs.timer` 등 장기 실행 객체를 만들 때는 반드시 GC되지 않도록 참조를 유지해야 한다. 로컬 변수에만 담아두면 GC 대상이 되어 예고 없이 멈출 수 있다.
