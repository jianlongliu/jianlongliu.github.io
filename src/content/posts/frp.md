---
title: '基于 FRP 的微软远程协助简单实现'
published: 2024-08-31 17:56:51
tags: [Linux, remote]
category: IT
draft: false
---

    frp 是一个专注于内网穿透的高性能的反向代理应用，支持 TCP, UDP, HTTP, HTTPS 等多种协议. 可以将内网服务以安全, 便捷的方式通过具有公网 IP 节点的中转暴露到公网.

>  下载地址: https://github.com/fatedier/frp/releases

## 服务端配置

服务端 `frps.ini`

```ini
[common]
bind_port = 7000
bind_udp_port = 7000

vhost_http_port = 80
vhost_https_port = 443

tcp_mux = true         #多路复用 
compress = true        #压缩
```

手动执行 `./frps -c frps.ini` 测试, 如果测试成功注册为systemctl 守护进程

手动创建 `sudo touch /etc/systemd/system/frps.service`

```
[Unit]
Description=frp server
After=network.target syslog.target
Wants=network.target

[Service]
Type=simple
ExecStart=<绝对路径>/frps -c <绝对路径>/frps.ini

[Install]
WantedBy=multi-user.target
```

 随开机自启动和手动启动`frps.service`

```
systemctl enable frps
systemctl start frps
```

## 客户端配置

客户端 `frpc.ini`

```ini
[common]
server_addr = <远程主机ip>
server_port = 7000
tcp_mux = true     #多路复用 
compress = true    #压缩

[RDP]              
type = tcp
local_ip = 127.0.0.1
local_port = 3389
remote_port = 6000
```

手动执行`frpc -c frpc.ini`用另外一台Windows 设备mstsc 输入测试 `<公网IP>:remote_port`。

如果没有问题就设置为开机自启动或计划任务，搜索引擎自行搜索

> FRP 文档
> 
> https://gofrp.org/docs/
