---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Spring Cloud Config
简介
```
在Spring Boot项⽬中,默认会提供⼀个application.properties或者 application.yml⽂件,我们可以把⼀些全局性的配置或者需要动态维护的配置写⼊改⽂件,不如数据库连接,功能开关,限流阈值,服务地址等。为了解决不同环境下服务连接配置等信息的差异,Spring Boot还提供了基于spring.profiles.active={profile}的机制来实现不同的环境的切换。

随着单体架构向微服务架构的演进,各个应⽤⾃⼰独⽴维护本地配置⽂件的⽅式开始显露出它的不⾜之处,主要有下⾯⼏点:

    配置的动态更新
        在实际应⽤会有动态更新位置的需求,⽐如修改服务连接地址、限流配置等。在传统模式下,需要⼿动修改配置⽂件并且重启应⽤才能⽣效,这种⽅式效率太低,重启也会导致服务暂时不可⽤。

    配置多节点维护
        在微服务架构中某些核⼼服务为了保证⾼性能会部署上百个节点,如果在每个节点中都维护⼀个配置⽂件,⼀旦配置⽂件中的某个属性需要修改,可想⽽知,⼯作量是巨⼤的。

        不同部署环境下配置的管理：前⾯提到通过profile机制来管理不同环境下的配置,这种⽅式对于⽇常维护来说也⽐较繁琐。

统⼀配置管理就是弥补上述不⾜的⽅法,简单说,最近本的⽅法是把各个应⽤系统中的某些配置放在⼀个第三⽅中间件上进⾏统⼀维护。然后,对于统⼀配置中⼼上的数据的变更需要推送到相应的服务节点实现动态跟新,所以微服务架构中,配置中⼼也是⼀个核⼼组件,⽽Spring Cloud Config就是⼀个配置中⼼组件,并且可以Git,SVN,本地⽂件等作为存储。
```

## 实践
在 idea 新建此 module 时使用 spring lnitializr方式创建

![springCloudConfig创建](https://i.jpg.dog/92915291d8d82688a16f581626666dd6.png)

在 spring boot 启动器上添加注解
```java
@SpringBootApplication
@EnableConfigServer
public class ConfigApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigApplication.class, args);
    }
}
```
在配置文件中添加
```yml
server:
  port: 9006
spring:
  profiles:
    active: native
  application:
    name: cloud-config
  cloud:
    config:
      server:
        git:
          uri: https://gitee.com/Black-sky-cloud/clouf-config.git
          search-paths: repo
          default-label: master


eureka:
  client:
    service-url:
      defaultZone: http://127.0.0.1:9004/eureka
```

Config Server默认存储配置的⽅式是git,如果git仓库是公开仓库,username和password属性可以省略不配置,具体配置属性解释如下。
```
spring.cloud.config.server.git.uri
    配置⽂件所在的git仓库
spring.cloud.config.server.git.search-paths
    配置⽂件所在⽬录
spring.cloud.config.server.git.default-label
    配置⽂件分⽀
```

配置仓库
在git仓库中,创建config⽬录,在config⽬录中创建 app-dev.yml配置⽂件,代码如下
```
key1: v1
key2: v2
key3: v3
```
Spring Cloud Config 有它的⼀套访问规则,我们通过这套规则在浏览器上直接访问就可以。
```
/{application}-{profile}.yml
/{label}/{application}-{profile}.yml

上面的词语解释
{application}
    就是应⽤名称,对应到配置⽂件上来,就是配置⽂件的名称部分,例如我上⾯创建的配置⽂件。
{profile} 
    就是配置⽂件的版本,我们的项⽬有开发版本、测试环境版本、⽣产环境版本,对应到配置⽂件上来就是以
application-{profile}.yml 
    加以区分,例如application-dev.yml、application-test.yml、application-prod.yml。
{label} 
    表示 git 分⽀,默认是 master 分⽀,如果项⽬是以分⽀做区分也是可以的,那就可以通过不同的 label 来控制访问不同的配置⽂件了。

git仓库配置⽂件缓存本地⽬录 c:\Users\Administrator\AppData\Local\Temp\config-repo-4882682414831344447 ,可以通过basedir属性改变。
```

### 从 configService 中获取 application.yml的配置
添加依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

application.yml 添加以下内容
```yml
spring:
 application:
     name: cloud-payment-service
 cloud:
     config:
         uri: http://localhost:9006
         profile: default
         label: master
     config:
         import: optional:configserver:http://localhost:9006
```
配置解释
```
spring.config.import=optional:configserver:http://localhost:9006 指定Spring Boot项⽬从 Config Server 导⼊配置
spring.cloud.config.url：Config Server地址,默认localhost:8888
spring.cloud.config.profile：为git配置⽂件的后缀
spring.cloud.config.label：为访问git的分⽀。
```

### 本地配置数据
虽然git存储配置数据⾮常⽅便,但是在项⽬开发阶段,使⽤git存储还是很不⽅便,Spring Cloud Config⽀持多种配置存储⽅式,⽐如默认的git,还有本地⽂件存储,JDBC,Redis等存储⽅式,这⾥介绍下本地⽂件存储,其他存储⽅式,参考官⽅⽂档

application.yml 中添加以下内容
```yml
spring:
    profiles:
        active: native
    cloud:
        config:
            server:
                native:
                    search-locations: classpath:/config_repo
# spring.profiles.active=native：表示使⽤本地配置存储
# spring.cloud.config.server.native.searchLocations：指定配置⽂件所在路径,可以使⽤相对路径⽐如classpath
```

### 自动刷新配置
Spring Cloud Config在项⽬启动时⾃动加载配置内容这⼀机制,导致了他的⼀个缺陷,配置不能⾃动刷新,在上述案例中,修改git仓库中的key1的值"key1=v11",发现⽀付服务得到的配置项key1的值还是旧的配置内容,新的内容不会⾃动刷新过来,在微服务架构中,动辄上百个节点如果都需要重启,这个问题⾮常麻烦。 我们可以使⽤Spring Cloud Bus和Spring Boot Actuator实现⾃动刷新,实现原理如图6-6所示

![自动刷新](https://i.jpg.dog/490f9d2067d4e97f73207aed43df3386.png)

####  配置中心服务端
导入依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```
application.yml 中配置连接RabbitMQ,同时配置暴露/actuator/bus-refresh端点
```yml
spring:
 rabbitmq:
     host: 192.168.56.110
     port: 5672
     username: guest
     password: guest
management:
 endpoints:
     web:
         exposure:
             include: bus-refresh
 endpoint:
     bus-refresh:
         enabled: true
```

#### 配置中⼼客户端
导入依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```
application.yml 中配置
```yml
spring:
    application:
        name: cloud-payment-service
    rabbitmq:
        host: 192.168.56.110
        port: 5672
        username: guest
        password: guest
```
使⽤@RefreshScope注解刷新更改的配置,代码示例如下
```java
@RequestMapping("/payment")
@Slf4j
@RefreshScope
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;
    @Value("${key1}")
    private String key1;
    @Value("${key2}")
    private String key2;
    @Value("${key3}")
    private String key3;

    @RequestMapping("/{id}")
    public ResponseEntity<Payment> payment(@PathVariable("id") Integer id) {
        log.info("key1={}, key2={}, key3={}", key1, key2, key3);
        Payment payment = new Payment(id, "⽀付成功,服务端⼝=" + serverPort);
        return ResponseEntity.ok(payment);
    }
}
```