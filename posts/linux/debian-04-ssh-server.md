---
title: "SSH 서버 설정 및 보안 강화"
slug: debian-ssh-server-setup
created: 2026-02-11
description: "SSH 키 인증, 포트 변경, UFW, Fail2Ban, 자동 업데이트까지 헤드리스 서버 보안 설정 과정"
category: linux
tags: [debian, ssh, ufw, fail2ban, tailscale, security]
type: [til, series]
series: "데비안 서버 구축"
order: 4
---

최종 목표는 그래픽카드를 제거하고 SSH로만 접속하는 24시간 헤드리스 서버다.

## SSH 키 인증 설정

비밀번호 대신 키 인증으로 접속하도록 설정했다.

- **공개키 (public key)** → 서버에 설치
- **비밀키 (private key)** → 접속하는 쪽(Mac mini)이 보관

Mac mini에서 키를 생성하고 공개키만 서버로 복사하는 구조다.

### 키 생성 (Mac mini에서)

```bash
ssh-keygen -t ed25519
```

`ed25519`는 RSA에 비해 키가 짧으면서도 보안성이 좋고 속도가 빠르다. 특별한 이유가 없다면 이걸 쓰면 된다.

실행하면 passphrase를 묻는데, 비밀키에 거는 추가 비밀번호다. 설정하면 비밀키 파일이 탈취되더라도 passphrase 없이는 사용할 수 없다. macOS는 키체인이 기억해주므로 설정을 권장한다.

### 서버 IP 확인 (데비안에서)

```bash
hostname -I
```

내 경우 `172.30.1.87`이 나왔다. `192.168.x.x`가 아니라 의아했지만, `172.16.0.0/12` 대역도 정상적인 사설 IP다.

### 공개키 복사

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub jay@172.30.1.87
```

키가 여러 개인 경우 `-i` 옵션으로 어떤 공개키를 보낼지 지정할 수 있다. 하나만 있다면 생략해도 된다.

### 문제 발생: No route to host

```
ssh: connect to host 172.30.1.87 port 22: No route to host
```

Mac mini에서 서버로 도달하지 못하는 상황이었다. 확인한 것들:

- Mac mini도 `172.30.1.x`로 동일 대역
- 데비안에서 게이트웨이로 ping → `Destination Host Unreachable`
- SSH 서버 상태 정상, 인터페이스 `state UP`, `ip route show` 정상

네트워크 설정에 문제가 없었는데, 잠시 후 갑자기 양쪽 ping이 통하기 시작했다. 랜케이블 접촉 불량이거나 네트워크가 일시적으로 불안정했던 것으로 추정된다. 소프트웨어만 의심하지 말고 물리적 연결 상태도 확인해야 한다.

이후 `ssh-copy-id`가 정상 완료되었고, 키 인증으로 접속에 성공했다.

## SSH 보안 강화

`/etc/ssh/sshd_config`를 수정한다. 수정 전에 반드시 백업해둔다.

```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak
sudo nano /etc/ssh/sshd_config
```

변경한 항목들:

```
Port [랜덤 포트]
PermitRootLogin no
PasswordAuthentication no
MaxAuthTries 3
AllowUsers jay
```

| 항목 | 설명 |
|------|------|
| Port | 기본 22번 대신 1024~65535 사이 랜덤 포트로 변경. 봇 공격 대부분이 22번을 노리므로 변경만으로 불필요한 시도를 줄일 수 있다. 보안이라기보다 소음 줄이기에 가깝고, 실제 보안은 키 인증이 담당한다 |
| PermitRootLogin no | root 계정으로 SSH 접속 차단 |
| PasswordAuthentication no | 비밀번호 로그인 차단. 키 인증만 허용 |
| MaxAuthTries 3 | 인증 3회 실패 시 연결 종료. 재접속 자체는 막지 못하므로 Fail2Ban과 함께 써야 효과적 |
| AllowUsers jay | 지정한 사용자만 SSH 접속 허용. 기본으로 없는 항목이라 직접 추가했다 |

```bash
sudo systemctl restart sshd
```

> 설정 변경 후 기존 SSH 세션은 유지한 채, 새 터미널에서 변경된 포트로 접속 테스트를 해야 한다. 기존 세션을 먼저 끊으면 설정 오류 시 서버에 접속할 방법이 없다.

```bash
ssh -p [변경한 포트] jay@172.30.1.87
```

## 방화벽 (UFW) 설정

UFW(Uncomplicated Firewall)는 리눅스 방화벽을 간편하게 관리하는 도구다.

```
UFW / firewalld        ← 사용하기 쉬운 도구
    ↓
iptables / nftables    ← 세밀한 규칙 설정 도구
    ↓
netfilter              ← 리눅스 커널의 패킷 필터링 엔진
```

개인 서버 용도로는 UFW로 충분하다.

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow [변경한 SSH 포트]/tcp
sudo ufw enable
```

모든 인바운드 트래픽을 차단하고, SSH 포트만 허용하는 설정이다. 이후 서비스를 추가할 때 필요한 포트를 열면 된다.

## Fail2Ban 설정

Fail2Ban은 반복적으로 로그인에 실패하는 IP를 자동으로 차단하는 도구다. MaxAuthTries가 단일 연결의 실패를 제한한다면, Fail2Ban은 IP 자체를 차단한다.

```bash
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

`[sshd]` 섹션을 수정한다.

```ini
[sshd]
enabled = true
port = [변경한 SSH 포트]
maxretry = 3
bantime = 86400
findtime = 3600
```

| 항목 | 값 | 설명 |
|------|-----|------|
| maxretry | 3 | 3번 실패 시 차단 |
| bantime | 86400 | 24시간 차단 |
| findtime | 3600 | 1시간 내 실패 횟수 기준 |

키 인증만 사용하고 접속자가 본인뿐이므로 강하게 설정해도 문제없다.

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd
```

## 자동 보안 업데이트

24시간 운영하는 서버는 보안 패치를 직접 챙기기 어렵다.

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## 그래픽카드 제거 및 헤드리스 운영

데비안을 최소 설치했으므로 데스크톱 환경이 없어 별도 설정은 필요 없었다. 서버를 종료하고 그래픽카드를 물리적으로 제거했다.

```bash
sudo shutdown -h now
```

재부팅 후 모니터 없이도 SSH 서버는 자동으로 시작된다.

> GPU 제거 후 부팅이 안 되는 경우, BIOS에서 "Halt on errors" 설정을 "No errors"로 변경해야 할 수 있다. 메인보드 내장 GPU 포트에 모니터를 연결해서 확인하면 된다.

## 외부 접속 (Tailscale)

집 밖에서 서버에 접속하려면 공유기 포트포워딩 대신 Tailscale을 사용하면 된다. SSH 포트를 인터넷에 직접 노출하지 않으면서 어디서든 접속할 수 있다.

**데비안 서버:**

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

**Mac mini:**

Tailscale 앱을 설치하고 같은 계정으로 로그인하면, 각 기기에 `100.x.x.x` 대역의 IP가 할당된다.

```bash
ssh -p [변경한 포트] jay@100.x.x.x
```

## 잡다한 팁

### sudo 실행 시 "unable to resolve host" 경고

`sudo` 명령마다 경고가 출력되었다. `/etc/hosts`에 호스트네임이 등록되지 않아서 발생하는 문제다.

```
127.0.1.1       debian
```

위 한 줄을 `/etc/hosts`에 추가하면 해결된다.

### 서버 IP 고정

공유기 관리 페이지에서 서버의 MAC 주소에 IP를 고정(DHCP 예약)해두면, 재부팅 시 IP가 바뀌는 일을 방지할 수 있다.

## 보안 설정 요약

| 항목 | 설정 |
|------|------|
| SSH 인증 | ed25519 키 인증만 허용, 비밀번호 로그인 차단 |
| SSH 포트 | 기본 22번에서 랜덤 포트로 변경 |
| 접속 제한 | 특정 사용자만 SSH 접속 허용 (AllowUsers) |
| 방화벽 | UFW로 SSH 포트만 개방, 나머지 인바운드 차단 |
| 침입 차단 | Fail2Ban으로 로그인 실패 IP 자동 차단 (24시간) |
| 시스템 업데이트 | unattended-upgrades로 보안 패치 자동 적용 |
| 외부 접속 | Tailscale VPN으로 포트 노출 없이 접속 |
