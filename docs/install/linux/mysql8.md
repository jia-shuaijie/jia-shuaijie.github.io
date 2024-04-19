# Centos7安装Mysql8

## 下载所需要的安装包

本次下载包所用的是[清华大学镜像站](https://mirrors.tuna.tsinghua.edu.cn/)中提供的mysql包. 下载包时需要下载四个类型的Rpm文件

- mysql-community-libs-8.0.33-1.el7.x86_64.rpm
- mysql-community-common-8.0.33-1.el7.x86_64.rpm
- mysql-community-server-8.0.33-1.el7.x86_64.rpm
- mysql-community-client-8.0.33-1.el7.x86_64.rpm

## 安装流程

1. 查看与卸载原有的包

    ```shell
    # 查看是否存在安装包
    rpm -qa|grep mariadb
    # 存在的话卸载当前已安装的包
    rpm -e --nodeps mariadb-libs
    ```

2. 安装RPM包

    ```shell
    sudo rpm -ivh mysql*.rpm --nodeps --force
    ```

3. 启动Mysql和查看是否启动成功

    ```shell
    systemctl start mysqld
    systemctl status mysqld
    ```

4. 获取临时密码

    ```shell
    grep 'temporary password' /var/log/mysqld.log

    # 执行后
    # [root@VM-24-10-centos temp]# grep 'temporary password' /var/log/mysqld.log
    # 2023-06-30T01:28:56.524220Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: tXdMBrtik2<d
    ```

5. 修改Root密码

    ```sql
    -- 目前Mysql8 不支持简单密码了,需要使用简单密码时需要另做修改
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'mysql密码';
    ```

6. 授权远程链接

    ```sql
    SHOW databases;
    USE mysql;
    UPDATE user SET host = "%" WHERE user='root';
    SELECT host, user, authentication_string, plugin FROM user;
    FLUSH privileges;
    ```

7. Mysql8 设置简单密码

    ```sql
    SHOW VARIABLES LIKE 'validate_password%';
    set global validate_password.policy=0;
    set global validate_password.length=1;
    ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
    ```

## 定时运行备份脚本

> 写shell脚本时不要再win下写好再放进去.不然会出现奇怪的问题

```shell
#!/bin.sh
# mysql备份使用的shell脚本
#includ <studio.h>
#includ <time.h>
#includ <stdlib.h>
#includ <sys/time.h>
log="/usr/local/mysql-back/mysql-echo.log"
echo $(date +"%Y-%m-%d %H:%M:%S")"脚本执行开始">> $log;

data_time=$(date '+%Y%m%d')
path="/usr/local/mysql-back/${data_time}"


if [ ! -d $path ]; then
echo "文件不存在! 创建文件夹" >> $log
sudo mkdir $path
fi

mysqldump  -uroot -p`Mysql密码`  导出的数据库名称  > /usr/local/mysql-back/${data_time}/导出的数据库名称.sql
echo "执行结束" >> $log

echo "开始移除7天之前的备份数据" >> $log
# 移除几天前就将 7 改为几天
daysAgo=$(date -d "7 day ago "$date '+%Y%m%d');

function del_directory(){
if [ $(($1)) -lt $(($daysAgo)) ];
    then
        echo "移除 ${1} 目录" >> $log
        `rm -rf $1`
fi
}

function read_dir() {
#注意此处这是两个反引号，表示运行系统命令
for file in `ls $1`
do
    if [ -d $file ];then
        del_directory $file
    fi
done
}
#读取第一个参数
read_dir $1
echo "结束删除之前备份数据" >> $log
echo $(date +"%Y-%m-%d %H:%M:%S")"脚本执行结束">> $log;
```

```shell
# 输入下面命令可以进到编辑页面
crontab -e
# 将下面这个定时任务写进去
00 1 * * * '/usr/local/mysql-back/mysql-back.sh' > /usr/local/mysql-back/back-err.log  &
# 下面命令可以查看当前有的定时任务
crontab -l
```

```shell
# 还原命令
mysql -uroot -p`Mysql密码` < db_202306301501.sql
# 指定库还原
mysql -uroot -p`Mysql密码` databaseName < db_202306301501.sql

```
