---
icon: book
date: 2024-06-24
category:
  - redis
tag:
  - redis
---
# redis

## 概述

> redis 是什么?

Redis（Remote Dictionary Server ），即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

免费开源! 是当下最热门的NoSQL技术之一! 也被人称之为结构化数据库!

> redis 能做什么?

1. 内存存储,持久化,内存中是断电即失,所以说持久化很重要(rdb,aof)
2. 效率高,可用用于高速缓存
3. 发布订阅系统
4. 地图信息分析
5. 计时器,计数器(浏览量!)
6. ...

> 特性

1. 多样的数据类型
2. 持久化
3. 集群
4. 事务
5. ....

> 学习中需要用到的东西

1. 狂神的公众号: 狂神说 (本文学习狂神说来的)
2. 官网: <https://redis.io/downloads/>

注意: Windows再Github上下载(停止更新很久了)

==Redis推荐都是再linux服务器上搭建的, 我们是基于Linux学习==

## Linux安装

1. 下载安装包! 最新稳定版本: 最新的稳定版本始终可在固定 <https://download.redis.io/redis-stable.tar.gz> URL 及其 SHA-256 总和中找到

    ![找下载示例](https://i.jpg.dog/fde8293541278f1dae1f55be6b23bd99.png)

2. 将安装包上传到linux服务器上并解压[ 上传目录为 `/opt`]
3. 安装gcc,执行 `yum install gcc-c++`命令即可
4. 在reids根目录执行

    ```shell
    make
    make install
    ```

5. redis的默认安装路径 `/usr/local/bin`
6. 将redis配置文件复制到 `/usr/local/bin` 目录下

    ```shell
    mkdir my-config
    cp /opt/redis/redis.conf my-config
    ```

7. redis默认不是后台启动的,需修改配置文件.

    ```shell
    # redis.conf
    # 找到dameonize 将参数修改为yes
    dameonize yes
    ```

8. 启动redis服务

    ```shell
    # 通过指定的配置文件启动服务
    redis-server /usr/local/bin/my-config/redis.conf
    ```

9. 使用redis客户端进行链接测试

    ```shell
    # 使用redis客户端进行链接
    reids-cli -p 6379
    ```

10. 查看redis进程是否开启命令 `ps -ef|grep redis`
11. 关闭redis服务命令 `shutdown`

## 测试性能

**redis-benchmark** 是一个压力测试工具.

官方自带的性能测试工具!

使用: redis-benchmark 命令参数!

命令参数[图片来自菜鸟教程]:

  ![redis命令参数](https://i.jpg.dog/fb15e2e3bc5eb4fd9124590754005d48.png)

简单测试下

```shell
# 测试: 100个并发链接 100000请求
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```

![Snipaste 2024 06 26 17 58 26](https://i.jpg.dog/b99bd7bdfebf880a18d7a35dff1d4ab2.png)

## 基础知识

redis默认存在16个数据库

1. 切换数据库命令: `select index` index为几号数据库.
2. 查看库数据大小命令: `dbsize`
3. 查看所有的key命令: `keys *`
4. 清空当前数据库命令: `flushdb`
5. 清空全部数据库内容命令: `flushall`

redis 是单线程的.
