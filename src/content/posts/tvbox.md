---
title: 在Windows 11上使用TVBox
published: 2023-03-22 14:15:18
description: ''
image: ''
tags: [Android, Windows]
category: 'Documents'
draft: false 
lang: ''
---

        当今，越来越多的人选择通过电视观看流媒体内容，这也催生了许多流媒体盒子。但是，如果您正在寻找一种全新的方式来观看电视，那么您可以尝试使用 TVBox 这个开源安卓应用程序。这篇博客将会为您介绍如何安装和配置 TVBox。

## 如何下载 TVBox 应用程序？

        TVBox 是一个开源项目，您可以在其 GitHub 页面下载它。访问 TVBox 的 GitHub 页面（[](https://github.com/pvqogw/TVBoxOSC/releases)），并下载最新版本的 APK 文件。
        

## 如何安装 TVBox 应用程序？

        将 APK 文件复制到您的 Android 设备中，然后在设备上运行该文件进行安装。如果您使用的是 Windows 11按照以下方法安装。

* __启用Windows Subsystem for Android (R)__

        打开Microsoft Store, 搜索Amazon Store 并按提示安装, 按需简单配置下图形和打开开发者选项。

* __下载Android 开发者工具__

        在Google Android 官网下载 [SDK Platform Tools | Android Developers](https://developer.android.google.cn/studio/releases/platform-tools) 和配置好环境变量方便使用

* __安装__

        在Windows Terminal (或其他终端) 键入`adb connect 127.0.0.1:<port>`连接Android 子系统, 然后安装app `adb install tvbox.apk`

 

## 使用 TVBox

        安装 TVBox 后，您需要进行一些简单的配置。首先，在应用程序设置中配置"配置地址"。在这里，您可以添加一些流媒体源，以便在 TVBox 中观看直播电视和点播内容。

![](https://cdn.staticaly.com/gh/jianlongliu/pictures@jianlongliu.github.io/H8cE2d.6j08nyd6b4ao.webp)

        总之，TVBox 是一款功能强大的开源安卓应用程序，能够提供高质量的流媒体体验。通过简单的配置，您可以获得一个新的观看电视的方式，为您的生活增添一些乐趣。

![](https://cdn.staticaly.com/gh/jianlongliu/pictures@jianlongliu.github.io/Screenshot-2024-03-22-173520.1wtrj3n1ffb4.webp)

> 这是一些当前可以使用的TVBox 源
> 
> * [TVBox接口 20230226 TVBox下载 ，最新版 TVBox接口，亲测可用无广告速度快 – 优质盒子](https://uzbox.com/tech/tvbox-jiekou.html)
> * [GitHub - jyoketsu/tv](https://github.com/jyoketsu/tv)
> * [TVBox Pro 猫影视后续神器-2023可用猫影视配置接口 - 玉米粒的分享玉米粒的分享](https://yimili.net/tvbox-2022/)
