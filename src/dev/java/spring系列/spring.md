---
icon: book
date: 2024-06-26
category:
  - 后端开发
  - spring系列
tag:
  - java
excerpt: false
order: 1
headerDepth: 5
---

# spring

本文记录了 spring/bean注入/aop/事务.
<!-- more -->
## spring 优势

1. 方便解耦,简化开发 Spring 就是一个大工厂,可以将所有对象的创建和依赖关系的维护交给 Spring 管理。
2. 方便集成各种优秀框架 Spring 不排斥各种优秀的开源框架,其内部提供了对各种优秀框架(如 Struts2、Hibernate、MyBatis 等)的直接支持。
3. 降低 Java EE API 的使用难度 Spring 对 Java EE 开发中非常难用的一些 API(JDBC、JavaMail、远程调用等)都提供了封装,使这些 API 应用的难度大大降低。
4. 方便程序的测试 Spring 支持 JUnit4,可以通过注解方便地测试 Spring 程序。
5. AOP 编程的支持 Spring 提供面向切面编程,可以方便地实现对程序进行权限拦截和运行监控等功能。
6. 声明式事务的支持 只需要通过配置就可以完成对事务的管理,而无须手动编程

## spring 核心容器由以下部分组成

1. Spring-core: 提供框架的基本组成部分,包括 IoC 和依赖注入功能
2. Spring-beans: 提供 BeanFactory,工厂模式的微妙实现,它移除了编码式单例的需要,并且可以把配置和依赖从实际编码逻辑中解耦。
3. Spring-context: 建立在由 core和 beans 模块的基础上建立起来的,它以一种类似于 JNDI 注册的方式访问对象。Context 模块继承自 Bean 模块,并且添加了国际化(比如,使用资源束)、事件传播、资源加载和透明地创建上下文(比如,通过 Servelet 容器)等功能。Context 模块也支持 JavaEE 的功能,比如 EJB、JMX 和远程调用等。ApplicationContext 接口是 Context 模块的焦点。

4. Spring-context-support: 提供了对第三方集成到 Spring 上下文的支持,比如缓存(EhCache,Guava, JCache)、邮件(JavaMail)、调度(CommonJ, Quartz)、模板引擎(FreeMarker,JasperReports, Velocity)等
5. Spring-expression(SpEL,Spring 表达式语言,Spring Expression Language)

## 控制反转(IOC)

### BeanFactory

BeanFactory 是基础类型的 IoC 容器,是一个管理 Bean 的工厂,它主要负责初始化各种 Bean,并调用它们的生命周期方法。

BeanFactory 接口实现类最常见的是`org.Springframework.beans.factory.xml.XmlBeanFactory`,它是根据 XML 配置文件中的定义装配Bean 的.

BeanFactory使用示例:

```java
FileSystemResource fileSystemResource = new FileSystemResource(Spring配置文件的名称);
BeanFactory beanFactory = new XmlBeanFactory(fileSystemResource);
```

### ApplicationContext

ApplicationContext 是 BeanFactory 的子接口,也被称为应用上下文。

它不仅提供了 BeanFactory 的所有功能,还添加了对 i18n(国际化)、资源访问、事件传播等方面的良好支持。

ApplicationContext 接口有两个常用的实现类:

  1. ClassPathXmlApplicationContext——常用
  2. FileSystemXmlApplicationContext

##### ClassPathXmlApplicationContext

该类从类路径 ClassPath 中寻找指定的 XML 配置文件,找到并装载完成 ApplicationContext 的实例化工作

ClassPathXmlApplicationContext使用示例:

```java
FileSystemResource systemResource = new FileSystemResource(Spring配置文件的名称);
Factory beanFactory = new XmlBeanFactory(systemResource);
```

##### FileSystemXmlApplicationContext

它与 ClassPathXmlApplicationContext 的区别是:

在读取 Spring 的配置文件时,FileSystemXmlApplicationContext 不再从类路径中读取配置文件,而是通过参数指定配置文件的位置,它可以获取类路径之外的资源,如“D:\application.xml”。

FileSystemXmlApplicationContext使用示例:

```java
ApplicationContext context = new FileSystemXmlApplicationContext(String configLocation);
```

## bean注入

### DI注入

容器将bean实例调用无参构造器创建对象并对其属性进行初始化的过程称为DI注入.

DI注入有三大类:

- set注入: 是通过 `setter` 方法传入被调用者的实例。
- 构造器: 构造注入是在构造调用者实例的同时,完成被调用者的实例化,使用构造器设置依赖关系。
- 自动注入:
  - 对于引用类型属性的注入,也可不在配置文件中显示的注入. 可以通过为标签 设置 autowire 属性值,为引用类型属性进行隐式自动注入(默认是不自动注入引用类型属性)
  - byName自动注入:  当配置文件中被调用者 bean 的 id 值与代码中调用者 bean 类的属性名相同时,可使用byName 方式,让容器自动将被调用者 bean 注入给调用者 bean.容器是通过调用者的 bean类的属性名与配置文件的被调用者 bean 的 id 进行比较而实现自动注入的。
  - byType自动注入: 配置文件中被调用者 bean 的 class 属性指定的类,要与代码中调用者 bean 类的某引用类型属性类型同源。即要么相同,要么有 is-a 关系(子类,或是实现类)。但这样的同源的被调用 bean 只能有一个。多于一个,容器就不知该匹配哪一个了.

### 注解注入

- `@Value`: 需要在属性上使用注解`@Value`,该注解的value属性用于指定要注入的值。
- byType自动注入: 需要在引用属性上使用注解`@Autowired`,该注解默认使用按类型自动装配 Bean 的方式。
- byName自动注入: 需要在引用属性上联合使用注解`@Autowired`与`@Qualifier`。`@Qualifier` 的value属性用于指定要匹配的Bean的id值。
- `@Resource`: @Resource 注解既可以按名称匹配Bean也可以按类型匹配Bean,默认是按名称注入。(JDK6以上可用,JDK17以上与JDK8版本的导包路径不同.)

## Bean控制注解

1. @Controller: 用于controller实现类的注解,该注解创建的对象可以作为处理器接收用户的请求。
2. @Service: 用户service实现类的注解
3. @Component: 声明当前是一个bean 并交给 spring 管理
4. @Repository:  用于dao实现类的的注解,在数据持久化对象中使用

> ps: @Repository,@Service,@Controller 是对@Component 注解的细化,标注不同层的对象。 即持久层对象,业务层对象,控制层对象。

## AOP

术语解释

1. Target(目标对象): 要被增强的对象,一般是业务逻辑类的对象。
2. Proxy(代理): 一个类被 AOP 织入增强后,就产生一个结果代理类。
3. Aspect(切面): 表示增强的功能,就是一些代码完成的某个功能,非业务功能。 是切入点和通知的结合。
4. Joinpoint(连接点): 所谓连接点是指那些被拦截到的点。 在Spring中,这些点指的是方法(一般是类中的业务方法),因为Spring只支持方法类型的连接点。
5. Pointcut(切入点):
    - 切入点指声明的一个或多个连接点的集合。通过切入点指定一组方法。
    - 被标记为 final 的方法是不能作为连接点与切入点的。
    - 因为最终的是不能被修改的,不能被增强的。
6. Advice(通知/增强):
    - 所谓通知是指拦截到 Joinpoint 之后所要做的事情就是通知。通知定义了增强代码切入到目标代码的时间点,是目标方法执行之前执行,还是之后执行等。通知类型不同,切入时间不同。
    - 通知的类型:前置通知,后置通知,异常通知,最终通知,环绕通知。
    - 切入点定义切入的位置,通知定义切入的时间。
7. Weaving(织入): 是指把增强应用到目标对象来创建新的代理对象的过程。 spring 采用动态代理织入,而 AspectJ 采用编译期织入和类装载期织入。

### AspectJ 对 AOP 的实现

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

### AOP示例

#### 引入依赖

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
```

#### 创建业务接口与实现类

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

#### 定义AOP切面类

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
    /*
      @Before: 前置通知, 目标方法运行前运行
      @After: 后置通知, 目标方法运行后运行
      @AfterReturning: 返回通知, 目标方法返回值之后运行
      @AfterThrowing: 异常通知, 目标方法抛出异常时运行
      @Around: 环绕通知, 目标方法运行前后运行
    */
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

#### spring配置文件中注册Aop代理类

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

### 事务传播行为常量

事务传播行为常量, 所谓事务传播行为是指,处于不同事务中的方法在相互调用时,执行期间事务的维护情况。 如,A 事务中的方法 doSome()调用 B 事务中的方法 doOther(),在调用执行期间事务的维护情况,就称为事务传播行为。事务传播行为是加在方法上的。

1. Propagation.REQUIRED:当前没有事务的时候,就会创建一个新的事务,如果当前有事务就直接加入该事务,比较常用的设置
2. Propagation.SUPPORTS: 如果当前有事务就直接加入该事务,当前没有事务的时候就以非事务方式执行
3. Propagation.MANDATORY: 支持当前事务,如果当前有事务就直接加入该事务,当前没有事务的时候就抛出异常
4. Propagation.REQUIRES_NEW: 创建新事务,无论当前是否有事务都会创建新的
5. PROPAGATION_NESTED
6. PROPAGATION_NEVER
7. PROPAGATION_NOT_SUPPORTED

默认事务超时时限: 常量 TIMEOUT_DEFAULT 定义了事务底层默认的超时时限,sql 语句的执行时长。
声明式事务控制, Spring提供的对事务的管理,就叫做声明式事务管理。
如果用户需要使用spring的声明式事务管理,在配置文件中配置即可:不想使用的时候直接移除配置。
这种方式实现了对事务控制的最大程度的解耦。
声明式事务管理,核心实现就是基于AOP。
Spring中提供了对事务的管理,事务必须在service层统一控制。

### 事务的粗细粒度

- 细粒度:对方法中的某几行的代码进行开启提交回滚；
- 粗粒度:对整个方法进行开启提交回滚；

Spring中的aop只能对方法进行拦截,所有我们也就针对方法进行事务的控制。

- 如果只有单条的查询语句,可以省略事务
- 如果一次执行的是多条查询语句, 例如统计结果、报表查询,必须开启事务。

### 注解形式控制事务

#### 导入依赖

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-tx</artifactId>
    <version>${spring.version}</version>
</dependency>
<dependency>
    <groupId>com.mchange</groupId>
    <artifactId>c3p0</artifactId>
    <version>0.9.5.2</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${spring.version}</version>
</dependency>

<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
```

#### 添加事务注解

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

#### 配置文件中开启事务

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
