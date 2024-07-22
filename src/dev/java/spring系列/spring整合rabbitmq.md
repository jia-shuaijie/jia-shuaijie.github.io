---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# spring 整合 rabbitmq 示例

## 搭建生产者工程
pom.xml 添加依赖
```xml
<dependencies>
    <!-- spring依赖       -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.1.7.RELEASE</version>
    </dependency>
    <!-- spring 整合 rabbitMQ 依赖 -->
    <dependency>
        <groupId>org.springframework.amqp</groupId>
        <artifactId>spring-rabbit</artifactId>
        <version>2.1.8.RELEASE</version>
    </dependency>
    <!-- 测试依赖 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
    <!-- spring 测试依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.1.7.RELEASE</version>
    </dependency>
</dependencies>
```
创建 properties 用于存放 rabbitMq 的链接数据
```properties
rabbitmq.host=192.168.65.128
rabbitmq.port=5672
rabbitmq.username=black_fire
rabbitmq.password=black_fire
rabbitmq.virtual-host=/black_fire
```
spring config xml文件配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context
https://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/rabbit
http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">
    <!-- 加载 properties 配置文件 -->
    <context:property-placeholder location="classpath:properties/rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接 -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>

    <!-- 定义管理交换机、队列 -->
    <rabbit:admin connection-factory="connectionFactory"/>

    <!--
        定义持久化队列,不存在则自动创建；不绑定到交换机则绑定到默认交换机
        默认交换机类型为direct,名字为："",路由键为队列的名称
    -->
    <rabbit:queue id="spring_queue" name="spring_queue" auto-declare="true"/>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~广播；所有队列都能收到消息 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!-- 定义广播交换机中的持久化队列,不存在则自动创建 -->
    <rabbit:queue id="spring_fanout_queue_1" name="spring_fanout_queue_1" auto-declare="true"/>
    <!--定义广播交换机中的持久化队列,不存在则自动创建-->
    <rabbit:queue id="spring_fanout_queue_2" name="spring_fanout_queue_2" auto-declare="true"/>

    <!--定义广播类型交换机；并绑定上述两个队列-->
    <rabbit:fanout-exchange id="spring_fanout_exchange"
                            name="spring_fanout_exchange" auto-declare="true">
        <!--  绑定队列      -->
        <rabbit:bindings>
            <rabbit:binding queue="spring_fanout_queue_1"/>
            <rabbit:binding queue="spring_fanout_queue_2"/>
        </rabbit:bindings>
    </rabbit:fanout-exchange>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~通配符；*匹配一个单词,#匹配多个单词    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <!--定义广播交换机中的持久化队列,不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_star" name="spring_topic_queue_star"
                  auto-declare="true"/>
    <!--定义广播交换机中的持久化队列,不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_well" name="spring_topic_queue_well"
                  auto-declare="true"/>
    <!--定义广播交换机中的持久化队列,不存在则自动创建-->
    <rabbit:queue id="spring_topic_queue_well2" name="spring_topic_queue_well2"
                  auto-declare="true"/>

    <rabbit:topic-exchange id="spring_topic_exchange"
                           name="spring_topic_exchange" auto-declare="true">
        <rabbit:bindings>
            <rabbit:binding pattern="item.*" queue="spring_topic_queue_star"/>
            <rabbit:binding pattern="item.#" queue="spring_topic_queue_well"/>
            <rabbit:binding pattern="items.#" queue="spring_topic_queue_well2"/>
        </rabbit:bindings>
    </rabbit:topic-exchange>
    <!--定义rabbitTemplate对象操作可以在代码中方便发送消息-->
    <rabbit:template id="rabbitTemplate" connection-factory="connectionFactory"/>

</beans>
```

发送消息的方法
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author black_fire
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations ="classpath:/spring/spring-rabbitmq.xml")
public class ProducerTest {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 发送队列消息 使用简单模式
     * convertAndSend(String routingKey, Object object)
     *      routingKey  路由键名
     *      object      消息内容
     * 这里路由键和队列同名
     */
    @Test
    public void queueTest(){
        rabbitTemplate.convertAndSend("spring_queue","send spring routing key information");
    }

    /**
     * 使用广播模式发送消息
     *  convertAndSend(String exchange, String routingKey, final Object object)
     *          exchange        交换机名
     *          routingKey      路由键名设置为空
     *          object          消息内容
     */
    @Test
    public void fanoutTest(){
        rabbitTemplate.convertAndSend("spring_fanout_exchange","","send spring_fanout_exchange information arrive queue ");
    }

    /**
     * 通配符 交换机类型为 topic
     * 匹配路由键通配符
     *      *       一个单词
     *      #       多个单词
     * 绑定到该交换机的匹配队列能收到消息
     * convertAndSend(String exchange, String routingKey, final Object object)
     *      exchange        交换机名称
     *      routingKey      路由键名
     *      object          发送的消息内容
     */
    @Test
    public void topicTest(){
        rabbitTemplate.convertAndSend("spring_topic_exchange","item.xz","send spring_topic_exchange information arrive queue");
        rabbitTemplate.convertAndSend("spring_topic_exchange","item.xz.1","send spring_topic_exchange information arrive queue");
        rabbitTemplate.convertAndSend("spring_topic_exchange","item.xz.2","send spring_topic_exchange information arrive queue");
        rabbitTemplate.convertAndSend("spring_topic_exchange","items.cn","send spring_topic_exchange information arrive queue");
    }
}
```
## 搭建消费者工程
pom.xml 依赖
```xml
<dependencies>
    <!-- spring依赖       -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.1.7.RELEASE</version>
    </dependency>
    <!-- spring 整合 rabbitMQ 依赖 -->
    <dependency>
        <groupId>org.springframework.amqp</groupId>
        <artifactId>spring-rabbit</artifactId>
        <version>2.1.8.RELEASE</version>
    </dependency>
    <!-- 测试依赖 -->
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
    <!-- spring 测试依赖 -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>5.1.7.RELEASE</version>
    </dependency>
</dependencies>
```

properties 文件
```properties
rabbitmq.host=192.168.65.128
rabbitmq.port=5672
rabbitmq.username=black_fire
rabbitmq.password=black_fire
rabbitmq.virtual-host=/black_fire_test
```

创建 接收消息的文件
```java
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;

import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class SpringQueueListener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        try {
            String msg = new String(message.getBody(), StandardCharsets.UTF_8);
            System.out.printf("接收的路由名称为 %s 接收的路由key为 %s 队列名为 %s 消息为 %s \n",
                    message.getMessageProperties().getReceivedExchange(),
                    message.getMessageProperties().getReceivedRoutingKey(),
                    message.getMessageProperties().getConsumerQueue(),
                    msg
                    );
        }catch (Exception e){
            e.printStackTrace();
        }
    }
}
```

spring config xml 文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:rabbit="http://www.springframework.org/schema/rabbit"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context
https://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/rabbit
http://www.springframework.org/schema/rabbit/spring-rabbit.xsd">
    <!-- 加载 properties 配置文件 -->
    <context:property-placeholder location="classpath:properties/rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接 -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"/>
    <!-- 生成消息返回的 bean-->
    <bean id="springQueueListener" class="cn.black_fire.rabbitmq.listener.SpringQueueListener" />
    <!-- 监听 -->
    <rabbit:listener-container connection-factory="connectionFactory" auto-declare="true">
        <!--   
            因为接收的内容都一致就不在重复分开的写接收内容了
            只要绑定不同的队列接收即可 
             -->
        <rabbit:listener ref="springQueueListener" queue-names="spring_queue"/>
        <rabbit:listener ref="springQueueListener" queue-names="spring_fanout_queue_1"/>
        <rabbit:listener ref="springQueueListener" queue-names="spring_fanout_queue_2"/>
        <rabbit:listener ref="springQueueListener" queue-names="spring_topic_queue_star"/>
        <rabbit:listener ref="springQueueListener" queue-names="spring_topic_queue_well"/>
        <rabbit:listener ref="springQueueListener" queue-names="spring_topic_queue_well2"/>
    </rabbit:listener-container>
</beans>
```

test 测试
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author black_fire
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations ="classpath:/spring/spring-rabbitmq.xml")
public class ConsumerTest {

    // 只需要保持运行就可以接收到 
    @Test
    public void test(){
        while (true){}
    }
}

```