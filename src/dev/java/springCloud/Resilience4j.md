---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Resilience4j
简介
```
Netflix的Hystrix微服务容错库已经停⽌更新,官⽅推荐使⽤Resilience4j代替Hystrix,或者使⽤Spring Cloud Alibaba的Sentinel组件。

Resilience4j是受到Netflix Hystrix的启发,为Java8和函数式编程所设计的轻量级容错框架。整个框架只是使⽤了Varr的库,不需要引⼊其他的外部依赖。与此相⽐,Netflix Hystrix对Archaius具有编译依赖,⽽Archaius需要更多的外部依赖,例如Guava和Apache Commons Configuration。

Resilience4j提供了提供了⼀组⾼阶函数(装饰器),包括断路器,限流器,重试机制,隔离机制。

你可以使⽤其中的⼀个或多个装饰器对函数式接⼝,lambda表达式或⽅法引⽤进⾏装饰。

这么做的优点是你可以选择所需要的装饰器进⾏装饰。

在使⽤Resilience4j的过程中,不需要引⼊所有的依赖,只引⼊需要的依赖即可。
```

核心模块
```
esilience4j-circuitbreaker: 熔断
resilience4j-ratelimiter: 限流
resilience4j-bulkhead: 隔离
resilience4j-retry: ⾃动重试
resilience4j-cache: 结果缓存
resilience4j-timelimiter: 超时处理
```

Resilience4j和Hystrix的异同
```
Hystrix使⽤HystrixCommand来调⽤外部的系统,⽽R4j提供了⼀些⾼阶函数,例如断路器、限流器、隔离机制等,这些函数作为装饰器对函数式接⼝、lambda表达式、函数引⽤进⾏装饰。

此外,R4j库还提供了失败重试和缓存调⽤结果的装饰器。

你可以在函数式接⼝、lambda表达式、函数引⽤上叠加地使⽤⼀个或多个装饰器,这意味着隔离机制、限流器、重试机制等能够进⾏组合使⽤。这么做的优点在于,你可以根据需要选择特定的装饰器。

任何被装饰的⽅法都可以同步或异步执⾏,异步执⾏可以采⽤ CompletableFuture 或RxJava。

当有很多超过规定响应时间的请求时,在远程系统没有响应和引发异常之前,断路器将会开启。

当Hystrix处于半开状态时,Hystrix根据只执⾏⼀次请求的结果来决定是否关闭断路器。⽽R4j允许执⾏可配置次数的请求,将请求的结果和配置的阈值进⾏⽐较来决定是否关闭断路器。

R4j提供了⾃定义的Reactor和Rx Java操作符对断路器、隔离机制、限流器中任何的反应式类型进⾏装饰。

Hystrix和R4j都发出⼀个事件流,系统可以对发出的事件进⾏监听,得到相关的执⾏结果和延迟的时间统计数据都是⼗分有⽤的。
```

## 断路器(CircuitBreaker)
简介
```
断路器通过有限状态机实现
有三个普通状态
    关闭(CLOSED)
    开启(OPEN)
    半开(HALF_OPEN)
还有两个特殊状态
    禁⽤(DISABLED)
    强制开启(FORCED_OPEN)

当熔断器关闭时,所有的请求都会通过熔断器。

如果失败率超过设定的阈值,熔断器就会从关闭状态转换到打开状态,这时所有的请求都会被拒绝。

当经过⼀段时间后,熔断器会从打开状态转换到半开状态,这时仅有⼀定数量的请求会被放⼊,并重新计算失败率,如果失败率超过阈值,则变为打开状态,如果失败率低于阈值,则变为关闭状态。

断路器使⽤滑动窗⼝来存储和统计调⽤的结果。

你可以选择基于调⽤数量的滑动窗⼝或者基于时间的滑动窗⼝。

基于访问数量的滑动窗⼝统计了最近N次调⽤的返回结果。

居于时间的滑动窗⼝统计了最近N秒的调⽤返回结果。

除此以外熔断器还会有两种特殊状态
    DISABLED(始终允许访问)
    FORCED_OPEN(始终拒绝访问)

这两个状态不会⽣成熔断器事件(除状态装换外),并且不会记录事件的成功或者失败。

退出这两个状态的唯⼀⽅法是触发状态转换或者重置熔断器
```
pom导入依赖
```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-circuitbreaker-resilience4j</artifactId>
</dependency>
```
CircuitBreaker配置
|                   配置属性                    |                                   默认值                                   |                                                                                                                                                   描述                                                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| failureRateThreshold                         | 50                                                                        | 以百分比配置失败率阈值。当失败率等于或大于阈值时,断路器状态并关闭变为开启,并进行服务降级。                                                                                                                                                                                                                      |
| slowCallRateThreshold                        | 100                                                                       | 以百分比的方式配置,断路器把调用时间用于slowCallDurationThreshold的调用视为慢调用,当慢调用比例大于等于阈值时,断路器开启,并进行服务降级                                                                                                                                                                           |
| slowCallDurationThreshold 60000              | [ms]                                                                      | 配置调用时间的阈值,用于该阈值的呼叫视为慢调用,并增加慢调用比例。                                                                                                                                                                                                                                              |
| permittedNumberOfCallsInHalfOpenState        | 10                                                                        | 断路器在半开状态下允许通过的调用次数                                                                                                                                                                                                                                                                         |
| maxWaitDurationInHalfOpenState               | 0                                                                         | 断路器在半开状态下的最长等待时间,超过该配置值的话,断路器会从半开状态恢复为开启状态。配置是0时表示断路器会一直处于半开状态,直到所有允许通过的访问结束。                                                                                                                                                               |
| slidingWindowType                            | COUNT_BASED                                                               | 配置滑动窗口的类型,当断路器关闭时,将调用的结果记录在滑动窗口中。滑动窗口的类型可以是count-based或timebased。如果滑动窗口类型是COUNT_BASED,将会统计记录最近slidingWindowSize次调用的结果。如果是TIME_BASED,将会统计记录最近slidingWindowSize秒的调用结果。                                                            |
| slidingWindowSize                            | 100                                                                       | 配置滑动窗口的大小。                                                                                                                                                                                                                                                                                        |
| minimumNumberOfCalls                         | 100                                                                       | 断路器计算失败率或慢调用率之前所需的最小调用数(每个滑动窗口周期)。例如,如果minimumNumberOfCalls为10,则必须至少记录10个调用,然后才能计算失败率。如果只记录了9次调用,即使所有9次调用都失败,断路器也不会开启。                                                                                                         |
| waitDurationInOpenState 60000                | [ms]                                                                      | 断路器从开启过渡到半开应等待的时间。                                                                                                                                                                                                                                                                         |
| automaticTransitionFromOpenToHalfOpenEnabled | false                                                                     | 如果设置为true,则意味着断路器将自动从开启状态过渡到半开状态,并且不需要调用来触发转换。创建一个线程来监视断路器的所有实例,以便在WaitDurationInOpenstate之后将它们转换为半开状态。但是,如果设置为false,则只有在发出调用时才会转换到半开,即使在waitDurationInOpenState之后也是如此。这里的优点是没有线程监视所有断路器的状态。 |
| recordExceptions                             | empty                                                                     | 记录为失败并因此增加失败率的异常列表。除非通过ignoreExceptions显式忽略,否则与列表中某个匹配或继承的异常都将被视为失败。如果指定异常列表,则所有其他异常均视为成功,除非它们被ignoreExceptions显式忽略。                                                                                                                 |
| ignoreExceptions                             | empty                                                                     | 被忽略且既不算失败也不算成功的异常列表。任何与列表之一匹配或继承的异常都不会被视为失败或成功,即使异常是recordExceptions的一部分                                                                                                                                                                                    |
| recordException                              | [throwable -> true· ,By default all ,exceptions are recored as failures ] | 一个自定义断言,用于评估异常是否应记录为失败。如果异常应计为失败,则断言必须返回true。如果出断言返回false,应算作成功,除非ignoreExceptions显式忽略异常。                                                                                                                                                            |
| ignoreException                              | [ throwable -> false , By default no ,exception is ignored]               | 


使用断路器需要在 application.yml 中配置
```yml
# 熔断降级配置
resilience4j:
  # 熔断降级的配置
  circuitbreaker:
    configs:
      default:
        #  这里是按数据进行熔断降级
        failureRateThreshold: 30 #失败请求百分⽐,超过这个⽐例,CircuitBreaker变为OPEN状态
        slidingWindowSize: 10 #滑动窗⼝的⼤⼩,配置COUNT_BASED,表示10个请求,配置 TIME_BASED表示10秒
        minimumNumberOfCalls: 5 #最⼩请求个数,只有在滑动窗⼝内,请求个数达到这个个 数,才会触发CircuitBreader对于断路器的判断
        slidingWindowType: TIME_BASED #滑动窗⼝的类型
        permittedNumberOfCallsInHalfOpenState: 3 #当CircuitBreaker处于HALF_OPEN状态的时候,允许通过的请求个数
        automaticTransitionFromOpenToHalfOpenEnabled: true #设置true,表示⾃动从 OPEN变成HALF_OPEN,即使没有请求过来
        waitDurationInOpenState: 2s #从OPEN到HALF_OPEN状态需要等待的时间
        recordExceptions: #异常名单
          - java.lang.Exception
    instances:
      backendA:
        baseConfig: default #熔断器backendA,继承默认配置default
      backendB:
         # 这里是按时间顺序的熔断降级
        failureRateThreshold: 50
        slowCallDurationThreshold: 2s #慢调⽤时间阈值,⾼于这个阈值的呼叫视为慢调⽤,  并增加慢调⽤⽐例。
        slowCallRateThreshold: 30 #慢调⽤百分⽐阈值,断路器把调⽤时间⼤于  slowCallDurationThreshold,视为慢调⽤,当慢调⽤⽐例⼤于阈值,断路器打开,并进⾏服务降级
        slidingWindowSize: 10
        slidingWindowType: TIME_BASED
        minimumNumberOfCalls: 2
        permittedNumberOfCallsInHalfOpenState: 2
        waitDurationInOpenState: 2s #从OPEN到HALF_OPEN状态需要等待的时间
```

上⾯配置了2个断路器"backendA",和"backendB",其中backendA断路器配置基于default配置,"backendB"断路器配置了慢调⽤⽐例熔断,"backendA"熔断器配置了异常⽐例熔断.
代码使用
```java
@GetMapping("/payment/{id}")
@CircuitBreaker(name = "backendD", fallbackMethod = "fallback")
public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) throws InterruptedException, ExecutionException {
    log.info("now i enter the method!!!");
    Thread.sleep(10000L); //阻塞10秒,已测试慢调⽤⽐例熔断
    String url = "http://cloud-payment-service/payment/" + id;
    Payment payment = restTemplate.getForObject(url, Payment.class);
    log.info("now i exist the method!!!");
    return ResponseEntity.ok(payment);
}

public ResponseEntity<Payment> fallback(Integer id, Throwable e) {
    e.printStackTrace();
    Payment payment = new Payment();
    payment.setId(id);
    payment.setMessage("fallback...");
    return new ResponseEntity<>(payment, HttpStatus.BAD_REQUEST);
}
```
## 隔离(Builkhead)
Resilience4j提供了两种隔离的实现⽅式,可以限制并发执⾏的数量。
1. SemaphoreBulkhead使⽤了信号量
2. FixedThreadPoolBulkhead使⽤了有界队列和固定⼤⼩线程池

pom添加依赖
```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-bulkhead</artifactId>
    <version>1.7.0</version>
</dependency>
```

### 信号量隔离
配置数据如图

![信号量隔离配置](https://i.jpg.dog/46d017b78229e75064e47f0bac14fcfb.png)

application.yml 中的配置
```yml
resilience4j:
    bulkhead:
        configs:
            default:
                maxConcurrentCalls: 5 # 隔离允许并发线程执⾏的最⼤数量
                maxWaitDuration: 20ms # 当达到并发调⽤数量时,新的线程的阻塞时间
    instances:
        backendA:
    baseConfig: default
        backendB:
        maxWaitDuration: 10ms
        maxConcurrentCalls: 20
```
使用示例图
```java
// type默认为Bulkhead.Type.SEMAPHORE,表示信号量隔离
@GetMapping("/payment/{id}")
@Bulkhead(name = "backendA", fallbackMethod = "fallback", type = Bulkhead.Type.SEMAPHORE)
public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) throws InterruptedException, ExecutionException {
    log.info("now i enter the method!!!");
    Thread.sleep(10000L); //阻塞10秒,已测试慢调⽤⽐例熔断
    String url = "http://cloud-payment-service/payment/" + id;
    Payment payment = restTemplate.getForObject(url, Payment.class);
    log.info("now i exist the method!!!");
    return ResponseEntity.ok(payment);
}
```
### 线程池隔离
配置如图
![线程池隔离配置](https://i.jpg.dog/78d2b5c306b47f907af24fcc8b36e02b.png)



修改 application.yml 
```yml
resilience4j:
 thread-pool-bulkhead:
 configs:
     default:
         maxThreadPoolSize: 4 # 最⼤线程池⼤⼩
         coreThreadPoolSize: 2 # 核⼼线程池⼤⼩
         queueCapacity: 2 # 队列容量
 instances:
     backendA:
         baseConfig: default
     backendB:
         maxThreadPoolSize: 1
         coreThreadPoolSize: 1
         queueCapacity: 1
```
使用示例
```java
@Service
@Slf4j
public class OrderService {
    // 注意,FixedThreadPoolBulkhead只对CompletableFuture⽅法有效,所以我们必创建返回CompletableFuture类型的⽅法
    @Bulkhead(name = "backendA", type = Bulkhead.Type.THREADPOOL)
    public CompletableFuture<Payment> getPaymet() throws InterruptedException{
        log.info("now i enter the method!!!");
        Thread.sleep(10000L);
        log.info("now i exist the method!!!");
        return CompletableFuture.supplyAsync(() -> new Payment(123, "线程池隔离回退。。。"));
    }
}
```
```java
@Autowired
private OrderService orderService;

@GetMapping("/payment/{id}")
public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) throws InterruptedException, ExecutionException {
    return ResponseEntity.ok(orderService.getPaymet().get());
}
```
## 限流(RateLimiter)
导入依赖
```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-ratelimiter</artifactId>
    <version>1.7.0</version>
</dependency>
```
配置如图
R4的限流模块RateLimter基于滑动窗⼝,和令牌桶限流算法

![限流配置](https://i.jpg.dog/03d5a2898e5352869ee498fc02a91d82.png)
修改 application.yml
```yml
resilience4j:
 ratelimiter:
     configs:
         default:
         timeoutDuration: 5 # 线程等待权限的默认等待时间
         limitRefreshPeriod: 1s # 限流器每隔1s刷新⼀次,将允许处理的最⼤请求重置为2
         limitForPeriod: 2 #在⼀个刷新周期内,允许执⾏的最⼤请求数
 instances:
     backendA:
         baseConfig: default
     backendB:
         timeoutDuration: 5
         limitRefreshPeriod: 1s
         limitForPeriod: 5
```

使用示例
```java
@GetMapping("/payment/{id}")
@RateLimiter(name = "backendA", fallbackMethod = "fallback")
public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) throws InterruptedException, ExecutionException {
    log.info("now i enter the method!!!");
    Thread.sleep(10000L); //阻塞10秒,已测试慢调⽤⽐例熔断
    String url = "http://cloud-payment-service/payment/" + id;
    Payment payment = restTemplate.getForObject(url, Payment.class);
    log.info("now i exist the method!!!");
    return ResponseEntity.ok(payment);
}
```









