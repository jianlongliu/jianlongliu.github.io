---

title: Nothing Phone (1) 使用Custom ROM和恢复官方系统
published: 2023-02-20 21:46:35
description: ''
image: ''
tags: [Android]
category: ''
draft: false 
lang: ''
---

![](https://nothing-intl.myshopify.com/cdn/shop/files/Support_centre_title_update-_2160x1200_b73d0141-e403-4c3e-939d-70a0d78f15aa_3840x.jpg?v=1694490156)

## 从Nothing OS 到 Custom ROM

### 1. 准备工作

* 点击五次版本号，解锁开发者选项勾选USB 调试, 并允许从该设备授权使用

* OEM解锁，进入bootloader `adb reboot bootloader`， 重启到bootloader后开始解锁 `fastboot flash unlock`

* 准备好Custom ROM, 例如, Paranoid Topaz, Pixys OS

* 在PC端准备好fastboot 驱动和`platform-tools` adb 工具
  
  * [SDK Platform Tools release notes](https://developer.android.google.cn/studio/releases/platform-tools?hl=en)
  
  * Windows 10 以上版本通过Windows Update 获取fastboot 驱动的可选更新

* 有些ROM 可能需要用到[payload dumper](https://github.com/ssut/payload-dumper-go/releases)提取`boot.img`镜像手动刷入或用来打magisk 修补
  
  * payload dunper 需要安装python 3, 首次安装后需要更新`pip`
  
  * 前置module 需要`protobuf`, `six `, `bsdiff4`
    
    ```pip
    pip install protobuf==3.15.0
    pip install six
    pip install bsdiff4
    ```

### 2. 执行

* 在fastboot 下执行 `fastboot update *.zip`, 时间较长等待刷入成功。如果遇到waiting for device, 检查fastboot 驱动是否安装。个人推荐 [Nothing Phone (1) (Spacewar) - PixelExperience](https://get.pixelexperience.org/Spacewar)

* (可选) root: 安装[magisk](https://github.com/topjohnwu/Magisk/releases), 修补magisk 镜像刷入`fastboot flash boot magisk-*.zip`或在recovery 侧载`adb sideload magisk.zip` (后缀apk 重命名zip 即可)

> 参考
> 
> [Development - Paranoid Android Topaz Alpha 2 - Nothing phone (1) | XDA Forums](https://forum.xda-developers.com/t/paranoid-android-topaz-alpha-2-nothing-phone-1.4505797/)



## 从Custom ROM 回到Nothing OS

* 准备好Nothing OS 1.1.3 全量包, 并用payload dumper 提取boot.img和 vendor_boot.img

* 刷入两个镜像进入recovery
  
  ```fastboot
  fastboot flash boot boot.img
  fastboot flash vendor_boot vendor.img
  ```

* 在手机上看到no command 后按住电源键，再按音量+ 并松手进入隐藏的恢复模式， 选择`apply update from adb side`, 侧载Nothing OS 1.1.3 (`adb sideload nothingos.zip`)

* 重启初始化后检查各功能正常，重新进入recovery 侧载到最新版本或在系统内OTA到最新版本，不过OTA很容易报错失败

> 参考
> 
> [Nothing phone 1 unbrick, downgrade or revert back to Nothing OS from custom rom: The easiest method! - YouTube](https://www.youtube.com/watch?v=WXRhxDx3iYw)



### 跳过原厂验证

```fastboot
fastboot --disable-verity --disable-verification flash vbmeta vbmeta.img
```

> 参考
>
> https://zhuanlan.zhihu.com/p/500410873
>
> [Info about Spacewar - PixelExperience Wiki](https://wiki.pixelexperience.org/devices/Spacewar/)
