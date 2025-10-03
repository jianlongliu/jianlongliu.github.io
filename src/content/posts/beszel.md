---
title: '部署beszel'
published: 2024-11-14 10:28:49
description: ''
image: 'https://beszel.dev/image/home-dashboard.png'
tags: [docker, beszel]
category: 'IT'
draft: false 
lang: ''
---

# 在docker compose 部署beszel 面板

## 部署beszel hub

```yml
services:
  beszel:
    image: 'henrygd/beszel'
    container_name: 'beszel'
    restart: unless-stopped
    ports:
      - '8090:8090'
    volumes:
      - ./beszel_data:/beszel_data
```

>**注意**: macOS 默认不支持 Docker 容器的 `network_mode: host` 配置。`host` 网络模式允许容器直接使用主机的网络接口，这种方式在 Linux 环境下很常见，因为容器和主机共享同一网络命名空间。但 macOS 和 Windows 的 Docker 架构不同，它们使用虚拟机来运行容器环境，无法直接访问主机的网络栈，因此不支持 `host` 网络模式
>
>[GitHub](https://github.com/henrygd/beszel/blob/main/supplemental/docker/agent/docker-compose.yml)和[Xiao Z's Blog](https://en.xiaoz.org/post/21383)

## 在docker 部署beszel-agent (不推荐)

在docker-compose 下部署只能监听容器状态, 不推荐

```yml
services:
  beszel-agent:
    image: "henrygd/beszel-agent"
    container_name: "beszel-agent"
    restart: unless-stopped
    ports:
      - '45876:45876'
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    environment:
      PORT: 45876
      KEY: "<key>"
```

## 或在物理机部署agent

从release页面下载agent 并运行
`PORT=45876 KEY="{PASTE_YOUR_KEY}" ./beszel-agent`

> ⚠️注意: 如果多次运行不成功, 可能是docker desktop 下删除容器, 在目录下重新`docker-compose up -d`
> 项目地址 https://github.com/henrygd/beszel



### 交给launchd 管理

如果测试没有任何问题, 接下来把它加入到launchd 服务中

在 ~/Library/LaunchAgents/下创建 com.yourname.beszel-agent.plist

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.jianlong.beszel.agent</string>
    
    <key>ProgramArguments</key>
    <array>
        <string>/Users/jianlongliu/App/beszel/beszel-agent</string>
    </array>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PORT</key>
        <string>45876</string>
        <key>KEY</key>
        <string>"your-key"</key>
    </dict>

    <key>RunAtLoad</key>
    <true/>

    <key>KeepAlive</key>
    <dict>
        <key>SuccessfulExit</key>
        <true/>
    </dict>

    <key>ThrottleInterval</key>
    <integer>10</integer>

    <key>StandardOutPath</key>
    <string>/tmp/beszel-agent.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/beszel-agent-error.log</string>

    <key>MachServices</key>
    <dict>
        <key>com.jianlong.beszel.agent</key>
        <true/>
    </dict>
</dict>
</plist>

```

> **⚠️注意**：
>
> - 将 `/path/to/beszel-agent` 替换为 `beszel-agent` 实际的完整路径。
> - `Label` 可以自定义，但通常建议使用反向域名格式。
> - `RunAtLoad` 确保服务在加载时启动，`KeepAlive` 确保服务保持后台运行。



#### 加载 `launchd` 服务

保存文件后，在终端中加载该服务：

```zsh
launchctl load ~/Library/LaunchAgents/com.yourname.beszel-agent.plist
```

如果一切正确，`beszel-agent` 将会在后台运行，并且会在系统启动时自动加载。



#### 管理 `launchd` 服务

- **卸载服务**：`launchctl unload ~/Library/LaunchAgents/com.yourname.beszel-agent.plist`
- **重新加载服务**：可以先卸载再加载，也可以用 `launchctl kickstart` 进行重启。



#### 检查服务状态

使用以下命令查看服务日志，确认其是否正确运行：

```zsh
log show --predicate 'process == "beszel-agent"' --info --last 1h
```

这样设置后，`beszel-agent` 会作为后台服务在 macOS 上自动启动并运行。