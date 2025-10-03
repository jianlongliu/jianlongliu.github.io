---
title: 简单部署yourls短链接
published: 2025-10-02
description: ''
image: 'https://d.jianl.dev/images/yourls-logo.svg?v=1.10.2'
tags: [docker]
category: 'IT'
draft: false 
lang: 'zh-CN'
---

# 简单部署 YOURLS 短链接服务

## Docker Compose 配置

```yaml
name: yourls
services:
  yourls:
    image: yourls
    restart: always
    depends_on:
      - mysql
    ports:
      - 8080:8080
    environment:
      YOURLS_DB_PASS: example            # 数据库密码
      YOURLS_SITE: https://example.com   # 网站域名
      YOURLS_USER: example_username      # YOURLS 管理员账号
      YOURLS_PASS: example_password      # YOURLS 管理员密码

  mysql:
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example       # 数据库 root 账户密码
      MYSQL_DATABASE: yourls             # 数据库名称
    volumes:
      - db:/var/lib/mysql

volumes:
  db:
```

## 初始化步骤

### 1. 创建数据库（首次使用需要执行）

```bash
# 进入 MySQL 容器
docker exec -it yourls-mysql-1 mysql -u root -pexample
```

在 MySQL 中执行：

```sql
CREATE DATABASE yourls;
```

### 2. 配置数据库用户权限

为避免连接权限错误，需要创建允许远程连接的用户

```sql
CREATE USER 'root'@'%' IDENTIFIED BY 'example';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### 3. 完成安装

访问 https://localhost:8080/admin 进入后台安装页面，使用配置的用户名和密码登录。

## 重要说明

### ⚠️ 注意事项：

* `YOURLS_SITE` 设置为你的实际域名，否则页面样式将无法正常加载
* 如果对 MySQL 权限管理熟悉，可以按需配置更严格的权限策略

## 相关资源

* Github: https://github.com/YOURLS/YOURLS
* DockerHub 官方镜像: https://hub.docker.com/_/yourls    

> 本文档基于 DockerHub 官方镜像文档整理
