---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Spring

spring 优势

1. 方便解耦,简化开发 Spring 就是一个大工厂,可以将所有对象的创建和依赖关系的维护交给 Spring 管理。
2. 方便集成各种优秀框架 Spring 不排斥各种优秀的开源框架,其内部提供了对各种优秀框架(如 Struts2、Hibernate、MyBatis 等)的直接支持。
3. 降低 Java EE API 的使用难度 Spring 对 Java EE 开发中非常难用的一些 API(JDBC、JavaMail、远程调用等)都提供了封装,使这些 API 应用的难度大大降低。
4. 方便程序的测试 Spring 支持 JUnit4,可以通过注解方便地测试 Spring 程序。
5. AOP 编程的支持 Spring 提供面向切面编程,可以方便地实现对程序进行权限拦截和运行监控等功能。
6. 声明式事务的支持 只需要通过配置就可以完成对事务的管理,而无须手动编程

spring 核心容器由以下部分组成

1. Spring-core
    提供框架的基本组成部分,包括 IoC 和依赖注入功能
2. Spring-beans
    提供 BeanFactory,工厂模式的微妙实现,它移除了编码式单例的需要,并且可以把配置和依赖从实际编码逻辑中解耦。
3. Spring-context
    建立在由 core和 beans 模块的基础上建立起来的,它以一种类似于 JNDI 注册的方式访问对象。
    Context 模块继承自 Bean 模块,并且添加了国际化(比如,使用资源束)、事件传播、资源加载和透明地创建上下文(比如,通过 Servelet 容器)等功能。Context 模块也支持 JavaEE 的功能,比如 EJB、JMX 和远程调用等。ApplicationContext 接口是 Context 模块的焦点。

4. Spring-context-support
    提供了对第三方集成到 Spring 上下文的支持,比如缓存(EhCache,Guava, JCache)、邮件(JavaMail)、调度(CommonJ, Quartz)、模板引擎(FreeMarker,JasperReports, Velocity)等
5. Spring-expression(SpEL,Spring 表达式语言,Spring Expression Language)

## 控制反转(IOC)

spring 提供了两种 IOC 容器

1. BeanFactory
    1. BeanFactory 是基础类型的 IoC 容器,是一个管理 Bean 的工厂,它主要负责初始化各种 Bean,并调用它们的生命周期方法。
    2. BeanFactory 接口实现类最常见的是org.Springframework.beans.factory.xml.XmlBeanFactory,它是根据 XML 配置文件中的定义装配Bean 的.
    3. BeanFactory使用示例:
        BeanFactory beanFactory = new XmlBeanFactory(new FileSystemResource(Spring配置文件的名称));
2. ApplicationContext
    1. ApplicationContext 是 BeanFactory 的子接口,也被称为应用上下文。它不仅提供了 BeanFactory 的所有功能,还添加了对 i18n(国际化)、资源访问、事件传播等方面的良好支持。
    2. ApplicationContext 接口有两个常用的实现类:
        1. ClassPathXmlApplicationContext——常用
            该类从类路径 ClassPath 中寻找指定的 XML 配置文件,找到并装载完成 ApplicationContext 的实例化工作
        2. ClassPathXmlApplicationContext使用示例
            Factory beanFactory = new XmlBeanFactory(new FileSystemResource(Spring配置文件的名称));
        3. FileSystemXmlApplicationContext
            它与 ClassPathXmlApplicationContext 的区别是:在读取 Spring 的配置文件时,FileSystemXmlApplicationContext 不再从类路径中读取配置文件,而是通过参数指定配置文件的位置,它可以获取类路径之外的资源,如“D:\application.xml”。
            FileSystemXmlApplicationContext使用示例: `ApplicationContext applicationContext = new FileSystemXmlApplicationContext(String configLocation);`

## 配置文件中标签属性

bean标签

1. id: 自定义的对象名称 ,要求唯一
2. name: bean对于的一个标识,一般使用id居多
3. class: 类的完全限定名 [ 完全限定名: 包.类名]
4. scope: 只有 singleton(单例)/prototype(多例) 两个值
    1. singleton 默认值,单例:在容器启动的时候就已经创建了对象,而且整个容器只有为一个的一个对象
    2. prototype 多例,在使用对象的时候才创建对象,每次使用都创建新的对象
5. lazy-init
    1. true/false 是否延迟创建对象,只针对单例有效
    2. true: 不延迟创建对象,容器加载的时候立即创建
    3. false: 默认加载,使用对象的时候才去创建对象
6. init-method 创建对象之后执行的初始化方法"
7. destroy-method 对象销毁方法,调用容器destroy方法的时候执行

constructor-arg [bean 子标签] (根据bean的构造器进行注入使用):

1. name: 属性名称
2. value: 属性值
3. ref: 引用的 bean

property[ bean 子标签]

1. name: 属性名
2. value: 属性值
3. ref: 引用的 bean

## DI注入

DI 注入就是  bean 实例调用无参构造器创建对象并对其属性进行初始化,这个过程交给容器自动完成的称为注入.
DI 注入有 4种方式分别为

1. set注入
    set 注入也叫设值注入, 是指通过 setter 方法传入被调用者的实例。
    这种注入方式简单、直观,因而在Spring 的依赖注入中大量使用。
2. 构造器注入
    构造注入是指,在构造调用者实例的同时,完成被调用者的实例化,使用构造器设置依赖关系。
3. 自动注入: 对于引用类型属性的注入,也可不在配置文件中显示的注入. 可以通过为标签 设置 autowire 属性值,为引用类型属性进行隐式自动注入(默认是不自动注入引用类型属性)。
    根据自动注入判断标准的不同,可以分为两种:
    1. byName(根据名称自动注入)
        当配置文件中被调用者 bean 的 id 值与代码中调用者 bean 类的属性名相同时,可使用byName 方式,让容器自动将被调用者 bean 注入给调用者 bean.
        容器是通过调用者的 bean类的属性名与配置文件的被调用者 bean 的 id 进行比较而实现自动注入的。
    2. byType(根据类型自动注入)
        配置文件中被调用者 bean 的 class 属性指定的类,要与代码中调用者 bean 类的某引用类型属性类型同源。
        即要么相同,要么有 is-a 关系(子类,或是实现类)。
        但这样的同源的被调用 bean 只能有一个。多于一个,容器就不知该匹配哪一个了.

## 注解注入

1. `@Vaule` 属性注入
    需要在属性上使用注解@Value,该注解的 value 属性用于指定要注入的值。
2. byType自动注入`@Autowired`
    需要在引用属性上使用注解@Autowired,该注解默认使用按类型自动装配 Bean 的方式。
3. byName自动注入`@Autowired`和`@Qualifier`
    需要在引用属性上联合使用注解@Autowired 与@Qualifier。
    @Qualifier 的 value 属性用于指定要匹配的 Bean 的 id 值。
4. 自动注入`@Resource`
    Spring提供了对 jdk中@Resource注解的支持。使用该注解,要求 JDK 必须是 6 及以上版本。
    @Resource 注解既可以按名称匹配Bean,也可以按类型匹配 Bean。默认是按名称注入。

    ```java
        @Autowired(required = false)
        @Qualifier("personDao")
        private PersonDao personDao;
    ```

## Bean 控制注解

1. @Component 声明当前是一个bean 并交给 spring 管理
2. @Repository  用于dao实现类的的注解,在数据持久化对象中使用
3. @Service 用户service实现类的注解
4. @Controller 用于controller实现类的注解,该注解创建的对象可以作为处理器接收用户的请求。

> ps: @Repository,@Service,@Controller 是对@Component 注解的细化,标注不同层的对象。 即持久层对象,业务层对象,控制层对象。

## AOP

术语解释

1. Target(目标对象): 要被增强的对象,一般是业务逻辑类的对象。
2. Proxy(代理): 一个类被 AOP 织入增强后,就产生一个结果代理类。
3. Aspect(切面): 表示增强的功能,就是一些代码完成的某个功能,非业务功能。 是切入点和通知的结合。
4. Joinpoint(连接点): 所谓连接点是指那些被拦截到的点。 在Spring中,这些点指的是方法(一般是类中的业务方法),因为Spring只支持方法类型的连接点。
5. Pointcut(切入点):
    切入点指声明的一个或多个连接点的集合。通过切入点指定一组方法。
    被标记为 final 的方法是不能作为连接点与切入点的。
    因为最终的是不能被修改的,不能被增强的。
6. Advice(通知/增强):
    所谓通知是指拦截到 Joinpoint 之后所要做的事情就是通知。通知定义了增强代码切入到目标代码的时间点,是目标方法执行之前执行,还是之后执行等。通知类型不同,切入时间不同。
    通知的类型:前置通知,后置通知,异常通知,最终通知,环绕通知。
    切入点定义切入的位置,通知定义切入的时间。
7. Weaving(织入): 是指把增强应用到目标对象来创建新的代理对象的过程。 spring 采用动态代理织入,而 AspectJ 采用编译期织入和类装载期织入。

## AspectJ 对 AOP 的实现

AspectJ的通知类型

1. 前置通知
2. 后置通知
3. 环绕通知
4. 异常通知
5. 最终通知

AspectJ 定义了专门的表达式用于指定切入点, 表达式的原型: `execution(modifiers-pattern? ret-type-pattern declaring-type-pattern?name-pattern(param-pattern) throws-pattern ?)`  

1. modifiers-pattern 访问权限类型
2. ret-type-pattern 返回值类型
3. declaring-type-pattern 包名类名
4. name-pattern(param-pattern) 方法名(参数类型和参数个数)
5. throws-pattern 抛出异常类型
6. `？`表示可选的部分

> 语法: `execution(访问权限 方法返回值 方法声明(参数) 异常类型)` 访问权限和异常类型可以省略或用符号代替.

符号解释:

1. `*`:  0-多个任意字符
2. `..`: 用在方法参数中,表示任意个参数；用在包名后,表示当前及其子包路径
3. `+`:  用在类名后,表示当前及其子类；用在接口后,表示当前接口及其实现类

切入点示例:

1. `execution(* com.sunset.service.*.*(..))` :
    指定切入点为:定义在 service 包里的任意类的任意方法。
2. `execution(* com.sunset.service..*.*(..))`:
    指定切入点为: 定义在 service 包或者子包里的任意类的任意方法
    .. 出现在类名中时,后面必须跟
    *,表示包、子包下的所有类。
3. `execution(* com.sunset.service.IUserService+.*(..))`:
    指定切入点为: IUserService
    若为接口,则为接口中的任意方法及其所有实现类中的任意方法
    若为类,则为该类及其子类中的任意方法。

## AOP 实现示例

1. 引入依赖

    ```xml
    <!--spring 核心依赖-->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-context</artifactId>
            <version>5.2.13.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-aspects</artifactId>
            <version>5.2.13.RELEASE</version>
        </dependency>
        <!--测试依赖-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
    ```

2. 创建业务接口 与实现类

    ```java
    /**
     * Service 接口
    */
    public interface PersonService {
        void add();
    }

    /**
     * 实现类
    */
    @Service
    public class PersonServiceImpl implements PersonService {
        @Override
        public void add() {
            System.out.println("add ---");
        }
    }
    ```

3. 定义 aop 切面类

    ```java
    import org.aspectj.lang.JoinPoint;
    import org.aspectj.lang.ProceedingJoinPoint;
    import org.aspectj.lang.annotation.*;
    import org.springframework.stereotype.Component;

    /*
    * 在定义好切面 Aspect 后,需要通知 Spring 容器,让容器生成“目标类+ 切面”的代理对象。
    * 这个代理是由容器自动生成的,只需要在 Spring 配置文件中注册一个基于 aspectj 的自动代理生成器,其就会自动扫描到@Aspect 注解,并按通知类型与切入点,将其织入,并生成代理。
    */
    @Component
    @Aspect
    public class MyAspect {
        /**
         * 当较多的通知增强方法使用相同的 execution 切入点表达式时,编写、维护均较为麻烦。
        * AspectJ 提供了@Pointcut 注解,用于定义 execution 切入点表达式。
        * 其用法是,将@Pointcut 注解在一个方法之上,以后所有的 execution 的 value 属性值均
        * 可使用该方法名作为切入点。代表的就是@Pointcut 定义的切入点。
        * 这个使用@Pointcut 注解方法一般使用 private 的标识方法,即没有实际作用的方法。
        */
        @Pointcut("execution(* com.blackFire.service..*.*(..))")
        private void pointCut() {
        }

        @Pointcut("execution(* com.blackFire.service..*.add*(..))")
        private void pointCut2() {
        }

        /**
         * 声明前置通知
        *
        */
        @Before("pointCut()")
        public void before(JoinPoint jp) {
            System.out.println("前置通知:在目标方法执行之前被调用的通知");
            String name = jp.getSignature().getName();
            System.out.println("拦截的方法名称:" + name);
            Object[] args = jp.getArgs();
            System.out.println("方法的参数格式:" + args.length);
            System.out.println("方法参数列表:");
            for (Object arg : args) {
                System.out.println("\t" + arg);
            }
        }

        /**
         * AfterReturning 注解声明后置通知
        * value: 表示切入点表达式
        * returning 属性表示 返回的结果,如果需要的话可以在后置通知的方法中修改结果
        */
        @AfterReturning(value = "pointCut2()",returning = "result")
        public Object afterReturn(Object result){
            if(result!=null){
                boolean res=(boolean)result;
                if(res){
                    result=false;
                }
            }
            System.out.println("后置通知:在目标方法执行之后被调用的通知,result="+result);
            return result;
        }
        
        /**
         * Around 注解声明环绕通知
        * ProceedingJoinPoint 中的proceed方法表示目标方法被执行
        */
        @Around(value = "pointCut()")
        public Object around(ProceedingJoinPoint pjp) throws Throwable {
            System.out.println("环绕方法---目标方法的执行之前");
            Object proceed = pjp.proceed();
            System.out.println("环绕方法---目标方法的执行之后");
            return proceed;
        }
        /**
         * AfterThrowing 注解声明异常通知方法
        * value: 表示切入点表达式
        * returning 属性表示 返回的结果,如果需要的话可以在后置通知的方法中修改结果
        */
        @AfterThrowing(value = "pointCut()",throwing = "ex")
        public void exception(JoinPoint jp,Throwable ex){
            //一般会把异常发生的时间、位置、原有都记录下来
            System.out.println("异常通知:在目标方法执行出现异常的时候才会别调用的通知,否则不执行");
                    System.out.println(jp.getSignature()+"方法出现异常,异常信息是:"+ex.getMessage());
        }
        
        /**
         * After 注解声明为最终通知
        */
        @After( "pointCut()")
        public void myFinally(){
            System.out.println("最终通知:无论是否出现异常都是最后被调用的通知");
        }

    }
    ```

4. 在 spring 配置文件中注册 aspectj 的代理

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xsi:schemaLocation="
                http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans.xsd
                http://www.springframework.org/schema/context
                http://www.springframework.org/schema/context/spring-context.xsd
                http://www.springframework.org/schema/aop
                http://www.springframework.org/schema/aop/spring-aop.xsd
          ">

        <!-- 配置包扫描, 在 base-package 中配置多个包扫描时使用 `;` 进行分割,也可以使用空格进行分割 -->
        <context:component-scan base-package="com.blackFire.domain;com.blackFire.service;com.blackFire.aop"/>
        <!-- 开启 aspectj 使用-->
        <aop:aspectj-autoproxy proxy-target-class="true"/>
        <!--
            aop:aspectj-autoproxy的底层是由 AnnotationAwareAspectJAutoProxyCreator 实现的,
            是基于 AspectJ 的注解适配自动代理生成器。
            其工作原理是,aop:aspectj-autoproxy通过扫描找到@Aspect 定义的切面类,再由切面类根据切入点找到目标类的目标方法,再由通知类型找到切入的时间点。
        -->
    </beans>
    ```

## Spring Mvc

Spring Mvc 组件

1. DispatcherServlet:
    前端控制器,也称为中央控制器或者核心控制器。
    用户请求的入口控制器,它就相当于 mvc 模式中的c,DispatcherServlet 是整个流程控制的中心,相当于是 SpringMVC 的大脑,由它调用其它组件处理用户的请求,DispatcherServlet 的存在降低了组件之间的耦合性。
    SpringMVC框架提供的该核心控制器需要我们在web.xml文件中配置。
2. HandlerMapping:
    处理器映射器 HandlerMapping也是控制器,派发请求的控制器。
    我们不需要自己控制该类,但是他是springmvc运转历程中的重要的一个控制器。
    HandlerMapping负责根据用户请求找到 Handler 即处理器(也就是我们所说的 Controller),SpringMVC 提供了不同的映射器实现不同的映射方式,
3. Handler:
    处理器 Handler 是继 DispatcherServlet 前端控制器的后端控制器,在DispatcherServlet 的控制下 Handler 对具体的用户请求进行处理。
    由于 Handler 涉及到具体的用户业务请求,所以一般情况需要程序员根据业务需求开发 Handler。(这里所说的 Handler 就是指我们的 Controller)
4. HandlAdapter:
    处理器适配器 通过 HandlerAdapter 对处理器进行执行,这是适配器模式的应用,通过扩展处理器适配器,支持更多类型的处理器,调用处理器传递参数等工作。
5. ViewResolver:
    视图解析器 ViewResolver 负责将处理结果生成 View 视图,ViewResolver 首先根据逻辑视图名解析成物理视图名称,即具体的页面地址,再生成 View 视图对象,最后对 View 进行渲染将处理结果通过页面展示给用户。
    SpringMVC 框架提供了很多的 View 视图类型,包括:jstlView、freemarkerView、pdfView 等。

spring Mvc 工作原理

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

## MVC 注解

1. `@Controller`:
    和在 spring 中是一样的,都是交给容器来创建对象,只不过在 springmvc中默认返回的是页面.如果在这个注解的类中想要返回对象,需要在方法上添加 `@ResponseBody` 注解.
2. `@ResponseBody`:
    可以添加到方法上,表示当前方法的返回值是对象,而不是转发页面
3. `@RestController`:
    这个注解可以理解为 @Controller 和 @ResponseBody 的组合.
    使用这个注解后,在当前类中,默认返回的是对象而不是请求或转发的页面.
    如果使用这个注解后想要转发页面,需要使用 ModelAndView 进行封装才可以转发.
4. `@RequestMapping`:
    1. 该注解可以定义在类上,也可以定义方法上,但是含义不同。
        1. 在类上时类似与一级请求,如果这个类处理的请求方法是
        ("/user/add")
        ("/user/update")
        ...
        这种就可以把 user 提取到类上作为一级请求使用.
        2. 在方法上时,如果有一级请求的情况下,类似与二级请求
        也就是 上面示例中 user 后面 不同的请求路径.
        在方法上时,不指定 method 时是所有类型的请求都会进行处理.
    2. method 属性是由 RequestMethod 进行限定的,也就是 method 只能使用 RequestMethod 枚举类中的方法.
        RequestMethod 枚举类有  GET/POST/PUT/HEAD 等方法.
    3. `@GetMapping`/`@PostMapping`/`@PutMapping` 都是 `@RequestMapping` 的延申标签,分别对应各个请求.

## 拦截器

1. 自定义拦截器需要实现 HandlerInterceptor 接口. HandlerInterceptor 接口中的方法:
    1. preHandle(request,response, Object handler):
        该方法在处理器方法执行之前执行。
        返回值为boolean,若为true,则紧接着会执行处理器方法,且会将afterCompletion() 方法放入到一个专门的方法栈中等待执行。
    2. postHandle(request,response, Object handler,modelAndView):
        该方法在处理器方法执行之后执行。
        处理器方法若最终未被执行,则该方法不会执行。
        由于该方法是在处理器方法执行完后执行,且该方法参数中包含 ModelAndView,所以该方法可以修改处理器方法的处理结果数据,且可以修改跳转方向。
    3. afterCompletion(request,response, Object handler, Exception ex):
        当 preHandle()方法返回true时,会将该方法放到专门的方法栈中,等到对请求进行响应的所工作完成之后才执行该方法。
        即该方法是在前端控制器渲染(数据填充)了响应页面之后执行的,此时对ModelAndView再操作也对响应无济于事。
    4. afterCompletion:
        最后执行的方法,清除资源,例如在Controller方法中加入数据

2. 配置拦截器需要在 springMvc 配置文件中配置

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

## Spring SpringMvc 联合使用

1. 导入依赖

    ```xml
    <dependencies>
        <!-- SpringMvc所需的依赖 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.2.13.RELEASE</version>
        </dependency>

        <!-- SpringServlet, 因为spring底层封装的还是servlet所以还是需要此依赖的. -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>
        <!-- json所需依赖  -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>2.9.0</version>
        </dependency>
        <!-- json所需依赖 -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>2.9.0</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <!-- maven编译 -->
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
            <!--tomcat插件-->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <path>/</path>
                    <port>8080</port>
                </configuration>
            </plugin>
        </plugins>
    </build>
    ```

2. spring 的配置文件 application.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd
    ">
        <!--spring的配置文件:除了控制器之外的bean对象都在这里扫描-->
        <context:component-scan base-package="com.xxx.domain;com.xxx.service"/>
    </beans>
    ```

3. spring Mvc 配置文件 applicationMvc.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/mvc
    http://www.springframework.org/schema/mvc/spring-mvc.xsd
    ">
        <!--springmvc的配置文件:控制器的bean对象都在这里扫描-->
        <context:component-scan base-package="com.xxx.controller"/>

        <!--视图解析器-->
        <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
            <!-- 配置前缀 -->
            <property name="prefix" value="/"></property> 
            <!-- 配置后缀 -->
            <property name="suffix" value=".jsp"></property>
        </bean>
        <!--
            annotation-driven是一种简写形式,也可以手动配置替代这种简写形式,简写形式可以让初学者快速应用默认配置方案。
            该注解会自动注册DefaultAnnotationHandlerMapping与AnnotationMethodHandlerAdapter 两个bean,是springMVC为@Controller分发用户请求所必须的,解决了@Controller注解使用的前提配置。
            同时它还提供了: 数据绑定支持,@NumberFormatannotation支持,@DateTimeFormat支持,@Valid支持,读写XML的支持(JAXB,读写JSON的支持(Jackson)。
            我们处理响应ajax请求时,就使用到了对json的支持(配置之后,在加入了jackson的core和mapper包之后,不写配置文件也能自动转换成json)。
        -->
        <mvc:annotation-driven/>
        
        <!--
            配置静态资源
            location 静态资源所在
            mapping 资源的请求  一般都是在静态资源型下的所有 也就是 -> /静态资源/**
        -->
        <mvc:resources mapping="/imgs/**" location="/imgs/" />
        <mvc:resources mapping="/js/**" location="/js/" />
        <mvc:resources mapping="/css/**" location="/css/" />
    </beans>
    ```

4. 在 webapp/WEN-INF 下的 web.xml 中启用 spring 和 spring mvc 的配置

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
            version="4.0">

        <!--spring的配置-->
        <context-param>
            <!--contextConfigLocation: 表示用于加载 Bean的配置文件 -->
            <param-name>contextConfigLocation</param-name>
            <!--
                指定spring配置文件的位置
                这个配置文件也有一些默认规则,它的配置文件名默认就叫 applicationContext.xml,如果将这个配置文件放在 WEB-INF 目录下那么这里就可以不用指定配置文件位置,只需要指定监听器就可以。
                这段配置是 Spring 集成 Web 环境的通用配置；一般用于加载除控制器层的 Bean (如dao、service 等),以便于与其他任何Web框架集成。
            -->
            <param-value>classpath:application.xml</param-value>
        </context-param>
        <listener>
            <!--
                ContextLoaderListener 默认监听 WEB-INF文件夹下的applicationContext.xml文件,
                而我们写上面的 contextConfigLocation 就是为了让他监听到我们 resources 下的 applicationContext.xml 文件
            -->
            <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
        </listener>

        <!--
            SpringMVC的配置
            前端控制器:所有的请求都会经过此控制器,然后通过此控制器分发到各个分控制器.
            前端控制器本质上还是一个Servlet,因为SpringMVC底层就是使用Servlet编写的
        -->
        <servlet>
            <servlet-name>dispatcherServlet</servlet-name>
            <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
            <!-- 创建前端控制器的时候读取springmvc配置文件启动ioc容器 -->
            <init-param>
                <param-name>contextConfigLocation</param-name>
                <param-value>classpath:springmvc.xml</param-value>
            </init-param>
            <!-- Tomcat启动就创建此对象 -->
            <load-on-startup>1</load-on-startup>
        </servlet>

        <!-- 配置拦截路径url,所有以.do结尾的请求都会被前端控制器拦截处理 -->
        <servlet-mapping>
            <servlet-name>dispatcherServlet</servlet-name>
            <url-pattern>/</url-pattern>
        </servlet-mapping>


        <!-- 配置中文乱码的过滤器 -->
        <filter>
            <filter-name>characterEncodingFilter</filter-name>
            <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
            <!--指定字符集-->
            <init-param>
                <param-name>encoding</param-name>
                <param-value>UTF-8</param-value>
            </init-param>
            <!--强制request使用字符集encoding-->
            <init-param>
                <param-name>forceRequestEncoding</param-name>
                <param-value>true</param-value>
            </init-param>
            <!--强制response使用字符集encoding-->
            <init-param>
                <param-name>forceResponseEncoding</param-name>
                <param-value>true</param-value>
            </init-param>
        </filter>
        <filter-mapping>
            <filter-name>characterEncodingFilter</filter-name>
            <url-pattern>/*</url-pattern>
        </filter-mapping>
    </web-app>
    ```

5. 示例 Controller

    ```java
    /*
    * 前端参数示例 userName="张"&userName="李""&userName="王"
    * 可以使用  @RequestParam("前端参数名") 接收,示例如下
    */
    @GetMapping(value = "test01")
    public void test01(@RequestParam("userName") List<String> name){}

    // 也可以使用数组形式进行接收,示例如下
    @GetMapping(value = "test02")
    public void test02(String[] teamName){}

    /**
     * 当前端传入的参数与 java 对象中的属性一致时
    * 前端示例: id=1&name="张"&age=18
    * java对象属性有 [id,name,age]
    * 可以直接使用 java 对象进行接收
    */
    @RequestMapping(value = "test03")
    public void test03(User user){}

    /**
     * 当前端传入参数以请求路径时传入
    * 示例路径: http://locahost:8080/param/test04/1001/zhang/15
    * 可以使用 @PathVariable 接收
    */
    @RequestMapping("test04/{id}/{name}/{age}")
    public void test04(
        @PathVariable("id") Integer personId,
        @PathVariable("name") String name,
        @PathVariable("age") String age){}

    /**
     * 当请求的参数不一致时,可以使用@RequestParam对其进行矫正
    *      value 属性表示请求中的参数名称
    *      required 表述赋值是否必须
    *          true表示必须赋值,
    *          false表示可以不赋值
    */
    @RequestMapping("test04")
    public void test04(
        @RequestParam(value = "userId",required = true) Integer id,
        @RequestParam("userName") String name,
        @RequestParam("userLocation")String loc){}
    ```

## Spring 事务

事务定义接口 TransactionDefinition 中定义了事务描述相关的三类常量

1. 事务隔离级别
2. 事务传播行为
3. 事务默认超时时限

事务隔离级别常量,这些常量均是以 ISOLATION_开头

1. DEFAULT:
    采用 DB 默认的事务隔离级别。
    MySql 的默认为REPEATABLE_READ；
    Oracle默认为READ_COMMITTED。
2. READ_UNCOMMITTED: 读未提交,未解决任何并发问题。
3. READ_COMMITTED: 读已提交,解决脏读,存在不可重复读与幻读。
4. REPEATABLE_READ: 可重复读。解决脏读、不可重复读,存在幻读
5. SERIALIZABLE: 串行化。不存在并发问题。

事务传播行为常量, 所谓事务传播行为是指,处于不同事务中的方法在相互调用时,执行期间事务的维护情况。 如,A 事务中的方法 doSome()调用 B 事务中的方法 doOther(),在调用执行期间事务的维护情况,就称为事务传播行为。事务传播行为是加在方法上的。

1. Propagation.REQUIRED
        当前没有事务的时候,就会创建一个新的事务,如果当前有事务就直接加入该事务,比较常用的设置
2. Propagation.SUPPORTS
        如果当前有事务就直接加入该事务,当前没有事务的时候就以非事务方式执行

3. Propagation.MANDATORY
    支持当前事务,如果当前有事务就直接加入该事务,当前没有事务的时候就抛出异常
4. Propagation.REQUIRES_NEW
        创建新事务,无论当前是否有事务都会创建新的
5. PROPAGATION_NESTED
6. PROPAGATION_NEVER
7. PROPAGATION_NOT_SUPPORTED

默认事务超时时限: 常量 TIMEOUT_DEFAULT 定义了事务底层默认的超时时限,sql 语句的执行时长。

声明式事务控制, Spring提供的对事务的管理,就叫做声明式事务管理。
如果用户需要使用spring的声明式事务管理,在配置文件中配置即可:不想使用的时候直接移除配置。
这种方式实现了对事务控制的最大程度的解耦。
声明式事务管理,核心实现就是基于AOP。
Spring中提供了对事务的管理,事务必须在service层统一控制。

事务的粗细粒度:

- 细粒度:对方法中的某几行的代码进行开启提交回滚；
- 粗粒度:对整个方法进行开启提交回滚；

Spring中的aop只能对方法进行拦截,所有我们也就针对方法进行事务的控制。

- 如果只有单条的查询语句,可以省略事务
- 如果一次执行的是多条查询语句, 例如统计结果、报表查询,必须开启事务。

## 注解形式控制事务

1. 导入依赖

    ```xml
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>com.mchange</groupId>
        <artifactId>c3p0</artifactId>
        <version>0.9.5.2</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.28</version>
    </dependency>
    ```

2. 在 service 实现类的方法上添加事务注解

    ```java
    import com.sunset.service.PersonService;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Propagation;
    import org.springframework.transaction.annotation.Transactional;


    @Service
    public class PersonServiceImpl implements PersonService {

        /**
         * @Transactional 属性 说明:
        * readOnly:是否只读
        *
        * rollbackFor={Exception.class}: 遇到什么异常会回滚
        *
        * propagation事务的传播:
        * Propagation.REQUIRED:当前没有事务的时候,就会创建一个新的事务；如果当前有事务,就直
        接加入该事务,比较常用的设置
        * Propagation.SUPPORTS:支持当前事务,如果当前有事务,就直接加入该事务；当前没有事务的
        时候,就以非事务方式执行
        * Propagation.MANDATORY:支持当前事务,如果当前有事务,就直接加入该事务；当前没有事务的
        时候,就抛出异常
        * Propagation.REQUIRES_NEW:创建新事务,无论当前是否有事务都会创建新的
        *
        * isolation=Isolation.DEFAULT:事务的隔离级别:默认是数据库的隔离级别
        *
        */
        @Transactional(propagation = Propagation.REQUIRED,rollbackFor = {Exception.class})
        @Override
        public void add() {
            System.out.println("add ---");
        }
    }
    ```

3. 在配置文件中配置事务开启

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:context="http://www.springframework.org/schema/context"
          xmlns:aop="http://www.springframework.org/schema/aop"
          xmlns:tx="http://www.springframework.org/schema/tx"
          xsi:schemaLocation="
                http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans.xsd
                http://www.springframework.org/schema/context
                http://www.springframework.org/schema/context/spring-context.xsd
                http://www.springframework.org/schema/aop
                http://www.springframework.org/schema/aop/spring-aop.xsd
                http://www.springframework.org/schema/tx
                http://www.springframework.org/schema/tx/spring-tx.xsd
          ">
        <!--   链接数据库的数据源-->
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
            <property name="driverClass" value="com.mysql.cj.jdbc.Driver"/>
            <property name="jdbcUrl" value=""/>
            <property name="user" value="" />
            <property name="password" value="" />
        </bean>
        <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
            <property name="dataSource" ref="dataSource" />
        </bean>
        <tx:annotation-driven transaction-manager="transactionManager" />
    </beans>
    ```
