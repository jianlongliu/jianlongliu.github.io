---
title: 在Mac Mini 上部署 code-server
published: 2025-10-31
description: ''
image: './vscode.png'
tags: [Documents]
category: 'IT'
draft: false 
lang: ''
---

# The open source AI code editor

## 环境准备

在开始部署前，请确保满足以下前置条件：

- **[Homebrew](https://brew.sh)** - macOS 包管理器
- **清华大学镜像源** - [配置指南](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/)，加速国内下载
- **网络环境** - 建议配备稳定的网络访问工具，确保依赖包正常安装

## Code-Server 部署方案

> 💡 **架构建议**：对于项目专属的开发环境，推荐使用容器化部署，具备更好的环境隔离和可移植性。

### 🐳 容器化部署（推荐）

基于 [linuxserver/code-server](https://hub.docker.com/r/linuxserver/code-server) 镜像的 Docker Compose 方案：

```yaml
services:
  code-server:
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
      - PASSWORD=passwd
      - SUDO_PASSWORD=password
      - DEFAULT_WORKSPACE=/config/workspace
    volumes:
      - ./code-server/config:/config
    ports:
      - 8443:8443
    restart: unless-stopped
```

**部署命令**：
```bash
docker compose up -d
```

**配置说明**：
- 将 `./code-server/config` 替换为你的本地配置目录
- 首次启动后可通过 `https://localhost:8443` 访问
- 默认工作区位于容器的 `/config/workspace` 目录

### 💻 物理机部署

适用于直接安装在 macOS 系统上的场景：

```bash
# 通过 Homebrew 安装
brew install code-server

# 启动服务并设置为开机自启
brew services start code-server
```

### ⚙️ 服务配置

编辑配置文件 `~/.config/code-server/config.yaml`：

```yaml
bind-addr: 0.0.0.0:8080
auth: password
password: passwd
cert: false
```

### 📝 重要提醒

- **配置生效**：修改配置后需执行 `brew services restart code-server` 重启服务
- **网络访问**：`bind-addr` 设置为 `0.0.0.0`，使用 `127.0.0.1` 无法从外部网络访问
- **安全考虑**：生产环境建议启用 TLS 证书加密通信
