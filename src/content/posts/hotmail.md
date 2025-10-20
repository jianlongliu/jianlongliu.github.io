---
title: '如何在EAS客户端配置hotmail 邮箱'
published: 2023-02-20 23:13:48
description: 怎么EAS配置hotmail
tags: [Microsoft]
category: IT
draft: false
---

# 如何在EAS客户端配置hotmail 邮箱

> ps. 对微软失望了，经常改来改去

    因为EAS可以同步邮件, 日历和联系人，要比其他协议更方便在手机端或Windows端好用, 联系人也不会单向同步. 接下来是在office outlook, gmail 客户端配置EAS协议的hotmail.com, outlook.com 邮箱

Exchange 服务器: `outlook.office365.com`  
Exchange 端口: `443`  
Exchange 用户名: _\<username\>@hotmail.com_, _\<username\>@outlook.com_  
Exchange 密码: [Microsoft Accounts 微软账户](https://accounts.microsoft.com) 生成的随机密码  

> 登录你的微软账户，找到Security 安全, App passwords 应用密码, Create a new app password 创建一个app 密码. 这个密码添加进去即可，不需要记住，更换手机或因为安全原因移除并重新创建一个即可

Exchange TLS/SSL encryption required: Yes (是)  