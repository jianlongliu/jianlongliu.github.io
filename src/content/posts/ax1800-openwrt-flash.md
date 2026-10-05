---
title: '小米 AX1800（RM1800）刷 kwrt/OpenWrt 实录'
published: 2026-10-06 03:00:00
description: '大分区 U-Boot、MIBIB 写入路径、bootipq 启动参数三处坑，以及一个没解决的 WiFi 问题'
tags: [OpenWrt, 路由器, IPQ6018, 刷机]
category: 'IT'
draft: true
---

手上这台小米 AX1800（型号 RM1800，原厂固件 1.0.336）想换成 kwrt/OpenWrt。整个过程踩了三个真正会卡死人的坑，最后卡在一个没解决的问题上——WiFi 起不来。把过程、命令、数字都记下来，供同机型的人少走弯路。

## 一、硬件与前提

| 项 | 值 |
|---|---|
| SoC | Qualcomm IPQ6018（IPQ6000 系，4×A53） |
| 闪存 | 128MiB SPI-NAND（PEB 128KiB / page 2048） |
| 内存 | 256MiB 物理（原厂固件可见 ~190MB） |
| 原厂分区表 | `rootfs` 44.5MB + `rootfs_1` 44.5MB（A/B 双系统）+ `overlay` 22.5MB |
| 目标固件 | kwrt（openwrt.ai）`qualcommax/ipq60xx` / `xiaomi_ax1800`，25.12-SNAPSHOT，内核 6.12.108 |

原厂固件下开 SSH 的通用方法是走 web API 注入（本项目用的是社区那套 `set_config_iotdev` 思路），登录默认 `root` / 自设密码；ssh 连接需要显式放开老算法：

```bash
ssh -o HostKeyAlgorithms=+ssh-rsa root@192.168.31.1
```

## 二、为什么要换"大分区 U-Boot"

这是第一个坑，也是最容易被忽略的前提。

- 原厂布局里单个 UBI 只有 **43.1MiB**（`rootfs` 44.5MB 里塞了 kernel 3.6MB + rootfs 19MB + rootfs_data 17.5MB）。
- 而 kwrt 的 `squashfs-factory.ubi` 是 **52.8MB** —— **根本塞不进去**。

也就是说，在这台机器上换大分区不是"可选优化"，是刷 OpenWrt 的前置条件。做法是刷社区 U-Boot（[chenxin527/uboot-qsdk12.5-build](https://github.com/chenxin527/uboot-qsdk12.5-build)，支持 `xiaomi_ax1800`，与红米 AX5 同平台），它自带：

- `192.168.1.1` 的 failsafe 刷机网页（art / cdt / mibib / img / uboot 页）与 telnet
- 内置 DHCP 服务器
- 按设备型号区分的 partition table

分区表本身来自 [meta-tools](https://github.com/chenxin527/meta-tools)：`ipq6018/flash_partition/nand-partition-ax5.xml`（xml → `nand_mbn_generator.py` → 912B 用户表 → `partition_tool` → MIBIB）。这张表把尾部三个分区合并成**单个 111MiB `rootfs`**：

```
 0: 0:SBL1      768KB    ... 前 12 项与原厂表逐字节一致
 7: 0:APPSBL    768KB  (offset 0x800000)
 8: 0:ART       256KB  (offset 0x980000)   ← 关键：位置不动
12: rootfs   113664KB  (0xB80000 ~ 0x7B80000)
```

**关键结论：前 12 项（含 `0:APPSBL` 与 `0:ART`）偏移与原厂表完全一致，所以不需要回刷 ART**，无线校准数据原地保留。

写 MIBIB 之前先确认过一次：Uboot 里 `is_sec_boot_enabled` 返回 `secure boot fuse is not enabled` —— 零售版没熔安全启动，否则刷第三方 U-Boot 会直接砖。原厂分区表里 `0:APPSBL` 只有单槽（没有 `APPSBL_1` 备分区），所以这一步没有退路，务必先备份。

## 三、刷机流程（实测走通的路径）

### 1. 备份（只读导出）

```bash
# 逐分区导出：SBL1/MIBIB/QSEE/DEVCFG/RPM/CDT/APPSBLENV/APPSBL/ART/bdata/overlay/cfg_bak
dd if=/dev/mtd8 bs=4096   # ART：含无线校准与 base MAC
md5sum /dev/mtd7          # 原厂 uboot
```

外加把 PPPoE 宽带账号密码抄下来——刷完要重配 WAN，忘了就得打运营商电话。

### 2. 写入新 U-Boot

分区可写性要先看：

```
APPSBL / APPSBLENV / rootfs* / overlay  → flags 0x400（可写）
SBL1 / MIBIB / CDT / ART                → flags 0x0（只读）
```

也就是说，**Linux 侧只能写 uboot，MIBIB 必须由新 U-Boot 自己写**。

坑在这里：这台机器的 busybox `mtd` **只认 `/dev/mtdX` 路径**，写 `mtd7` 或 `0:APPSBL` 都会失败（后者它会把冒号当多设备分隔符，报 `Could not open mtd device: 0`）：

```bash
mtd write /tmp/uboot-new.bin /dev/mtd7     # ✅
dd if=/dev/mtd7 bs=4096 count=160 | md5sum  # 回读校验，与上传文件一致
```

### 3. 进 failsafe 网页

**断开电源 → 按住 Reset → 上电 → 5 秒后松手**，蓝灯闪 3 次后常亮即 httpd 已起，桌面机会从这个 U-Boot 的 DHCP 拿到 `192.168.1.x`。

### 4. 写 MIBIB

网页上的 `/mibib/reload` 在非 9008 模式下会直接拒绝：

```json
{"status":"fail","info":{"type":"not_in_9008_mode"}}
```

改用它自带的 **webterm**（`POST /webterm/exec`，表单字段 `cmd`），从本机起个 HTTP 服务把文件喂进去：

```bash
text
wget 0x44000000 http://192.168.1.173:8000/sys-ax5-mibib.bin
crc32 0x44000000 0x40000                     # 与本地 crc32 对比
flash 0:MIBIB 0x44000000 0x40000             # 擦除 + 写入
flashread 0x46000000 0:MIBIB && crc32 0x46000000 0x40000   # 回读再比
```

`smeminfo` 里 `rootfs` 变成 `0x7000000`（112MiB）就说明新表生效了。

### 5. 刷固件

```bash
curl -X POST -F "firmware=@kwrt-...-factory.ubi" http://192.168.1.1/upload
# → {"status":"success","info":{"type":"UBI Firmware","size":"52822016","md5":"f2d5e494..."}}
```

回读验证：`smeminfo` 里 ubi 卷 `rootfs_data` 自动从 9 个 LEB 扩到 **471 个**（≈57MiB overlay），`image sequence number` 与本地解析镜像得到的一致。NAND 机型 U-Boot 只认 `factory.ubi`，不认 sysupgrade 包。

### 6. 启动参数（第二个真正的坑）

刷完一启动就 panic，原因在 U-Boot 源码里写着：

```c
#define nand_rootfs "ubi.mtd=" QCA_ROOT_FS_PART_NAME " root=mtd:ubi_rootfs rootfstype=squashfs"
```

`bootipq` 硬编码了原厂小米的 UBI 卷名 **`ubi_rootfs`**，而 kwrt/OpenWrt 的 UbiFit 镜像卷名是 **`rootfs`**（镜像 DTB 里写的是 `root=/dev/ubiblock0_1`）。卷不存在 → 内核找不到根 → panic。

修法是把 U-Boot 环境变量指对并持久化：

```
setenv bootargs "console=ttyMSM0,115200n8 ubi.mtd=rootfs root=/dev/ubiblock0_1 rootfstype=squashfs swiotlb=1 coherent_pool=2M"
setenv fsbootargs "ubi.mtd=rootfs root=/dev/ubiblock0_1 rootfstype=squashfs"
saveenv
```

`saveenv` 写进 `0:APPSBLENV`，重启不丢。之后一遍就起来了。

> 顺带一提：如果按 Reset 进不了 failsafe，很可能是把网线插在了 WAN 口——原厂固件下 3 个 LAN 口是网桥成员，OpenWrt 只把 `192.168.1.1`（本例是 `10.0.0.1`）放在 LAN 侧。

## 四、起来之后：第三个坑（内存）

kwrt 的预设包是"全家桶"：`nginx` + `uwsgi` + `iStore` + `quickstart` + `haproxy` + `passwall` + `tasks` + `wizard` … 全在开机自启。而这版构建给用户态只剩：

```
MemTotal:     131212 kB     ← 256MB 物理里，DTB 预留了 112MB
load average: 22.14         ← 4 核机器
CPU:   0% usr  36% sys  62% io
ath11k: failed to allocate mac80211 hw device: -12      ← -12 = ENOMEM
```

表现就是 LuCI 点不动、SSH banner 超时、`MemAvailable` 一度只剩 84KB。处理方式是**摘掉非必要服务的开机软链**（保留 `nginx`+`uwsgi`，因为 LuCI 就是它们提供的）：

```bash
for s in quickstart haproxy passwall passwall_server advancedplus istore tasks \
         wizard miniupnpd wifihistory luci-client-history ram_release ubihealthd \
         cpumark bootcount startdhns luci-fan; do
  rm -f /etc/rc.d/S*"$s"; /etc/init.d/$s disable
done
```

重启后负载 **22 → 0.98**，iowait 62% → 0%，UI 立刻正常。

> 注意 LuCI 里那个"一键分区扩容挂载工具"（partexp）跟这件事无关：它是给 USB/eMMC 外置存储用的，默认目标会认成 `mtdblock0`——在裸 mtd 块设备上建分区表会直接砸掉闪存内容。

## 五、没解决的问题：WiFi

`ath11k` 初始化失败，且怎么腾内存都不行：

| 操作 | MemAvailable | ath11k |
|---|---|---|
| 全家桶跑着 | 7.9MB | `failed to setup link desc: -12` |
| 停 nginx/uwsgi/ttyd/cron/odhcpd + 卸 ecm | 11.9MB | 仍然 `-12` |

根因是这版构建的内存账本：内核可见只有 **131MB**，DTB 里预留了 112MB（含 `memory@4ab00000` 一块 **85MB** 的 q6/WiFi 固件区），ath11k 起 DP 环（`reo destination rings` / `link desc`）时申请不到连续内存。而**原厂固件当年能拿到 190MB**、WiFi 是好的——所以是构建的内存布局与驱动需求不匹配，不是硬件问题。

这也是这个机型在 OpenWrt 下的**社区共识**：AX5/AX1800 的"带 WiFi 版"一直有坑（社区里"刷带 WiFi 版一直闪黄灯""WiFi 有问题的请进来"之类的帖子常年存在），所以流行刷"无 WiFi 版"当有线路由器用。

可选出路：

1. **换精简构建**（如社区 CI 出的 `IPQ60XX-WIFI-YES` 版）：包集干净、内存宽松，WiFi 有概率可用。概率不保证——那个 85MB 预留是所有 OpenWrt 构建同源的。
2. **回滚原厂 1.0.336**：官方 CDN 镜像 + 备份的原厂 `MIBIB`/`APPSBL` 都在手，可回到"WiFi 正常 + ShellCrash 代理"的原状态。
3. **当有线路由器**：WiFi 交给别的 AP；但 macOS 的"互联网共享"是真 NAT，当不了纯 AP，会让无线设备绕过这台路由器。

## 六、命令速查

```bash
# 原厂侧
ssh -o HostKeyAlgorithms=+ssh-rsa root@<原厂IP>
mtd write /dev/mtdX <file>                 # busybox mtd 只认路径
# U-Boot failsafe webterm（192.168.1.1）
wget <addr> <url> | crc32 <addr> <len> | flash <part> <addr> <len> | flashread <addr> <part>
# 刷固件
curl -X POST -F "firmware=@<image>.ubi" http://192.168.1.1/upload
# 状态
curl http://192.168.1.1/sysinfo
```

## 附：素材清单

| 文件 | 用途 |
|---|---|
| 原厂分区备份（12 个分区 bin + md5） | 回滚基准 |
| `nand-partition-ax5.xml` → MIBIB（256KiB） | 大分区表（单 `rootfs` 111MiB） |
| `uboot-ipq60xx-xiaomi_ax1800-*.bin`（640KB, ELF） | 取代 `0:APPSBL` |
| `kwrt-*-squashfs-factory.ubi`（52.8MB） | 目标固件 |
| 原厂 1.0.336 官方镜像（24.7MB） | 回滚用 |

**记住三件事**：先备份 `0:APPSBL` 与 `0:ART`；`bootipq` 的 `root=mtd:ubi_rootfs` 一定要改；这机型的 OpenWrt WiFi 别抱太高期望。
