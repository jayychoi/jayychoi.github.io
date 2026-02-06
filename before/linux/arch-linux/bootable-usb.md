---
title: 부팅 USB 만들기
slug: arch-bootable-usb
created: 2024-12-16 10:48:00
updated:
description: 윈도우에서 아치 리눅스 부팅 USB를 만드는 과정
category: arch-linux
tags:
published: true
---

> 이 글은 윈도우11을 기준으로 작성되었습니다.

## 이미지 다운로드

[Arch Linux Downloads]

다운로드 페이지에서 한국을 찾아 다운받는다.
`archlinux-x86_64.iso`를 선택했다.

## 파일 확인

운영체제는 시스템 전체에 접근 권한이 있으므로 올바른 파일인지 확인하는 것이 중요하다.

### 체크섬 확인

다운로드한 ISO 파일의 해시값과 공식 사이트에서 제공하는 해시값을 비교하여 파일이 손상되거나 변조되었는지를 확인한다.

파워쉘에서는 다음 명령으로 파일 해시를 구할 수 있다.

```powershell
> Get-FileHash .\archlinux-x86_64.iso -Algorithm SHA256
```

![powershell에서 해시를 구한 것][powershell get-file-hash]

> 근데 `sha256sums.txt`가 미리 해시를 구해놓은 파일인 것 같다.
> 직접 구할 필요 없이 이걸 공식 사이트의 해시와 비교하기만 하면 되는 듯...

### 서명 검증

ISO 파일이 실제 아치 리눅스 개발자에 의해 생성되었는지 확인한다.
악의적으로 변조된 파일을 받으면 큰일날 수 있으니 검증 과정을 거친다.

ISO 파일을 다운받을 때 `archlinux-x86_64.iso.sig`를 함께 다운받는다.
그리고 윈도우에서 사용하는 gpg4win을 설치한다.
터미널에서 다음 명령을 실행한다.

```sh
> gpg --keyserver-options auto-key-retrieve --verify archlinux-version-x86_64.iso.sig
```

## 부팅 USB 만들기

윈도우에서는 rufus를 사용해서 부팅 USB를 만들 수 있다.
rufus를 설치하고 용량이 넉넉한 USB를 꽃은 뒤, rufus의 '장치'에 해당 USB를 선택한다.
'부팅 선택'에서는 다운받은 아치 리눅스 ISO 파일을 선택한다.

![rufus]

시작을 누르면 아래 창이 뜬다.

![ISO hybrid image]

'DD 이미지 모드로 쓰기'를 선택한다.

> ISO 이미지 모드는 파일을 개별적으로 복사하는 방식이다.
> ISO 모드를 사용하면 부팅 구조가 변경될 수 있어 아치 리눅스 부팅 시 문제가 발생할 수 있다.
> 반면에 DD 이미지 모드는 디스크의 정확한 비트별 복사를 수행한다.
> 그래서 DD 이미지 모드에서는 부팅 구조와 모든 파일을 그대로 보존한다.
> 아치 리눅스는 하이브리드 ISO로 제작되어 있어서 ISO 모드와 DD 모드를 모두 사용할 수 있는데,
> 정확한 비트별 복사가 필요하기 때문에 DD 모드를 선택해야 한다.

[Arch Linux Downloads]: https://archlinux.org/download/
[powershell get-file-hash]: https://github.com/user-attachments/assets/d0069b8c-b969-44d0-9cf8-d52b2b8c6abd
[rufus]: https://github.com/user-attachments/assets/c0447ac7-4388-4037-8600-6f77e09f49d0
[ISO hybrid image]: https://github.com/user-attachments/assets/86195602-6f85-4978-8cb8-d0bf5f4921f5
