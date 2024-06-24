---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# mybatis

简介:
> MyBatis 本是 apache 的一个开源项目 iBatis,2010 年这个项目由 apache software foundation 迁移到了 google code,并且改名为MyBatis 。
> 2013 年 11 月迁移到 Github。iBATIS 一词来源于“internet”和“abatis”的组合,是一个基于 Java 的持久层框架。
> iBATIS 提供的持久层框架包括 SQL Maps 和 Data Access Objects(DAO)。
> Mybatis 基于java的持久层框架,它的内部封装了JDBC,让开发人员只需要关注SQL语句本身,不需要花费精力在驱动的加载、连接的创建、Statement的创建等复杂的过程。
> Mybatis通过XML或注解的方式将要执行的各种的statement配置起来,并通过java对象和statement中的sql的动态参数进行映射生成最终执行的SQL语句,最后由mybatis框架执行SQL,并将结果直接映射为java对象。
> 采用了ORM思想解决了实体类和数据库表映射的问题,对JDBC进行了封装,屏蔽了JDBCAPI底层的访问细节,避免我们与jdbc的api打交道,就能完成对数据的持久化操作。
>> ORM 中分别表示为:
>> O -->  Object Java对象 POJO
>> R --> Relation 关系,就是数据库中的一张表
>> M --> mapping 映射
>>
## Mybaits 对象分析

1. `Resources`
    Resources 类,顾名思义就是资源,用于读取资源文件。其有很多方法通过加载并解析资源文件,返回不同类型的`IO`流对象。
2. `SqlSessionFactoryBuilder`
    `SqlSessionFactory`的创建,需要使用`SqlSessionFactoryBuilder`对象的build()方法
    事实上使用`SqlSessionFactoryBuilder`的原因是将SqlSessionFactory这个复杂对象的创建交由Builder来执行,也就是使用了建造者设计模式。

    建造者模式
        又称生成器模式,是一种对象的创建模式。
        可以将一个产品的内部表象与产品的生成过程分割开来, 从而可以使一个建造过程生成具有不同的内部表象的产品(将一个复杂对象的构建与它的表示分离, 使得同样的构建过程可以创建不同的表示).
        这样用户只需指定需要建造的类型就可以得到具体产品,而不需要了解具体的建造过程和细节.
        在建造者模式中,角色分指导者(`Director`)与建造者(`Builder`)
            用户联系指导者, 指导者指挥建造者, 最后得到产品. 建造者模式可以强制实行一种分步骤进行的建造过程.

3. `SqlSessionFactory`
    SqlSessionFactory 接口对象是一个重量级对象(系统开销大的对象),是线程安全的,所以一个应用只需要一个该对象即可。

    创建`SqlSession`需要使用`SqlSessionFactory`接口的的 openSession()方法。

4. 默认的 openSession()方法没有参数,它会创建有如下特性的 SqlSession
    1. 会开启一个事务(也就是不自动提交)。
    2. 将从由当前环境配置的 DataSource 实例中获取 Connection 对象。事务隔离级别将会使用驱动或数据源的默认设置。
    3. 预处理语句不会被复用,也不会批量处理更新。
    4. 当参数为 TRUE 是 会自动提交, FALSE 时需要手动提交, 默认为 false.

5. `SqlSession` 接口对象用于执行持久化操作
    `SqlSession` 中一次会话已创建`SqlSession`对象开始到`SqlSession`对象关闭为结束.

> PS: SqlSession 接口对象是线程不安全的,所以每次数据库会话结束前需要马上调用其 close()方法将其关闭。

## Mybatis 单独使用

本次使用的数据库需要自己创建,在创建时字符集选为`utf8mb4`排序规则选为`utf8mb4_general_ci`

### 导入依赖

```xml
<dependencies>
    <!-- spring start -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>5.2.15.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>5.2.15.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-beans</artifactId>
        <version>5.2.15.RELEASE</version>
    </dependency>
    <!-- spring end -->
    <!-- Mybatis start -->
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>3.5.6</version>
    </dependency>
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.28</version>
    </dependency>
    <!-- Mybatis end -->
    <dependency>
        <!-- 测试依赖,可不导入  -->
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.13.1</version>
    </dependency>
    <dependency>
        <!-- lombok 依赖(减少get/set生成) -->
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.24</version>
    </dependency>
</dependencies>
```

### 创建配置文件
>
>ps: Resource文件夹中创建,文件名可自定义,我这里就定义为 mybatis.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <properties resource="db.properties" />
    <!--配置 mybatis 环境-->
    <environments default="development">
        <!--id:数据源的名称-->
        <environment id="development">
            <!--事务类型:使用 JDBC 事务,使用 Connection 的提交和回滚-->
            <transactionManager type="JDBC"/>
            <!--数据源 dataSource:创建数据库 Connection 对象type: POOLED 使用数据库的连接池-->
            <dataSource type="POOLED">
                <!--连接数据库的四大参数注意数据库版本使用的是MySQL8,如果是mysql5的话,driver和url都不一样,参考学过的JDBC-->
                <property name="driver" value="${database.driver}"/>
                <property name="url" value="${database.url}"/>
                <property name="username" value="${database.username}"/>
                <property name="password" value="${database.password}"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <!--  加上这个后就会扫描该路径下所用到的 *Mapper 和 *Mapper.xml 文件  -->
        <package name="扫描的包路径"/>
    </mappers>
</configuration>

```

### 数据库配置

> ps: 这些配置也可以在mybaits.xml文件中配置

```properties
database.driver=com.mysql.cj.jdbc.Driver
database.url=jdbc:mysql://ip:port/databaseName?useUnicode=true&characterEncoding=utf-8&useSSL=false&serverTimezone=GMT
database.username=root
database.password=root
```

### SqlSession获取Mapper

```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.Reader;

/**
 * &#064;Author  Sunset
 * <p>
 * 单独使用 Mybatis 时重点是如何获取 SqlSession.
 * <p>
 * 1. 通过 SqlSessionFactoryBuilder( 建造者模式对象创建) 来获取到 SqlSessionFactory 工厂.
 * <p>
 * 2. 从 SqlSessionFactory 工厂调取 openSession() 获取 SqlSession.
 */
public class MybatisUtil {
    /**
     * 将本次使用的 SqlSession 所处的线程封闭到 TreadLocal
     */
    private static final ThreadLocal<SqlSession> THREAD_LOCAL = new ThreadLocal<>();
    private static final SqlSessionFactory FACTORY;

    static {
        Reader reader = null;
        try {
            // 读取配置文件,参数是配置文件名车
            reader = Resources.getResourceAsReader("mybatis.xml");
        } catch (IOException e) {
            e.printStackTrace();
        }
        // 创建工厂
        FACTORY = new SqlSessionFactoryBuilder().build(reader);
    }

    /**
     * 获取链接
     * @return 返回 SqlSession
     */
    public static SqlSession getSqlSession(){
        // 从threadLocal中获取
        SqlSession sqlSession = THREAD_LOCAL.get();
        if (sqlSession == null){
            // openSession 更改为true 会自动提交
            sqlSession =  FACTORY.openSession();
            // 将sqlSession和线程进行绑定
            THREAD_LOCAL.set(sqlSession);
        }
        return sqlSession;
    }

    /**
     * 关闭链接
     */
    public static void closeSqlSession(){
        // 从threadLocal中获取
        SqlSession sqlSession = THREAD_LOCAL.get();
        if (sqlSession != null){
            sqlSession.close();
            THREAD_LOCAL.remove();
        }
    }
}
```

### 创建对应的Mapper和Mapper.xml

UserMapper.java

```java
import org.apache.ibatis.annotations.Param;
import org.sunset.cn.entity.User;

import java.util.List;

public interface UserMapper {
    List<User> queryAll(@Param("id") Integer id);
}
```

UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- namespace 必须时 mapper 文件的完全限定名 -->
<mapper namespace="org.sunset.cn.mapper.UserMapper">

    <select id="queryAll" resultType="org.sunset.cn.entity.User">
        select id,name,age,email from user
        <where>
            <if test="id != null and id != 0"> id = #{id}</if>
        </where>
    </select>
</mapper>
```

### 调用Mapper

UserService.java

```java
import org.sunset.cn.entity.User;

import java.util.List;

public interface UserService {
    /**
     * 传入 id 时根据 id查询,不传入时查询全部数据
     * @param id 用户id
     * @return 用户数据
     */
    List<User> getUser(Integer id);

}
```

UserServiceImpl.java

```java
import org.sunset.cn.entity.User;
import org.sunset.cn.mapper.UserMapper;
import org.sunset.cn.util.MybatisUtil;

import java.util.List;

public class UserServiceImpl implements UserService {
    public UserMapper usersMapper = MybatisUtil.getSqlSession().getMapper(UserMapper.class);
    @Override
    public List<User> getUser(Integer id) {
        return  usersMapper.queryAll(id);
    }
    // 直接使用 main 方法测试了,就不再去写测试方法调用了
    public static void main(String[] args) {
        UserServiceImpl userService = new UserServiceImpl();
        List<User> user = userService.getUser(null);
        user.forEach(System.out::println);
    }
}
```

> ps: 在创建 *Mapper 和*Mapper.xml 文件时需要注意以下几点
>
> 1. XML映射文件必须与实体类在同一个包下
> 2. XML映射文件名称必须与实体类同名.
> 3. XML映射文件需要注册到mybatis的全局配置文件中. (我这里使用的是包扫描所以不需要自己一个个进行注册)

## 配置文件标签

1. 配置文件中是有顺序的如果顺序错误也会报错,我们在 idea 中可以 `ctrl+鼠标左键` 点击 configuration 标签就可以看到.
2. properties 标签有以下属性
    - resource: 该属性存在时是指定读取的 properties 文件.
    - url: 这个属性不常用.
3. environments
    - default: 默认读取那个 environment
4. environment 是 environments 的子标签
    - id: environment的id表示
5. transactionManager 是 environment 的子标签
    - type: 选用的事务,我经常用的是 'JDBC'
6. dataSource 是 environment 的子标签
    - type: 使用的连接池
7. property
    - name: 属性名
    - value: 属性值
8. mappers
9. package 是 mappers 的子标签
    - name: 指定包下的所有Mapper接口
10. mapper 是 mappers 的子标签
    - reource: 使用相对于类路径的资源,从 classpath 路径查找文件
    - class: 使用的mapper接口的完全限定名,要求: 接口和映射文件同包同名
    - url: 不常用

## MapperXml标签

1. select
    - id 属性是这个 select 标签所对应的方法名,当前xml中唯一不可重复.
    - 此标签必须要有 resultType 或 resultMap 两个选一个使用.
    - resultType 属性是指定要返回的java实体类.
    - resultMap 属性是在实体类与数据库表字段不符时使用的.
    - parameterType 属性是传入的参数类型
2. update
    - id 属性是这个 update 标签所对应的方法名,当前xml中唯一不可重复.
    - parameterType 属性是传入的参数类型
    - resultType/resultMap 在此标签中不常用.
3. resultMap
    - 该标签用于处理数据库字段与实体类字段不一致的情况
    - id 属性是这个 resultMap 标签的名称,当前xml中唯一不可重复.
    - type 属性是 resultMaper的返回类型.
    - id 子标签,主键列使用
    - result 子标签 其他列使用
    - id 子标签和 result 子标签的属性是一样的所以这里就写到一起了
        - column 表示数据库表中的列名,不区分大小写
        - property 表示实体类中的对应的属性名,区分大小写
        - javaType 实体类中的对应的属性的类型,可以省略,mybatis会自己推断
        - jdbcType "数据库中的类型column的类型" 一般省略
4. foreach标签
    mapper 中的方法

    ```java
        void addList(List<Users> list);
    ```

    xml 中定义对应的标签

    ```xml
        <!--批量添加-->
        <insert id="addList" parameterType="arraylist">
            INSERT INTO users (loginname,password) VALUES
            <!--
                collection:要遍历的集合,参数是集合类型,直接写list 如果使用 @Parm 指定的话就是 @Parm 中的字符串
                item: 遍历的集合中的每一个数据
                separator:将遍历的结果用 , 分割
            -->
            <foreach collection="list" item="t" separator=",">
            (#{t.loginName},#{t.passWord})
            </foreach>
        </insert>
    ```

5. sql 标签
    - id 属性其他表中嵌套是用于指定当前 sql 标签使用, 当前 xml 唯一不可重复
    - 里面可以写通用的 sql 片段,其它标签引用时使用 include 标签即可.
6. include 标签
    - refid 要引用的标签 id

以后遇到其他标签在进行补充吧,暂时常用的就这些.

> ps: parameterType属性需要注意: 如果传入的是 List/Set/.. 那么 parameterType 里传入的是 List 那组尖括号里所包的类型,例如传入的参数是 `List<Integer>` 那么 parameterType= integer.

## 转义字符

| 字符  | 转义符号 |   备注   |
| :---: | :------: | :------: |
|   <   |   &lt;   |   小于   |
|  <=   |  &lt;=   | 小于等于 |
|   >   |   &gt;   |   大于   |
|  >=   |  &gt;=   | 大于等于 |
|  <>   |  &lt;>   |  不等于  |
|   &   |  &amp;   |    与    |
|   ’   |  &apos;  |  单引号  |
|   ”   |  &quot;  |  双引号  |
