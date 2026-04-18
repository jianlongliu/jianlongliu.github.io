---
title: 适用于 Arch Linux 的 Btrfs 容灾与快照管理
published: 2026-03-28
description: '修订说明: 本手册将 Snapper 定位为“状态记录仪”，将 Btrfs 原生指令定位为“核心回滚方案”。核心原则: 自动化提供记录，手动化确保成功。'
tags: [Linux, Arch, Btrfs]
category: 'IT'
---

# 适用于 Arch Linux 的 Btrfs 容灾与快照管理

## Ⅰ. 自动化追踪：Snapper 管理
在 Arch 环境下，Snapper 仅用于配合 `pacman` 钩子（如 `snap-pac`）实现自动快照。若工具逻辑层（rollback 命令）失效，不应强行修复工具，而应直接进入第 Ⅱ 阶段。

### 1. 配置与策略优化
```bash
# 初始化根分区配置
sudo snapper -c root create-config /

# 建议清理策略 (/etc/snapper/configs/root)
# 避免过多的快照导致 Btrfs 元数据遍历缓慢
TIMELINE_CLEANUP="yes"
TIMELINE_LIMIT_HOURLY="0"
TIMELINE_LIMIT_DAILY="5"
TIMELINE_LIMIT_WEEKLY="1"
NUMBER_LIMIT="10" 
```

### 2. 快照操作
* **手动备份**：在进行高风险修改前，手动标记状态。
  ```bash
  sudo snapper create --description "Before_Config_Change"
  ```
* **查看快照**：
  ```bash
  sudo snapper list
  ```

---

## Ⅱ. 核心容灾：双轨制回滚方案
由于 Arch 的 `fstab` 通常硬编码 `subvol=/@`，Snapper 原生的 `rollback` 逻辑（尝试修改默认子卷 ID）在 Arch 上往往失效。

### 方案 A：手动“物理替换” (底层应急)
**适用场景**：系统无法启动，需进入 Live CD 环境修复。这是最稳妥的方案。

1. **挂载物理层 (顶级卷)**：
   ```bash
   # 挂载 Btrfs 顶级卷 (subvolid=5)
   sudo mount /dev/[DEVICE_NAME] /mnt -o subvol=/
   ```

2. **执行替换逻辑**：
   ```bash
   cd /mnt
   # 1. 隔离故障现场
   sudo mv @ @_broken_$(date +%m%d)

   # 2. 恢复目标快照 (利用 Snapper 的物理存储路径)
   # 路径：./@_broken_xxxx/.snapshots/[ID]/snapshot
   sudo btrfs btrfs subvolume snapshot ./@_broken_xxxx/.snapshots/[ID]/snapshot ./@
   ```

3. **重启**：`umount /mnt` 后重启。只要新克隆的子卷名为 `@`，`fstab` 就能正常识别。



### 方案 B：`snapper-rollback` (自动化回滚)
**适用场景**：系统可进入终端。它是方案 A 的自动化脚本实现。

1. **安装与配置**：`paru -S snapper-rollback`。确保 `/etc/snapper-rollback.conf` 中 `subvol_main = @`。
2. **执行指令**：
   ```bash
   sudo snapper-rollback [快照ID]
   ```

---

## Ⅲ. 状态复原与后置处理
回滚完成后，需解决由于“时光倒流”导致的系统状态不一致。

### 1. 环境清理
* **解除 Pacman 进程锁**：防止 `unable to lock database` 报错。
  ```bash
  sudo rm -f /var/lib/pacman/db.lck
  ```
* **内核对齐 (关键)**：
  由于 `/boot` 通常是独立分区（vfat），快照无法覆盖内核镜像。若回滚后驱动报错，请务必执行：
  ```bash
  sudo pacman -S linux
  ```

### 2. 废弃卷销毁
确认回滚成功后，手动删除故障卷以释放空间（需挂载顶级卷）：
```bash
# 必须加 -R 参数以处理嵌套快照
sudo btrfs subvolume delete -R /mnt/@_broken_xxxx
```

---

## Ⅳ. 性能维护：Balance (数据均衡)
Balance 用于重新分配磁盘数据块（Chunks），解决空间分配异常。

### 1. 适用场景
* 写入时报 `No space left on device` 但 `df` 显示仍有空间。
* 在大规模删除旧快照后，加速空间回收。

### 2. 维护指令
注意：严禁无参数运行 balance。使用安全阈值仅处理低利用率的数据块。
```bash
# 均衡利用率低于 50% 的数据块
sudo btrfs balance start -dusage=50 /

# 查看当前进度
sudo btrfs balance status /
```
> **提示**：现代内核已足够智能，除非遇到空间分配异常，否则无需将 Balance 加入定时任务，以减少 SSD 额外磨损。

---
Updated: 2026-04-18 | Inspired by Gemini