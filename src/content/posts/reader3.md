---
title: 在不同平台上使用Reader3 阅读
published: 2023-10-01
tags: [Android, Reading]
category: IT
draft: false
---
> 服务器端: Ubuntu Server 22.04  
> 智能手机: Nothing Phone(1) (Project Elixir 3.6, Android 13)  
> 平板: 小米平板6 Pro (MIUI 14, Android 13)  

为了方便在不同设备上跨平台阅读小说，我决定部署阅读应用程序[Reader3](https://github.com/hectorqin/reader/) docker compose版本到服务器。虽然按照[文档](https://github.com/hectorqin/reader/blob/master/doc.md)进行了安装和配置，但实际部署过程中仍然遇到了一些问题，可能是因为我的经验不足。

## 服务端部署
1. 安装docker-compose  
`sudo apt install docker-compose`
2. 拉取`docker-compose.yaml`配置文件  
`wget https://ghproxy.com/https://raw.githubusercontent.com/hectorqin/reader/master/docker-compose.yaml`
3. 按需配置刚刚拉取的yaml文件  
4. 启动和停止docker-compose  
启动: 在配置文件所在目录执行`sudo docker-compose up -d`  
停止: `sudo docker-compose stop`
5. 手动更新
`sudo docker-compose pull && sudo docker-compose up -d`

## 客户端部署
### Web 端
使用浏览器访问 `http://<ip>:<port>` 即可在线阅读和管理书源
> 默认端口是4396
> 注意: 首次登陆记得要注册账号

### Android 多端WebDav 同步
在App 设置的"备份与恢复"配置WebDAV, 勾选"同步阅读进度"方便多端同步，首次使用需要点击备份  

WebDav 服务器地址: `http://<ip>:<port>/reader3/webdav/`
> 注意: 服务器地址要按上述格式添加，不然会报错的，在这里吃了亏，  
> 需要添加刚刚注册的账号和密码  

按上述配置基本上可以实现多端同步和使用了

### Android App 

lagado with MD3 https://github.com/HapeLee/legado-with-MD3