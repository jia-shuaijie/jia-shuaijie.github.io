---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Eureka(服务注册与发现)
简介
```
Eureka 来源于古希腊词汇,意为"发现了"。
在软件领域,Eureka是Netflix在线影⽚公司开源的⼀个服务注册和发现组件,和其他的Netflix公司的服务组件(例如负载均衡,熔断器,⽹关等)⼀起,被Spring Cloud社区整合为Spring Cloud Netflix模块。

和Zookeeper类似,Eureka是⼀个⽤于服务注册和发现的组件,最开始主要应⽤与亚⻢逊公司的云计算服务平台AWS,Eureka分为Eureka Server和Eureka Client,Eureka Server为Eureka服务注册中⼼,Eureka Client为Eureka客户端。

Eureka主要涉及到三⼤⻆⾊
    服务提供者、服务消费者、注册中⼼.

服务注册是指各个微服务在启动时,将⾃⼰的⽹络地址等信息注册到Eureka,服务提供者将⾃⼰的服务信息,如服务名、IP等告知服务注册中⼼。

服务发现是指当⼀个服务消费者需要调⽤另外⼀个服务时,服务消费者从Eureka查询服务提供者的地址,并通过该地址调⽤服务提供者的接⼝。⼀个服务既可以是服务消费者,也可以是服务发现者。

各个微服务与注册中⼼使⽤⼀定机制(例如⼼跳)通信。如果Eureka与某微服务⻓时间⽆法通信,Eureka会将该服务实例从服务注册中⼼中剔除,如果剔除掉这个服务实例过了⼀段时间,此服务恢复⼼跳,那么服务注册中⼼将该实例重新纳⼊到服务列表中.

Eureka2.x已经停更,解决⽅案推荐使⽤Nacos作为替换⽅案
```
## eureka 集群示例
注意
1. 在yaml单⼀配置⽂件中,可⽤连续三个连字号(---)区分多个⽂件。
2. Spring Boot2.4.x使⽤spring.config.activate.on-profile代替原来的spring.profiles 因为本地搭建Eureka Server集群,所以需要修改本地的host⽂件

修改本地 host 文件
```
127.0.0.1  peer1
127.0.0.1  peer2
127.0.0.1  peer3
```
在 eureka 服务的 application.yml 中配置如下
```yml
server:
  port: 9004
spring:
  application:
    name: eureka-server
eureka:
  client:
    service-url:
      defaultZone: http://peer1:9003/eureka,http://peer2:9004/eureka,http://peer3:9005/eureka
    register-with-eureka: false
    fetch-registry: false
  instance:
    lease-renewal-interval-in-seconds: 30
    lease-expiration-duration-in-seconds: 90
  server:
    enable-self-preservation: false 
    eviction-interval-timer-in-ms: 1000 
---
spring:
  config:
    activate:
      on-profile: peer1
server:
  port: 9003
eureka:
  instance:
    hostname: peer1
  client:
    service-url:
      defaultZone: http://peer2:9004/eureka/,http://peer3:9005/eureka/
---
spring:
  config:
    activate:
      on-profile: peer2
server:
  port: 9004
eureka:
  instance:
    hostname: peer2
  client:
    service-url:
      defaultZone: http://peer1:9003/eureka/,http://peer3:9005/eureka/
---
spring:
  config:
    activate:
      on-profile: peer3
server:
  port: 9005
eureka:
  instance:
    hostname: peer3
  client:
    service-url:
      defaultZone: http://peer1:9003/eureka/,http://peer2:9004/eureka/
```

## eureka 使用
在 idea 新建此 module 时使用 spring lnitializr方式创建  
![eureka服务创建](https://i.jpg.dog/fcbf2cd711d35e3f8f8af7551766b72d.png)

在 spring boot 的启动器添加当前服务是 eureka 服务的注解
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * @author blackFire
 * @EnableEurekaServer 这个注解表示当前服务为 eureka 的服务
 */
@SpringBootApplication
@EnableEurekaServer
public class EurekaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }

}
```
修改配置文件 application.yml
```yml
server:
  # 端口号
  port: 9004

spring:
  application:
    # 服务运行是的服务名
    name: eureka-server


eureka:
  client:
    service-url:
      # 提供服务的地址
      defaultZone: http://127.0.0.1:9004/eureka
    register-with-eureka: false
    fetch-registry: false
  server:
    # 关闭 eureka ⾃我保护模式(缺省为打开)
    enable-self-preservation: false
    # 扫描失效服务的间隔时间(缺省为60*1000ms)
    eviction-interval-timer-in-ms: 1000 
```

### eureka 注册服务

当其他服务想要向 eureka 服务进行注册时需要以下配置

1. pom.xml 中导入 eureka 的依赖
```xml
<properties>
        <java.version>1.8</java.version>
        <spring-cloud.version>2020.0.3</spring-cloud.version>
</properties>
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
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
```

2. 在当前服务的 application.yml 文件中添加一下内容
```yml
eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:9004/eureka/
    # 可以不写  默认为 true
    fetch-registry: true    
    # 可以不写  默认为 true
    register-with-eureka: true 
```
3. 并且需要在当前服务的启动器上添加注解,示例如下
```java
@SpringBootApplication
@EnableDiscoveryClient
public class application {
    public static void main(String[] args) {
        SpringApplication.run(application.class, args);
    }
}
```




















