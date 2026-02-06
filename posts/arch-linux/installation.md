---
title: "아치 리눅스 설치"
slug: arch-installation
created: 2024-12-16
category: arch-linux
tags: []
---

## 부팅 USB로 부팅하기

앞서 만든 부팅 USB를 꽂고, 바이오스에서 이 USB로 부팅해야 한다.
그리고 바이오스에서 보면 똑같은 아치 리눅스 항목이 여러 개 있었다.
주의점은 반드시 UEFI가 적힌 항목을 선택해야 한다.
그러지 않으면 부트 방식을 확인할 때 `efivars` 디렉토리가 존재하지 않는다.
(왜 UEFI가 아니어도 부팅이 잘 될까?)

부팅이 되면 목록이 나오는데, `Arch Linux install medium`을 선택한다.

> 부팅 USB로 부팅된 OS를 '라이브 환경'이라고 부른다.
> USB에 있는 파일들만 사용해서 OS를 실행한 것이다.
> 그래서 라이브 환경에서는 필요한 몇 가지 설정을 한 뒤, 그 내용으로 디스크에 설치를 진행한다.

## 키보드 레이아웃 설정

기본 키맵은 US이다.

## 부팅 모드 확인

UEFI bitness를 확인해서 부팅 모드를 확인할 수 있다.

```sh
$ cat /sys/firmware/efi/fw_platform_size
```

이 명령의 리턴값으로 부팅 모드를 확인할 수 있다.

- `64`: UEFI로 부팅됨. 64-bit x64 UEFI.
- `32`: UEFI로 부팅됨. 32-bit IA32 UEFI.
- `No such file or directory`: BIOS 또는 CSM 모드로 부팅됨.

라이브 환경의 부팅 모드가 실제로 설치될 아치 리눅스의 부팅 모드가 된다.
따라서 원하는 모드가 아니라면 부팅 USB를 다시 제대로 실행해야 한다.

## 인터넷 연결

유선랜을 사용한다면 자동으로 인터넷 연결이 된다.
와이파이를 사용한다면 추가 작업이 필요하다.

> 나는 유선랜이라 추가 작업이 필요 없었다.

1. `ip link`로 네트워크 인터페이스가 활성화되어 있는지 확인한다.
2. 네트워크에 연결한다. (유선랜의 경우, 랜선을 꼽는다.)
3. `ping`으로 네트워크가 잘 연결되었는지 확인한다.

## 시스템 시간 설정

`timedatectl`로 시간을 설정한다.

`timedatectl status`로 현재 상태를 확인할 수 있다.
아무 설정 없이 실행해보니 UTC 시간으로 설정되어 있었다.

```sh
$ timedatectl status                   # UTC
$ timedatectl set-ntp true             # NTP 동기화 활성화
$ timedatectl set-timezone Asia/Seoul  # 타임존을 서울로 설정
$ date                                 # 한국 시간이 출력됨
$ timedatectl status                   # 타임존은 서울이고, 로컬 시간에 한국 시간이 출력됨
```

`timedatectl set-ntp true`는 NTP(Network Time Protocol) 동기화를 활성화한다.
그러면 네트워크를 통해 정확한 서버 시간을 받아와서 동기화한다.

## 디스크 파티션 설정

디스크 장치 목록을 확인하기 위해 `fdisk -l`을 실행한다.

> `rom`, `loop`, `airoot`로 끝나는 것들은 무시해도 된다.

리눅스에서는 SATA HDD/SSD를 `/dev/sda`로, NVMe SSD는 `/dev/nvme0n1` 등으로 인식한다.

현재 내 컴퓨터에는 HDD 1개와 NVMe SSD 2개가 장착되어 있다.
`fdisk -l`을 실행하니 다음의 목록이 나왔다.

- `/dev/sda`: HDD
- `/dev/nvme0n1`: SSD 1
- `/dev/nvme1n1`: SSD 2
- `/dev/sdb`: 아치 리눅스 설치용 부팅 USB
- `/dev/loop0`: 무시해도 됨(실제 물리 디스크가 아니라 USB로 부팅할 경우 사용되는 임시 장치)

나는 `/dev/nvme0n1`에 아치 리눅스를 설치했다.

```sh
$ fdisk /dev/nvme0n1
```

### fdisk 실행 과정

`fdisk /dev/nvme0n1`을 실행하니 fdisk 프롬프트가 나타났다.

1. `g`: GPT 파티션 테이블을 생성한다. 디스크를 GPT로 설정하고 모든 파티션 정보를 삭제한다.
2. `n`: 새 파티션을 생성한다. 이건 EFI 시스템 파티션으로 사용한다.
   - 파티션 번호: 그냥 엔터 (기본값 1)
   - First sector: 그냥 엔터 (기본값)
   - Last sector: `+1G` 입력 (1GB 할당)
3. `t`: 파티션 타입을 변경한다. `n`으로 생성하면 기본으로 `Linux filesystem` 타입이 된다.
   - `1`을 입력한다. `1`은 EFI 시스템 파티션 타입이다.
4. `n`: 새 파티션을 생성한다. 이건 루트 파티션으로 리눅스에서 실제로 사용하는 부분이다.
   - 파티션 번호: 그냥 엔터 (기본값 2)
   - First sector: 그냥 엔터 (기본값)
   - Last sector: 그냥 엔터 (남은 공간 전체 사용)
5. `p`: 파티션 테이블 정보를 확인한다. 문제가 없으면 넘어간다.
6. `w`: 저장하고 종료한다.

파티션을 생성하고 `p`를 입력하니 다음 내용이 출력되었다.

```text
Device           Start        End    Sectors   Size Type
/dev/nvme0n1p1    2048    2099199    2097152     1G EFI System
/dev/nvme0n1p2 2099200 2000408575 1998309376 952.9G Linux filesystem
```

## 파티션 포맷

파티션을 나누면 각 파티션을 알맞는 파일 시스템으로 포맷해야 한다.

- EFI 시스템 파티션: FAT32
  - UEFI 표준에서 FAT32만 공식적으로 지원한다.
  - 모든 운영체제가 읽을 수 있는 공통 파일 시스템이어야 한다.
- 루트 파티션: 나는 ext4를 선택
  - 리눅스 파일 시스템 중에 선택하면 된다.
  - ext4, btrfs, xfs, f2fs, ntfs, fat32, exfat 등등

```sh
# EFI 시스템 파티션 포맷
$ mkfs.fat -F 32 /dev/nvme0n1p1

# 루트 파티션 포맷
$ mkfs.ext4 /dev/nvme0n1p2
```

## 파일 시스템 마운트

`/mnt`에 루트 파티션의 파일 시스템을 마운트해야 한다.
그리고 `/mnt/boot`에는 EFI 시스템 파티션을 마운트한다.

```sh
# 루트 파티션을 /mnt에 마운트
$ mount /dev/nvme0n1p1 /mnt

# EFI 시스템 파티션을 위한 디렉토리 /mnt/boot를 생성하고 마운트
$ mount --mkdir /dev/nvme0n1p1 /mnt/boot
```

## 미러 선택

패키지는 미러 서버에서 다운로드 받는다.
사용할 미러 서버의 목록이 `/etc/pacman.d/mirrorlist`에 저장되어 있다.
이 목록은 pacstrap으로 아치 리눅스를 설치할 때 그대로 적용되기 때문에 미리 잘 수정해두어야 한다.

수정을 위해서는 reflector라는 도구를 사용한다.
reflector는 아치 리눅스의 미러 서버 리스트를 자동으로 관리해주는 도구이다.
전세계 미러 서버들을 확인해서 가장 빠르고 최신인 서버들을 찾아준다.

```sh
# reflector 설치
$ pacman -Sy reflector

# 빠른 미러를 찾아 설정
$ reflector --country South-Korea,Japan --latest 5 --sort rate --save /etc/pacman.d/mirrorList
```

## 필수 패키지 설치

```sh
# 시스템 필수 패키지
$ pacstrap /mnt base linux linux-firmware
```

위 패키지들은 설치하지 않을 경우 아예 시스템이 작동하지 않는다.
그 외 패키지들에 대해서는 별도의 목록을 제공하지는 않는다.
대신 중요한 패키지들은 사용자들이 자율적으로 선택하도록 가이드만 해 준다.

- 파일 시스템 관리를 위한 유저 도구
- RAID 또는 LVM 파티션에 접근하기 위한 도구
- linux-firmware에 포함되지 않은 펌웨어
- 네트워크 관련 소프트웨어
- 텍스트 편집기
- man과 info에 접근하기 위한 패키지

몇몇 패키지는 미리 설치하지 않으면 곤란해질 수 있어 미리 설치해야 한다.

```sh
# 내가 설치한 패키지
$ pacstrap /mnt networkmanager neovim sudo man-db man-pages texinfo tldr
```

## 기타 시스템 설정

```sh
# fstab
$ genfstab -U /mnt >> /mnt/etc/fstab

# chroot
$ arch-chroot /mnt

# timezone
$ ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
$ hwclock --systohc

# 현지화
# /etc/locale.gen 파일에서 필요한 로케일을 주석 해제 (en_US.UTF-8, ko_KR.UTF-8)
# 그리고 다음 명령 실행
$ locale-gen

# 시스템 기본 언어 설정
$ echo "LANG=en_US.UTF-8" >> /etc/locale.conf

# 호스트 이름 설정
$ echo "cjy-arch" >> /etc/hostname

# 비밀번호 설정
$ passwd
```

## 부트로더

마지막으로 부트로더를 설치하여 시스템을 어떻게 부팅할지를 설정해야 한다.
아치 리눅스 커뮤니티에서는 다음의 세 부트로더가 인기있다고 한다.

- GRUB2: 가장 보편적이고 멀티 부팅 시 선호
- systemd-boot: 단순하고 부팅 속도가 빨라 최근 인기가 폭발
- rEFInd: ?

나는 systemd-boot를 선택했다.
나에겐 속도가 가장 중요하기 때문이다.
아치 리눅스에 기본적으로 설치되어 있어 쉽게 활성화할 수 있다.

### systemd-boot 설치

```sh
$ bootctl install
```

### `loader.conf` 작성

```sh title="/boot/loader/loader.conf"
default arch.conf  # 기본 프로필
timeout 5          # 몇 초 뒤 기본 프로필로 넘어갈 것인가
console-mode max
editor no
```

### `arch.conf` 작성

```sh title="/boot/loader/entries/arch.conf"
title Arch Linux
linux /vmlinuz-linux
initrd /initramfs-linux.img
options root=UUID={uuid}
```

UUID는 `blkid`나 `lsblk -f`를 통해 확인할 수 있다.

## 재부팅

지금까지 작업이 끝났다면 현재 디렉토리 위치가 `/mnt`일 것이다.
`exit`으로 나간 뒤, `reboot`를 실행하면 설치된 아치 리눅스로 재부팅된다.
