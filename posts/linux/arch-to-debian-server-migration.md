---
title: "라이브 USB 없이 아치 리눅스에서 데비안 서버로 마이그레이션"
slug: arch-to-debian-server-migration
created: 2026-02-08
updated: 2026-02-09
description: "실행 중인 아치 리눅스에서 dd 아카이빙과 debootstrap을 활용해 라이브 USB 없이 데비안 서버로 전환하는 과정"
category: linux
tags: [debian, archlinux, dd, debootstrap, docker, server]
---

## 개요

데스크탑에 아치 리눅스가 설치되어 개발용 PC로 사용 중이다. 이걸 개인 서버로 전환하려고 한다. 데비안을 설치하고 Docker 서비스, 개발 서버 등을 올릴 계획이다.

보통은 라이브 USB로 부팅해서 dd 백업을 뜨고, 다시 라이브 USB로 데비안을 설치하는 흐름을 따른다. 하지만 `debootstrap`을 쓰면 **실행 중인 아치 리눅스에서 라이브 USB 없이 전부 처리할 수 있다.**

### 디스크 구성

| 디스크 | 현재 상태 | 역할 |
|--------|-----------|------|
| SSD1 (NVMe) | 아치 리눅스 | 최종적으로 데비안이 들어갈 디스크 |
| SSD2 (NVMe) | 윈도우 | 데비안 임시 설치 경유지. 윈도우는 밀어도 됨 |
| HDD | 데이터 | dd 아카이브 저장소 |

### 전체 흐름

핵심은 SSD2를 경유지로 쓰는 것이다. 실행 중인 OS의 디스크를 자기 자신이 밀 수는 없으니, 다른 디스크에 먼저 데비안을 설치하고 거기서 부팅한 뒤 원래 디스크를 정리한다.

1. 아치에서 SSD1을 dd로 아카이빙 → HDD에 저장
2. 아치에서 SSD2(윈도우)를 밀고 debootstrap으로 데비안 설치
3. SSD2의 데비안으로 부팅
4. 데비안에서 SSD1(아치)을 밀고 rsync로 데비안 이전
5. SSD1의 데비안으로 최종 부팅

---

## Phase 1: 사전 준비

실행 중인 아치에서 디스크 구조를 확인하고, 필요한 도구를 설치한다.

### 디스크 확인

```bash
lsblk -f
```

SSD1, SSD2, HDD 각각의 디바이스명을 확인한다. 이 글에서는 다음과 같이 가정한다.

| 디스크 | 디바이스 |
|--------|----------|
| SSD1 (아치) | `/dev/nvme0n1` |
| SSD2 (윈도우) | `/dev/nvme1n1` |
| HDD | `/dev/sda` |

### HDD 마운트

```bash
mkdir -p /mnt/hdd
mount /dev/sda1 /mnt/hdd
```

### debootstrap 설치

```bash
pacman -S debootstrap
```

패키지가 없으면 AUR에서 설치한다.

```bash
yay -S debootstrap
```

---

## Phase 2: 아치 리눅스 아카이빙

아치 리눅스 환경 세팅에 공을 많이 들였기 때문에, OS를 안 쓰더라도 디스크 이미지로 아카이빙해둔다.

### 패키지 목록 + dotfiles 백업

dd 이미지와 별개로, 나중에 빠르게 참조할 수 있도록 따로 백업해둔다. dd 이미지에서 특정 파일 하나를 꺼내려면 이미지를 마운트해야 하는데, 이렇게 따로 빼두면 훨씬 편하다.

```bash
# 패키지 목록
pacman -Qqe > ~/pkglist-explicit.txt    # 직접 설치한 패키지
pacman -Qqm > ~/pkglist-aur.txt         # AUR 패키지
```

```bash
# 설정 파일 묶기
tar czf ~/dotfiles-backup.tar.gz \
  ~/.config ~/.bashrc ~/.zshrc ~/.ssh ~/.gitconfig \
  /etc/fstab /etc/pacman.conf /etc/systemd/ \
  ~/pkglist-explicit.txt ~/pkglist-aur.txt

cp ~/dotfiles-backup.tar.gz /mnt/hdd/
```

### dd로 SSD1 전체 이미지

실행 중인 OS의 디스크를 dd하는 것이므로 파일 시스템 100% 일관성이 보장되지는 않는다. 하지만 서비스를 다 멈추고 sync를 한 뒤 뜨면 실용적으로 충분하다. 나중에 복원할 수 있는 아카이브 수준이면 되기 때문이다.

```bash
# 쓰기 활동을 최대한 줄인다
systemctl stop docker
# 다른 서비스도 가능한 한 중지
sync
```

```bash
# gzip 압축으로 이미지 생성
dd if=/dev/nvme0n1 bs=4M status=progress | gzip > /mnt/hdd/arch-ssd1.img.gz
```

- `bs=4M`: 블록 사이즈. 성능을 위해 4M 권장
- `status=progress`: 진행률 표시
- 압축 시 빈 공간이 많으면 이미지 크기가 크게 줄어든다

> HDD에 저장하는 이유: 이후 SSD1도 밀고 SSD2도 밀 건데, HDD는 건드리지 않으므로 아카이브가 안전하다.

### 이미지 검증

```bash
# 파티션 테이블 확인
gunzip -c /mnt/hdd/arch-ssd1.img.gz | fdisk -l /dev/stdin

# 체크섬 생성
sha256sum /mnt/hdd/arch-ssd1.img.gz > /mnt/hdd/arch-ssd1.sha256
```

파티션 테이블이 정상적으로 보이면 아카이빙은 완료다.

---

## Phase 3: SSD2에 데비안 설치

여기가 핵심이다. 실행 중인 아치에서 `debootstrap`으로 SSD2에 데비안 베이스 시스템을 설치한 뒤, chroot로 들어가서 커널과 부트로더를 잡아준다.

### SSD2 파티션 정리

윈도우를 밀고 리눅스용 파티션을 만든다. SSD2는 임시 경유지이므로 단순하게 잡는다.

```bash
wipefs -a /dev/nvme1n1
```

```bash
gdisk /dev/nvme1n1
# n → +512M → EF00 (EFI System Partition)
# n → 나머지 → 8300 (Linux filesystem)
# w
```

```bash
mkfs.fat -F32 /dev/nvme1n1p1
mkfs.ext4 /dev/nvme1n1p2
```

### debootstrap 실행

```bash
mount /dev/nvme1n1p2 /mnt/ssd2
mkdir -p /mnt/ssd2/boot/efi
mount /dev/nvme1n1p1 /mnt/ssd2/boot/efi

debootstrap --arch amd64 bookworm /mnt/ssd2 http://deb.debian.org/debian
```

`debootstrap`이 데비안 미러에서 베이스 시스템을 다운로드해서 `/mnt/ssd2`에 풀어준다. 네트워크 속도에 따라 몇 분 걸린다.

### chroot 진입

설치된 데비안에 chroot로 들어가서 부팅에 필요한 것들을 설정한다.

```bash
mount --bind /dev     /mnt/ssd2/dev
mount --bind /dev/pts /mnt/ssd2/dev/pts
mount --bind /proc    /mnt/ssd2/proc
mount --bind /sys     /mnt/ssd2/sys
mount --bind /sys/firmware/efi/efivars /mnt/ssd2/sys/firmware/efi/efivars

chroot /mnt/ssd2 /bin/bash
```

### chroot 내부 설정

여기서부터는 chroot 내부다.

**apt 소스 설정:**

debootstrap은 최소 소스만 설정하므로, security와 updates 저장소를 추가한다.

```bash
cat > /etc/apt/sources.list << 'EOF'
deb http://deb.debian.org/debian bookworm main contrib non-free non-free-firmware
deb http://deb.debian.org/debian bookworm-updates main contrib non-free non-free-firmware
deb http://security.debian.org/debian-security bookworm-security main contrib non-free non-free-firmware
EOF

apt update
```

**커널 + 필수 패키지:**

debootstrap은 커널을 설치하지 않는다. 직접 설치해야 한다.

```bash
apt install -y linux-image-amd64 linux-headers-amd64
apt install -y grub-efi-amd64 efibootmgr
apt install -y sudo openssh-server vim curl wget rsync
```

**fstab 작성:**

```bash
blkid
```

출력된 UUID를 확인해서 `/etc/fstab`을 작성한다.

```bash
cat > /etc/fstab << 'EOF'
# <device>                                <mount>    <type>  <options>       <dump> <pass>
UUID=SSD2-ROOT-UUID                       /          ext4    errors=remount-ro 0      1
UUID=SSD2-EFI-UUID                        /boot/efi  vfat    umask=0077        0      1
EOF
```

`UUID=SSD2-ROOT-UUID` 부분을 `blkid` 결과로 바꿔야 한다.

**호스트명, 타임존, 사용자:**

```bash
echo "debian-server" > /etc/hostname

ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

passwd                    # root 비밀번호
adduser jay               # 일반 사용자
usermod -aG sudo jay
```

**네트워크:**

debootstrap은 네트워크 설정도 안 해주므로 직접 잡아야 한다. 유선 DHCP 기준으로 가장 간단한 방법:

```bash
cat > /etc/network/interfaces << 'EOF'
auto lo
iface lo inet loopback

auto eno1
iface eno1 inet dhcp
EOF
```

> 인터페이스 이름(`eno1`)은 시스템마다 다르다. chroot 밖에서 `ip link`로 확인하고 넣으면 된다.

**부트로더 설치:**

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=debian
update-grub
```

**chroot 탈출:**

```bash
exit
umount -R /mnt/ssd2
```

---

## Phase 4: SSD2 데비안으로 부팅

재부팅한 뒤 UEFI에서 SSD2를 부팅 디스크로 선택한다. 대부분 부팅 시 F12(또는 F2, Del)를 누르면 부팅 디스크 선택 메뉴가 나온다.

확인할 것:

- 데비안이 정상 부팅되는지
- 네트워크가 잡히는지 (`ip a`)
- SSH 접속이 되는지

문제가 있으면 다시 SSD1(아치)로 부팅해서 chroot로 수정하면 된다. 라이브 USB가 필요 없는 이유가 바로 이것이다 — 아치가 아직 SSD1에 살아있으므로 언제든 돌아갈 수 있다.

---

## Phase 5: 데비안을 SSD1으로 이전

SSD2의 데비안이 정상 동작하면, 이제 SSD1(아치)을 밀고 데비안을 옮긴다.

### SSD1 파티션 정리

```bash
wipefs -a /dev/nvme0n1

gdisk /dev/nvme0n1
# p1: 1G EFI (EF00) — 서버 용도라 넉넉하게
# p2: 나머지 Linux filesystem (8300)

mkfs.fat -F32 /dev/nvme0n1p1
mkfs.ext4 /dev/nvme0n1p2
```

> 서버라면 LVM을 고려할 수 있다. 나중에 파티션 크기를 유연하게 조절할 수 있어서 편하다. 이 글에서는 단순하게 EFI + root로 진행한다.

### rsync로 시스템 복사

dd로 디스크를 통째로 복사하는 것보다 rsync가 깔끔하다. 파티션 크기가 달라도 상관없고, UUID만 맞춰주면 된다.

```bash
mount /dev/nvme0n1p2 /mnt/ssd1
mkdir -p /mnt/ssd1/boot/efi
mount /dev/nvme0n1p1 /mnt/ssd1/boot/efi

rsync -aAXv \
  --exclude={"/dev/*","/proc/*","/sys/*","/tmp/*","/run/*","/mnt/*","/media/*"} \
  / /mnt/ssd1/
```

- `-aAX`: 아카이브 모드 + ACL + 확장 속성 보존
- `--exclude`: 가상 파일시스템과 마운트 포인트 제외

### fstab + 부트로더 수정

rsync로 복사하면 fstab에 SSD2의 UUID가 들어있다. SSD1의 UUID로 바꿔야 한다.

```bash
blkid /dev/nvme0n1p1 /dev/nvme0n1p2
```

출력된 UUID로 `/mnt/ssd1/etc/fstab`을 수정한다.

그 다음 chroot로 부트로더를 재설치한다.

```bash
mount --bind /dev  /mnt/ssd1/dev
mount --bind /proc /mnt/ssd1/proc
mount --bind /sys  /mnt/ssd1/sys
mount --bind /sys/firmware/efi/efivars /mnt/ssd1/sys/firmware/efi/efivars

chroot /mnt/ssd1 /bin/bash

grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=debian
update-grub

exit
umount -R /mnt/ssd1
```

### SSD1으로 부팅

재부팅 후 UEFI에서 SSD1을 선택한다. 정상 부팅되면 이전 완료다.

---

## Phase 6: 서버 초기 설정

SSD1에서 데비안이 잘 돌면 서버 초기 설정을 진행한다. SSD2는 밀고 데이터 디스크나 Docker volume 용도로 쓰면 된다.

### 기본 설정

```bash
apt update && apt upgrade -y
apt install -y curl wget git vim sudo ufw htop tmux

timedatectl set-timezone Asia/Seoul
dpkg-reconfigure locales  # en_US.UTF-8, ko_KR.UTF-8
```

### SSH 보안

클라이언트에서 SSH 키를 복사한다.

```bash
ssh-copy-id user@server-ip
```

서버의 `/etc/ssh/sshd_config`를 수정한다.

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
systemctl restart sshd
```

비밀번호 인증을 끄고 키 인증만 허용하면 무차별 대입 공격을 차단할 수 있다.

### 방화벽

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw enable
```

### Docker 설치

```bash
apt install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

usermod -aG docker $USER
```

로그아웃 후 다시 로그인하면 일반 사용자로 docker 명령을 사용할 수 있다.

### 추가 고려사항

- **고정 IP**: 서버이므로 DHCP 대신 고정 IP 권장. `/etc/network/interfaces`에서 설정한다
- **자동 업데이트**: `unattended-upgrades` 패키지로 보안 업데이트를 자동 적용할 수 있다
- **모니터링**: Portainer, Netdata, Grafana 등을 Docker로 올릴 수 있다
- **리버스 프록시**: Nginx Proxy Manager 또는 Traefik으로 Docker 서비스를 외부에 노출할 수 있다

---

## 작업 순서 요약

| 단계 | 환경 | 작업 |
|------|------|------|
| 1 | 아치 (SSD1) | 디스크 파악, HDD 마운트, debootstrap 설치 |
| 2 | 아치 (SSD1) | dd로 SSD1 → HDD 아카이빙 |
| 3 | 아치 (SSD1) | SSD2 윈도우 삭제 + debootstrap으로 데비안 설치 |
| 4 | — | 재부팅 → SSD2 데비안 부팅 확인 |
| 5 | 데비안 (SSD2) | SSD1 파티션 정리 + rsync로 데비안 이전 |
| 6 | — | 재부팅 → SSD1 데비안 최종 부팅 |
| 7 | 데비안 (SSD1) | SSD2 정리 + 서버 초기 설정 |
