---
title: "macOS에서 한글 파일명이 깨지는 이유(NFD)"
slug: macos-korean-nfd
created: 2026-02-07
category: etc
type: [til]
tags: []
---

## 증상

macOS에서 만든 한글 파일명이 Windows나 Linux, 또는 일부 프로그램에서 자모가 분리되어 보이는 현상이 있다.
예를 들어 `김범수 - 지나간다.opus`가 `ㄱㅣㅁㅂㅓㅁㅅㅜ - ㅈㅣㄴㅏㄱㅏㄴㄷㅏ.opus`처럼 풀어져서 표시된다.

맥의 Finder에서 파일명을 한글로 변경했을 때 이런 현상이 발생하고, 터미널에서 `ls`로 출력해보면 글자가 깨져서 나온다.
터미널에서 `mv`로 변경했을 때는 발생하지 않았다. 

## 원인: 유니코드 정규화 (NFC vs NFD)

유니코드는 같은 글자를 표현하는 두 가지 방식을 정의하고 있다.

### NFC (Normalization Form Composed) — 완성형

한글을 **완성된 한 글자**로 저장하는 방식이다.

```
"한" = U+D55C (1개의 코드 포인트)
```

Windows, Linux 등 대부분의 시스템이 이 방식을 사용한다.

### NFD (Normalization Form Decomposed) — 분해형

한글을 **초성 + 중성 + 종성**으로 분해하여 저장하는 방식이다.

```
"한" = ㅎ(U+1112) + ㅏ(U+1161) + ㄴ(U+11AB) (3개의 코드 포인트)
```

macOS의 파일시스템(APFS, HFS+)이 이 방식을 사용한다.

### 비교

| | NFC (완성형) | NFD (분해형) |
|---|---|---|
| `한` 저장 방식 | `U+D55C` (1개) | `U+1112 U+1161 U+11AB` (3개) |
| 사용 환경 | Windows, Linux | macOS |
| 눈에 보이는 차이 | 없음 (같은 글자로 렌더링) | 없음 (같은 글자로 렌더링) |
| 바이트 수 | 적다 | 많다 |

눈으로 보기에 같은 글자이지만 내부적으로 다른 바이트 시퀀스이기 때문에, NFD를 지원하지 않는 환경에서는 자모가 풀어져서 보이게 된다.

## 확인 방법

Python으로 파일명의 정규화 형태를 확인할 수 있다.

```python
import os, unicodedata

for f in os.listdir('/path/to/dir'):
    is_nfc = unicodedata.is_normalized('NFC', f)
    print(f'NFC={is_nfc}  {f}')
```

macOS에서 생성한 한글 파일명은 대부분 `NFC=False`로 표시된다.

## 해결 방법

NFD로 저장된 파일명을 NFC로 변환하면 된다.

### Python (macOS 기본 설치)

```bash
python3 -c "
import os, unicodedata
path = '/path/to/dir'
for f in os.listdir(path):
    nfc = unicodedata.normalize('NFC', f)
    if f != nfc:
        os.rename(os.path.join(path, f), os.path.join(path, nfc))
        print('변환:', nfc)
"
```

### convmv (전용 도구)

```bash
# 설치
brew install convmv

# 미리보기 (실제 변환하지 않음)
convmv -f utf8 -t utf8 --nfc /path/to/dir/*

# 실제 변환
convmv -f utf8 -t utf8 --nfc --notest /path/to/dir/*
```

Python은 macOS에 기본 포함되어 있어서 별도 설치 없이 바로 사용할 수 있다.
convmv는 Homebrew 설치가 필요하지만 명령어가 더 간결하다.
