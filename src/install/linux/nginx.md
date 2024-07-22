---
icon: pen-to-square
date: 2024-07-22
category:
  - linux
---
# nginx 安装
nginx 下载地址: https://nginx.org/en/download.html
这里附带上我下载好的所有安装包
```
蓝奏云: https://wwm.lanzoub.com/b02770yri
密码:0000
```

需要安装 gcc环境
```shell
# 安装 make
yum -y install gcc automake autoconf libtool make
# 安装 gcc
yum install gcc gcc-c++
```

## PCRE安装
PCRE 下载地址 https://sourceforge.net/projects/pcre/files/pcre/


安装PCRE库
```shell
# 解压 pcre
tar -zxvf pcre-8.45.tar.gz -C /root/app
# 运行下面命令安装
./configure
make
make install

```
## zlib库
下载地址: http://www.zlib.net/fossils/

安装zlib库
```shell
# 将下载好的 zlib上传到 Linux
tar -zxvf zlib-1.2.12.tar.gz -C /root/app
# 运行以下命令安装 zlib
./configure
make
make install
```
# 安装ssl(某些vps默认没装ssl)
下载地址: https://www.openssl.org/source/

```shell
# 直接解压就可以
tar -zxvf openssl-1.0.1c.tar.gz -c /root/app
```

# 安装 nginx
下载好 nginx 的包上传到 Linux 上,解压至指定位置
```shell
# 解压 nginx 包
tar -zxvf nginx-1.21.6.tar.gz -C /root/app/nginx
# 安装
./configure --sbin-path=/root/app/nginx-1.21.6 \
--conf-path=/root/app/nginx-1.21.6/nginx.conf \
--pid-path=/root/app/nginx-1.21.6/nginx.pid \
--with-http_ssl_module \
--with-pcre=/root/app/pcre-8.45 \
--with-zlib=/root/app/zlib-1.2.12 \
--with-openssl=/root/app/openssl-1.1.1n

make
make install
# --with-pcre=/usr/src/pcre-8.34 指的是pcre-8.34 的源码路径。
# --with-zlib=/usr/src/zlib-1.2.7 指的是zlib-1.2.7 的源码路径。
```

查看端口是否被占用
```shell
netstat -ano|grep 80
```

运行 nginx
```shell
# 如果查不到结果后执行,有结果则忽略此步骤(ubuntu下必须用sudo启动,不然只能在前台运行)
sudo /root/app/nginx-1.21.6
```

停止 nginx
```
# 找到 nginx 服务
ps -ef|grep nginx
# 直接杀死进程
kill -QUIT  进程id

netstat -tnulp | grep nginx # 参看端口是否关闭
systemctl status nginx  # 查看服务是否关闭
```