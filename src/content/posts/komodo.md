---
title: Pixel 9 Pro XL (Komodo) 入门指南（自用）
published: 2025-09-11 00:30:41
description: ''
image: ''
tags: [Android]
category: ''
draft: false 
lang: ''
---

# Pixel 9 Pro XL (Komodo) 入门指南（自用）



## 1.启用国内三大运营商VoLTE和5G

需要用到的工具

Pixel IMS https://github.com/kyujin-cho/pixel-volte-patch

shizuku https://play.google.com/store/apps/details?id=moe.shizuku.privileged.api

plaform tools 



## 2.修改Pixel 信号阈值

根据Google发布的信号强度报告，我们得知这个信号强弱的显示与KEY_5G_NR_SSRSRP_THRESHOLDS_INT_ARRAY这个数组有关
我们查看这个数组的默认值为[-110,-90,-80,-65]，在国内对于4G来说是信号差的-90dbm，从理论上对于5G已经是能跑到何同学速度的信号强度了，我们修改这个数组的值就好了

那你肯定会说，这不是中国建设完全偷工减料，改了纯属掩耳盗铃？恰好相反，AOSP默认的显示是根据4G时代的信号标准设计的，它基本上是直接把4G的阈值复制到了5G！

改了有啥用? 美观舒服也能**防止一格信号的时候4G和5G来回自动切换耗电**

去GitHub下载[Pixel IMS](https://github.com/kyujin-cho/pixel-volte-patch)，并使用[Shizuku](https://play.google.com/store/apps/details?id=moe.shizuku.privileged.api)激活，这些简单的步骤就不详细写了
 激活后，在底部导航栏选择你的手机卡，滑到最下方选择手动设置，将`KEY_5G_NR_SSRSRP_THRESHOLDS_INT_ARRAY`（类型`IntArray`）改为你手机厂商的默认系统值就好了，一定注意**数值从小到大！**

![三星](https://www.irvingwu.blog/assets/pixelims.6bGkkyK9.webp)
如果你不知道你手机对应的值，这里有张表可以参考一下，我的是一加，所以改为OPPO的默认阈值
![OEM](https://www.irvingwu.blog/assets/array.2cs0b3F1.webp)

> 文献来源
>
> https://www.irvingwu.blog/posts/aosp-5g-signal-strength

> ps. 慢慢写吧！
