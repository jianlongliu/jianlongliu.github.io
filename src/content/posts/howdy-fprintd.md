---
title: 为 Arch Linux 实现指纹识别和面部解锁
published: 2026-06-02
description: ''
image: ''
tags: [Linux, Arch]
category: ''
draft: false 
lang: ''
---
# 为 Arch Linux 实现指纹识别和面部解锁

由于指纹识别模块进程抢占, 锁屏时摄像头识别人脸解锁，sudo 时按指纹代替输密码更佳

## 环境

OS: Arch Linux

DM: greetd + dms-greeter

WM: niri + dms

Bio: howdy + fprintd

HW: Lenovo ThinkPad X1 Carbon Gen 9

## 一、howdy 人脸解锁

### 安装

`sudo pacman -S howdy`

### 配置文件

默认配置下 `device_path = none`，摄像头根本不知道去哪找。改成：

```ini
# /lib/security/howdy/config.ini

device_path = /dev/video0
recording_plugin = opencv # 默认是 opencv，别手贱改 ffmpeg
capture_failed = false # 关掉快照，避免权限问题
capture_successful = false
certainty = 3.5 # 精度，越低越松
timeout = 4 # 识别超时秒数
```

```
# /etc/pam.d/dankshell
# 锁屏用，加 howdy

auth sufficient pam_python3.so /lib/security/howdy/pam.py
auth [success=1 default=bad] pam_unix.so try_first_pass nullok
```

绝对不要把 howdy 加到 system-auth！ greetd 启动也会经过 system-auth，加上去 greetd 直接崩到起不来，血泪教训。

### Python 3 兼容

Arch 的 pam_python3.so 用 Python 3 跑脚本，但 howdy 的 pam.py 是 Python 2 写法：

#### ❌ 原版 Python 2

```py
import ConfigParser
config = ConfigParser.ConfigParser()
```

#### ✅ 兼容写法

```py
try:
 import ConfigParser as configparser
except ImportError:
 import configparser
config = configparser.ConfigParser()
```

录入人脸 `sudo howdy add`
然后锁屏测试，脸对准摄像头，4 秒内识别成功自动解锁。

## 二、fprintd 指纹 sudo

### 安装与录入

```bash
sudo pacman -S fprintd
fprintd-enroll -f right-index-finger # 或 right-middle-finger
```

录入小提示：每次扫描后一定要完全抬起手指，微调位置再放回去，否则会报 enroll-duplicate——这不是真有重复指纹，而是传感器觉得你两次位置一模一样。

### PAM 配置

```
# /etc/pam.d/sudo
auth sufficient pam_fprintd.so
auth include system-auth
```

指纹只在 sudo 时生效，不跟锁屏抢硬件，互不干扰。

## 三、最终效果

| 场景         | 方式           | 状态              |
| ---------- | ------------ | --------------- |
| 🔒 锁屏解锁    | 摄像头人脸识别      | 自动解锁            |
| 🔑 sudo 提权 | 指纹验证         | 通过              |
| 🚀 开机首次登录  | 手动输密码        | greetd 不走锁屏 PAM |
| ⌨️ 兜底      | 识别失败了正常输密码就行 |                 |

## 总结

1. PAM 文件别乱改——搞清楚你的 DM 锁屏走哪个 PAM 服务，不是所有场景都用 system-auth
2. 模块名要对——pam_python.so ≠ pam_python3.so
3. Python 2/3 兼容——Arch 的 howdy 包还没修这个问题，得手动改
4. 硬件是分开的——摄像头和指纹传感器各走各路，配置好 PAM 路径就不会打架
5. 打完快照再跑路——`sudo snapper --config root create --description "howdy + fprintd"`和`sudo snapper --config home create --description "howdy + fprintd"`

> Jianlong Liu: 最近都在用AI Agent debug 不知道这个过时没, 希望能帮助到人~