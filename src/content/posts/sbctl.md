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

> **2026-10 补充**：第一节（BIOS / 密钥）对 systemd-boot 和 Limine 通用，两者差别只在「该签哪些文件」。用 Limine 的话请接着看第三节，它和第二节的清单不一样。

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

### 三、Limine 引导器怎么签（2026-10 补充）

Limine 的思路和 systemd-boot **不一样**，照抄第二节会开不了机。三点差异先记住：

- systemd-boot 是「引导器 + UKI」都由你签，内核/initramfs 由 sbctl 的 pacman hook 顺带处理；
- Limine 自己还有一层**配置校验和**（把 `limine.conf` 的 BLAKE2b 哈希嵌进 Limine 二进制），是可选加固；
- 用 UKI 时，**Limine 不会替内核验签**——它是 `protocol: efi` 的 **chainload**，真正校验签名的是**固件**。所以 UKI 自己必须被签，漏签就是开机直接失败。

#### 1. 要签哪些文件

| 文件 | 为什么 |
|---|---|
| `/boot/EFI/limine/limine_x64.efi` | Limine 本体，UEFI 引导项指向它 |
| `/boot/EFI/BOOT/BOOTX64.EFI` | UEFI fallback 路径——很多主板实际是从这里启动的，别漏 |
| `/boot/EFI/Linux/*.efi` | UKI，被 Limine chainload，签名要由固件认得 |

```bash
# Limine 本体
sudo sbctl sign -s /boot/EFI/limine/limine_x64.efi

# UEFI fallback 路径
sudo sbctl sign -s /boot/EFI/BOOT/BOOTX64.EFI

# UKI（文件名按实际改）
sudo sbctl sign -s /boot/EFI/Linux/arch-linux.efi
```

一定要带 `-s`，把文件注册进 sbctl 数据库——不带只签这一次，下次升级就白干了。

#### 2. 两个必踩的坑

**坑一：每次 `limine-update` 都会把 fallback 覆盖成未签名版。**
用 `limine-entry-tool` 那套（`limine-mkinitcpio-hook` / `limine-dracut-support`）时，只要 `/etc/default/limine` 里是 `ENABLE_LIMINE_FALLBACK=yes`，每次 `limine-update` / `limine-install` 都会把 `/usr/share/limine/BOOTX64.EFI`（未签名）盖到 `/boot/EFI/BOOT/BOOTX64.EFI` 上。上游自己都注明了「开着 Secure Boot 时 fallback 不会自动签」，所以：

```bash
sudo limine-update     # 会覆盖 fallback
sudo sbctl sign-all    # 用数据库里的记录把它签回来
```

如果你的主板就是优先从 fallback 启动的，忘了这一步，**下次重启就进不去系统**。想一劳永逸：把 UEFI 启动顺序改成优先 Limine 自己的条目（`efibootmgr -o`），或者干脆设 `ENABLE_LIMINE_FALLBACK=no`。

**坑二：签完 UKI，`limine.conf` 里的 `#hash` 立刻失效。**
Limine 的配置文件里每个文件路径后面可以跟一个 `#` 加 BLAKE2b 校验和（`limine-entry-tool` 会自动写），签名改变了文件字节，哈希自然对不上。补救很简单：

```bash
sudo limine-update     # 重建 UKI（自动重新签名）并重算 limine.conf 里的哈希
```

想自己核对：`sudo b2sum /boot/EFI/Linux/arch-linux.efi`，和 `limine.conf` 里 `path:` 后面那串 128 位十六进制对比即可。

#### 3. 哪些步骤是自动的

`limine-entry-tool` 生态已经布好了自动签名点，**手动只需要注册一次**（就是上面那个 `-s`）：

| 时机 | 谁签 | 签什么 |
|---|---|---|
| 内核更新、重建 UKI | mkinitcpio 的 `/usr/lib/initcpio/post/sbctl` | 新生成的 UKI |
| 内核更新流程收尾 | `/etc/boot/hooks/post.d/90-limine-enroll-config` | `limine_x64.efi` |
| `limine` 包升级 | sbctl 的 pacman hook（`zz-sbctl.hook` → `sbctl sign-all -g`） | 数据库里所有已注册文件 |

#### 4. 可选加固：把 limine.conf 也锁上

想连配置文件一起保护，在 `/etc/default/limine` 里加：

```ini
ENABLE_ENROLL_LIMINE_CONFIG=yes
```

它会在签名前把 `limine.conf` 的校验和嵌进 Limine 二进制，之后 Limine 在 Secure Boot 下会校验配置、并强制要求所有文件路径都带 `#hash`。

> **警告**：启用后**改完 `limine.conf` 忘记重新 enroll 就会开机 panic**，而且关掉 Secure Boot 也救不回来。先准备好一个未签名的备用引导器（`limine-install --fallback` 出来的那个）再开。

#### 5. 验证

```bash
sudo sbctl verify
```

核心文件显示 **Signed** 即可。两个 `not signed` 是正常的，可以忽略：

- `/boot/EFI/Microsoft/` 下的微软文件（不影响 Windows 启动）；
- `/boot/<machine-id>/limine_history/` 里 `limine-snapper-sync` 存放的**历史 UKI 副本**——它们是「开启 Secure Boot 之前」的快照备份，没签名。注意副作用：**这些老快照的启动项在 Secure Boot 下会起不来**（chainload 时固件拒收），以后新建的快照会拷贝已签名的 UKI，所以只有历史遗留受影响。快照本体不会丢，用 `limine-snapper-restore` 仍可恢复。

> “特别感谢某位超级傲娇又色色的Grok全程指导，不然我可能还在 BIOS 里抓狂呢♪”

