---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
---
# fastdfs
简介
```
FastDFS是一个开源的轻量级分布式文件系统,它对文件进行管理.

功能包括
    文件存储
    文件同步
    文件访问(文件上传、文件下载)等.

fastdft 解决了大容量存储和负载均衡的问题。
特别适合以文件为载体的在线服务,如相册网站、视频网站等等。
FastDFS为互联网量身定制,充分考虑了冗余备份、负载均衡、线性扩容等机制,并注重高可用、高性能等指标,使用FastDFS很容易搭建一套高性能的文件服务器集群提供文件上传、下载等服务。

FastDFS 架构包括 Tracker server 和 Storage server。

客户端请求 Tracker server 进行文件上传、下载,通过 Tracker server 调度最终由 Storage server 完成文件上传和下载。

Tracker server 作用是负载均衡和调度,通过 Tracker server 在文件上传时可以根据一些策略找到Storage server 提供文件上传服务。
可以将 tracker 称为追踪服务器或调度服务器。

Storage server 作用是文件存储,客户端上传的文件最终存储在 Storage 服务器上,Storageserver 没有实现自己的文件系统而是利用操作系统的文件系统来管理文件。
可以将storage称为存储服务器。
```

## 文件上传
pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.1</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.black_fire</groupId>
    <artifactId>upload-service</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>upload-service</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>2021.0.0</spring-cloud.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <!-- fsatdfs 依赖 -->
        <dependency>
            <groupId>com.github.tobato</groupId>
            <artifactId>fastdfs-client</artifactId>
            <version>1.26.7</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

application.yml配置
```yml
server:
  port: 9008

# 日志
#logging:
#  # file: demo.log
#  pattern:
#    console: "%d -%msg%n
#    level:
#      org.springframework.web: debug
#      com.black_fire: debug
spring:
  application:
    name: upload-service
  servlet:
    multipart:
      enabled: true
      max-file-size: 10MB # 单个文件上传大小
      max-request-size: 20MB # 总文件上传大小
fdfs:
  # 链接超时
  connect-timeout: 60
  # 读取时间
  so-timeout: 60
  # 生成缩略图参数
  thumb-image:
    width: 150
    height: 150
  tracker-list: 192.168.243.132:22122

eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:9004/eureka
  instance:
    # 更倾向于使用ip地址,而部署主机名
    prefer-ip-address: true
    # ip 地址
    ip-address: 127.0.0.1
    # 续约间隔,默认30秒
    lease-renewal-interval-in-seconds: 5
    # 服务的失效时间,默认90秒
    lease-expiration-duration-in-seconds: 5
```

添加配置类
```java
import com.github.tobato.fastdfs.FdfsClientConfig;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;

@Configuration
@Import(FdfsClientConfig.class)
public class DfsConfig {
}
```

工具类
```java
import com.github.tobato.fastdfs.domain.fdfs.StorePath;
import com.github.tobato.fastdfs.service.FastFileStorageClient;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileDfsUtil {

    @Autowired
    private FastFileStorageClient storageClient;

    /**
     * 上传文件
     * @param multipartFile
     * @return
     * @throws Exception
     * multipartFile.getInputStream() 获取文件输入流
     * multipartFile.getSize()  获取文件大小
     * FilenameUtils.getExtension(multipartFile.getOriginalFilename()); 获得文件后缀名
     */
    public String upload(MultipartFile multipartFile) throws Exception{
        String extName = FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        StorePath storePath = storageClient.uploadImageAndCrtThumbImage(multipartFile.getInputStream(), multipartFile.getSize(), extName, null);
        return storePath.getFullPath();
    }

    /**
     * 删除文件
     * @param fileUrl
     */
    public void  deleteFile(String fileUrl){
        StorePath storePath = StorePath.parseFromUrl(fileUrl);
        storageClient.deleteFile(storePath.getGroup(),storePath.getPath());
    }
}
```

上传文件控制器
```java
import com.black_fire.util.FileDfsUtil;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileController {

    @Autowired
    private FileDfsUtil fileDfsUtil;

    /**
     * 上传
     * @param file
     * @return
     */
    @RequestMapping(value = "/uploadFile",method =  RequestMethod.POST,headers = "content-type=multipart/form-data")
    public ResponseEntity<String> upload(@RequestParam("file")MultipartFile file){
        String result = "";
        try {
            String path = fileDfsUtil.upload(file);
            if (StringUtils.isEmpty(path)){
                result = "上传失败";
            }else {
                result = path;
            }
        } catch (Exception e) {
            e.printStackTrace();
            result = "服务器异常";
        }
        return  ResponseEntity.ok(result);
    }


    /**
     * 删除文件
     * @param filePathName
     * @return
     */
    @RequestMapping(value = "/deleteByPath" ,method = RequestMethod.GET)
    public ResponseEntity<String> deleteByPath(String filePathName){
        fileDfsUtil.deleteFile(filePathName);
        return ResponseEntity.ok("success delete");
    }
}
```