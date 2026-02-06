---
title: "도커 컨테이너 접속"
slug: docker-container-access
created: 2025-04-23
category: docker
tags: []
---

```bash
docker exec -it [container id/name] [shell type]
```

- `-i`(`--interactive`): 표준 입력(stdin)으로 컨테이너와 상호작용
- `-t`(`--tty`): 가상 터미널(TTY) 할당

예) `docker exec -it mysql-container bash`

> 주의: 컨테이너에 bash가 없는 경우도 많다. (alpine 등) sh는 대부분 있다.