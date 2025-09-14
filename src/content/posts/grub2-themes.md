---
title: 如何修改 Grub2主题?
published: 2024-08-31 17:56:51
tags: [Linux]
category: Documents
image: 'https://github.com/voidlhf/StarRailGrubThemes/raw/master/preview/Hysilens.png'
draft: false
---



**描述**:

A pack of GRUB2 themes for Honkai: Star Rail  

更多预览:

https://github.com/voidlhf/StarRailGrubThemes/tree/master/preview  

The labels in the bottom right corner of the preview image will not be displayed in the theme file.  



**安装**:  
使用 Guinaifen 主题举例

1. 复制 Guinaifen 到 grub 主题目录
   `sudo cp -r Guinaifen /usr/share/grub/themes`

2. 编辑grub文件
   `sudo vim /etc/default/grub`

3. Add the theme to the bottom of the text file 在底部添加以下内容  
   `GRUB_THEME="/usr/share/grub/themes/Guinaifen/theme.txt"`

4. 更新 grub  
   `sudo grub-mkconfig -o /boot/grub/grub.cfg`
   
   > 在UEFI 的Fedroa 40+ 机器上不生效?
   > 
   > `sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg`
   > 
   > [Changing grub menu theme on Fedora 40 Workstation - #2 by jaybe - Fedora Discussion](https://discussion.fedoraproject.org/t/changing-grub-menu-theme-on-fedora-40-workstation/126448/2)

5. Reboot the computer 重启电脑



星铁主题下载链接

https://www.gnome-look.org/p/2076542
