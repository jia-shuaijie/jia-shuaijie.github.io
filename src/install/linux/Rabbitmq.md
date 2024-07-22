---
icon: pen-to-square
date: 2024-07-22
category:
  - linux
---
# centos7 安装 Rabbitmq-3.6.5
蓝奏云下载地址:
```
蓝奏云地址: https://wwm.lanzoub.com/b02770z0h
密码:0000
```

安装依赖环境
```shell
yum install build-essential openssl openssl-devel unixODBC unixODBC-devel 
make gcc gcc-c++ kernel-devel m4 ncurses-devel tk tc xz
```

## 安装 
```shell
# 进入上传的地址 运行下面命令 安装 erlang
rpm -ivh erlang-18.3-1.el7.centos.x86_64.rpm
# 如果 gblic 版本低于2.15 需要使用下面命令进行升级
sudo yum install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gcc make -y
# 安装 socat 
sudo rpm -Uvh socat-1.7.3.2-1.1.el7.x86_64.rpm --force --nodeps

# 安装 rabbitmq
rpm -ivh rabbitmq-server-3.6.5-1.noarch.rpm
```

开启配置
```shell
# 开启管理界⾯
rabbitmq-plugins enable rabbitmq_management
# 修改默认配置信息
vim /usr/lib/rabbitmq/lib/rabbitmq_server-3.6.5/ebin/rabbit.app
# ⽐如修改密码、配置等等,例如：loopback_users 中的 <<"guest">>,只保留guest
```

## 启动
```shell
service rabbitmq-server start # 启动服务
service rabbitmq-server stop # 停⽌服务
service rabbitmq-server restart # 重启服务
```

设置配置文件
```shell
cd /usr/share/doc/rabbitmq-server-3.6.5/
cp rabbitmq.config.example /etc/rabbitmq/rabbitmq.config
```

访问 web 页面是: `http://ip:15672`   
我们配置的默认使用的用户是 `guest` ,登录时用户和密码都是 `guest`.