# Centos7安装emqx

我们可以去  [emqx](https://www.emqx.com/zh/try?product=broker) 中下载对应的版本,当然你也可以去看 [emqx 官方文档](https://www.emqx.io/docs/zh/v5.0/).

下载对应的安装包可以去 [emqx官网下载](https://www.emqx.com/zh/downloads-and-install?product=broker&version=5.0.9&os=Centos7&oslabel=CentOS%207)

```shell
wget https://www.emqx.com/zh/downloads/broker/5.0.9/emqx-5.0.9-el7-amd64.rpm
sudo yum install emqx-5.0.9-el7-amd64.rpm
emqx start # 或者执行:  sudo systemctl start emqx
```

## 错误解决

### 如果错误中有报缺少`openssl1.1.1`可以查看[官网](https://www.emqx.io/docs/zh/v4.3/faq/error.html#openssl-%E7%89%88%E6%9C%AC%E4%B8%8D%E6%AD%A3%E7%A1%AE) 中给的解决方法

```shell
wget https://www.openssl.org/source/openssl-1.1.1c.tar.gz
tar zxf openssl-1.1.1c.tar.gz
cd openssl-1.1.1c
./config
make test # 执行测试；如果输出 PASS 则继续
# 如果这一步报 Parse errors: No plan found in TAP output 那么执行 yum install perl-Test-Simple 后消失
make install # 为了确保库的引用可以之心下面两行,当然可以选择不执行
ln -s /usr/local/lib64/libssl.so.1.1 /usr/lib64/libssl.so.1.1
ln -s /usr/local/lib64/libcrypto.so.1.1 /usr/lib64/libcrypto.so.1.1
```

### 如果Centos8使用tar包进行安装可能会遇到下面的错误 `error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory` 解决此错误有两个方法我个人是用第二个方法解决的

1. 运行 `yum install  libtinfo.so.5`
2. 在 tar 解压的包中找到 `dynlibs` 将这个目录下的 `libtinfo.so.5` 复制到 `/usr/lib64` 下即可解决
