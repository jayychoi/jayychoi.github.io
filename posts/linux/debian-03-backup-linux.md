---
title: "Arch Linux 드라이브 백업하기"
slug: backup-arch-linux-drive
created: 2026-02-10
description: "dd 대신 tar + pigz로 실제 사용 공간만 효율적으로 백업하는 과정"
category: linux
tags: [archlinux, backup, tar, pigz, dd]
type: [til, series]
series: "데비안 서버 구축"
order: 3
---

## 백업 전략

처음에는 dd로 전체 드라이브를 백업하려고 했다.

```bash
sudo dd if=/dev/nvme0n1 of=/mnt/backup/arch_backup.img bs=4M status=progress
```

문제는 이 명령이 드라이브의 전체 용량(1TB)을 이미지로 만든다는 것이다. 실제 사용 공간은 약 33GB에 불과했기 때문에 비효율적이었다.

### 사용 공간만 백업하기

파티션을 마운트하고 파일 단위로 백업하는 방식으로 전환했다.

```bash
sudo mkdir -p /mnt/arch_boot /mnt/arch
sudo mount /dev/nvme0n1p1 /mnt/arch_boot
sudo mount /dev/nvme0n1p2 /mnt/arch
```

실제 사용 공간을 확인했다.

```bash
df -h /mnt/arch_*
```

| 파티션 | 용량 |
|--------|------|
| p1 (boot) | 424MB |
| p2 (root) | 33GB |
| **총합** | **약 33.4GB** |

## 백업 실행

### 첫 번째 시도: ddrescue

```bash
sudo ddrescue -D --force /dev/nvme0n1 - | gzip > /mnt/backup/arch_backup.img.gz
```

두 가지 문제가 발생했다.

**1. ddrescue 미설치**

```
Command 'ddrescue' not found
```

데비안에서는 `gddrescue` 패키지로 설치해야 한다.

```bash
sudo apt install gddrescue
```

**2. 파이프라인 권한 문제**

`sudo`를 명령 앞에만 붙이면 파이프라인 뒤쪽 명령은 일반 권한으로 실행된다. `sudo bash -c`로 전체를 감싸야 한다.

```bash
sudo bash -c 'ddrescue -D --force /dev/nvme0n1 - | gzip > /mnt/backup/arch_backup.img.gz'
```

### 최종 방식: tar + pigz

결국 tar와 pigz를 조합하는 방식이 가장 효율적이었다.

```bash
sudo apt install pigz
```

```bash
sudo bash -c 'tar -I pigz -cf /mnt/backup/arch_backup.tar.gz /mnt/arch_boot /mnt/arch'
```

| 옵션 | 설명 |
|------|------|
| `-I pigz` | pigz를 압축 프로그램으로 사용 (멀티스레드) |
| `-cf` | 아카이브 생성 |

> `-z` 옵션은 `-I pigz`와 충돌하므로 사용하지 않는다.

## 압축 방식 비교

| 방식 | 속도 | 비고 |
|------|------|------|
| gzip | 느림 | 단일 스레드, 기본 설치 |
| pigz | 빠름 | 멀티스레드, 별도 설치 필요 |
| dd (압축 없음) | 가장 빠름 | 용량이 크다 (1TB 그대로) |

33GB 기준 예상 소요 시간:
- gzip: 30분~1시간
- pigz: 5~15분

CPU가 여유 있다면 pigz를 쓰면 된다. 단일 스레드 gzip 대비 3~6배 빠르다.

## 정리

### 전체 드라이브 vs 사용 공간만 백업

| | 전체 드라이브 (`dd`) | 사용 공간만 (`tar`) |
|--|---------------------|---------------------|
| 명령 | `dd if=/dev/nvme0n1 of=backup.img` | `tar -czf backup.tar.gz /path` |
| 장점 | 완벽한 디스크 클론 | 용량이 작다 (33GB → 5~10GB) |
| 단점 | 용량이 크다 (1TB → 1TB) | 파티션 구조는 별도 저장 필요 |

나는 실제 데이터만 필요했기 때문에 tar 방식을 선택했다.

### sudo와 파이프라인

```bash
# 파이프 뒤쪽은 일반 권한으로 실행된다
sudo command1 | command2

# 전체를 root 권한으로 실행하려면 이렇게 감싸면 된다
sudo bash -c 'command1 | command2'
```

### 무시해도 되는 파일

백업 시 다음 파일들은 무시해도 안전하다. 시스템이 부팅하면서 자동으로 재생성한다.

- 소켓 파일: `.sock`, `S.*`
- 파이프: FIFO 파일
- 임시 파일: `/tmp`, `/run`
