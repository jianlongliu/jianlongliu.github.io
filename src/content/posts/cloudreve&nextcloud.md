---
title: '部署cloudreve和nextcloud 网盘'
published: 2023-07-02 21:25:51
description: ''
image: 'https://gd-hbimg.huaban.com/913d6eefa0afa852ec7a7968f25848b5e8ac076f6ed7-qZZ1sC_fw658'
tags: [office]
category: 'Documents'
draft: false 
lang: ''
---

> ps. 两个都太难用了, 转投pydio cells了

![](https://cloudreve.org/imgs/feature3.png)


# ~~I 简易部署和使用 cloudreve 网盘~~


简单思路是使用docker 部署cloudreve, 在服务器通过nginx 反向代理映射到公网端口和使用https.  
进阶想法是借助onlyoffice或collabora online实现office 文档在线预览和编辑

## 安装 docker

### Windows

在低版本Windows 下使用 [Docker-Toolbox](https://github.com/docker-archive/toolbox/releases)
windows 11使用docker desktop for Windows

### Linux

直接apt安装 `sudo apt install docker`, linux 下所有docker操作必须`sudo`提权  

### 常用命令

| 命令                                           | 操作                              |
|:--------------------------------------------:|:-------------------------------:|
| `docker ps`                                  | 查看运行容器                          |
| `docker exec <container name> -it /bin/bash` | 进入容器                            |
| `docker run`                                 | 启动容器                            |
| `docker container stop <container name>`     | 停止某个容器                          |
| `docker container rm <container name>`       | 移除某个容器                          |
| `docker pull <images>`                       | 拉取镜像                            |
| `docker-machine start`                       | 启动docker虚拟机 (docker-toolbox 专用) |
| `docker-machine stop`                        | 停止docker虚拟机 (docker-toolbox 专用) |



## 部署 cloudreve

下载[cloudreve](https://github.com/cloudreve/Cloudreve/releases)

## 安装和配置 nginx

## 部署 collabora online 或 onlyoffice

> 拒绝施工

​    

![](https://nextcloud.com/c/uploads/2025/08/Nextcloud-Hub25Autumn-announcement-image_LinkedIn-event.png)

# ~~II Nextcloud docker部署 (自用)~~

## 使用环境

机器: Mac Mini M4

OS: MacOS Sequoia

容器: Orb Stack

## 配置文件

### docker-compose.yaml

```yaml
services:
  app:
    image: nextcloud:latest
    volumes:
      - nextcloud:/var/www/html
      - ./config/config.php:/var/www/html/config/config.php
    environment:
      - MYSQL_DATABASE=nextcloud
      - MYSQL_USER=nextcloud
      - MYSQL_PASSWORD=your_db_password
      - MYSQL_HOST=db
      - REDIS_HOST=redis
      - REDIS_HOST_PASSWORD=your_redis_password
      - NEXTCLOUD_TRUSTED_DOMAINS=localhost
    command: >
      sh -c "
      chmod -R 755 /var/www/html/config &&
      chown -R www-data:www-data /var/www/html/config &&
      chown -R www-data:www-data /var/www/html/apps &&
      su -s /bin/bash www-data -c 'php occ upgrade' &&
      apache2-foreground
      "
    depends_on: 
      - db
      - redis
      - nginx
  
  db:
    image: mariadb:11.4.4-ubi9
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: nextcloud
      MYSQL_USER: nextcloud
      MYSQL_PASSWORD: your_db_password
    volumes:
      - db:/var/lib/mysql
    restart: always

  redis:
    image: redis:alpine
    command: redis-server --requirepass your_redis_password
    restart: always
    environment:
      - REDIS_PASSWORD=your_redis_password
    volumes:
      - redis:/data

  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    ports:
      - "80:80"   # 映射标准 HTTP 端口
      - "443:443" # 映射标准 HTTPS 端口
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl/origin.pem:/etc/nginx/ssl/origin.pem
      - ./nginx/ssl/origin-key.pem:/etc/nginx/ssl/origin-key.pem

volumes:
  nextcloud:
  db:
  redis:
```

ps. 应该还要配置cron, 晚点继续研究



### nginx.conf

```nginx
# nginx.conf 文件的基本结构

user  nginx;
worker_processes  1;

# 事件配置
events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    access_log  /var/log/nginx/access.log;
    error_log   /var/log/nginx/error.log;

    # 配置 HTTP 相关设置
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    # 这里开始是你的 server 配置块
    server {
        listen 80;
        server_name your.domain.com;

        # 强制重定向到 HTTPS
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name your.domain.com;

        # SSL 配置
        ssl_certificate /etc/nginx/ssl/origin.pem;
        ssl_certificate_key /etc/nginx/ssl/origin-key.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:...';  # 可根据需要调整
    

        # 启用 HSTS (Strict-Transport-Security)
        add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;

        # 设置反向代理到 Nextcloud 容器（app）
        location / {
            proxy_pass http://app:80;  # 反向代理到 Nextcloud 容器的 80 端口
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # 适用于 WebSocket 和 Nextcloud 的一些优化
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
        }
    }
}
```

写完上面的yaml文件后, `docker-compose pull` 拉取镜像, 继续配置nginx.conf, 启动容器`docker-compose up -d`



### /var/www/html/config/config.php

下面这个配置文件可以考虑外挂在物理机上, 覆盖容器内的文件

```php
<?php
$CONFIG = array (
  'htaccess.RewriteBase' => '/',
  'memcache.local' => '\\OC\\Memcache\\APCu',
  'apps_paths' => 
  array (
    0 => 
    array (
      'path' => '/var/www/html/apps',
      'url' => '/apps',
      'writable' => false,
    ),
    1 => 
    array (
      'path' => '/var/www/html/custom_apps',
      'url' => '/custom_apps',
      'writable' => true,
    ),
  ),
  'memcache.distributed' => '\\OC\\Memcache\\Redis',
  'memcache.locking' => '\\OC\\Memcache\\Redis',
  'redis' => 
  array (
    'host' => 'redis',
    'password' => 'your_redis_password',
    'port' => 6379,
  ),
  'upgrade.disable-web' => true,
  'instanceid' => '',
  'passwordsalt' => '',
  'secret' => '',
  'trusted_domains' => 
  array (
    0 => 'localhost',
    1 => 'https://your.domain.com',
  ),
  'datadirectory' => '/var/www/html/data',
  'dbtype' => 'mysql',
  'version' => '30.0.4.1',
  'overwriteprotocol' => 'https',
  'overwrite.cli.url' => 'https://your.domain.com',
  'dbname' => 'nextcloud',
  'dbhost' => 'db',
  'dbport' => '',
  'dbtableprefix' => 'oc_',
  'mysql.utf8mb4' => true,
  'dbuser' => 'nextcloud',
  'dbpassword' => 'your_db_password',
  'installed' => true,
  'config_is_read_only' => false,
  'default_language' => 'CN',
  'default_phone_region' => 'CN',
  'mail_smtpmode' => 'smtp',
  'mail_sendmailmode' => 'smtp',
  'mail_smtphost' => 'smtp.domain.com',
  'mail_smtpport' => '587',
  'mail_from_address' => 'name',
  'mail_domain' => 'mail.com',
  'mail_smtpauth' => 1,
  'mail_smtpname' => 'name@mail.com',
  'mail_smtppassword' => 'passwd',
  'defaultapp' => '',
  'loglevel' => 2,
  'maintenance' => false,
  'appstoreenabled' => false,
);

```

## 怎么数据备份? 

数据存放的数据卷`nextcloud_nextcloud`中, `/var/www/html/_data`目录下, 考虑以下脚本备份

```sh
# backup_orbstack_volumes.sh

#!/bin/bash

# 设置路径
SOURCE_DIR="$HOME/OrbStack/docker/volumes"
BACKUP_DIR="$HOME/Backup/OrbStack"
SCRIPT_DIR="$BACKUP_DIR"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="${BACKUP_DIR}/orbstack_volumes_backup_${DATE}.tar.gz"

# 检查目标备份目录是否存在
if [ ! -d "${BACKUP_DIR}" ]; then
    echo "目标备份目录不存在，创建中..."
    mkdir -p "${BACKUP_DIR}"
fi

# 计算数据大小
echo "正在计算待备份目录的大小..."
TOTAL_SIZE=$(gfind "${SOURCE_DIR}" -type f -exec stat -f "%z" {} + | awk '{s+=$1} END {print s}')

if [ -z "${TOTAL_SIZE}" ] || [ "${TOTAL_SIZE}" -eq 0 ]; then
    echo "无法计算目录大小或目录为空，请检查路径：${SOURCE_DIR}"
    exit 1
fi

# 备份数据卷
echo "开始备份 OrbStack volumes（共 $(echo ${TOTAL_SIZE} | numfmt --to=iec)）..."
tar -cf - -C "${SOURCE_DIR}" . | pv -s "${TOTAL_SIZE}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "备份完成！文件已保存至：${BACKUP_FILE}"
else
    echo "备份失败，请检查错误信息。"
    exit 1
fi

# 删除超过 30 天的备份文件
echo "清理超过 30 天的备份文件..."
find "${BACKUP_DIR}" -type f -name "orbstack_volumes_backup_*.tar.gz" -mtime +30 -exec rm -v {} \;
echo "清理完成！"
```

> 以上脚本均由ChatGPT 生成, 我非常感谢他~