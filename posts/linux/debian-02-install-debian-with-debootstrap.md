---
title: "debootstrap으로 데비안 설치하기"
slug: install-debian-with-debootstrap
created: 2026-02-10
description: "SSD 2개가 장착된 시스템에서, 아치 리눅스가 설치된 SSD를 활용해 USB 부팅 디스크 없이 빈 SSD에 데비안을 설치했다. debootstrap을 사용하면 데비안 기본 시스템을 설치할 수 있다."
category: linux
tags: [debian, debootstrap, systemd-boot, chroot]
type: [til, series]
series: "데비안 서버 구축"
order: 2
---

## 환경

- **기존 OS:** Arch Linux (NVMe SSD 1TB)
- **대상 SSD:** NVMe SSD 1TB, 포맷 완료
- **부트 방식:** UEFI + systemd-boot
- **설치할 OS:** Debian 13 (Trixie)

## 초기 디스크 상태

```
NAME        MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
sda           8:0    0   1.8T  0 disk
└─sda1        8:1    0   1.8T  0 part
sdb           8:16   0  12.7T  0 disk
└─sdb1        8:17   0  12.7T  0 part
nvme1n1     259:0    0 953.9G  0 disk
├─nvme1n1p1 259:3    0     1G  0 part /boot     ← Arch Linux
└─nvme1n1p2 259:4    0 952.9G  0 part /
nvme0n1     259:1    0 953.9G  0 disk
└─nvme0n1p1 259:6    0 953.9G  0 part           ← 빈 SSD (대상)
```

## 1단계: 파티셔닝

대상 SSD(`nvme0n1`)에 EFI 파티션과 root 파티션을 생성한다.

```bash
sudo fdisk /dev/nvme0n1
```

fdisk 내부에서 다음과 같이 진행했다.

```
d          # 기존 파티션 삭제

n          # EFI 파티션 생성
p
1
Enter
+512M

n          # root 파티션 생성
p
2
Enter
Enter

t          # EFI 파티션 타입 변경
1
1          # EFI System

w          # 저장
```

### EFI 파티션은 반드시 FAT32여야 한다

UEFI 스펙에서 ESP는 FAT32만 지원한다. UEFI 펌웨어는 ext4를 읽을 수 없기 때문에, ESP를 ext4로 만들면 부팅 자체가 불가능하다. `fdisk`에서 파티션을 생성한 후 타입을 EFI System으로 변경하는 것도 빠뜨리면 안 된다. 파일시스템 포맷과 파티션 타입은 별개이며, 타입이 "Linux filesystem"으로 남아 있으면 UEFI가 ESP로 인식하지 못한다.

### 포맷 및 마운트

FAT32 포맷을 위해 `dosfstools` 패키지가 필요하다.

```bash
sudo pacman -S dosfstools

sudo mkfs.fat -F32 /dev/nvme0n1p1
sudo mkfs.ext4 /dev/nvme0n1p2

sudo mount /dev/nvme0n1p2 /mnt
sudo mkdir -p /mnt/boot
sudo mount /dev/nvme0n1p1 /mnt/boot
```

## 2단계: debootstrap으로 기본 시스템 설치

`debootstrap`은 데비안 기본 시스템을 임의의 디렉토리에 설치해주는 도구다. 아치 리눅스 설치 시 `pacstrap`을 사용하는 것과 유사한 개념이다.

```bash
sudo pacman -S debootstrap
sudo debootstrap --arch amd64 trixie /mnt http://deb.debian.org/debian
```

| 인자 | 설명 |
|------|------|
| `--arch amd64` | 설치할 아키텍처 (x86_64) |
| `trixie` | 데비안 버전 코드네임 (Debian 13) |
| `/mnt` | 설치 대상 경로 |
| `http://deb.debian.org/debian` | 패키지 미러 서버 |

debootstrap만으로는 최소한의 기본 패키지만 설치된다. 커널, 부트로더, 네트워크 관리자, 사용자 계정 등은 별도로 설정해야 한다.

## 3단계: chroot 진입 및 시스템 설정

### chroot 준비

chroot는 루트 디렉토리만 변경할 뿐, `/dev`, `/proc`, `/sys` 같은 가상 파일시스템은 자동으로 마운트되지 않는다. 이들을 바인드 마운트해야 chroot 내부에서 `bootctl install`, `blkid` 등이 정상 작동한다.

> 아치 리눅스의 `arch-chroot`는 이 작업을 자동으로 해주지만, 일반 `chroot`에서는 수동으로 해야 한다.

```bash
sudo mount --bind /dev /mnt/dev
sudo mount --bind /proc /mnt/proc
sudo mount --bind /sys /mnt/sys
sudo mount --bind /dev/pts /mnt/dev/pts
sudo mount --rbind /sys/firmware/efi/efivars /mnt/sys/firmware/efi/efivars
sudo chroot /mnt /bin/bash
```

### PATH 설정

chroot 진입 후 PATH가 제대로 잡히지 않아 `dpkg`, `useradd` 등을 찾지 못하는 경우가 있다. 진입 직후 바로 PATH를 설정하면 된다.

```bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

### 패키지 소스 및 필수 패키지 설치

```bash
cat > /etc/apt/sources.list << 'EOF'
deb http://deb.debian.org/debian trixie main contrib non-free non-free-firmware
deb http://deb.debian.org/debian trixie-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security trixie-security main contrib non-free non-free-firmware
EOF

apt update
apt install linux-image-amd64 linux-headers-amd64 firmware-linux \
            systemd-boot locales sudo network-manager
```

### 로케일 설정

```bash
sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
sed -i 's/# ko_KR.UTF-8 UTF-8/ko_KR.UTF-8 UTF-8/' /etc/locale.gen
locale-gen
echo 'LANG=en_US.UTF-8' > /etc/locale.conf
```

### 시간대 및 호스트네임

```bash
ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

echo "jay-deb" > /etc/hostname

cat > /etc/hosts << 'EOF'
127.0.0.1   localhost
127.0.1.1   jay-deb
EOF
```

> `/etc/hostname`과 `/etc/hosts`의 호스트네임이 일치해야 한다. 일치하지 않아도 작동은 하지만 명령을 실행할 때마다 경고가 출력됐다.

### 사용자 설정

```bash
passwd                                        # root 비밀번호
useradd -m -G sudo -s /bin/bash jay
passwd jay                                    # 일반 사용자 비밀번호
```

### fstab 작성

UUID는 `blkid` 명령으로 확인한다. `blkid`가 바로 실행되지 않으면 `/sbin/blkid`로 시도하면 된다.

```bash
blkid
```

```bash
cat > /etc/fstab << 'EOF'
UUID=<nvme0n1p2의 UUID>  /      ext4  defaults  0 1
UUID=<nvme0n1p1의 UUID>  /boot  vfat  defaults  0 2
EOF
```

## 4단계: systemd-boot 설정

부트로더는 GRUB 대신 systemd-boot를 사용했다. 아치 리눅스에서 쓰던 건데 빠르고 깔끔해서 좋다. AI 답변에서 전부 GRUB을 이야기하는 걸 보면 GRUB이 표준적인 도구인 것 같긴 하다.

```bash
bootctl install
chmod 700 /boot
```

`bootctl install` 출력에 random seed 관련 보안 경고가 나올 수 있는데, `chmod 700 /boot`로 해결된다.

### 로더 설정

```bash
cat > /boot/loader/loader.conf << 'EOF'
default debian.conf
timeout 3
editor no
EOF
```

### 부팅 엔트리

```bash
cat > /boot/loader/entries/debian.conf << 'EOF'
title   Debian Trixie
linux   /vmlinuz-6.12.63+deb13-amd64
initrd  /initrd.img-6.12.63+deb13-amd64
options root=UUID=<nvme0n1p2의 UUID> rw quiet
EOF
```

> debootstrap 설치에서는 `/boot/vmlinuz`, `/boot/initrd.img` 같은 심볼릭 링크가 자동 생성되지 않을 수 있다. 반드시 `ls /boot/`로 실제 파일명을 확인하고, 버전 번호가 포함된 정확한 파일명(예: `vmlinuz-6.12.63+deb13-amd64`)을 사용해야 한다.

## 5단계: 듀얼부팅

각 SSD에 독립적인 ESP와 systemd-boot가 설치되어 있으므로, UEFI 부팅 메뉴에서 원하는 SSD를 선택하면 된다. 두 OS가 완전히 독립적이라 한쪽을 삭제하거나 변경해도 다른 쪽에 영향을 주지 않는다.

## 트러블슈팅

### 첫 부팅 시 emergency mode 진입

데비안으로 부팅했더니 "you are in emergency mode" 메시지가 뜨고, USB 키보드 입력이 전혀 되지 않았다.

#### 원인

systemd-boot 엔트리에서 커널 경로를 `/vmlinuz`, `/initrd.img`로 지정했는데, 실제 파일명은 `vmlinuz-6.12.63+deb13-amd64`였다. 심볼릭 링크가 없어서 커널 로딩이 제대로 되지 않은 것이다.

#### 해결

아치 리눅스로 다시 부팅한 뒤, 데비안 파티션을 마운트해서 chroot로 들어가 엔트리 파일의 커널/initrd 경로를 정확한 파일명으로 수정했다.

### NVMe 드라이브 번호가 부팅마다 바뀜

아치 리눅스에서 데비안이 `nvme0n1`이었는데, 재부팅하니 `nvme1n1`으로 바뀌어 있었다. 잘못된 드라이브를 마운트해서 chroot 했더니 데비안이 아니라 아치에 들어가는 실수를 했다.

#### 원인

NVMe 드라이브 번호는 커널의 프로빙 순서에 따라 달라질 수 있다.

#### 해결

이름 대신 UUID를 사용한다. 작업 전에 항상 `lsblk`로 현재 매핑을 확인해야 한다. fstab과 systemd-boot 엔트리에는 장치 이름 대신 UUID를 사용하면 이 문제를 근본적으로 방지할 수 있다.

### chroot 내에서 명령어를 찾지 못함

`dpkg`, `useradd`, `blkid` 등이 `command not found`로 실행되지 않았다.

#### 원인

chroot 환경에서 PATH에 `/usr/sbin`, `/sbin` 등이 포함되지 않아서 생기는 문제다.

#### 해결

```bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
```

chroot 진입 직후 위 명령을 실행하거나, `/usr/sbin/update-initramfs`처럼 절대 경로로 실행하면 된다.

### mkfs.fat 명령이 없음

아치 리눅스에 `dosfstools` 패키지가 설치되어 있지 않아서 생긴 문제다.

```bash
sudo pacman -S dosfstools
```

`mkfs.ext4`는 기본적으로 설치되어 있었다.