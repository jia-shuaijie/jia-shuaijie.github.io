---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Spring Cloud Sleuth (链路追踪)
基本术语
```
Spring Cloud Sleuth采⽤的是Google的开源项⽬Dapper的专业术语.

Span
    基本⼯作单元,发送⼀个远程调度任务 就会产⽣⼀个Span,Span有⼀个64位ID唯⼀标识的,Trace是⽤另⼀个64位ID唯⼀标识的,Span还有其他数据信息,⽐如摘要、时间戳事件、Span的ID、以及进度ID。

Trace
    ⼀系列Span组成的⼀个树状结构。请求⼀个微服务系统的API接⼝,这个API接⼝,需要调⽤多个微服务,调⽤每个微服务都会产⽣⼀个新的Span,所有由这个请求产⽣的Span组成了这个Trace。
Annotation
    ⽤来及时记录⼀个事件的,⼀些核⼼注解⽤来定义⼀个请求的开始和结束 。这些注解包括以下： cs - Client Sent -客户端发送⼀个请求,这个注解描述了这个Span的开始
    sr - Server Received -服务端获得请求并准备开始处理它,如果将其sr减去cs时间戳便可得到⽹络传输的时间。
    ss - Server Sent (服务端发送响应)–该注解表明请求处理的完成(当请求返回客户端),如果ss的时间戳减去sr时间戳,就可以得到服务器请求的时间。
    r - Client Received (客户端接收响应)-此时Span的结束,如果cr的时间戳减去cs时间戳便可以得到整个请求所消耗的时间
```

![链路追踪术语](https://i.jpg.dog/f50a2a29c7744cffa8e6e1d2d751be50.png)


## 案例
### Zipkin-Server
下载 Zipkin-Server 地址:  https://archiva-maven-storage-prod.oss-cn-beijing.aliyuncs.com/repository/central/io/zipkin/zipkin-server/2.23.2/zipkin-server-2.23.2-exec.jar

启动Zipkin-Server java -jar zipkin-server-2.23.2-exec.jar

#### Zipkin-Client
添加依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-sleuth-zipkin</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-sleuth</artifactId>
</dependency>
```
application.yml中添加以下内容
```yml
spring:
    application:
        name: cloud-payment-service
    zipkin:
        base-url: http://192.168.220.12:9411
        sender:
            type: web
    sleuth:
        sampler:
            probability: 1
# spring.zipkin.base-url：指定Zipkin的服务端,⽤于发送链路报告
# spirng.zipkin.sender.type：web表示使⽤http发送数据
# spring.sleuth.sampler.probability：采样率,值为[0,1]之间,这⾥表示100%采样报告
```

#### 使⽤RabbitMQ传输链路数据
在 docker 中安装 RabbitMQ
```shell
docker pull rabbitmq:management
docker run -d -p 5672:5672 -p 15672:15672 --name rabbitmq rabbitmq:management
```

Zipkin-Server 启动Zipkin-Server时,指定从RabbitMQ获得链路消息数据。命令如下
```
RABBIT_ADDRESSES=localhost java -jar zipkin-server-2.23.2-exec.jar
#或者下⾯命令
java -jar zipkin-server-2.23.2-exec.jar --zipkin.collector.rabbitmq.addresses=localhost
# 注意这⾥使⽤localhost,故此需要把 zipkin-server-2.23.2-exec.jar 上传到docker所在的虚拟机。
```

Zipkin-Client中添加依赖
```xml
<dependency>
    <groupId>org.springframework.amqp</groupId>
    <artifactId>spring-rabbit</artifactId>
</dependency>
```
修改application.yml 配置,将链路数据发送给RabbitMQ
```yml
spring:
    zipkin:
        rabbitmq:
            addresses: 192.168.220.12:5672
            # base-url: http://192.168.220.12:9411
    sender:
        type: rabbit
    sleuth:
        sampler:
            probability: 1
# 因为发送链路数据的⽅式type=rabbit,故此需要配置spring.zipkin.rabbitmq,同时base-url就不需要了
```

#### 使⽤ElasticSearch存储链路数据
Zipkin Server将链路数据存储在内存中,⼀旦程序重启,之前的链路数据全部丢失。

那么怎么将链路数据存储起来呢？
    
    Zipkin⽀持将链路数据存储在MySql、Elasticsearch,和Cassandra数据库中.

安装Elasticsearch和Kibana 使⽤docker安装Elasticsearch和Kibana。命令如下

```shell
docker pull elasticsearch:7.13.4
# 创建⾃定义的⽹络(⽤于连接到连接到同⼀⽹络的其他服务(例如Kibana))
docker network create somenetwork
#运⾏Elasticsearch
docker run -d --name elasticsearch --net somenetwork -p 9200:9200 -p
9300:9300 -e "discovery.type=single-node" elasticsearch:7.13.4
docker pull kibana:7.3.4
# 运⾏ Kibana
docker run -d --name kibana --net somenetwork -p 5601:5601 kibana:7.13.4
```

Zipkin-Server 启动Zipkin Server时,指定使⽤ES存储数据,命令如下
```shell
RABBIT_ADDRESSES=localhost STORAGE_TYPE=elasticsearch ES_HOSTS=http://localhost:9200 java -jar zipkin-server-2.23.2-exec.jar 
#或者 

java -jar zipkin-server-2.23.2-exec.jar -- zipkin.collector.rabbitmq.addresses=localhost --STORAGE_TYPE=elasticsearch --ES_HOSTS=http://localhost:9200
```