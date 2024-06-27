---
icon: book
date: 2024-06-26
category:
  - 后端开发
  - spring系列
tag:
  - java
excerpt: false
headerDepth: 5
order: 2
---
# Spring MVC

## 组件

### DispatcherServlet

前端控制器,也称为中央控制器或者核心控制器。

用户请求的入口控制器,它就相当于 mvc 模式中的c,DispatcherServlet 是整个流程控制的中心,相当于是 SpringMVC 的大脑,由它调用其它组件处理用户的请求,DispatcherServlet 的存在降低了组件之间的耦合性。

SpringMVC框架提供的该核心控制器需要我们在web.xml文件中配置。

### HandlerMapping

处理器映射器 HandlerMapping也是控制器,派发请求的控制器。

我们不需要自己控制该类,但是他是springmvc运转历程中的重要的一个控制器。

HandlerMapping负责根据用户请求找到 Handler 即处理器(也就是我们所说的 Controller),SpringMVC 提供了不同的映射器实现不同的映射方式,

### Handler

处理器 Handler 是继 DispatcherServlet 前端控制器的后端控制器,在DispatcherServlet 的控制下 Handler 对具体的用户请求进行处理。

由于 Handler 涉及到具体的用户业务请求,所以一般情况需要程序员根据业务需求开发 Handler。(这里所说的 Handler 就是指我们的 Controller)

### HandlAdapter

处理器适配器 通过 HandlerAdapter 对处理器进行执行,这是适配器模式的应用,通过扩展处理器适配器,支持更多类型的处理器,调用处理器传递参数等工作。

### ViewResolver

视图解析器 ViewResolver 负责将处理结果生成 View 视图,ViewResolver 首先根据逻辑视图名解析成物理视图名称,即具体的页面地址,再生成 View 视图对象,最后对 View 进行渲染将处理结果通过页面展示给用户。

SpringMVC 框架提供了很多的 View 视图类型,包括:jstlView、freemarkerView、pdfView 等。

## 工作原理

1. 用户在浏览器中访问相应网页时,浏览器会向服务器发送一个请求,此时服务器中接收此请求的时前端控制器`DispatcherServlet`
2. 前端控制器`DispatcherServlet`接收到此请求后,像Spring中的映射器发起请求`HandlerMapping`中查询对应的处理类
3. 映射器找到相应的处理类时,将结果返回给前端控制器`DispatCherServlet`,此时前端控制会去找处理适配器`HandlerAdaptor`
4. 处理适配器接收到来自前端控制器`DispathCherServlet`后,对相应的处理器发起处理
5. 相应的处理器类接收到指令后,找到对应方法进行执行
6. 最终将执行结果返回给处理适配器`HandlerAdaptor`. [ 返回的结果可以是 modelAndView也可以是其他 ]
7. 处理适配器接收到返回的结果后,将结果直接返回给前端控制器`DispathCherServlet`
8. 前端控制器接收到来自处理适配器的结果后,将结果交给视图解析器`ViewResolver`进行解析
9. 视图解析器`ViewResolver`解析完成后将视图地址以及携带的数据返回给前端控制器
10. 前端控制接收到视图地址和数据后,请求相应的视图,拿到对应的视图
11. 最终将视图和数据反馈给用户请求的浏览器.

## 注解

### @Controller

和在 spring 中是一样的,都是交给容器来创建对象,只不过在 springmvc中默认返回的是页面.

如果在这个注解的类中想要返回对象,需要在方法上添加 `@ResponseBody` 注解.

### @ResponseBody

可以添加到方法上,表示当前方法的返回值是对象,而不是转发页面

### @RestController

这个注解可以理解为 @Controller 和 @ResponseBody 的组合.使用这个注解后,在当前类中,默认返回的是对象而不是请求或转发的页面.如果使用这个注解后想要转发页面,需要使用 ModelAndView 进行封装才可以转发.

### RequestMapping

该注解可以定义在类上,也可以定义方法上,但是含义不同。

在类上时类似与一级请求,如果这个类处理的请求方法是 "/user/add","/user/update"这种就可以把 user 提取到类上作为一级请求使用.

在方法上时,如果有一级请求的情况下,类似与二级请求也就是 上面示例中 user 后面不同的请求路径.在方法上时不指定 method 时是所有类型的请求都会进行处理.

method 属性是由 RequestMethod 进行限定的,也就是 method 只能使用 RequestMethod 枚举类中的方法.

`@GetMapping/@PostMapping/@PutMapping` 都是 `@RequestMapping` 的延申标签,分别对应各个请求.

## 自定义拦截器

自定义拦截器需要实现 HandlerInterceptor 接口.

### HandlerInterceptor接口

#### preHandle

该方法在处理器方法执行之前执行。

返回值为boolean,若为true,则紧接着会执行处理器方法,且会将afterCompletion() 方法放入到一个专门的方法栈中等待执行。

#### postHandle

该方法在处理器方法执行之后执行。

处理器方法若最终未被执行,则该方法不会执行。

由于该方法是在处理器方法执行完后执行,且该方法参数中包含 ModelAndView,所以该方法可以修改处理器方法的处理结果数据,且可以修改跳转方向。

#### afterCompletion

当 preHandle()方法返回true时,会将该方法放到专门的方法栈中,等到对请求进行响应的所工作完成之后才执行该方法。
即该方法是在前端控制器渲染(数据填充)了响应页面之后执行的,此时对ModelAndView再操作也对响应无济于事。

最后执行的方法,清除资源,例如在Controller方法中加入数据

### 在配置文件中配置

```xml
<mvc:interceptors>
<!-- 这里可以同时配置多个拦截器,配置的顺序就是拦截器的拦截顺序 -->
    <mvc:interceptor>
    <!-- 拦截器要拦截的请求路径 拦截所有用/** -->
    <mvc:mapping path="/**"/>
    <!-- 指定干活的拦截器 -->
        <bean class="com.blackFire.interceptor.MyInterceptor2" id="myInterceptor"></bean>
    </mvc:interceptor>

    <mvc:interceptor>
    <!-- 拦截器要拦截的请求路径 拦截所有用/** -->
    <mvc:mapping path="/**"/>
    <!-- 指定干活的拦截器 -->
    <bean class="com.blackFire.interceptor.MyInterceptor2" id="myInterceptor2"></bean>
    </mvc:interceptor>

</mvc:interceptors>
<!--
    如果有多个拦截器的时候:
        preHandle: 按照配置前后顺序执行
        postHandle: 按照配置前后逆序执行
        afterCompletion: 按照配置前后逆序执行
 -->
```
