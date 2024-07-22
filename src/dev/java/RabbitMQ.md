# RabbitMQ
简介
```
RabbitMQ官方地址：http://www.rabbitmq.com/
2007年,Rabbit 技术公司基于 AMQP 标准开发的 RabbitMQ 1.0 发布。RabbitMQ 采用 Erlang 语言开发。Erlang 语言专门为开发高并发和分布式系统的一种语言,在电信领域使用广泛。

```

RabbitMQ 架构图


![RabbitMQ架构](https://i.jpg.dog/520d3962e2d60b66c4d2027f2c08dd3a.png)

RabbitMQ相关概念
```
Broker
    接收和分发消息的应用, RabbitMQ Server 就是 Message Broker

Virtual host
    出于多租户和安全因素设计的,把AMQP的基本组件划分到一个虚拟的分组中,类似与网络中的 namespace(命名空间) 概念.
    当多个不同的用户使用同一个i额 RabbitMQ server 提供服务时,可以划分出多个 vhost 每个用爱自己的 vhost创建 exchange/queue等.

Connection
    publisher/consumer 和 broker 之间的 TCP 链接

Channel
    如果每一次访问 RabbitMQ 都建立一个 Connection, 在消息量大的时候建立 TCP Connection 的开销将是巨大的,效率也较低.
    Channel 实在 connection 内部建立的逻辑链接,如果应用支持多线程,通常多个 thread 创建单独的 channel 进行通信, AMQP method 包含了 channel id 帮助客户端和message broker 识别 channel,所以 channel 之间是完全隔离的.
    Channel 作为轻量级的 Connection 极大减少了操作系统建立 TCP Connection 的开销

Exchange
    message 到达 broker 的第一站,根据分发规则,匹配查询表中的 routing key,分发消息到queue 中去.
    常用的类型有
        direct(point-to-point)
        topic(publish-subscribe) 
        fanout(multicase)

Queue
    消息最终被送到这里等待 consumer 取走

Binding
    exchange 和 queue 之间虚拟链接, binding 中可以包含 routing key.
    Binding 信息被保存到 exchange 中的查询表中,用于 message 的分发依据.
```

RabbitMQ提供了6种模式
```
简单模式
work模式
Publish/Subscribe发布与订阅模式
Routing路由模式
Topics主题模式
RPC远程调用模式
官网对应模式介绍：https://www.rabbitmq.com/getstarted.html
```


![rabbitmq 6model](https://i.jpg.dog/00453a2b432a8126047c926b10e1fe00.png)


## RabbitMQ 页面的使用

### 添加用户

![rabbitmq add user](https://i.jpg.dog/2508d699a832ce101698128f6dde0d73.png)

### Virtual Hosts配置
```
RabbitMQ也有类似的权限管理；
在RabbitMQ中可以虚拟消息服务器Virtual Host,每个Virtual Hosts相当于⼀个相对独⽴的RabbitMQ 服务器,每个VirtualHost之间是相互隔离的。
exchange、queue、message不能互通。
Virtual Name⼀般以/开头
```

创建 Virtual Hosts


![rabbitmq create VirtualHosts](https://i.jpg.dog/1e49c2a68e662d414eb33270aa1cb5c9.png)


为上面创建的 virtual 设置权限
![rabbitmq VirtualHosts setting Authority](https://i.jpg.dog/9575489ac9557362a4279c2604411a8e.png)



## Rabbitmq的使用
pom.xml
```xml
<properties>
    <rabbitmq.version>5.6.0</rabbitmq.version>
</properties>
<dependencies>
    <!-- 使用 amqp 链接 rabbitmq    -->
    <dependency>
        <groupId>com.rabbitmq</groupId>
        <artifactId>amqp-client</artifactId>
        <version>${rabbitmq.version}</version>
    </dependency>
</dependencies>
```

为了方便使用,将其提取为一个工具类
```java
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class ConnectionUtils {

    private final static String IP = "192.168.65.128";
    private final static int PORT = 5672;
    private final static String VIRTUALHOST = "/black_fire_test";
    private final static String USERNAME = "black_fire";
    private final static String PASSWORD = "black_fire";


    public static Connection getConnection() {
        // 创建链接工厂
        ConnectionFactory connectionFactory = new ConnectionFactory();
        // 为其设置参数
        connectionFactory.setHost(IP);
        connectionFactory.setPort(PORT);
        connectionFactory.setVirtualHost(VIRTUALHOST);
        connectionFactory.setUsername(USERNAME);
        connectionFactory.setPassword(PASSWORD);
        Connection connection = null;
        try {
            connection = connectionFactory.newConnection();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
        return connection;
    }
}
```

### 简单模式
使用时代码流程,具体代码可以参考下面的案例
```
1. 获取链接
2. 创建频道
3. 创建队列
4. 发送消息/接收消息
5. 发送消息需要关闭资源,接收消息不需要关闭资源因为需要监听最新的消息进行消费.
```

发送消息使用的时 channel 中的 basicPublish 方法
```
basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body) throws IOException
    basicPublish参数解释
        参数1：交换机名称,如果没有指定则使用默认 Default Exchange
        参数2：路由key,简单模式可以传递队列名称
        参数3：消息其它属性
        参数4：消息内容
```

接收消息时使用的时 channel 中的 basicConsume 方法
```
basicConsume(String queue, boolean autoAck, Consumer callback) 
    basicConsume参数解释
        参数1：队列名称
        参数2：是否自动确认,设置为true为表示消息接收到自动向mq回复接收到了,mq接收到回复会删除消息,设置为false则需要手动确认
        参数3：消息接收到后回调
```
#### 发送消息案例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class Producer {

    public final static String QUEUE_NAME = "simple_queue";

    /**
     *  1. 获取链接(创建 connection 提取为一个公共方法方便重用)
     *      Connection connection = ConnectionUtils.getConnection();
     *  2. 创建频道
     *      Channel channel = connection.createChannel();
     *  3. 创建队列
     *      channel.queueDeclare(QUEUE_NAME, true, false, false, null);
     *      queueDeclare 方法参数解释:
     *          queueDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete, Map<String, Object> arguments) throws IOException;
     *              参数1：队列名称
     *              参数2：是否定义持久化队列
     *              参数3：是否独占本次连接, 只能有一个 Consumer 监听这个队列
     *              参数4：是否在不使用的时候自动删除队列,当没有 Consumer 时,自动删除
     *              参数5：队列其它参数
     *  4. 发送消息
     *      channel.basicPublish("", QUEUE_NAME, null, massage.getBytes());
     *      basicPublish参数解释
     *          basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body) throws IOException
     *              参数1：交换机名称,如果没有指定则使用默认 Default Exchange
     *              参数2：路由key,简单模式可以传递队列名称
     *              参数3：消息其它属性
     *              参数4：消息内容
     *
     */
    public static void producerTest(){
        // 通过 ConnectionUtils 获取一个 链接
        Connection connection = ConnectionUtils.getConnection();
        try {
            // 创建频道
            Channel channel = connection.createChannel();
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);
            String massage = "hello I is simple_queue;";
            channel.basicPublish("", QUEUE_NAME, null, massage.getBytes());
            System.out.println("已发送 消息" + massage);
            // 释放资源
            channel.close();
            connection.close();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        producerTest();
    }

}
```
#### 接收消息的案例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer {

    /**
     * 1. 获取链接(创建 connection 提取为一个公共方法方便重用)
     * Connection connection = ConnectionUtils.getConnection();
     * 2. 创建频道
     * Channel channel = connection.createChannel();
     * 3. 创建队列
     * channel.queueDeclare(QUEUE_NAME, true, false, false, null);
     * queueDeclare 方法参数解释:
     * queueDeclare(String queue, boolean durable, boolean exclusive, boolean autoDelete, Map<String, Object> arguments) throws IOException;
     * 参数1：队列名称
     * 参数2：是否定义持久化队列
     * 参数3：是否独占本次连接, 只能有一个 Consumer 监听这个队列
     * 参数4：是否在不使用的时候自动删除队列,当没有 Consumer 时,自动删除
     * 参数5：队列其它参数
     * 4. 接收消息
     * basicConsume(String queue, boolean autoAck, Consumer callback)
     * basicConsume参数解释
     * basicPublish(String exchange, String routingKey, BasicProperties props, byte[] body) throws IOException
     * 参数1：队列名称
     * 参数2：是否自动确认,设置为true为表示消息接收到自动向mq回复接收到了,mq接收到回复会删除消息,设置为false则需要手动确认
     * 参数3：消息接收到后回调
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.QUEUE_NAME, true, false, false, null);
            com.rabbitmq.client.Consumer consumer = new DefaultConsumer(channel) {
                /*
                    使用匿名内部类
                    handleDelivery() 该方法表示接收到消息的回调
                        consumerTag     消息者标签,在channel.basicConsume时候可以指定
                        envelope        消息包的内容,可从中获取消息id,消息routingkey,交换机,消息和重传标志(收到消息失败后是否需要重新发送)
                        properties      消息的配置内容
                        body 消息


                 */
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.QUEUE_NAME, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}
```

### 工作模式(workQueues)
该模式是一种竞争模式,只是多个消费者消费一个生产者生产的消息.

与简单模式相比,只是多了一个或多个消费者(consumer).

多个消费者同时消费时,提高了消费效率,且不重复

#### 生产者示例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class Producer {

    public final static String QUEUE_NAME = "work_queue";
    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void producerTest() {
        // 通过 ConnectionUtils 获取一个 链接
        Connection connection = ConnectionUtils.getConnection();
        try {
            // 创建频道
            Channel channel = connection.createChannel();
            channel.queueDeclare(QUEUE_NAME, true, false, false, null);

            for (int item = 0; item <= 30; item++) {
                String massage = "hello I is simple_queue; work_queue model-"+item;
                channel.basicPublish("", QUEUE_NAME, null, massage.getBytes());
                System.out.println("已发送 消息" + massage);
            }
            // 释放资源
            channel.close();
            connection.close();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        producerTest();
    }

}

```

#### 多个消费者示例
其实就是复制一份消费者1 改一下名称就可以了.
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer1 {
    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.QUEUE_NAME, true, false, false, null);
            com.rabbitmq.client.Consumer consumer = new DefaultConsumer(channel) {

                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer1 -接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.QUEUE_NAME, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}
```

```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer2 {


    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.QUEUE_NAME, true, false, false, null);
            com.rabbitmq.client.Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer2- 接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.QUEUE_NAME, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}
```

### 订阅模式概述
在订阅模型中,多了一个exchange角色,而且过程略有变化：
```
P
    生产者,也就是要发送消息的程序,但是不再发送到队列中,而是发给X(交换机)
C
    消费者,消息的接受者,会一直等待消息到来。
Queue
    消息队列,接收消息、缓存消息。
Exchange
    交换机,图中的X。一方面,接收生产者发送的消息。另一方面,知道如何处理消息,例如递交给某个特别队列、递交给所有队列、或是将消息丢弃。
    到底如何操作,取决于Exchange的类型。

Exchange有常见以下3种类型：
    Fanout: 广播,将消息交给所有绑定到交换机的队列
    Direct: 定向,把消息交给符合指定routing key 的队列
    Topic: 通配符,把消息交给符合routing pattern(路由模式) 的队列
```

Exchange(交换机)只负责转发消息,不具备存储消息的能力,因此如果没有任何队列与Exchange绑定,或者没有符合路由规则的队列,那么消息会丢失！

### Publish/Subscribe发布与订阅模式
#### Fanout 广播模式
```
交换机需要与队列进行绑定,绑定之后 
    一个消息可以被多个消费者都收到。

发布订阅模式与工作队列模式的区别
1. 工作队列模式不用定义交换机,而发布/订阅模式需要定义交换机。
2. 发布/订阅模式的生产方是面向交换机发送消息,工作队列模式的生产方是面向队列发送消息(底层使用默认交换机)。
3、发布/订阅模式需要设置队列和交换机的绑定,工作队列模式不需要设置,实际上工作队列模式会将队列绑 定到默认的交换机 。
```
##### 生产者示例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class Producer {

    public final static String FANOUT_EXCHANGE = "fanout_exchange";
    public final static String FANOUT_QUEUE_1 = "fanout_queue_1";
    public final static String FANOUT_QUEUE_2 = "fanout_queue_2";

    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void producerTest() {
        // 通过 ConnectionUtils 获取一个 链接
        Connection connection = ConnectionUtils.getConnection();
        try {
            // 创建频道
            Channel channel = connection.createChannel();
            /*
                声明交换机
                exchangeDeclare(String exchange, BuiltinExchangeType type)
                   参数1:  交换机名称
                   参数2:  交换机类型: fanout,topic,direct,headers
             */
            channel.exchangeDeclare(FANOUT_EXCHANGE, BuiltinExchangeType.FANOUT);
            // 声明两个队列
            channel.queueDeclare(FANOUT_QUEUE_1, true, false, false, null);
            channel.queueDeclare(FANOUT_QUEUE_2, true, false, false, null);
            
            /*
                把队列绑定交换机
                queueBind(String queue, String exchange, String routingKey)
                    参数1: 队列名
                    参数2: 交换机名
                    参数3: 因为是广播模式所以不用传
             */
            channel.queueBind(FANOUT_QUEUE_1,FANOUT_EXCHANGE,"");
            channel.queueBind(FANOUT_QUEUE_2,FANOUT_EXCHANGE,"");
            for (int item = 1; item <= 10; item++) {
                String massage = "hello I is simple_queue; fanout model-"+item;
                channel.basicPublish(FANOUT_EXCHANGE, "", null, massage.getBytes());
                System.out.println("已发送 消息" + massage);
            }
            // 释放资源
            channel.close();
            connection.close();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        producerTest();
    }

}
```
##### 两个消费者示例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer1 {
    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.FANOUT_QUEUE_1, true, false, false, null);
            /*
                给当前消费者绑定消费队列和交换机
             */
            channel.queueBind(Producer.FANOUT_QUEUE_1,Producer.FANOUT_EXCHANGE,"");
            Consumer consumer = new DefaultConsumer(channel) {

                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer1 -接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.FANOUT_QUEUE_1, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        consumerTest();
    }
}
```
```java

import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer2 {


    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.FANOUT_QUEUE_2, true, false, false, null);
            /*
                给当前消费者绑定消费队列和交换机
            */
            channel.queueBind(Producer.FANOUT_QUEUE_2,Producer.FANOUT_EXCHANGE,"");
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer2- 接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.FANOUT_QUEUE_2, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        consumerTest();
    }
}
```

#### Routing 路由模式
```
Routing模式要求队列在绑定交换机时要指定routing key, 消息会转发到符合routing key的队列

路由模式特点：
队列与交换机的绑定,不能是任意绑定了,而是要指定一个 RoutingKey (路由key)

消息的发送方在 向 Exchange发送消息时,也必须指定消息的 RoutingKey 
Exchange不再把消息交给每一个绑定的队列,而是根据消息的 Routing Key 进行判断,只有队列的 Routingkey 与消息的 Routing key 完全一致,才会接收到消息.
```
##### 生产者案例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class Producer {

    public final static String DIRECT_EXCHANGE = "direct_exchange";
    public final static String DIRECT_QUEUE_INSERT = "direct_queue_1";
    public final static String DIRECT_QUEUE_UPDATE = "direct_queue_2";

    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void producerTest() {
        // 通过 ConnectionUtils 获取一个 链接
        Connection connection = ConnectionUtils.getConnection();
        try {
            // 创建频道
            Channel channel = connection.createChannel();
            /*
                声明交换机
                exchangeDeclare(String exchange, BuiltinExchangeType type)
                   参数1:  交换机名称
                   参数2:  交换机类型: fanout,topic,direct,headers
             */
            channel.exchangeDeclare(DIRECT_EXCHANGE, BuiltinExchangeType.DIRECT);
            // 声明两个队列
            channel.queueDeclare(DIRECT_QUEUE_INSERT, true, false, false, null);
            channel.queueDeclare(DIRECT_QUEUE_UPDATE, true, false, false, null);

            /*
                把队列绑定交换机
                queueBind(String queue, String exchange, String routingKey)
                    参数1: 队列名
                    参数2: 交换机名
                    参数3: 因为是广播模式所以不用传
             */
            channel.queueBind(DIRECT_QUEUE_INSERT,DIRECT_EXCHANGE,"insert");
            channel.queueBind(DIRECT_QUEUE_UPDATE,DIRECT_EXCHANGE,"update");
            String insertMassage = "新增鞋子 routingKey insert";
            channel.basicPublish(DIRECT_EXCHANGE, "insert", null, insertMassage.getBytes());
            String updateMassage = "新增鞋子 routingKey update";
            channel.basicPublish(DIRECT_EXCHANGE, "update", null, updateMassage.getBytes());

            // 释放资源
            channel.close();
            connection.close();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        producerTest();
    }
}
```
##### 消费者案例
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer1 {
    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.DIRECT_QUEUE_INSERT, true, false, false, null);
            /*
                给当前消费者绑定消费队列和交换机
             */
            channel.queueBind(Producer.DIRECT_QUEUE_INSERT, Producer.DIRECT_EXCHANGE,"insert");
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer1 -接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.DIRECT_QUEUE_INSERT, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}

```

```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer2 {


    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            channel.queueDeclare(Producer.DIRECT_QUEUE_UPDATE, true, false, false, null);
                        /*
                给当前消费者绑定消费队列和交换机
             */
            channel.queueBind(Producer.DIRECT_QUEUE_UPDATE, Producer.DIRECT_EXCHANGE,"");
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer2- 接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.DIRECT_QUEUE_UPDATE, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}
```

#### Topics 通配符模式
```
Topic 类型与 Direct 相比,都是可以根据 RoutingKey 把消息路由到不同的队列.
只不过 Topic 类型Exchange 可以让队列在绑定 Routing key 的时候使用通配符！
Routingkey 一般都是有一个或多个单词组成,多个单词之间以”.”分割.
例如： item.insert

通配符规则：
    # ：匹配一个或多个词
    * ：匹配不多不少恰好1个词

举例：
item.# ：能够匹配 item.insert.abc 或者 item.insert
item.* ：只能匹配 item.insert
```

##### 生产者
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.BuiltinExchangeType;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

/**
 * @author black_fire
 */
public class Producer {

    public final static String TOPIC_EXCHANGE = "topic_exchange";
    public final static String TOPIC_QUEUE_ALL = "topic_queue_all";
    public final static String TOPIC_QUEUE_INSERT_UPDATE = "topic_queue_insert_update";

    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void producerTest() {
        // 通过 ConnectionUtils 获取一个 链接
        Connection connection = ConnectionUtils.getConnection();
        try {
            // 创建频道
            Channel channel = connection.createChannel();
            /*
                声明交换机
                exchangeDeclare(String exchange, BuiltinExchangeType type)
                   参数1:  交换机名称
                   参数2:  交换机类型: fanout,topic,direct,headers
             */
            channel.exchangeDeclare(TOPIC_EXCHANGE, BuiltinExchangeType.TOPIC);
            // 声明两个队列
            channel.queueDeclare(TOPIC_QUEUE_ALL, true, false, false, null);
            channel.queueDeclare(TOPIC_QUEUE_INSERT_UPDATE, true, false, false, null);

            String insertMassage = "新增鞋子 topic model routingKey item.insert";
            channel.basicPublish(TOPIC_EXCHANGE, "item.insert", null, insertMassage.getBytes());

            String updateMassage = "更新鞋子 topic model routingKey item.update";
            channel.basicPublish(TOPIC_EXCHANGE, "item.update", null, updateMassage.getBytes());

            String deleteMassage = "删除鞋子 topic model routingKey item.delete";
            channel.basicPublish(TOPIC_EXCHANGE, "item.delete", null, updateMassage.getBytes());

            // 释放资源
            channel.close();
            connection.close();

        } catch (IOException | TimeoutException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        producerTest();
    }

}
```

##### 消费者
```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer1 {
    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            // 声明交换机
            channel.exchangeDeclare(Producer.TOPIC_EXCHANGE,BuiltinExchangeType.TOPIC);
            channel.queueDeclare(Producer.TOPIC_QUEUE_ALL, true, false, false, null);

            /*
                给当前消费者绑定消费队列和交换机
             */
            channel.queueBind(Producer.TOPIC_QUEUE_ALL, Producer.TOPIC_EXCHANGE,"item.*");
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer1 -接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.TOPIC_QUEUE_ALL, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}

```

```java
import cn.black_fire.rabbitmq.utils.ConnectionUtils;
import com.rabbitmq.client.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * @author black_fire
 */
public class Consumer2 {


    /**
     * 基本和 简单模式差不多一样的代码注释可以在简单模式案例中查看
     */
    public static void consumerTest() {
        Connection connection = ConnectionUtils.getConnection();
        try {
            Channel channel = connection.createChannel();
            // 声明交换机
            channel.exchangeDeclare(Producer.TOPIC_EXCHANGE,BuiltinExchangeType.TOPIC);
            channel.queueDeclare(Producer.TOPIC_QUEUE_INSERT_UPDATE, true, false, false, null);
                        /*
                给当前消费者绑定消费队列和交换机
             */
            channel.queueBind(Producer.TOPIC_QUEUE_INSERT_UPDATE, Producer.TOPIC_EXCHANGE,"item.update");
            channel.queueBind(Producer.TOPIC_QUEUE_INSERT_UPDATE, Producer.TOPIC_EXCHANGE,"item.insert");
            Consumer consumer = new DefaultConsumer(channel) {
                @Override
                public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
                    System.out.println("路由key".concat(envelope.getRoutingKey()));
                    System.out.println("交换机".concat(envelope.getExchange()));
                    System.out.println("消息id".concat(String.valueOf(envelope.getDeliveryTag())));
                    System.out.println("consumer2- 接收到的消息".concat(new String(body, StandardCharsets.UTF_8)));
                }
            };
            channel.basicConsume(Producer.TOPIC_QUEUE_INSERT_UPDATE, true, consumer);
        } catch (IOException e) {
            e.printStackTrace();
        }


    }


    public static void main(String[] args) {
        consumerTest();
    }
}

```

### 模式之间的总结
```
简单模式 HelloWorld 
    一个生产者、一个消费者,不需要设置交换机(使用默认的交换机)
工作队列模式 Work Queue 
    一个生产者、多个消费者(竞争关系),不需要设置交换机(使用默认的交换机)
发布订阅模式 Publish/subscribe
    需要设置类型为fanout的交换机,并且交换机和队列进行绑定,当发送消息到交换机后,交换机会将消息发送到绑定的队列
路由模式 Routing
    需要设置类型为direct的交换机,交换机和队列进行绑定,并且指定routingkey,当发送消息到交换机后,交换机会根据routing key将消息发送到对应的队列
通配符模式 Topic 
    需要设置类型为topic的交换机,交换机和队列进行绑定,并且指定通配符方式的routing key,当发送消息到交换机后,交换机会根据routing key将消息发送到对应的队列
```

## 高级特性

### 消息的可靠投递
简介
```
在使用 RabbitMQ 的时候,作为消息发送方希望杜绝任何消息丢失或者投递失败场景。

RabbitMQ 为我们提供了两种方式用来控制消息的投递可靠性模式.
    confirm 确认模式
    return 退回模式

rabbitmq 整个消息投递的路径为：
producer--->rabbitmq broker--->exchange--->queue--->consumer
    消息从 producer 到 exchange 则会返回一个 confirmCallback 
    消息从 exchange-->queue 投递失败则会返回一个 returnCallback
```

#### 确认模式(confirm)
以 spring 整合形式演示案例.

创建 properties 和 spring config xml文件
```properties
rabbitmq.host=192.168.65.128
rabbitmq.port=5672
rabbitmq.username=black_fire
rabbitmq.password=black_fire
rabbitmq.virtual-host=/black_fire_test
```
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
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接
        publisher-confirms="true" 开启确认模式
    -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
                               publisher-confirms="true"
    />

    <!-- 定义管理交换机、队列 -->
    <rabbit:admin connection-factory="connectionFactory"/>

    <!--定义rabbitTemplate对象操作可以在代码中方便发送消息-->
    <rabbit:template id="rabbitTemplate" connection-factory="connectionFactory"/>

    <!-- 测试消息可靠性投递   -->
    <rabbit:queue id="test_queue_confirm" name="test_queue_confirm" />

    <rabbit:direct-exchange name="test_exchange_confirm">
        <rabbit:bindings>
            <!--  如果不配置 routingKey 那么默认使用 queue 名称,如果配置了那么正常情况下使用 routingKey 来接收          -->
            <rabbit:binding  queue="test_queue_confirm" key="confirm"  />
        </rabbit:bindings>
    </rabbit:direct-exchange>
</beans>    
```
使用 确认模式发送消息
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author black_fire
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:/spring-rabbitmq.xml")
public class ProducerTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    /**
     * 消息可靠性投递
     * 确认模式:
     * 在 spring 配置文件的 rabbit:connection-factory 中配置 publisher-confirms="true"
     * 如果投递失败会出发 rabbitTemplate 的 ConfirmCallBack回调
     */
    @Test
    public void testConfirm() {
        rabbitTemplate.setConfirmCallback(new RabbitTemplate.ConfirmCallback() {
            /**
             * @param correlationData 相关配置信息
             * @param ack   exchange 交换机 是否成功找到了消息. true 成功 false 失败
             * @param cause 失败原因
             */
            @Override
            public void confirm(CorrelationData correlationData, boolean ack, String cause) {
                System.out.println("confirm 方法被执行了 ~~~~");
                if (ack) {
                    // 当 交换机找到消息
                    System.out.println("成功接收消息: cause==> " + cause);
                } else {
                    // 当交换机没找到消息
                    System.out.println("接收消息失败: cause==> " + cause);
                }
            }
        });
        rabbitTemplate.convertAndSend("test_exchange_confirm", "confirm", "send routingKey message...");
    }
}
```
#### 退回模式
使用退回模式的 properties 更改其 spring config xml 文件
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
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接
        publisher-confirms="true" 开启确认模式
        publisher-returns="true"  开启退回模式
    -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
                               publisher-confirms="true"
                               publisher-returns="true"
    />

    <!-- 定义管理交换机、队列 -->
    <rabbit:admin connection-factory="connectionFactory"/>

    <!--定义rabbitTemplate对象操作可以在代码中方便发送消息-->
    <rabbit:template id="rabbitTemplate" connection-factory="connectionFactory"/>

    <!-- 测试消息可靠性投递   -->
    <rabbit:queue id="test_queue_confirm" name="test_queue_confirm" />

    <rabbit:direct-exchange name="test_exchange_confirm">
        <rabbit:bindings>
            <!--  如果不配置 routingKey 那么默认使用 queue 名称,如果配置了那么正常情况下使用 routingKey 来接收          -->
            <rabbit:binding  queue="test_queue_confirm" key="confirm"  />
        </rabbit:bindings>
    </rabbit:direct-exchange>
</beans>    
```

使用回退模式发送
```java

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.connection.CorrelationData;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author black_fire
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:/spring-rabbitmq.xml")
public class ProducerTest {

    @Autowired
    private RabbitTemplate rabbitTemplate;

     /**
     * 退回模式
     *  1. publisher-returns="true" 开启退回模式
     *  2. 设置   ReturnCallBack
     *  3. 设置 Exchange 处理消息失败的模式: setMandatory
     *
     *
     */
    @Test
    public void testReturn(){

        /*
        设置交换机处理失败的模式
            默认情况: 如果消息没有路由到Queue,则丢弃消息
            true情况: 如果消息没有路由到Queue,则返回给消息发送方ReturnCallBack
         */
        rabbitTemplate.setMandatory(true);

        rabbitTemplate.setReturnCallback(new RabbitTemplate.ReturnCallback() {
            /**
             * @param message       消息对象
             * @param replyCode     错误码
             * @param replyText     错误信息
             * @param exchange      交换机
             * @param routingKey    路由键
             */
            @Override
            public void returnedMessage(Message message, int replyCode, String replyText, String exchange, String routingKey) {
                System.out.println("return 执行了~~~");
            }
        });
        // 下面发送消息是错误发送演示
        rabbitTemplate.convertAndSend("test_exchange_confirm", "confirm2", "send routingKey message...");
    }
}
```

### Consumer Ack
简介
```
ack指Acknowledge,确认。 表示消费端收到消息后的确认方式。
有三种确认方式：
自动确认：acknowledge="none"
手动确认：acknowledge="manual"
根据异常情况确认：acknowledge="auto"

其中自动确认是指,当消息一旦被Consumer接收到,则自动确认收到,并将相应 message 从RabbitMQ 的消息缓存中移除。但是在实际业务处理中,很可能消息接收到,业务处理出现异常,那么该消息就会丢失。
如果设置了手动确认方式,则需要在业务处理成功后,调用channel.basicAck(),手动签收,如果出现异常,则调用channel.basicNack()方法,让其自动重新发送消息。
```
以 spring 整合形式演示案例.

创建 properties 和 spring config xml文件
```properties
rabbitmq.host=192.168.65.128
rabbitmq.port=5672
rabbitmq.username=black_fire
rabbitmq.password=black_fire
rabbitmq.virtual-host=/black_fire_test
```
spring config xml 文件内容
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
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接 -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
    />
    <!-- 生成消息返回的 bean-->
    <context:component-scan base-package="cn.black_fire.rabbitmq.listener" />

    <!--
        acknowledge="manual" 开启手动签收消息
     -->
    <rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual">
        <rabbit:listener ref="ackListener" queue-names="test_queue_confirm" />
    </rabbit:listener-container>
</beans>
```

接收消息的示例对象
```java
package cn.black_fire.rabbitmq.listener;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.listener.api.ChannelAwareMessageListener;
import org.springframework.stereotype.Component;

/**
 * @author black_fire
 */
@Component
public class AckListener implements ChannelAwareMessageListener {

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        long deliverTag = message.getMessageProperties().getDeliveryTag();
        try {
            System.out.println(new String(message.getBody()));
            System.out.println("处理业务逻辑");
            // 正常情况下,就会执行签收
            channel.basicAck(deliverTag,true);
        }catch (Exception e){
            e.printStackTrace();
            /*
                拒绝签收多个消息
                basicNack(long deliveryTag, boolean multiple, boolean requeue)
                    deliveryTag:   deliverTag
                    multiple:   是否拒绝多个消息
                    requeue:    true 重回队列
             */
            channel.basicNack(deliverTag,true,true);
        }
    }
}
```

写一个死循环测试接收消息即可
```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * @author black_fire
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "classpath:spring-rabbitmq.xml")
public class AckTst {


    @Test
   public void test(){
       while (true){}
   }
}
```

### 消费限流
只需要修改 spring config xml 文件就可以了
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
    <context:property-placeholder location="classpath:rabbitmq.properties"/>

    <!-- 定义rabbitmq connectionFactory 也就是创建链接 -->
    <rabbit:connection-factory id="connectionFactory"
                               host="${rabbitmq.host}"
                               port="${rabbitmq.port}"
                               username="${rabbitmq.username}"
                               password="${rabbitmq.password}"
                               virtual-host="${rabbitmq.virtual-host}"
    />
    <!-- 生成消息返回的 bean-->
    <context:component-scan base-package="cn.black_fire.rabbitmq.listener" />

    <!--
        限流处理: 
            acknowledge="manual" 开启手动签收消息
            prefetch="1"  每次只读取一个消息进行处理
                只有签收一个后才会处理下一个
        接收消息实体类实现 ChannelAwareMessageListener 接口.
     -->
    <rabbit:listener-container connection-factory="connectionFactory" acknowledge="manual" prefetch="1">
        <rabbit:listener ref="ackListener" queue-names="test_queue_confirm" />
    </rabbit:listener-container>
</beans>
```

### TTL
```
TTL
    Time To Live消息过期时间设置
```

在 spring config xml文件中实现 TTL (在生产者一端)
```xml
<!-- ttl 队列过期时间 -->
<rabbit:queue id="test_queue_ttl" name="test_queue_ttl">
    <rabbit:queue-arguments>
        <!--
            key             固定字符串
            value           时间间隔,以毫秒为单位
            value-type      需要设置为 Integer 类型,默认为 String 会报错
                    -->
        <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer" />
    </rabbit:queue-arguments>
</rabbit:queue>
<rabbit:topic-exchange name="test_exchange_ttl">
    <rabbit:bindings>
        <rabbit:binding pattern="ttl.#" queue="test_queue_ttl" />
    </rabbit:bindings>
</rabbit:topic-exchange>
```

ttl 消息过期时间示例
```java
@Test
public void test(){
    MessagePostProcessor messagePostProcessor = new MessagePostProcessor() {
        @Override
        public Message postProcessMessage(Message message) throws AmqpException {
            // 设置 message 的过期时间 默认单位为毫秒
            message.getMessageProperties().setExpiration("5000");
            return message;
        }
    };

    // 消息过期
    rabbitTemplate.convertAndSend("test_queue_ttl","ttl.hhh","message ttl", messagePostProcessor);
}
```

### 死信队列
简介
```
死信队列,英文缩写：DLX 。

Dead Letter Exchange(死信交换机),当消息成为Dead message后,可以被重新发送到另一个交换机,这个交换机就是DLX。
```
![rabbitmq DLX](https://i.jpg.dog/26cf74c0b5338b2a93fdbb4d26bc8690.png)

```
消息成为死信的三种情况:
    1. 队列消息长度到达限制；
    2. 消费者拒接消费消息,basicNack/basicReject,并且不把消息重新放入原目标队列,requeue=false；
    3. 原队列存在消息过期设置,消息到达超时时间未被消费；
```

在 spring config xml 中配置死信队列(生产端)
```xml
<!--
1. 声明正常的队列(test_queue_dlx)和交换机(test_exchange_dlx)
-->
<rabbit:queue name="test_queue_dlx" id="test_queue_dlx">
<!--3. 正常队列绑定死信交换机-->
<rabbit:queue-arguments>
<!--3.1 x-dead-letter-exchange：死信交换机名称-->
<entry key="x-dead-letter-exchange" value="exchange_dlx" />
<!--3.2 x-dead-letter-routing-key：发送给死信交换机的routingKey-->
<entry key="x-dead-letter-routing-key" value="dlx.hehe" />
    <!--4.1 设置队列的过期时间 ttl-->
    <entry key="x-message-ttl" value="10000" value-type="java.lang.Integer"
    />
    <!--4.2 设置队列的长度限制 max-length -->
    <entry key="x-max-length" value="10" value-type="java.lang.Integer" />
</rabbit:queue-arguments>
</rabbit:queue>
<rabbit:topic-exchange name="test_exchange_dlx">
    <rabbit:bindings>
        <rabbit:binding pattern="test.dlx.#" queue="test_queue_dlx">
        </rabbit:binding>
    </rabbit:bindings>
</rabbit:topic-exchange>
<!--
2. 声明死信队列(queue_dlx)和死信交换机(exchange_dlx)
-->
<rabbit:queue name="queue_dlx" id="queue_dlx" />
<rabbit:topic-exchange name="exchange_dlx">
    <rabbit:bindings>
        <rabbit:binding pattern="dlx.#" queue="queue_dlx" />
    </rabbit:bindings>
</rabbit:topic-exchange>
```
当消息被拒收时要设置为 requeue=false 不然不会进入死信队列
```java
@Component
public class DlxListener implements ChannelAwareMessageListener {
    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();
        try {
            //1.接收转换消息
            System.out.println(new String(message.getBody()));
            //2. 处理业务逻辑
            System.out.println("处理业务逻辑...");
            int i = 3/0;//出现错误
            //3. 手动签收
            channel.basicAck(deliveryTag,true);
        } catch (Exception e) {
            //e.printStackTrace();
            System.out.println("出现异常,拒绝接受");
            //4.拒绝签收,不重回队列 requeue=false
            channel.basicNack(deliveryTag,true,false);
        }
    }
}
```

### 延迟队列
简介
```
延迟队列,即消息进入队列后不会立即被消费,只有到达指定时间后才会被消费

在RabbitMQ中并未提供延迟队列功能,但是可以使用
    TTL+死信队列 组合实现延迟队列的效果
```


