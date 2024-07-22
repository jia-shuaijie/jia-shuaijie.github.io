---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Spirng Cloud OpenFeign
简介
```
Feign是⼀个声明式的HTTP客户端组件,它旨在是编写Http客户端变得更加容易。

OpenFeign添加了对于Spring MVC注解的⽀持,同时集成了Spring Cloud LoadBalancer和Spring CloudCircuitBreaker,在使⽤Feign时提供负载均衡和熔断降级的功能。
```
使用 OpenFeign 需要导入依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

开启 openFeign 需要在 springboot 启动器上添加 `@EnableFeignClients` 注解示例如下
```java
@SpringBootApplication
// eureka 注册注解
@EnableDiscoveryClient
// openfeign 开启注解
@EnableFeignClients
public class OrderApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

## OpenFeign 使用示例
向外提供的服务的 feign 客户端
```java
/**
 * "cloud-payment-service"是服务名
 * 使⽤这个名字来从Eureka服务列表中得到相应的服务,来创建LoadBalancer客户端,也可以使⽤url属性指定服务的URL。
 */
@FeignClient(value = "cloud-payment-service")
public interface PaymentClient {
    @GetMapping("/payment/{id}")
    public Payment payment(@PathVariable("id") Integer id);
}
```
使用上面的 feign 的客户端
```java
@Autowired
private PaymentClient paymentClient;

@GetMapping("/feign/payment/{id}")
public ResponseEntity<Payment> getPaymentByFeign(@PathVariable("id") Integer id) {
    Payment payment = paymentClient.payment(id);
    return ResponseEntity.ok(payment);
}
```

## feign 超时配置
OpenFeign提供了2个超时参数
1. connectTimeout防⽌由于服务器处理时间⻓⽽阻塞调⽤者。
2. readTimeout 从连接建⽴时开始应⽤,在返回响应时间过⻓时触发。
对所有 feignClient 进行配置时
```yml
feign:
    client:
        config:
            default:
                # 防止由于服务器处理时间长而阻塞调用者
                connectTimeout: 5000 
                # 从连接建立时开始应用,在返回响应时间过长时触发
                readTimeout: 5000 
```
如果只对于具体FeignClient配置,可以把default换成具体的FeignClient的名字
```yml
feign:
    client:
        config:
            feignName:
                connectTimeout: 5000 
                readTimeout: 5000
```

## feign 继承熔断器
导入 Spring Cloud CircuitBreaker熔断器依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```
开启熔断配置需要在 application.yml 中添加以下内容
```yml
feign:
    circuitbreaker:
        enabled: true
```

### 熔断降级示例
Feign熔断降级类 Spring Cloud CircuitBreaker⽀持降级概念,当熔断器打开,或者调⽤是出现错误,则执⾏降级⽅法。
```java
// @FeignClient的fallback属性指定讲解的类
// 注意服务降级类需要在spring容器中注册
@FeignClient(value = "cloud-payment-service",fallback = PaymentClient.MyFallback.class)
public interface PaymentClient {

    @GetMapping("/payment/{id}")
    public Payment payment(@PathVariable("id") Integer id);

    @Component
    static class MyFallback implements PaymentClient{

        @Override
        public Payment payment(Integer id) {
            Payment payment = new Payment(id , "熔断降级返回的结果");
            return payment;
        }
    }
}
```

如果想要获得熔断降级的异常信息,⽐如打印异常⽇志,则可以使⽤fallbackFactory属性指定.
```java
//@FeignClient(value = "cloud-payment-service",fallback = PaymentClient.MyFallback.class)
@FeignClient(value = "cloud-payment-service",fallbackFactory = PaymentClient.MyFallbackFactory.class)
public interface PaymentClient {

    @GetMapping("/payment/{id}")
    public Payment payment(@PathVariable("id") Integer id);

    @Component
    static class MyFallback implements PaymentClient{

        @Override
        public Payment payment(Integer id) {
            Payment payment = new Payment(id , "熔断降级返回的结果");
            return payment;
        }
    }

    @Component
    static class MyFallbackFactory implements FallbackFactory<MyFallback>{

        @Override
        public MyFallback create(Throwable cause) {
            cause.printStackTrace();
            return new MyFallback();
        }
    }
}
```

## feign 请求与相应压缩
```yml
feign:
    compression:
        request:
            # 请求压缩
            enabled: true 
            # 压缩的类型
            mime-types: text/xml,application/xml,application/json 
            # 请求最小压缩的阈值
            min-request-size: 2048 
        response:
            # 响应压缩
            enabled: true 
            # 使用gzip解码器解码响应数据
            useGzipDecoder: true 
```

## feign 日志
在 application.yml 中配置 feign 日志
```yml
logging:
 level:
     com.blackFire: debug
```
配置FeignLoggerLevel 在配置类中配置Logger.Level

告诉配置类Feign需要打印的内容,具体代码如下
```java
import feign.Logger;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FooConfiguration {
    /**
     * Logger.Level取值
     *      NONE: ⽆⽇志记录(默认)。
     *      BASIC: 只记录请求⽅法和 URL 以及响应状态码和执⾏时间。
     *      HEADERS: 记录基本信息以及请求和响应标头。
     *      FULL: 记录请求和响应的标头、正⽂和元数据
     */
    @Bean
    Logger.Level feignLoggerLevel(){
        return Logger.Level.FULL;
    }
}
```