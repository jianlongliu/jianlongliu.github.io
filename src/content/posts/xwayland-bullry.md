---
title: xwayland 应用在Gnome 46开启分数缩放会模糊的临时解决方法
tags: [Linux]
published: 2024-05-28 10:09:12
image: https://github.com/jianlongliu/picx-images-hosting/raw/master/Screenshot-from-2024-05-28-10-21-23.77de344ygv.webp
category: IT
draft: false
---

# xwayland 应用在Gnome 46开启分数缩放会模糊的临时解决方法



> ps. 新版本应该修复合并了这个补丁

### Description

This is just for my personal use, please don't bother the 
Gnome maintainers if there are bugs. I can't promise to keep the 
packages up to date with the Gnome and Fedora version, so be warned!

Furthermore I'm not the developer of these patches. I took them from:

- https://gitlab.gnome.org/GNOME/mutter/-/merge_requests/3567
- https://gitlab.gnome.org/GNOME/gnome-settings-daemon/-/merge_requests/353
  respectively and all credits go to the original authors.

### Installation Instructions

Enable the copr:

```
sudo dnf copr enable taaem/mutter-xwayland-fractional-scaling
```

Overwrite the installed versions of mutter and gnome-settings-daemon:

```
sudo dnf reinstall mutter mutter-common gnome-settings-daemon --repo copr:copr.fedorainfracloud.org:taaem:mutter-xwayland-fractional-scaling
```

Enable the experimental features:

```
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer', 'xwayland-native-scaling']"
```

> * [taaem/mutter-xwayland-fractional-scaling - Fedora Discussion](https://discussion.fedoraproject.org/t/taaem-mutter-xwayland-fractional-scaling/109104)
> 
> * [taaem/mutter-xwayland-fractional-scaling Copr](https://copr.fedorainfracloud.org/coprs/taaem/mutter-xwayland-fractional-scaling/)
