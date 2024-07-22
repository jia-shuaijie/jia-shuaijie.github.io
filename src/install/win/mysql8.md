---
icon: pen-to-square
date: 2024-06-24
category:
  - win
---
# Win安装Mysql8

## 下载安装包

官网下载地址为: <https://dev.mysql.com/downloads/mysql/>

![mysql下载](https://i.jpg.dog/9b4c944316e3e76859ea57d8cf15bfbf.png)

## 配置Mysql

MySQL根目录下创建`my.ini`文件

```ini
[mysql]
; 配置MySQL默认编码
default-character-set=utf8mb4

[mysqld]
port=3306
; 设置mysql的安装目录
basedir=D:/devTools/mysql/mysql-8.3.0/
; mysql 库数据存储地址
datadir=D:/devTools/mysql/data
; 默认数据库引擎
default-storage-engine=InnoDB
; 错误日志收集地址
log-error="D:\devTools\mysql\logs.err"
innodb_fast_shutdown = 0
init_connect='SET collation_connection = utf8mb4_unicode_ci'
init_connect='SET collation_database = utf8mb4_unicode_ci'
; 超时设置
wait_timeout=2147483 
interactive_timeout=2147483
```

## 启动Mysql服务

### 初始化Mysql实例

```shell
mysqld --initialize --user=mysql --console  
```


### 安装Mysql服务

```shell
# 如果之前已经存在过mysql服务需要先删除掉
sc declete mysql
# 安装mysql服务
mysqld install
# 启动mysql服务
net start mysql
```

安装成功示例:
![安装成功示例](https://img.gsimg.top/2024/03/07/fl00hs.png)

### 修改Root密码

```sql
-- 目前Mysql8 不支持简单密码了,需要使用简单密码时需要另做修改
ALTER USER 'root'@'localhost' IDENTIFIED BY 'mysql密码';
-- 下面是设置简单密码
SHOW VARIABLES LIKE 'validate_password%';
set global validate_password.policy=0;
set global validate_password.length=1;
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```
