---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
order: 4
---
# SpringSSM整合

## Spring 整合 mybatis(SSM)

### 依赖导入

```xml
    <!--  注意这个 packaging 标签必须存在,不然 tomcat 插件一启动就结束了  -->
    <packaging>war</packaging>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.source>1.8</maven.compiler.source>
        <spring.version>5.2.15.RELEASE</spring.version>
        <servlet-api.version>3.0.1</servlet-api.version>
        <mysql.version>8.0.28</mysql.version>
        <druid.version>1.2.3</druid.version>
        <pagehelper.version>5.1.10</pagehelper.version>
        <log4j.version>1.2.17</log4j.version>
        <mybatis.version>3.5.6</mybatis.version>
        <mybatis.spring.version>1.3.3</mybatis.spring.version>
        <jackson.version>2.9.6</jackson.version>
        <lombok.version>1.16.14</lombok.version>
        <junit.version>4.12</junit.version>
        <lombok.version>1.18.24</lombok.version>
    </properties>


    <dependencies>
        <!-- spring start -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-tx</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <dependency>
            <!-- tomcat7 插件依赖 和视图解析器也需要此依赖 -->
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>${servlet-api.version}</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <!-- 开启事务使用 -->
            <groupId>org.springframework</groupId>
            <artifactId>spring-jdbc</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <!-- spring end -->
        <!-- Mybatis start -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.28</version>
        </dependency>
        <dependency>
            <!-- alibaba 的 druid -->
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>${druid.version}</version>
        </dependency>
        <dependency>
            <!-- github 上的分页插件 -->
            <groupId>com.github.pagehelper</groupId>
            <artifactId>pagehelper</artifactId>
            <version>${pagehelper.version}</version>
        </dependency>
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>${mybatis.version}</version>
        </dependency>
        <!-- mybatis-spring 与spring组合为 spring ssm 时需要引入,因为 -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis-spring</artifactId>
            <version>${mybatis.spring.version}</version>
        </dependency>
        <!-- Mybatis end -->

        <dependency>
            <!-- Jackson Json处理工具包 -->
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>


        <dependency>
            <!-- lombok 依赖(减少get/set生成) -->
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>${lombok.version}</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.2</version>
                <configuration>
                    <path>/</path>
                    <port>80</port>
                    <uriEncoding>UTF-8</uriEncoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

### 数据库连接配置文件

文件名: db.properties

```properties
database.driver=com.mysql.cj.jdbc.Driver
database.url=jdbc:mysql://ip:3306/tableName?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=GMT
database.username=mysqlUserName
database.password=mysqlUserPwd
```

## 配置spring

mybatis.xml(如果不需要可以不创建) 除了 setting 用到 mybatis.xml 文件其他都交给 spring 来管理

### 创建spring配置文件application.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd
        ">
    <!-- 将这些包中添加注解之后对象的创建权限交给Spring容器-->
    <context:component-scan base-package="org.sunset.cn.entity;org.sunset.cn.service;" />

    <!-- 读取db 配置文件 -->
    <context:property-placeholder location="classpath*:db.properties"/>
    <!--    配置数据库链接数据源-->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${database.driver}"/>
        <property name="url" value="${database.url}"/>
        <property name="username" value="${database.username}"/>
        <property name="password" value="${database.password}"/>
    </bean>
    <!-- 配置 sqlSessionFactory Bean -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <!-- 如果有mybatis的单独配置文件,需要在此插入 -->
        <property name="configLocation" value="classpath:mybatis.xml"/>
        <property name="dataSource" ref="dataSource"/>

        <property name="plugins">
            <array>
                <!-- 分页 -->
                <bean class="com.github.pagehelper.PageInterceptor">
                    <property name="properties">
                        <value>
                            reasonable = true
                        </value>
                    </property>
                </bean>
            </array>
        </property>
    </bean>

    <!-- 配置 mapper 扫描 -->
    <bean id="mapperScannerConfigurer"  class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
        <property name="basePackage" value="org.sunset.cn.mapper" />
    </bean>

    <!-- 通过注解方式实现事务 -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>
</beans>
```

### 创建mvc的配置文件

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
    <context:component-scan base-package="org.sunset.cn.controller"/>
    <mvc:annotation-driven/>
    <!--视图解析器-->
    <bean id="internalResourceViewResolver"
          class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/html/"/>
        <property name="suffix" value=".html"/>
    </bean>
    <!--静态资源处理-->
    <mvc:resources mapping="/html/**" location="/html/"/>
</beans>
```

### 创建 web.xml

idea中需要创建 webapp/WEB-INF/web.xml 来使用. 也就是需要配置 web.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- 监听器 监听 spring 配置文件  -->
    <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath*:application.xml</param-value>
    </context-param>
    <listener>
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <servlet>
        <servlet-name>DispatcherServlet</servlet-name>
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value>classpath*:springMvcApplication-local.xml</param-value>
        </init-param>
    </servlet>
    <servlet-mapping>
        <servlet-name>DispatcherServlet</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
</web-app>
```

## 创建一个 controller 测试下是否成功

```java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@ResponseBody
@RequestMapping("user")
public class UserController {

    @GetMapping(value = "")
    public String queryAllOrById()) {
        return "success";
    }
}
```

> ps: 启动时使用 tomcat 插件启动,也可以去 idea 的启动配置里选择 mavan ,再在页面中配置运行命令为 `tomcat7:run`.
