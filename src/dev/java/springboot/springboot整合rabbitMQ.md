---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# spring boot 整合 rabbitMQ

## 搭建生产者工程
pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.4.RELEASE</version>
    </parent>
    <groupId>cn.black_fire</groupId>
    <artifactId>springboot-rabbitmq-producer</artifactId>
    <version>1.0-SNAPSHOT</version>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
    </dependencies>
</project>
```

创建配置文件和启动器. 在 application.yml 配置文件中添加以下内容
```yml
spring:
  rabbitmq:
    port: 5672
    host: 192.168.65.128
    virtual-host: /black_fire_test
    username: black_fire
    password: black_fire
```

创建配置文件
```java
package cn.black_fire.config;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author black_fire
 */
@Configuration
public class RabbitMqConfig {
    /**
     * 交换机名称
     */
    public static  final String ITEM_TOPIC_EXCHANGE = "springboot_item_topic_exchange";

    /**
     * 队列名称
     */
    public static final String ITEM_QUEUE = "springboot_item_queue";

    /**
     * 构建一个 itemTopicExchange 的交换机
     */
    @Bean("itemTopicExchange")
    public Exchange topicExchange(){
        return ExchangeBuilder.topicExchange(ITEM_TOPIC_EXCHANGE).durable(true).build();
    }

    /**
     * 生成队列
     */
    @Bean
    public Queue itemQueue(){
        return QueueBuilder.durable(ITEM_QUEUE).build();
    }

    /**
     * 将队列绑定到交换机中
     * @param queue 对列
     * @param exchange 交换机
     * `@Qualifier` 根据 bean 名指定,原本翻译为 [ 此注释可以在字段或参数上使用作为自动定向时的候选bean的限定符 ]
     * noargs() 代表不传参数
     */
    @Bean
    public Binding itemQueueExchange(@Qualifier("itemQueue") Queue queue,
                                     @Qualifier("itemTopicExchange") Exchange exchange){
        return BindingBuilder.bind(queue).to(exchange).with("item.#").noargs();
    }
}
```

发送消息测试
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author black_fire
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class RabbitMqTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    public void test() {
        rabbitTemplate.convertAndSend(RabbitMqConfig.ITEM_TOPIC_EXCHANGE, "item.insert", "添加商品 routingKey 为 item.insert");
        rabbitTemplate.convertAndSend(RabbitMqConfig.ITEM_TOPIC_EXCHANGE, "item.update", "更新商品 routingKey 为 item.update");
        rabbitTemplate.convertAndSend(RabbitMqConfig.ITEM_TOPIC_EXCHANGE, "item.delete", "删除商品 routingKey 为 item.delete");
    }
}

```

## 搭建消费者工程
pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.black_fire</groupId>
    <artifactId>springboot-rabbitmq-consumer</artifactId>
    <version>1.0-SNAPSHOT</version>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.4.RELEASE</version>
    </parent>
    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-amqp</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
    </dependencies>
</project>
```
创建配置文件和启动器. 在 application.yml 配置文件中添加以下内容
```yml
spring:
  rabbitmq:
    port: 5672
    host: 192.168.65.128
    virtual-host: /black_fire_test
    username: black_fire
    password: black_fire
```

创建消息监听
```java
package com.black_fire.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * @author black_fire
 */
@Component
public class MyListener {

    @RabbitListener(queues = "springboot_item_queue")
    public void myListener(String massage){
        System.out.println("接收到的消息为"+massage);
    }
}
```

写一个死循环保持监听
```java
package com.blackfire;

import com.black_fire.ConsumerApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

/**
 * @author black_fire
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ConsumerApplication.class)
public class ConsumerTest {

    @Test
    public void test(){
        while (true){}
    }
}
```