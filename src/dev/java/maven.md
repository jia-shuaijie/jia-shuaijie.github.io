---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
---
# Maven

## maven镜像源配置

maven 配置华为云镜像[官方文档地址: https://www.huaweicloud.com/special/maven-jingxiang.html](https://www.huaweicloud.com/special/maven-jingxiang.html)

```xml
<mirror>
    <id>huaweicloud</id>
    <mirrorOf>*</mirrorOf>
    <url>https://repo.huaweicloud.com/repository/maven/</url>
</mirror>
```

maven 配置阿里云镜像[官网指南: https://developer.aliyun.com/mvn/guide](https://developer.aliyun.com/mvn/guide)

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```
