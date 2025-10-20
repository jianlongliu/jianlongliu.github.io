---
title: 发现 Starship
published: 2023-03-25 12:56:10
description: ''
image: 'https://raw.githubusercontent.com/starship/starship/master/media/demo.gif'
tags: [Terminal]
category: 'IT'
draft: false 
lang: ''
---

逛知乎发现了一个挺好看的终端美化小玩意儿, 全平台的。下面是官网和项目地址

> [starship 官网](https://starship.rs)
> 
> [Github 项目地址](https://github.com/starship/starship)

以下是[Pastel-Powerline 预设](https://starship.rs/presets/pastel-powerline.html)实际使用效果

![](https://starship.rs/presets/img/pastel-powerline.png)

 

这个在Android 上使用paste-powerline 预设有点小折腾，以下是一些小经验

## 在Android termux上安装starship paste-powerline 预设

    1. 需要准备

* [Termux](https://github.com/termux/termux-app/releases) 终端  *(不建议使用Play Store 旧版本)

* [Nerd Fonts]() 字体

* [Termux:Styling](https://github.com/termux/termux-styling/releases)



    2. 安装Nerd Fonts 字体

* 在termux 执行`termux-setup-storage` 开启`/sdcard`访问权限

* 创建`~/fonts `目录, 复制nerd fonts 字体到目录中

* 安装font config `pkg install fontconfig`, 在`~/fonts`目录执行`fc-cache -v` 刷新字体缓存



   3. 安装starship和paste-powerline 预设

   4. 安装Termux:Styling, 打开termux 长按空白处选择more, 选择nerd fonts字体即可. 你就拥有漂亮的termux 了。
