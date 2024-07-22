---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Spring Cloud Gateway
简介
```
SpringCloud Gateway 是 Spring Cloud 的⼀个全新项⽬,该项⽬是基于 Spring 5.0,Spring Boot 2.0 和 Project Reactor 等技术开发的⽹关,它旨在为微服务架构提供⼀种简单有效的统⼀的 API 路由管理⽅式。

SpringCloud Gateway 作为 Spring Cloud ⽣态系统中的⽹关,⽬标是替代 Zuul,在Spring Cloud 2.0以上版本中,没有对新版本的Zuul 2.0以上最新⾼性能版本进⾏集成,仍然还是使⽤的Zuul 2.0之前的⾮Reactor模式的⽼版本。

⽽为了提升⽹关的性能,SpringCloud Gateway是基于WebFlux框架实现的,⽽WebFlux框架底层则使⽤了⾼性能的Reactor模式通信框架Netty。

Spring Cloud Gateway 的⽬标,不仅提供统⼀的路由⽅式,并且基于 Filter 链的⽅式提供了⽹关基本的功能,例如:安全,监控/指标,和限流。

注意:Spring Cloud Gateway 底层使⽤了⾼性能的通信框架Netty。
```

特征
```
基于 Spring Framework 5,Project Reactor 和 Spring Boot 2.0
集成 Spring Cloud DiscoveryClient
Predicates 和 Filters 作⽤于特定路由,易于编写的 Predicates 和 Filters
具备⼀些⽹关的⾼级功能：动态路由、限流、路径重写
集成Spring Cloud DiscoveryClient
集成熔断器CircuitBreaker
```

术语解释
```
Filter(过滤器)
    和Zuul的过滤器在概念上类似,可以使⽤它拦截和修改请求,并且对下游的响应,进⾏⼆次处理。
    过滤器为org.springframework.cloud.gateway.filter.GatewayFilter类的实例。

Route(路由)
    ⽹关配置的基本组成模块,和Zuul的路由配置模块类似。
    ⼀个Route模块由⼀个 ID,⼀个⽬标URI,⼀组断⾔和⼀组过滤器定义。如果断⾔为真,则路由匹配,⽬标URI会被访问。

Predicate(断⾔)
    这是⼀个 Java 8 的 Predicate,可以使⽤它来匹配来⾃ HTTP 请求的任何内容,例如 headers 或参数。断⾔的输⼊类型是⼀个 ServerWebExchange。
```
处理流程
```
客户端向 Spring Cloud Gateway 发出请求。

然后在 Gateway Handler Mapping 中找到与请求相匹配的路由,将其发送到 Gateway Web Handler。

Handler 再通过指定的过滤器链来将请求发送到我们实际的服务执⾏业务逻辑,然后返回。过滤器之间⽤虚线分开是因为过滤器可能会在发送代理请求之前(“pre”)或之后(“post”)执⾏业务逻辑。
```

## 路由配置方式
简介
```
路由是⽹关配置的基本组成模块,和Zuul的路由配置模块类似。⼀个Route模块由⼀个 ⼀个⽬标 URI,⼀组断⾔和⼀组过滤器定义。

如果断⾔为真,则路由匹配,⽬标URI会被访问
```
### 基础路由配置⽅式
```yml
# 如果请求的⽬标地址,是单个的URI资源路径,配置⽂件实例如下。
spring:
    application:
        name: api-gateway
    cloud:
        gateway:
            routes:
                - id: service1
                uri: https://blog.csdn.net
                predicates:
                    - Path=/csdn

# 上⾯这段配置的意思是,配置了⼀个 id 为 url-proxy-1的URI代理规则,路由的规则为,当访问地址 http://localhost:8080/csdn/1.jsp时,会路由到上游地址https://blog.csdn.net/1.jsp。

# 各字段含义如下
# id：我们⾃定义的路由 ID,保持唯⼀
# uri：⽬标服务地址
# predicates：路由条件,Predicate 接受⼀个输⼊参数,返回⼀个布尔值结果。该接⼝包含多种默认⽅法来将 Predicate 组合成其他复杂的逻辑(⽐如：与,或,⾮)。
```

### 基于代码的路由配置方式
转发功能同样可以通过代码来实现,我们可以在启动类 GateWayApplication 中添加⽅法customRouteLocator() 来定制转发规则。

```java
@SpringBootApplication
// 向eureka注册
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }

    /**
     * 以方法形式配置路径 此方法不常用
     * @param builder
     * @return
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder){
        // 当此服务接收到 csdn 时跳转到 http://blog.csdn.net/ 下
        return builder.routes().route("service1",r->r.path("/csdn").uri("http://blog.csdn.net/")).build();
    }
}
```
### 和注册中⼼相结合的路由配置⽅式
```yml
# 在uri的schema协议部分为⾃定义的lb:类型,表示从微服务注册中⼼(如Eureka)订阅服务,并且通过负载均衡进⾏服务的路由

server:
    port: 9005
spring:
    application:
        name: api-gateway
    cloud:
        gateway:
            routes:
                - id: service1
                uri: https://blog.csdn.net
                predicates:
                    - Path=/csdn
                - id: service2
                # uri: http://127.0.0.1:9001
                uri: lb://cloud-payment-service
                predicates:
                - Path=/payment/**
eureka:
    client:
        service-url:
            defaultZone: http://127.0.0.1:9004/eureka
```

## 路由匹配规则
Spring Cloud Gateway的主要功能之⼀是转发请求,转发规则的定义主要包含三个部分,如下图所示

![路由匹配规则](https://i.jpg.dog/47503a7f9dbe034f5b14ee00f588f6ca.png)

Spring Cloud Gateway 的功能很强⼤,我们仅仅通过 Predicates 的设计就可以看出来,前⾯我们只是使⽤了 predicates 进⾏了简单的条件匹配,其实 Spring Cloud Gataway 帮我们内置了很多Predicates 功能。

Spring Cloud Gateway 是通过 Spring WebFlux 的 HandlerMapping 做为底层⽀持来匹配到转发路由,Spring Cloud Gateway 内置了很多 Predicates ⼯⼚,这些 Predicates ⼯⼚通过不同的 HTTP请求参数来匹配,多个 Predicates ⼯⼚可以组合使⽤.


![路由匹配规则1](https://i.jpg.dog/6347d87ec0ecc9403cc6d1d886bda9bc.png)

### Predicate 断⾔条件
简介
```
Predicate 来源于 Java 8,是 Java 8 中引⼊的⼀个函数,Predicate 接受⼀个输⼊参数,返回⼀个布尔值结果。

该接⼝包含多种默认⽅法来将 Predicate 组合成其他复杂的逻辑(⽐如：与,或,⾮)。

可以⽤于接⼝请求参数校验、判断新⽼数据是否有变化需要进⾏更新操作。

在 Spring Cloud Gateway 中 Spring 利⽤ Predicate 的特性实现了各种路由匹配规则,有通过Header、请求参数等不同的条件来进⾏作为条件匹配到对应的路由.

说⽩了 Predicate 就是为了实现⼀组匹配规则,⽅便让请求过来找到对应的 Route 进⾏处理.
```

转发规则如下表所示

|  规则   |                                                 实例                                                 |                                  说明                                  |
| :-----: | :--------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------: |
|  Path   |                                         -Path=/gate/,/rele/                                          |  当请求路径为gate/rule开头的时候,转发到 http://localhost:9001服务器上  |
| Before  |                        -Before=2017-01-20T17:42:47.789-07:00[America/Denver]                         |    在某个时间之前的请求才会被转发到 http://localhost:9001 服务器上     |
|  After  |                         -After=2017-01-20T17:42:47.789-07:00[America/Denver]                         |                     在某个时间之后的请求才会被转发                     |
| Between | -Between=2017-01-20T17:42:47.789-07:00[America/Denver],2017-01-20T17:42:47.789-07:00[America/Denver] |                    在某个时间段之间的请求才会被转发                    |
| Cookie  |                                        -Cookie-chocolate,ch.p                                        | 名为 chocolate 的表单或者满足正则 ch.p 的表单才会被匹配到进行请求转发  |
| Header  |                                       -Header=X-Reqest-ld,\d+                                        |            携带参数 X-Request-Id或者满足\d+的请求头才会匹配            |
|  Host   |                                         -Host=www.hd123.com                                          | 当主机名为 www.hd123.com的时候直接转发到 http://localhost:9001服务器上 |
| Method  |                                             -Method=GET                                              |      只有 Get 方法才会匹配转发请求,还可以限定 post/put 等请求方式      |

#### 通过请求参数匹配
Query Route Predicate ⽀持传⼊两个参数,⼀个是属性名⼀个为属性值,属性值可以是正则表达式。
```yml
# 这样配置,只要请求中包含 smile 属性的参数即可匹配路由。
spring:
    cloud:
        gateway:
            routes:
                - id: service3
                uri: https://www.baidu.com
                order: 0
                predicates:
                    - Query=smile
                
# 还可以将 Query 的值以键值对的⽅式进⾏配置,这样在请求过来时会对属性值和正则进⾏匹配,匹配上才会⾛路由。
spring:
    cloud:
        gateway:
            routes:
                - id: service3
                uri: https://www.baidu.com
                order: 0
                predicates:
                    # 这样只要当请求中包含 keep 属性并且参数值是以 pu 开头的⻓度为三位的字符串才会进⾏匹配和路由。

                    - Query=keep, pu.
```

#### 通过Header匹配
Header Route Predicate 和 Query Route Predicate ⼀样,也是接收 2 个参数,⼀个header 中属性名称和⼀个正则表达式,这个属性值和正则表达式匹配则执⾏
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service4
                uri: https://www.baidu.com
                order: 0
                predicates:
                    - Header=X-Request-Id, \d+
```
使⽤ curl 测试,命令⾏输⼊：curl http://localhost:9005 -H "X-Request-Id:88",则返回⻚⾯代码证明匹配成功。

#### 通过Cookie匹配
Cookie Route Predicate 可以接收两个参数,⼀个是 Cookie name ,⼀个是正则表达式,路由规则会通过获取对应的 Cookie name 值和正则表达式去匹配,如果匹配上就会执⾏路由,如果没有匹配上则不执⾏
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service5
                uri: https://www.baidu.com
                predicates:
                    - Cookie=sessionId, test
```
使⽤ curl 测试,命令⾏输⼊,curl http://localhost:9005 --cookie "sessionId=test",则会返回⻚⾯代码,如果去掉--cookie "sessionId=test",后台汇报 404 错误。

#### 通过Host匹配

Host Route Predicate 接收⼀组参数,⼀组匹配的域名列表,这个模板是⼀个 ant 分隔的模板,⽤.号作为分隔符。它通过参数中的主机地址作为匹配规则。
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service6
                uri: https://www.baidu.com
                predicates:
                    - Host=**.baidu.com
```
使⽤ curl 测试,命令⾏输⼊,curl http://localhost:9005 -H "Host: www.baidu.com"或者curlhttp://localhost:8080 -H "Host: md.baidu.com",经测试以上两种 host 均可匹配到 host_route 路由,去掉 host 参数则会报 404 错误

#### 通过请求⽅式匹配
可以通过是 POST、GET、PUT、DELETE 等不同的请求⽅式来进⾏路由。
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service7
                uri: https://www.baidu.com
                predicates:
                    - Method=PUT
```
使⽤ curl 测试,命令⾏输⼊,curl -X PUT http://localhost:9005,测试返回⻚⾯代码,证明匹配到路由,以其他⽅式,返回 404 没有找到,证明没有匹配上路由

#### 通过请求路径匹配
Path RoutePredicate 接收⼀个匹配路径的参数来判断是否路由。
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service8
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/payment/{segment}
```
如果请求路径符合要求,则此路由将匹配, curl 测试,命令⾏输⼊,curl http://localhost:9005/payment/1,可以正常获取到⻚⾯返回值,curl http://localhost:9005/payment2/1,报404,证明路由是通过指定路由来匹配。

#### 组合匹配
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service9
                uri: https://www.baidu.com
                order: 0
                predicates:
                    - Host=**.foo.org
                    - Path=/headers
                    - Method=GET
                    - Header=X-Request-Id, \d+
                    - Query=foo, ba.
                    - Query=baz
                    - Cookie=chocolate, ch.p
```
各种 Predicates 同时存在于同⼀个路由时,请求必须同时满⾜所有的条件才被这个路由匹配。⼀个请求满⾜多个路由的断⾔条件时,请求只会被⾸个成功匹配的路由转发



### filters 过滤器规则

|      过滤规则       |             实例             |                               说明                               |
| :-----------------: | :--------------------------: | :--------------------------------------------------------------: |
|     PrefixPath      |       -PrefixPath=/app       |                       在请求路径前加上 app                       |
|     RewritePath     | -RewritePath=/test,/app/test |   访问 localhost:902/test,请求会转发到 localhost:8001/app/test   |
|       SetPath       |     SetPath=/app/{path}      | 通过模板设置路径,转发的规则会在路径前增加 app, {path} 表示愿路径 |
|     RedirectTo      |                              |                              重定向                              |
| RemoveRequestHeader |                              |                        去掉某个请求头信息                        |

#### PrefixPath

```yml
# 对所有的请求路径添加前缀
spring:
    cloud:
        gateway:
            routes:
                - id: service10
                uri: http://127.0.0.1:9001
                predicates:
                    - Path={segment}
                filters:
                    - PrefixPath=/payment
# 访问/123请求被发送到http://127.0.0.1:9001/payment/123。
```

#### StripPrefix
```yml
# 跳过指定的路径
spring:
    cloud:
        gateway:
            routes:
                - id: service11
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/api/{segment}
                filters:
                    - StripPrefix=1
                    - PrefixPath=/payment
# 此时访问http://localhost:9005/api/123,⾸先StripPrefix过滤器去掉⼀个/api,然后PrefixPath过滤器加上⼀个/payment,能够正确访问到⽀付微服务。
```

#### RewritePath
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service12
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/api/payment/**
                filters:
                    - RewritePath=/api/(?<segment>.*), /$\{segment}
# 请求 http://localhost:9005/api/payment/123 路径,RewritePath过滤器将路径重写为 http://localhost:9005/payment/123,能够正确访问⽀付微服务
```

#### SetPath
SetPath和Rewrite类似,代码如下。
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service13
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/api/payment/{segment}
                filters:
                    - SetPath=/payment/{segment}
# 请求 http://localhost:9005/api/payment/123 路径,SetPath过滤器将路径设置为 http://localhost:9005/payment/123,能够正确访问⽀付微服务。
```

#### RemoveRequestHeader
```yml
# 去掉某个请求头信息。
spring:
    cloud:
        gateway:
            routes:
                - id: removerequestheader_route
                uri:  https://example.org
                filters:
                    - RemoveRequestHeader=X-Request-Foo
```

#### RemoveRequestParameter

```yml
#去掉某个请求参数信息
spring:
    cloud:
        gateway:
            routes:
                - id: removerequestparameter_route
                uri:  https://example.org
                filters:
                    - RemoveRequestParameter=red
```

#### SetRequestHeader
```yml
# 设置请求头信息

spring:
    cloud:
        gateway:
            routes:
                - id: setrequestheader_route
                uri:  https://example.org
                filters:
                    - SetRequestHeader=X-Request-Red, Blue
```

#### default-filters
```yml
# 对所有的请求添加过滤器。

spring:
    cloud:
        gateway:
            routes:
                - id: service14
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/9001/{segment}
                - id: service15
                uri: http://127.0.0.1:9000
                predicates:
                    - Path=/9000/{segment}
            default-filters:
                - StripPrefix=1
                - PrefixPath=/payment
```

### ⾃定义过滤器
过滤器执⾏次序
Spring-Cloud-Gateway 基于过滤器实现,同 zuul 类似,有pre和post两种⽅式的 filter,分别处理前置逻辑和后置逻辑。

客户端的请求先经过pre类型的 filter,然后将请求转发到具体的业务服务,收到业务服务的响应之后,再经过post类型的 filter 处理,最后返回响应到客户端。

过滤器执⾏流程如下,order 越⼤,优先级越低

![过滤器执行次序](https://i.jpg.dog/d17d2f3a7e47abfc65b5774723a2c4b7.png)

过滤器分为两种
```
全局过滤器: 对所有路由⽣效。
局部过滤器: 对指定的路由⽣效。
```

#### 全局过滤器
实现 GlobalFilter 和 Ordered,重写相关⽅法,加⼊到spring容器管理即可,⽆需配置,全局过滤器对所有的路由都有效。代码如下
```java
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * 全局过滤器配置
 * 定义了4个全局过滤器,顺序为A>B>C>MyAuthFilter,其中全局过滤器MyAuthFilter中判断令牌是否存在,如果令牌不存在,则返回401状态码,表示没有权限访问
 */
//@Configuration
@Slf4j
public class FilterConfig {

    @Bean
    public GlobalFilter a() {
        return new AFilter();
    }

    @Bean
    public GlobalFilter b() {
        return new BFilter();
    }

    @Bean
    public GlobalFilter c() {
        return new CFilter();
    }

    @Bean
    public GlobalFilter myAuth() {
        return new MyAuthFilter();
    }


    static class AFilter implements GlobalFilter, Ordered {

        @Override
        public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
            log.info("AFilter 前置逻辑-----");
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                log.info("AFilter 后置逻辑---");
            }));


        }

        @Override
        public int getOrder() {
            return HIGHEST_PRECEDENCE + 100;
        }
    }

    static class BFilter implements GlobalFilter, Ordered {

        @Override
        public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
            log.info("BFilter 前置逻辑-----");
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                log.info("BFilter 后置逻辑---");
            }));


        }

        @Override
        public int getOrder() {
            return HIGHEST_PRECEDENCE + 200;
        }
    }

    static class CFilter implements GlobalFilter, Ordered {

        @Override
        public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
            log.info("CFilter 前置逻辑-----");
            return chain.filter(exchange).then(Mono.fromRunnable(() -> {
                log.info("CFilter 后置逻辑---");
            }));


        }

        @Override
        public int getOrder() {
            return HIGHEST_PRECEDENCE + 300;
        }
    }

    static class MyAuthFilter implements GlobalFilter, Ordered {

        @Override
        public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
            log.info("MyAuth 前置逻辑--");
            String token = exchange.getRequest().getHeaders().getFirst("token");
            if (StringUtils.isBlank(token)){
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        }

        @Override
        public int getOrder() {
            return HIGHEST_PRECEDENCE + 400;
        }
    }
}
```

#### 局部过滤器
定义局部过滤器步骤如下。
```
需要实现GatewayFilter, Ordered,实现相关的⽅法加⼊到过滤器⼯⼚,并且注册到spring容器中。
在配置⽂件中进⾏配置,如果不配置则不启⽤此过滤器规则。
```

```java
// 接下来定义局部过滤器,对于请求头user-id校验,如果不存在user-id请求头,直接返回状态码406
@Component
public class UserIdCheckGatewayFilterFactory extends AbstractGatewayFilterFactory<Object>{
    @Override
    public GatewayFilter apply(Object config){
        return new UserIdCheckGateWayFilter();
    }

    @Slf4j
    static class UserIdCheckGateWayFilter implements GatewayFilter, Ordered{
        @Override
        public Mono<Void> filter(ServerWebExchange exchange,GatewayFilterChain chain){
            String url = exchange.getRequest().getPath().pathWithinApplication().value();
            log.info("请求URL:" + url);
            log.info("method:" + exchange.getRequest().getMethod());
            //获取header
            String userId = exchange.getRequest().getHeaders().getFirst("user-id");
            log.info("userId：" + userId);
            if (StringUtils.isBlank(userId)){
                log.info("*****头部验证不通过,请在头部输⼊ user-id");
                //终⽌请求,直接回应
                exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        }
        // 值越⼩,优先级越⾼
        @Override
        public int getOrder(){
            return HIGHEST_PRECEDENCE;
        }
    }
}
```
配置文件
```yml
spring:
    cloud:
        gateway:
            routes:
                - id: service14
                uri: http://127.0.0.1:9001
                predicates:
                    - Path=/{segment}
                default-filters:
                    - PrefixPath=/payment
                    - UserIdCheck
```

### 高级特性
熔断降级
```
在分布式系统中,⽹关作为流量的⼊⼝,因此会有⼤量的请求进⼊⽹关,向其他服务发起调⽤,其他服务不可避免的会出现调⽤失败(超时、异常),失败时不能让请求堆积在⽹关上,需要快速失败并返回给客户端,想要实现这个要求,就必须在⽹关上做熔断、降级操作。

为什么在⽹关上请求失败需要快速返回给客户端？因为当⼀个客户端请求发⽣故障的时候,这个请求会⼀直堆积在⽹关上,当然只有⼀个这种请求,⽹关肯定没有问题(如果⼀个请求就能造成整个系统瘫痪,那这个系统可以下架了),但是⽹关上堆积多了就会给⽹关乃⾄整个服务都造成巨⼤的压⼒,甚⾄整个服务宕掉。

因此要对⼀些服务和⻚⾯进⾏有策略的降级,以此缓解服务器资源的的压⼒,以保证核⼼业务的正常运⾏,同时也保持了客户和⼤部分客户的得到正确的相应,所以需要⽹关上请求失败需要快速返回给客户端。

CircuitBreaker过滤器使⽤Spring Cloud CircuitBreaker API 将⽹关路由包装在断路器中。SpringCloud CircuitBreaker ⽀持多个可与 Spring Cloud Gateway ⼀起使⽤熔断器库。⽐如,Spring Cloud⽀持开箱即⽤的 Resilience4J。
```
导入依赖
```xml
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-circuitbreaker-reactor-resilience4j</artifactId>
</dependency>
```
#### 配置文件
```yml
server:
 port: 9005
spring:
 application:
     name: api-gateway
 cloud:
     gateway:
         routes:
             - id: service14
             uri: http://127.0.0.1:9001
             predicates:
                 - Path=/payment/{segment}
             filters:
                 - name: CircuitBreaker
                 args:
                     name: backendA
                     fallbackUri: forward:/fallbackA
eureka:
 client:
     service-url:
         defaultZone: http://127.0.0.1:9004/eureka
resilience4j:
 circuitbreaker:
     configs:
         default:
             failureRateThreshold: 30 #失败请求百分⽐,超过这个⽐例,CircuitBreaker变为OPEN状态
             slidingWindowSize: 10 #滑动窗⼝的⼤⼩,配置COUNT_BASED,表示10个请求,配置TIME_BASED表示10秒
             minimumNumberOfCalls: 5 #最⼩请求个数,只有在滑动窗⼝内,请求个数达到这个个数,才会触发CircuitBreader对于断路器的判断
             slidingWindowType: TIME_BASED #滑动窗⼝的类型
             permittedNumberOfCallsInHalfOpenState: 3 #当CircuitBreaker处于HALF_OPEN状态的时候,允许通过的请求个数
             automaticTransitionFromOpenToHalfOpenEnabled: true #设置true,表示⾃动从OPEN变成HALF_OPEN,即使没有请求过来
             waitDurationInOpenState: 2s #从OPEN到HALF_OPEN状态需要等待的时间
             recordExceptions: #异常名单
                 - java.lang.Exception
         instances:
             backendA:
                 baseConfig: default
             backendB:
                 failureRateThreshold: 50
                 slowCallDurationThreshold: 2s #慢调⽤时间阈值,⾼于这个阈值的呼叫视为慢调⽤,并增加慢调⽤⽐例。
                 slowCallRateThreshold: 30 #慢调⽤百分⽐阈值,断路器把调⽤时间⼤于
                 slowCallDurationThreshold,视为慢调⽤,当慢调⽤⽐例⼤于阈值,断路器打开,并进⾏服务降级
                 slidingWindowSize: 10
                 slidingWindowType: TIME_BASED
                 minimumNumberOfCalls: 2
                 permittedNumberOfCallsInHalfOpenState: 2
                 waitDurationInOpenState: 120s #从OPEN到HALF_OPEN状态需要等待的时间
```

#### 全局过滤器 创建⼀个全局过滤器,打印熔断器状态,代码如下
```java
@Component
@Slf4j
public class CircuitBreakerLogFilter implements GlobalFilter, Ordered {
 @Autowired
 private CircuitBreakerRegistry circuitBreakerRegistry;
 @Override
 public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain  chain) {
     String url =  exchange.getRequest().getPath().pathWithinApplication().value();
     log.info("url : {} status : {}", url,
     circuitBreakerRegistry.circuitBreaker("backendA").getState().toString());
     return chain.filter(exchange);
 }

 @Override
 public int getOrder() {
     return HIGHEST_PRECEDENCE;
 }
}
```

#### 降级方法
```java
@RestController
@Slf4j
public class FallbackController {
    @GetMapping("/fallbackA")
    public ResponseEntity fallbackA() {
        return ResponseEntity.ok("服务不可⽤,降级");
    }
}
```

### 统⼀跨域请求
简介 
```
跨域请求
    当前发起请求的域与该请求指向的资源所在的域不⼀样。

这⾥的域指的是这样的⼀个概念
    我们认为若协议 + 域名 + 端⼝号均相同,那么就是同域

举个例⼦
    假如⼀个域名为aaa.cn的⽹站,它发起⼀个资源路径为aaa.cn/books/getBookInfo的Ajax 请求,那么这个请求是同域的,因为资源路径的协议、域名以及端⼝号与当前域⼀致(例⼦中协议名默认为http,端⼝号默认为80)。
    
    但是,如果发起⼀个资源路径为bbb.com/pay/purchase的 Ajax请求,那么这个请求就是跨域请求,因为域不⼀致,与此同时由于安全问题,这种请求会受到同源策略限制。
```
虽然在安全层⾯上同源限制是必要的,但有时同源策略会对我们的合理⽤途造成影响,为了避免开发的应⽤受到限制,有多种⽅式可以绕开同源策略,常⽤的做法JSONP, CORS。

#### 跨域请求解决示例
```java
@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {
    @Value("${server.port}")
    private String serverPort;

    @GetMapping("/{id}")
    public ResponseEntity<Payment> payment(@PathVariable("id") Integer id) {
        Payment payment = new Payment(id, "⽀付成功,服务端⼝=" + serverPort);
        return ResponseEntity.ok(payment);
    }
}
```

跨域配置 现在请求经过gatway⽹关是,可以通过⽹关统⼀配置跨域访问,代码如下
```yml
spring:
    cloud:
        gateway:
            globalcors:
                cors-configurations:
                    '[/**]':
                        allowed-origin-patterns: "*" # spring boot2.4配置
                        # allowed-origins: "*"
                        allowed-headers: "*"
                        allow-credentials: true
                        allowed-methods:
                            - GET
                            - POST
                            - DELETE
                            - PUT
                            - OPTION
```

## gateway 使用
在 idea 新建此 module 时使用 spring lnitializr方式创建  
![gateway创建](https://i.jpg.dog/94b72cd71059fcd0219a84eb18f12a1d.png)

向 eureka 中注册
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
// 向eureka注册
@EnableDiscoveryClient
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

在 application.yml 中添加以下内容
```yml
server:
    port: 9005
spring:
    application:
        name: api-gateway
    cloud:
        gateway:
            routes:
                - id: url-proxy-1
                uri: https://blog.csdn.net
                predicates:
                    - Path=/csdn
eureka:
    client:
        service-url:
            defaultZone: http://127.0.0.1:9004/eureka
```













