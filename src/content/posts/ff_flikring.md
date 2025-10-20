---
title: '处理Fedora 下的Firefox 浏览器播放视频抖动'
published: 2024-09-11 00:30:41
description: ''
image: ''
tags: [Linux, FireFox]
category: 'IT'
draft: false 
lang: ''
---
# 处理Fedora 下的Firefox 浏览器播放视频抖动

    在使用firefox 播放bilibili 视频时，画面时不时抖动抽风。切换Vivaldi 浏览器播放又正常，更新FFMPEG是解决firefox 浏览器播放抖动的一个思路

> 操作系统: Fedora Workstation 40 Pre-Release
> 
> 桌面环境: Gnome 46

1. 配置RPM Fussion 库

```bash
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

注意，如果在terminal 中运行报错，尝试把`$(rpm -E %fedora)`改成当前系统版本号，例如

```bash
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-40.noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-40.noarch.rpm
```

> [RPM Fussion](https://rpmfusion.org/Configuration) 官网配置方法，其他操作系统用户可以参考

2. 更新ffmpeg
   
   `sudo dnf update` 更新源

   `sudo dnf upgrade ffmpeg ffmpeg-devel --allowerasing`

        注意，此命令会覆盖系统内置ffmpeg 

        `ffmpeg -version` 查看版本号

重新启动Firefox 浏览器后应该可以正常观看，视频不抖动了
