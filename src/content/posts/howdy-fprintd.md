---

title: 为 Arch Linux 实现指纹识别和面部解锁
published: 2026-08-07
description: '锁屏刷脸、登录刷脸、sudo 按指纹——howdy + fprintd 在 Arch + DMS 上的三路 PAM 实践'
image: 'https://live.staticflickr.com/65535/53990781497_f407bba1dd_b.jpg'
tags: [Linux, Arch]
category: 'Linux'
draft: false
lang: ''

---

# 为 Arch Linux 实现指纹识别和面部解锁



## 环境

- 硬件：ThinkPad X1 Carbon Gen 9（IR 灰度头 `/dev/video2` 640x360，彩色头 `/dev/video0` 1280x720）
- OS：Arch Linux
- DM：greetd + dms-greeter
- WM：niri + dms
- Bio：howdy 2.6.1-3（稳定版）+ fprintd

## 架构：为什么拆成三路

三个场景走三张 PAM，互不抢占：

```
greeter 登录   → /etc/pam.d/greetd    人脸 + 密码
DMS 锁屏      → /etc/pam.d/dankshell 人脸 + 密码（不挂指纹）
sudo         → /etc/pam.d/sudo       指纹 + 密码
```

两个关键决策：

- 锁屏 / greeter 只接 howdy、不接指纹——X1C9 上 fprintd 会被 sudo + 锁屏抢读失效，搞不定，就让位只留 sudo 一个场景
- sudo 只接指纹、不接 howdy——不碰摄像头

`system-auth` 永远不碰 howdy。

## 一、howdy 人脸解锁

### 安装与配置

```bash
sudo pacman -S howdy
```

默认配置 `device_path = none`，先指到红外头：

```ini
# /lib/security/howdy/config.ini

device_path = /dev/video2   # IR 灰度头，不是 /dev/video0
use_cnn = false             # CNN 单帧 45s 必挂，HOG 只要 ~200ms
certainty = 5.0             # 阈值 0.5
timeout = 6
dark_threshold = 50
recording_plugin = opencv
```

### 点灯：ir-light

IR 摄像头不点灯就是一片黑。写个 `ir-light` 脚本，通过 UVC 扩展单元（`unit=13 selector=14`）写 `[2, 100]`（模式 2 + 亮度 100），画面亮度能从 16 提到 68：

```bash
# /usr/local/bin/ir-light，PAM 里每次认证前由 pam_exec 调用
```

### V4L2 补丁（关键）

OpenCV 默认用 FFMPEG backend 读 `/dev/video2` 直接崩，日志就报 `Unknown error: 1`。给 `/lib/security/howdy/pam.py` 加环境变量，强制 V4L2：

```
OPENCV_VIDEOIO_PRIORITY_V4L2=100
OPENCV_VIDEOIO_PRIORITY_FFMPEG=0
OPENCV_VIDEOIO_PRIORITY_GSTREAMER=0
```

### 锁屏 PAM

```bash
# /etc/pam.d/dankshell
#%PAM-1.0
auth       optional     pam_exec.so /usr/local/bin/ir-light
auth       sufficient   pam_python.so /lib/security/howdy/pam.py
auth       include      system-auth
account    include      system-auth
session    include      system-auth
```

### 录入（必须带 V4L2 env）

录脸和识别如果走了不同 backend，编码有系统偏差，换个姿势就不认。录脸也得带同一套环境变量：

```bash
sudo /usr/local/bin/ir-light
pkexec env SUDO_USER=jianlongliu OPENCV_VIDEOIO_PRIORITY_V4L2=100 \
  OPENCV_VIDEOIO_PRIORITY_FFMPEG=0 OPENCV_VIDEOIO_PRIORITY_GSTREAMER=0 \
  howdy add -y
```

建议姿势：正脸 / 低头 / 偏左 / 偏右 / 仰头。

## 二、greeter 登录人脸（2026-08-07 新增）

锁屏能刷脸之后，登录界面也想刷。改 `/etc/pam.d/greetd`：

```bash
# /etc/pam.d/greetd
#%PAM-1.0

auth       optional     pam_exec.so /usr/local/bin/ir-light
auth       sufficient   pam_python.so /lib/security/howdy/pam.py
auth       required     pam_securetty.so
auth       requisite    pam_nologin.so
auth       include      system-local-login
account    include      system-local-login
session    include      system-local-login
```

**坑**：howdy 一开始放在 `system-local-login` 之后，密码栈失败会走 faillock `[default=die]` 直接终止，根本轮不到 howdy。必须把 `ir-light` + howdy 挪到栈顶、`sufficient` 前置，回车 → 扫脸 → 进桌面才成立。

另外 howdy 别升 beta：greetd 下 beta 版有 `pam_setcred: PERM_DENIED` 的已知崩溃（boltgolt/howdy#991），锁屏没事，greeter 会直接起不来。

## 三、fprintd 指纹 sudo

指纹在 X1C9 上很挑食：sudo 和 dms 锁屏同时在读 fprintd，守护进程被抢后直接失灵，试过各种方案搞不定。所以干脆让位——fprintd 只服务 sudo，锁屏/登录全交给人脸。硬件分家（IR 摄像头 vs 指纹头）只是前提，真正决定分工的是 fprintd 抢读这个坑。

```bash
sudo pacman -S fprintd
fprintd-enroll -f right-index-finger   # 或 right-middle-finger
```

录指纹有个反直觉的坑：每次扫描后**一定要完全抬起手指**，微调位置再放回去，否则报 `enroll-duplicate`——不是真重复，是传感器觉得你两次放得一模一样。

```bash
# /etc/pam.d/sudo
#%PAM-1.0
auth		sufficient	pam_fprintd.so forward_pass
auth		include		system-auth
account		include		system-auth
session		include		system-auth
```

## 四、效果一览

| 场景          | 方式        | 状态    |
| ----------- | --------- | ----- |
| 锁屏解锁        | 人脸 / 密码   | 自动解锁  |
| 登录（greeter） | 人脸 / 密码   | 回车即扫脸 |
| sudo        | 指纹 / 密码   | 免输密码  |
| 兜底          | 识别失败，密码照常 | 已测    |

## 五、踩坑录

- **`Unknown error: 1`，锁屏回退密码**：OpenCV 默认 FFMPEG backend 读不了 IR 头 → compare.py 崩。修复：pam.py 强制 V4L2。
- **刷脸必挂**：`use_cnn=true` 单帧约 45s，远大于 timeout。换 HOG 后 ~200ms。
- **换个姿势不认**：录脸走 FFMPEG、识别走 V4L2，两套编码有系统偏差。带 V4L2 env 重录解决。
- **IR 灯不亮（全黑帧）**：UVC 灯控件没设，写 `ir-light`。灯常亮则是 UVC 设置跨进程持久，要关就写回 `[0,0]`。
- **greeter 回车不扫脸**：howdy 排在密码栈后面，被 faillock `[default=die]` 截胡，前置到栈顶解决。
- **fprintd 多场景抢读失效**：sudo + 锁屏共用 fprintd，守护进程被抢读后指纹失灵。修复：让位——指纹只留给 sudo，锁屏/登录全用 howdy。

## 运维备忘

- **`dms auth sync` 会覆盖 `/etc/pam.d/dankshell` 和 `/etc/pam.d/greetd`**：greeter 需在 DMS 设置里开 "Use system PAM authentication"（`greeterPamExternallyManaged=true`），手工行才不被冲掉
- **paru 更新 howdy/dms 后**：`pam.py` 的 V4L2 补丁可能被覆盖，需重打
- **ThinkShutter**：物理滑盖，刷脸时保持推开
- **改 PAM 前先快照**：`sudo snapper --config root create --description "howdy + fprintd"`
