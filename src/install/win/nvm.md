---
icon: pen-to-square
date: 2024-06-24
category:
  - win
---
# nvm

## 安装NVM

如果已经安装了node请先卸载.

从github中找到nvm所在仓库进行下载.

`nvm下载地址:` <https://github.com/coreybutler/nvm-windows/releases>

nvm下载时请选择下图所框选的包
![nvm下载选择](https://img.gsimg.top/2024/04/17/flkik4.png)

下载的虽然是压缩包但是解压后是exe安装包.
![nvm安装地址](https://img.gsimg.top/2024/04/17/fsuhkz.png)
![nodejs安装地址](https://img.gsimg.top/2024/04/17/fsuir7.png)
![点击安装](https://img.gsimg.top/2024/04/17/fsuh59.png)
![安装完成](https://img.gsimg.top/2024/04/17/fsuqlx.png)

### 配置下载源

在nvm安装根目录[也就是安装时配置的目录]下找到配置文件
![Snipaste_2024-04-17_09-58-42](https://img.gsimg.top/2024/04/17/fuq1pe.png)

配置nvm下载源

```text
node_mirror https://npmmirror.com/mirrors/node/
npm_mirror: https://npmmirror.com/mirrors/npm/
```

![配置下载源](https://img.gsimg.top/2024/04/17/gk7dsg.png)

### 配置全局NPM

1. `npm config set prefix "D:\devTools\nvm\npm-repository"` 配置npm下载包时的全局包路径
2. `npm config set registry https://registry.npmmirror.com` 安装全局npm，不同的node都使用这个npm。想更新全局的npm的话首先删除全局路径(就是上一行命令的地址，可以使用npm config ls查看)下的npm，再执行一次这个命令即可。
3. 在用户变量中添加 `NPM_HOME = E:\nvm\npm`，path中添加%NPM_HOME%。这里需要注意的是，%NPM_HOME%要添加在%NVM_SYMLINK%之前，避免npm访问到的是nodejs中自带的npm包管理工具。

> ps: npmmirror 镜像站 <https://www.npmmirror.com/>
>
## nvm使用

查看nvm版本号: `nvm version`
查看网络可以安装的版本: `nvm list available`

![nvm安装版本查看](https://img.gsimg.top/2024/04/17/goy2ra.png)

指定一个版本进行安装: `nvm install 18.20.2`
![Snipaste_2024-04-17_10-11-42](https://img.gsimg.top/2024/04/17/grrgry.png)
查看已安装的node版本: `nvm list`

选择一个版本进行使用: `nvm use 18.20.2`
![Snipaste_2024-04-17_10-13-03](https://img.gsimg.top/2024/04/17/grrb58.png)

### nvm常用命令

| 命令                     | 说明                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| nvm list                 | 查看已经安装的版本                                                                                   |
| nvm list installed       | 查看已经安装的版本                                                                                   |
| nvm list available       | 查看网络可以安装的版本                                                                               |
| nvm arch                 | 查看当前系统的位数和当前nodejs的位数                                                                 |
| nvm install [arch]       | 安装制定版本的node 并且可以指定平台 version 版本号 arch 平台                                         |
| nvm on                   | 打开nodejs版本控制                                                                                   |
| nvm off                  | 关闭nodejs版本控制                                                                                   |
| nvm proxy [url]          | 查看和设置代理                                                                                       |
| nvm node_mirror [url]    | 设置或者查看setting.txt中的node_mirror，如果不设置的默认是 <https://nodejs.org/dist/>                |
| nvm npm_mirror [url]     | 设置或者查看setting.txt中的npm_mirror,如果不设置的话默认的是：<https://github.com/npm/>npm/archive/. |
| nvm uninstall            | 卸载指定的版本                                                                                       |
| nvm use [version] [arch] | 切换指定的node版本和位数                                                                             |
| nvm root [path]          | 设置和查看root路径                                                                                   |
| nvm version              | 查看当前的版本                                                                                       |
