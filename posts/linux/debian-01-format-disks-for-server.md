---
title: "서버용 디스크 포맷"
slug: format-disks-for-server
created: 2026-02-10
category: linux
tags: [ext4, mkfs, fdisk, debian]
type: [til, series]
series: "데비안 서버 구축"
order: 1
---

## 외장하드 포맷

기존에 사용하던 하드가 12년째 되니 배드 섹터가 많이 생겨서 새 하드를 구매했다. 블랙 프라이데이 때 아마존에서 WD Elements 14TB를 28만원에 구매했고, 하드를 적출해서 사용할 생각이다.

이 하드는 기본 포맷이 exFAT여서 리눅스에서 사용하기 위해 ext4로 포맷하기로 했다.

### 디스크 확인

포맷할 하드를 식별한다.

```bash
sudo fdisk -l
```

`/dev/sdb`로 연결되어 있었다.

### ext4로 포맷

```bash
sudo mkfs.ext4 /dev/sdb1
```

## SSD 포맷

중요한 데이터는 전부 윈도우가 설치된 드라이브에 있었다. 외장하드를 포맷한 뒤 데이터를 외장하드로 옮기고, 윈도우 드라이브도 포맷했다.

> 포맷하려면 반드시 마운트를 해제해야 한다. (`sudo umount <path>`)

### 파티션 정리

윈도우 드라이브는 4개의 파티션으로 나뉘어 있었다. GPT 파티션 테이블을 새로 생성해서 하나로 통합했다.

```bash
sudo fdisk /dev/nvme0n1

# g: GPT 파티션 테이블 생성
# n: 새 파티션 생성
# 엔터 여러 번: 기본값으로 진행
# w: 저장
```

### ext4로 포맷

외장하드와 같은 방식으로 포맷한다.

```bash
sudo mkfs.ext4 /dev/nvme0n1p1
```

### 확인

`blkid`를 실행했을 때 `TYPE="ext4"`가 표시되면 정상이다.

```bash
sudo blkid /dev/nvme0n1p1
```
