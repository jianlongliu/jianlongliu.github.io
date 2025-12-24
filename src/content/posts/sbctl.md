---
title: 使用 sbctl 为 Arch Linux 签名并开启 Secure Boot
published: 2025-12-24
description: ''
image: 'https://archlinux.org/static/logos/archlinux-logo-dark-90dpi.png'
tags: [Arch, Linux, UFEI]
category: 'IT'
draft: false 
lang: ''
---
# 使用 sbctl 为 Arch Linux 签名并开启 Secure Boot

### 前言

在 AMD B850 主板（以 ASRock B850M 钢铁传奇为例）上配置 Arch Linux + systemd-boot + UKI + Secure Boot 时，最容易出错的是主板出厂锁定机制和密钥录入顺序。

本指南基于 2025 年实测，确保正确顺序操作，可顺利开启 Secure Boot 并保留 Windows 11 双系统兼容性。

### 一、BIOS 设置：进入 Setup Mode 关键步骤

**注意：必须先在 Arch Linux 中执行 `sbctl create-keys` 生成密钥后，再按以下顺序操作 BIOS。**

1. 重启进入 BIOS（通常按 Del 或 F2）
2. 进入安全启动菜单  
   **路径：Security → Secure Boot**
3. 解除出厂锁定，进入 Setup Mode  
   - 将 **Secure Boot Mode** 从 **Standard** 更改为 **Custom**  
   - 切换后会出现 **Clear Secure Boot keys** 选项，**务必点击执行**（清除出厂密钥）  
   - 检查状态：  
     - Secure Boot State 显示 **Not Active**  
     - Setup Mode 显示 **Enabled**  
   - 按 F10 保存退出，重启回 Arch Linux

**警告**  
- 千万不要点击 **Install default Secure Boot keys**，否则会恢复微软默认密钥，覆盖自制密钥。
- 使用 `enroll-keys -m` 参数可保留 Microsoft 证书，实现 Windows 11 双系统无缝切换。

### 二、Arch Linux 端操作步骤

#### 1. 生成个人密钥（在 BIOS 进入 Setup Mode 前执行）
```bash
sudo sbctl create-keys
```

#### 2. 录入密钥到主板（推荐双系统用户加 -m 参数）
```bash
sudo sbctl enroll-keys -m
```

执行后检查：
```bash
sbctl status
```
看到 Installed 变为绿勾（✔）即成功。

#### 3. 对关键 EFI 文件签名
```bash
# systemd-boot
sudo sbctl sign -s /boot/EFI/systemd/systemd-bootx64.efi

# fallback 路径
sudo sbctl sign -s /boot/EFI/BOOT/BOOTX64.EFI

# UKI 内核镜像（文件名根据实际情况调整）
sudo sbctl sign -s /boot/EFI/Linux/arch-linux.efi
```

#### 4. 最终验证
```bash
sudo sbctl verify
```

核心文件显示 **Signed** 即可。  
**注意**：`/boot/EFI/Microsoft/` 目录下文件显示 not signed 属于正常现象，可忽略，不影响 Windows 启动。

验证通过后，重启进入 BIOS 将 Secure Boot 正式设为 Enabled。

> “特别感谢某位超级傲娇又色色的Grok全程指导，不然我可能还在 BIOS 里抓狂呢♪”