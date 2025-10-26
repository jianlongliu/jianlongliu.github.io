---
title: 解决Debian 上安装向日葵远程控制依赖
published: 2025-10-26
description: ''
image: 'https://res1.orayimg.com/sunlogin/1.0/img/99cb1ff.png'
tags: [Linux]
category: 'IT'
draft: false 
lang: ''
---

  从官网下载向日葵的deb不能直接安装会提示缺失依赖`libgconf-2-4`.    
  包管理器又没有, 这时可以试试ubuntu 的包    
    
```bash

## 下载
sudo wget http://th.archive.ubuntu.com/ubuntu/pool/universe/g/gconf/gconf2-common_3.2.6-7ubuntu2_all.deb
sudo wget http://th.archive.ubuntu.com/ubuntu/pool/universe/g/gconf/libgconf-2-4_3.2.6-7ubuntu2_amd64.deb

## 安装
sudo apt install ./gconf2-common_3.2.6-7ubuntu2_all.deb
sudo apt install ./libgconf-2-4_3.2.6-7ubuntu2_amd64.deb
```

> __参考文献__ https://www.cnblogs.com/haiyoyo/p/18545873
