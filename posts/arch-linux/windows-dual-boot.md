---
title: "systemd-boot로 윈도우 듀얼 부팅"
slug: arch-dual-boot
created: 2024-12-16
category: arch-linux
tags: []
---

먼저 윈도우 EFI 파티션을 리눅스에 마운트 해야 한다.
내 경우 윈도우 EFI 파티션 경로는 `/dev/nvme0n1p1`이었다.
이건 실제 윈도우가 설치된 디스크에서 부팅을 담당하는 파티션이다.

```bash
mount --mkdir /dev/nvme0n1p1 /mnt/efi-windows
```

이제 EFI 파일을 리눅스의 EFI 파티션으로 복사한다.

```bash
cp -r /mnt/efi-windows/EFI/Microsoft /boot/EFI/
```

`/boot/loader/loader.conf`에 `auto-entries yes` 옵션을 추가하니 자동으로 윈도우 항목이 추가되었다.
`/boot/EFI`에 들어있으면 자동으로 감지해서 해주는 것 같다.
