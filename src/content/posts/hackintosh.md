---
title: Hackintosh 黑苹果安装配置指引 (自用)
published: 2024-11-02 21:25:51
description: ''
image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_b1Nmxsrk1mvi_fxqP03AHLyWLIsyViavNnnoIKo9JmqefBAMAw1T8FitrTjpi7lNu78&usqp=CAU'
tags: [MacOS, Hackintosh]
category: 'IT'
draft: false 
lang: ''
---

> ⚠ 买Mac Mini M4了，这个对我没什么用了，坑也不填了希望能帮到你！

## I.硬件信息

CPU: Intel Core i7 9700    
Memory: ADATA威刚 万紫千红 16GB + 海盗船 16GB DDR4 双通道    
Motherboard: Asrock 华擎 Z390M Pro4    
Graphic: AMD RADEON 6950XT 16GB 公版    
NVME: Samsung三星 970 Evo 500GB, WDC 西数 SN770 1TB    
SATA: Crucial英睿达 MX500 550 1TB, HGST UltraStart HC310 4TB, Seagate Desktop 1TB    
USB Drive: SanDisk 64GB

## II. 准备

### II.I 你需要准备以下工具

| App                                                                                               | 备注/功能                   |
| ------------------------------------------------------------------------------------------------- | ----------------------- |
| [OpenCore Pkg](https://github.com/acidanthera/OpenCorePkg)                                        | EFI底层包                  |
| [RapidEFI](https://github.com/JeoJay127/RapidEFI-Tool)                                            | 基于OpenCore 的全自动化底层包     |
| Windows 11                                                                                        | OS                      |
| [Python3](https://www.python.org/downloads/)                                                      | OpenCore macrecovery 依赖 |
| [rufus](https://www.rufus.ie)                                                                     | 用于USB驱动器烧录              |
| [OpenCore Configurator](https://mackie100projects.altervista.org/download-opencore-configurator/) | config.list 配置文件编辑器     |

### II.II Sonoma 镜像下载和烧录到U盘

在opencore/util/macrecovery.py 下运行以下命令下载OS X Sonoma 的Base System 镜像    

```cmd
python macrecovery.py -b Mac-937A206F2EE63C01 -m 00000000000000000 download    
```

使用rufus 格式化USB驱动器    
![img](https://dortania.github.io/OpenCore-Install-Guide/assets/img/format-usb-rufus.43feba9e.png "使用rufus格式化USB驱动器")    
按上图设置 BOOT selection 为 not bootable 不可引导, 文件系统为Large FAT32, 删除所有Autorun 的文件

复制刚刚下载的镜像到USB驱动器根目录下, 注意要手动创建`com.apple.recovery.boot`文件夹

```
\com.apple.recovery.boot\BaseSystem.chunklist    
\com.apple.recovery.boot\BaseSystem.dmg    
```

![img](https://dortania.github.io/OpenCore-Install-Guide/assets/img/com-recovery.805dc41f.png)    

### II.III 准备EFI分区

EFI 部分很让人心情复杂, 后续的内容会涉及到系统驱动(Driver, Kext)和各种bug修复

> //progressing...

> [Making the installer in Windows 在Windows 下创建安装器](https://dortania.github.io/OpenCore-Install-Guide/installer-guide/windows-install.html)    

## III. 安装系统

//progressing...



## IV. EFI修补系统

//progressing...

> 我的EFI 文件分享, 更建议用RapidEFI
>
> [jianlongliu/hackintosh_z390m_coffee_lake](https://github.com/jianlongliu/hackintosh_z390m_coffee_lake)           

### IV.I 伪装Radeon 6900XT

因为我的显卡是AMD Radeon 6950XT, 选择伪装免驱动的6900XT, 5%的性能误差可以忽略了. 你需要提前准备以下App或kext: 

* [WhateverGreen](https://github.com/acidanthera/WhateverGreen)

* OpenCore Configurator

> [「全网首发」RX6950XT/RX6650XT黑苹果成功驱动及教程补充](https://www.bilibili.com/read/cv16609382/)
>
> [RX6950XT+RX6650XT上市即遭硬核破解 黑苹果(macOS)](https://www.bilibili.com/video/BV1D541197yT/?spm_id_from=333.337.search-card.all.click&vd_source=14e207212818ddb27ab3c2bfc48cca05)



## V. 增强和推荐 App

* AltTab

  > Ps. 不如按F3

* Bartender 折叠菜单栏

* ChatGPT
  * [MacGPT](https://www.macgpt.com/)
  * [ChatGPT](https://github.com/lencx/ChatGPT)

* [FireFox](https://www.mozilla.org/en-US/firefox/new/)

* [FlClash](https://github.com/chen08209/FlClash) 科学上网

![](https://github.com/chen08209/FlClash/raw/main/snapshots/desktop.gif)

* iStat Menus 硬件性能和温度监测

* [iTerm 2](https://iterm2.com/) 终端

* [Loop](https://github.com/MrKai77/Loop) 窗口管理

  > ps. sonoma 系统有必要, sequoia 可有可无

* [Monitor Control]() 亮度控制

* Karabiner Elements 自定义快捷键

* [KDE Connect](https://kdeconnect.kde.org/download.html) 跨平台联动

* SoundSource 快捷键调整音量

* Markdown 编辑器
  * [Typora](https://typora.io)
  * [Marktext](https://github.com/marktext/marktext)

* [Visual Studio Code](https://code.visualstudio.com/)

* [WhiteSur Firefox Theme MacOS](https://github.com/vinceliuice/WhiteSur-firefox-theme) 火狐浏览器的 Safari 主题

![](https://github.com/vinceliuice/WhiteSur-gtk-theme/raw/pictures/pictures/firefox.svg?raw=true)

## III.Credit 致谢

[OpenCore Install Guide](https://dortania.github.io/OpenCore-Install-Guide/)
