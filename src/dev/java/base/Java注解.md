---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - java
tag:
  - java
order: 3
---
# 注解
可以把注释注释到jvm的机制. 

在JDK1.5引入的机制,注解可用范围: java语言中类 方法 变量 参数 包 等的标注

主要用于:
- 编译格式检查
- 反射中解析
- 生成帮助文档
- 跟踪代码依赖
- 等

## 内置注解
@Override: 重写 [ 编译格式检查,用在 ] -- 定义在java.lang.Override

@Deprecated: 废弃 -- 定义在 java.lang.Deprecated
    
@SafeVarargs: java7开始支持,忽略任何使用参数位泛型变量的方法或构造函数调用时产生的警告

@Functionallnterface 函数式接口: java8开始支持, 标识一个匿名函数或函数式接口

@Repeatable: 标识某注解可以在同一个声明上使用多次,java8开始支持  标识某注解可以在同一个声明上使用多次

## 元注解

@Retention - 标识这个注解怎么保存,是只在代码中,还是编入class文件中,或者是在运行时可以通过反射访问。

@Documented - 标记这些注解是否包含在用户文档中 javadoc。

@Target - 标记这个注解应该是哪种 Java 成员。

@Inherited - 标记这个注解是自动继承的
1. 子类会继承父类使用的注解中被@Inherited修饰的注解
2. 接口继承关系中,子接口不会继承父接口中的任何注解,不管父接口中使用的注解有没有被@Inherited修饰
3. 类实现接口时不会继承任何接口中定义的注解


## 自定义注解

```java
import java.lang.annotation.*;

/**
 * @author blackFire
 * 自定义注解示例
 */
/*
    @Documented                          [ 注解是否包含在文档中 ]
    @Target参数                          [ 用途类型 ]
        ElementType.TYPE                表示自定义注解可以使用在类上
        ElementType.METHOD              表示自定义注解可以使用在方法上
    @Retention参数                       [ 保存策略 ]
        RetentionPolicy.RUNTIME         注解会被编译器记录在类文件中,并且在运行时由 VM 保留,因此可以反射性地读取它们。
    @Inherited                          [ 可以继承 ]
 */
@Inherited
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface MyInterface {
    // 只有value可以不用指定属性名传参
    String value();
    // 给默认值后,就不必非要传参
    int[] num() default 10;
}
```