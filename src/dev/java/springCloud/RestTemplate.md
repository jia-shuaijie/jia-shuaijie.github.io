---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# RestTemplate(服务调用)
简介
```
RestTemplate是Spring Resources中⼀个访问第三⽅RESTful API接⼝的⽹络请求框架。 

RestTemplate的设计原则和其他的Spring Template(例如JdbcTemplate)类似,都是为了执⾏复杂任务提供了⼀个具有默认⾏为的简单⽅法。 

RestTemplate是⽤来消费REST服务的,所以RestTemplate的主要⽅法都与REST的HTTP协议的⼀些⽅法紧密相连,例如HEAD、GET、POST、PUT、DELETE、OPTIONS等⽅法,这些⽅法在RestTemplate类对应的⽅法为headForHeaders(),getForObject()、postForObject()、put()、delet()等。 
```

调用示例
```java
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private DiscoveryClient discoveryClient;
    
    // 当拦截到 /order/payment/1 这种请求时进行处理
    @GetMapping("/payment/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) {
        // 从 eureka 获取 payment 的服务
        List<ServiceInstance> serviceInstances = discoveryClient.getInstances("cloud-payment-service");
        ServiceInstance serviceInstance = serviceInstances.get(0);
        // 从 eureka 中获取该服务的 ip和端口号拼接称请求的 url
        String url = "http://" + serviceInstance.getHost() + ":" + serviceInstance.getPort() + "/payment/" + id;
        // 使用 restTemplate 请求该地址并转换为 Payment.class 类型
        Payment payment = restTemplate.getForObject(url, Payment.class);
        // 成功后返回上面的 payment 对象
        return ResponseEntity.ok(payment);
    }
}
```

## LoadBalancer(负载均衡)
简介
```
负载均衡是指将负载分摊到多个执⾏单元上,常⻅的负载均衡有两种⽅式。

⼀种独⽴进程单元,通过负载均衡策略,将请求转发到不同的执⾏单元上,例如Nginx。

另⼀种是将负载均衡逻辑以代码的形式封装到服务消费者的客户端上,服务消费者客户端维护了⼀份服务提供者的信息列表,有了信息表,通过负载均衡策略将请求分摊给多个服务提供者,从⽽达到负载均衡的⽬的。

SpringCloud原有的客户端负载均衡⽅案Ribbon已经被废弃,取⽽代之的是SpringCloud LoadBalancer,LoadBalancer是Spring Cloud Commons的⼀个⼦项⽬,他属于上述的第⼆种⽅式,是将负载均衡逻辑封装到客户端中,并且运⾏在客户端的进程⾥。 

在Spring Cloud构件微服务系统中,LoadBalancer作为服务消费者的负载均衡器,有两种使⽤⽅式,⼀种是和RestTemplate相结合,另⼀种是和Feign相结合,Feign已经默认集成了LoadBalancer。
```

### LoadBalancer整合RestTemplate
修改 application.yml 配置文件
```yml
server:
    # 以下写法的意思是 
    # port参数存在使⽤port参数,不存在使⽤默认9001端⼝
    # 启动⽀付服务时,可以通过指定-Dport=9000,指定服务使⽤不同端⼝启动。
    port: ${port:9001}
```

为产生 RestTemplate 的服务在 springboot 启动器中添加以下 bean 示例如下
```java
@SpringBootApplication
public class application {

    public static void main(String[] args) {
        SpringApplication.run(application.class, args);
    }

    @Bean
    @LoadBalanced
    public RestTemplate restTemplate(){
        return new RestTemplate();
    }
}
```

#### 演示负载均衡使用
要被调用的服务
```java
import com.jsj.pojo.Payment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("payment")
public class PaymentController {

    @Value("${server.port}")
    private String serverPort;

    @GetMapping("{id}")
    public ResponseEntity<Payment> payment(@PathVariable("id") Integer id){

        Payment payment = new Payment(id,"支付成功, 服务端口"+ serverPort);
        return ResponseEntity.ok(payment);
    }
}
```
负载均衡的服务调用上面的服务
```java
@GetMapping("/payment/{id}")
public ResponseEntity<Payment> getPaymentById(@PathVariable("id") Integer id) {
    String url = "http://cloud-payment-service/payment/" + id;
    Payment payment = restTemplate.getForObject(url, Payment.class);
    return ResponseEntity.ok(payment);
}
```

### LoadBlancerClient
简介
```
负载均衡的核⼼类为LoadBalancerClient,LoadBalancerClient可以获取负载均衡的服务提供者实例信息。
```
示例
```java
@Autowired
private LoadBalancerClient loadBalancerClient;

@GetMapping("/test-load-balancer")
public String testLoadBalancer() {
    ServiceInstance instance = loadBalancerClient.choose("cloud-payment-service");
    return instance.getHost() + ":" + instance.getPort();
}
```