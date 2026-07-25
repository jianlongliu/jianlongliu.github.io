---
title: 解决Zen 浏览器上播放Bilibili 视频卡顿
published: 2026-07-25
description: ''
image: 'https://g.foolcdn.com/editorial/images/505303/bilibili_banner22.jpg'
tags: [Linux, Arch]
category: 'Documents'
draft: false 
lang: ''
---

OS: Arch Linux    
WM: niri-wm   
Graphic: Intel Xe 96 EU (i915) 

wayland环境下, 使用zen 浏览器播放哔哩哔哩网页端视频会卡顿, mpv播放很顺畅. 究其原因是VAAPI 解码走了 XWayland 的 GL 路径, i915 在 XWayland 下硬解调度异常.    

此问题并非个例 
| 来源                                                                                              | 在说什么                                                             |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| [Mozilla Bug 1957284](https://bugzilla.mozilla.org/show_bug.cgi?id=1957284)                     | Iris Xe + Wayland：FF/Chromium 不用 VAAPI 或卡死首帧；**mpv / vainfo 正常** |
| [ArchWiki · Firefox 硬解](https://wiki.archlinux.org/title/Firefox#Hardware_video_acceleration)   | WebRender、VAAPI、必要时 force；HEVC 要足够新的 Firefox                     |
| [ArchWiki · Chromium 硬解](https://wiki.archlinux.org/title/Chromium#Hardware_video_acceleration) | 靠 flags / Wayland Ozone；**上游不官方支持**，社区自救                         |
| [Arch BBS · Chromium VAAPI](https://bbs.archlinux.org/viewtopic.php?id=244031)                  | 从 2019 开到现在的长帖，Intel 用户反复出现                                      |
| [Arch BBS #281398](https://bbs.archlinux.org/viewtopic.php?id=281398)                           | Linux 上 Firefox 曾默认 blocklist 硬解，要 `force-enabled`               |

以下修改配置实现走wayland协议硬解

### Zen 配置

当前 profile 的 user.js（~/.zen/\<profile\>/user.js，改完完全退出 Zen 再开）：

```~/.zen/\<profile\>/user.js
user_pref("media.ffmpeg.vaapi.enabled", true);
user_pref("media.hardware-video-decoding.force-enabled", true);
user_pref("gfx.webrender.all", true);
user_pref("media.ffmpeg.hevc.enabled", true);
user_pref("media.rdd-ffmpeg.enabled", true);
```

```~/.config/environment.d/zen-wm.conf
widget.dmabuf.force-enabled    
MOZ_ENABLE_WAYLAND=1    
```

验收：about:support → `HARDWARE_VIDEO_DECODING`: `Successful`，`Compositing`: `WebRender`

### 确认硬解
播放 B 站时跑：
```
# 找到 rdd 进程
pid=$(pgrep -f 'rdd' | head -1)
[[ -z "$pid" ]] && { echo "未找到 rdd，正在播视频吗？"; exit 1; }

echo "=== rdd PID $pid ==="
rg -q 'iHD_drv_video' /proc/$pid/maps 2>/dev/null && echo "✓ iHD 已加载" || echo "✗ iHD 未加载"
rg -q 'libva' /proc/$pid/maps 2>/dev/null && echo "✓ libva 已加载" || echo "✗ libva 未加载"
ls /proc/$pid/fd 2>/dev/null | rg -q 'dri|render' && echo "✓ GPU 节点已开" || echo "✗ GPU 节点未开"
```

或用日志：MOZ_LOG="FFmpegVideo:5" zen-browser 搜 VA-API。