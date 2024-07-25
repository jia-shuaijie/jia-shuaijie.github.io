---
icon: pen-to-square
date: 2024-07-23
category:
  - android
order: 1
---
# Android系列之Android Studio

## Android studio 下载

Android studio官网下载地址: <https://developer.android.google.cn/studio?hl=zh-cn>

![Snipaste 2024 07 23 19 13 01](https://i.jpg.dog/58ea6e2e38ed318c1b6c7af8d2676ad2.png)

## 配置sdk和gradle相关的存放地址

1. 配置全局默认设置

![打开全局配置](https://i.jpg.dog/a52d01bcc95865d0e5366dd8e4e4e33b.png)

2. 配置android studio sdk默认位置

![配置android studio sdk默认位置](https://i.jpg.dog/ee6ec29bbe68301f32351250672d3bad.png)

3. 配置gradle下载存放位置

![gradle下载存放位置](https://i.jpg.dog/e46ac0e2b2b3d2dc965d567236e4719f.png)

## 创建一个项目
1. 点击 new Project

![创建项目](https://i.jpg.dog/f165ffb0606e36e3309adcec9772b8eb.png)

2. 选择EmptyActivity

![Snipaste 2024 07 23 19 17 35](https://i.jpg.dog/8a4b79371edd30114e44c5797eb65664.png)

3. 配置app名称等相关配置

![Snipaste 2024 07 23 19 19 16](https://i.jpg.dog/b985141029fc16a254fdcd512553fa07.png)

4. 离线安装gradle

![Snipaste 2024 07 23 19 34 02](https://i.jpg.dog/dd0da4ae3cb20e8ed9ef4384d547b61b.png)
  
  - 从国内镜像源中找到对应的gradle包直接将其下载下来
  - 镜像源地址: <https://mirrors.aliyun.com/macports/distfiles/gradle/>

![Snipaste 2024 07 23 19 40 45](https://i.jpg.dog/584e4281f48235cbf5abdaf5a54df55a.png)

  - 找到`C:\Users\user\.gradle\wrapper\dists\gradle-8.7-bin`,里面会有一个乱码的文件夹将下载好的压缩包直接放入这个乱码文件夹中即可
  - 由于上面改了gradle下载存放地址,所以有的可能需要去上面修改的存放地址下找`wrapper\dists\gradle-8.7-bin`

![Snipaste 2024 07 23 19 37 03](https://i.jpg.dog/fd0b39e13e93a3beb0dcb858d743144c.png)



5. 找到setting.gradle或setting.gradle.kt修改为国内镜像源

```gradle
pluginManagement {
    repositories {
        maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { url=uri ("https://maven.aliyun.com/repository/public") }
        maven { url=uri ("https://jitpack.io") }
        maven { url=uri ("https://maven.aliyun.com/repository/releases") }
        maven { url=uri ("https://maven.aliyun.com/repository/google") }
        maven { url=uri ("https://maven.aliyun.com/repository/central") }

        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven { url=uri ("https://maven.aliyun.com/repository/public") }
        maven { url=uri ("https://maven.aliyun.com/repository/gradle-plugin") }
        maven { url=uri ("https://jitpack.io") }
        maven { url=uri ("https://maven.aliyun.com/repository/releases") }
        maven { url=uri ("https://maven.aliyun.com/repository/google") }
        maven { url=uri ("https://maven.aliyun.com/repository/central") }
        google()
        mavenCentral()
    }
}
```

![示例图](https://i.jpg.dog/3cee6ef1a56014ff29240704cbdba030.png)

6. 找到缓存包清理一下缓存.

  - 没有更改gradle存放位置的,去`C:\Users\user\.gradle` 找到`caches` 清空该文件夹即可(可能需要先关闭android studio).
  - 更改了gradle存放位置的在更改后的位置中找到`caches`清空即可. 例如我的更改后的位置是`D:\devtools\gradle-repo`,那么我需要清除的缓存地址就是`D:\devtools\gradle-repo\caches`

7. 一切正常的话应该如下图一样

![成功示例图](https://i.jpg.dog/a4244839d41039c5f6e889fc6869efe1.png)

## 创建虚拟手机

![Snipaste 2024 07 23 19 52 10](https://i.jpg.dog/5ffa8feab135dc5167139c14a11a289b.png)
![Snipaste 2024 07 23 19 53 01](https://i.jpg.dog/ce6b980eb6db2f0a0f7a2ec222531d89.png)
![Snipaste 2024 07 23 19 53 38](https://i.jpg.dog/78d9b56fff9a2f0cf6a0ecfbb8c8cea1.png)

创建好后不要打开这个虚拟手机,我们需要先将这个虚拟手机迁移到一个固定位置,一直堆积在c盘会很容易爆满.

1. 在c盘中找到`C:\Users\user\.android\avd`
2. 里面会有一个`Nexus_4_API_30.ini`文件 和`Nexus_4_API_30.avd`文件夹
3. 我们想 `Nexus_4_API_30.avd`文件夹迁移到一个新的位置,我这里迁移到了`D:\devtools\Android\avd`目录下
4. 打开`Nexus_4_API_30.ini` 文件,修改path变量为最新的地址,例如我的就是`D:\devtools\Android\avd\Nexus_4_API_30.avd`

![Nexus_4_API_30.ini](https://i.jpg.dog/8fc5fe192630c26ff2c6f865abba088c.png)

