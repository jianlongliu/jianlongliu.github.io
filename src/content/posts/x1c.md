---
title: ThinkPad X1 Carbon Gen 9 个人使用指南
published: 2026-05-12
description: ''
image: ''
tags: [Linux, Windows, Microsoft, Arch, ThinkPad]
category: 'IT'
draft: false 
lang: ''
---

## 硬件信息
> __CPU__: Intel Core i7 1185G7 3.0Ghz (4C8T)    
> __GPU__: Intel Iris Xe 96    
> __Memory__: 32GB DDR4    
> __NVME SSD__: Micron 512GB    
> __Monitor__: 华星光电 CSO1411 (MNE007ZA1-4) 14" 3200*2400p@60hz    

## Windows 11和Microsoft Office 安装和激活

### 1. Windows 11镜像下载
推荐Windows 11 Pro for Workstation,     
https://massgrave.dev/windows_11_links

### 2. Microsoft Office 365 下载
https://massgrave.dev/office_c2r_custom

### 3. Windows 和Office 365 激活
`irm https://get.activated.win | iex`

### 4. Windows Terminal
> progessing 施工中

## Arch Linux
> https://github.com/jianlongliu/myarch

### Q&A
#### 修复内置屏幕在Linux 下雪花屏幕闪烁
##### 问题现象
- ThinkPad X1 Carbon Gen 9，CSOT 华星光电 CSO1400 (MNE007ZA1-4) 面板
- Linux 下 systemd-boot 结束后出现横条纹闪烁（雪花屏）
- Windows 下开启 10-bit 色深同样花屏
- `nomodeset` / `i915.modeset=0` 正常 → 定位到 `i915` KMS 链路训练

##### 根本原因
CSO1400 面板硬件缺陷：10-bit FRC（帧率控制/时间抖动）导致视觉伪影，与操作系统无关。面板原生 EDID 声明 10-bit 色深（字节 0x14 = 0xb5），i915 驱动按声明配置链路后触发面板缺陷。

##### 修复方案
1. EDID 固件覆盖强制 8-bit
核心操作：提取面板原生 EDID（256 字节完整结构），修改单个字节 0x14 从 0xb5(10-bit) → 0xa5(8-bit)，重算校验和。
> 踩坑点：用 moninfo / AW EDID Editor 等 Windows 工具生成的修改版 EDID 只有 128 字节，但字节 0x7e 声明了扩展块数量为 1。内核看到声明有扩展块却只有 128 字节 → 拒绝加载 → [drm] *ERROR* Invalid firmware EDID。
>
> 正确做法：直接从 Linux 面板提取完整 256 字节 EDID（含 CEA-861 扩展块），仅修改字节 0x14，重算基础块校验和，其余结构完全不动。
2. 辅助内核参数

| 参数 | 作用 | 必要性 |
| --- | --- | --- |
| i915.fastboot=1 |	保留 EFI GOP 配置，跳过 i915 接管时的链路重训练	| 高 — nomodeset正常说明 GOP 配置是对的 |
| i915.enable_psr2_sel_fetch=0 | 禁用 PSR2 选择性抓取 | 中 — 即使 PSR=0 此项仍独立开启 |
| i915.enable_psr=0 | 禁用面板自刷新 | |
| i915.enable_dc=0 | 禁用 DC 电源状态 | |
| i915.edp_vswing=2 | 电压摆幅等级 | |

##### 部署步骤（Arch + systemd-boot + UKI）
1. `/lib/firmware/edid/CSO1411.bin`         ← 放置修改后 256 字节 EDID
2. `/etc/kernel/cmdline`                    ← 更新内核参数
3. `/etc/mkinitcpio.conf → FILES=(...)`     ← 将 EDID 打包进 initramfs
4. `mkinitcpio -P`                          ← 重建 UKI
5. `reboot`

##### 验证命令
```bash
dmesg | grep -i "edid"          # 不应出现 Invalid firmware EDID
cat /sys/class/drm/card1-eDP-1/edid | hexdump -C | head -2  # 0x14 应为 a5
```

> Powered by Deepseek 4 Pro & Opencode

## AI
### 1. Opencode
`winget install opencode`

### 2. DeepSeek
https://platform.deepthink.com

> progessing 施工中