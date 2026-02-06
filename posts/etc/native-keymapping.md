---
title: "karabiner 없이 맥북 키매핑하기"
slug: plist-keymapping
created: 2025-12-05
updated: 2025-12-05
category: etc
tags: []
---

## 문제

맥에서 오른쪽 커맨드를 한영키로 사용하다가 macOS 26으로 업데이트하고 문제가 생겼다.

기존에는 karabiner로  오른쪽 커맨드를 F18로 변경하고, 맥 설정에서 F18을 한영키로 설정했다.
그런데 macOS로 업데이트하니 키가 씹히는 경우가 많았다.
체감상 거의 항상이었다. (업데이트 하지 말걸...)

마침 개발자 오픈채팅에서도 이 이야기가 많이 나왔고, 더 로우레벨에서 해결할 방법을 찾았다.

## 해결 방법

`hidutil`을 사용해서 커스텀 키매핑을 적용할 수 있다.

`$ hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000E7,"HIDKeyboardModifierMappingDst":0x70000006D}]}'`

하지만 이렇게 터미널에서 명령을 실행하면 컴퓨터 종료 시 설정이 사라진다.
영구적으로 설정을 남기려면 이 명령을 `plist` 파일로 작성해두면 된다.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.local.KeyRemapping</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/hidutil</string>
        <string>property</string>
        <string>--set</string>
        <string>{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000E7,"HIDKeyboardModifierMappingDst":0x70000006D}]}</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

이 파일을 아래 경로에 저장한다.

```sh
/Library/LaunchAgents/com.logi.optionsplus.plist
~/Library/LaunchAgents/com.local.KeyRemapping.plist
```

## 참고

https://taedi.net/38
