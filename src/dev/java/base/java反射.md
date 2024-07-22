---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - java
tag:
  - java
order: 2
---
# 反射
## 简介

Java反射机制是在运行状态中,获取任意一个类的结构,创建对象,得到方法,执行方法,得到属性. 
这种在运行状态获取信息以及动态调用对象方法的功能被称为Java语言的反射机制


## 类加载器

Java类加载器(Java Classloader)是Java运行时环境(Java Runtime Environment)的一部分,负责动态加载Java类到Java虚拟机的内存空间中.

java默认有三种类加载器
1. BootstrapClassLoader(引导启动类加载器):
    - 嵌在JVM内核中的加载器,该加载器是用C++语言写的,主要负载加载JAVA_HOME/lib下的类库,引导启动类加载器无法被应用程序直接使用
2. ExtensionClassLoader(扩展类加载器):
    - ExtensionClassLoader是用JAVA编写,且它的父类加载器是Bootstrap.
    - 是由sun.misc.Launcher$ExtClassLoader实现的,主要加载JAVA_HOME/lib/ext目录中的类库。
    - 它的父加载器是BootstrapClassLoader
3. App ClassLoader(应用类加载器):
    - App ClassLoader是应用程序类加载器,负责加载应用程序classpath目录下的所有jar和class文件。它的父加载器为Ext ClassLoader



类通常是按需加载,即第一次使用该类时才加载。由于有了类加载器,Java运行时系统不需要知道文件与文件系统。

双亲委派模型:如果一个类加载器收到了一个类加载请求,它不会自己去尝试加载这个类,而是把这个请求转交给父类加载器去完成。

每一个层次的类加载器都是如此。因此所有的类加载请求都应该传递到最顶层的

启动类加载器中,只有到父类加载器反馈自己无法完成这个加载请求(在它的搜索范围没有找到这个类)时,子类加载器才会尝试自己去加载。委派的好处就是避免有些类被重复加载


## 如何使用反射

反射使用的演示对象
```java
/**
 * @author blackFire
 */
public class Person {
    private String name;
    private int age;

    public Person() {
    }

    public Person(String name) {
        this.name = name;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    // 省略 get/set 方法
}
```

### 获取 Class 方式
```java
public class ClassTest(){

    static class Student{ }

    /**
     * 演示 反射获取 Class
     * 1. 使用 类名.class;
     * 2. 使用 对象.getClass;
     * 3. 使用 Class.forName("类全路径");
     */
    public static void getClassTest(){
        // 第一种获取方式
        Class<Student> cla = Student.class;

        // 第二种
        Student student = new Student();
        Class<Student> cla1 = (Class<Student>) student.getClass();

        // 第三种
        try {
            Class<?> aClass = Class.forName("com.blackfire.day03.ReflectionTest$Student");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

### 使用返回获取构造器
#### 获取并使用无参构造器创建对象
```java
public static  void getConstructor() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        // 获取到 Person 的 class
        Class<Person> personClass = Person.class;
        // 通过 Person 的 class 获取它的构造器
        Constructor<Person> constructor = personClass.getConstructor();
        // 使用 无参构造器创建 Person 对象
        Person person = constructor.newInstance();
        // 输出 Person{name='null', age=0}
        System.out.println(person);
    }
```

#### 获取并使用带参构造器创建对象
```java
/**
 * 获取并使用带参构造器
 */
public static  void getConstructor1() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        // 获取到 Person 的 class
        Class<Person> personClass = Person.class;
        // 通过 Person 的 class 获取它的构造器
        Constructor<Person> constructor = personClass.getConstructor(String.class, int.class);
        // 使用 带参构造器创建方法
        Person person = constructor.newInstance("张三", 15);
        System.out.println(person);
    }
```

获取并使用 private 修饰的构造器
```java
public static  void getConstructor2() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        // 获取到 Person 的 class
        Class<Person> personClass = Person.class;
        // 通过 Person 的 class 获取它的构造器 getDeclaredConstructor 获取所有权限的构造器, 当有 private 修饰的构造器时需要使用这个
        Constructor<Person> constructor = personClass.getDeclaredConstructor(String.class);
        // 当使用 private 修饰的构造器时 需要 对其加上忽略权限
        constructor.setAccessible(true);
        // 使用 带参构造器创建方法
        Person person = constructor.newInstance("张三");
        System.out.println(person);
    }
```
### 使用反射获取并使用方法
```java
 /**
     * 获取 public 修饰的方法
     *      使用 Class.getMethod(String name, Class<?>... parameterTypes) 获取方法
     *          Method method = personClass.getMethod(methodName , typeClass);
     *      设置数据即可    
     *          method.invoke(obj,value);
     * 获取 private 修饰的方法时
     *      使用 Class.getDeclaredMethod(String name, Class<?>... parameterTypes) 获取所有权限的方法
     *          Method method =  personClass.getDeclaredMethod(methodName , typeClass);
     *      并为 method 设置忽略检查 
     *          method.setAccessible(true);
     *      设置数据    
     *          method.invoke(obj,value);
     */ 
public static void getMethod() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {
        // 使用 反射获取一个对象
        Person person = Person.class.getConstructor().newInstance();
        // 获取到 Person 的 class
        Class<Person> personClass = Person.class;
        // 获取 setAge 方法
        Method setAge = personClass.getMethod("setAge", int.class);
        setAge.invoke(person,10);
        System.out.println(person);
}
```
### 使用反射获取并使用属性
```java
/**
     * 获取 public 修饰的属性时
     *      使用 Class.getField(String name) 获取属性
     *          Field field = Class.getField(String name)
     *      设置数据
     *          field.set(obj,value);
     * 获取 private 修饰的属性时
     *      使用 Class.getDeclaredField(String name) 获取所有权限的属性
     *          Field field = Class.getDeclaredField(String name)
     *      并为其设置忽略权限
     *          field.setAccessible(true);
     *      最后设置数据即可
     *          field.set(obj,value);
     */
public static void getProperty() throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchFieldException {
        // 使用 反射获取一个对象
        Person person = Person.class.getConstructor().newInstance();
        // 获取到 Person 的 class
        Class<Person> personClass = Person.class;
        // 通过类获取 "name" 属性
        Field name = personClass.getDeclaredField("name");
        name.setAccessible(true);
        name.set(person,"张三");
        System.out.println(person);
}
```

## 内省
### 简介

基于反射 , java所提供的一套应用到JavaBean的API

拥有无参构造器,所有属性私有,所有属性提供get/set方法,实现了序列化接口的这种类, 我们称其为 bean类.

Java提供了一套java.beans包的api , 对于反射的操作, 进行了封装!

使用内省获取 get/set 方法

```java
/**
     * 通过内省获取 get/set 方法
     * 使用 java.beans 下的 Introspector
     *      .getBeanInfo(Class);
     *          获取到一个 BeanInfo
     * 使用 BeanInfo 中的 getPropertyDescriptors 方法获取到所有的属性
     *      beanInfo.getPropertyDescriptors();
     * 循环拿到的所有属性,获取它的 get / set方法
     *      获取所有的 set 方法
     *          pd.getReadMethod();
     *      获取到所有的 get 方法
     *          pd.getWriteMethod();
     */
    public static  void get() throws IntrospectionException {
        Class<Person> personClass = Person.class;
        BeanInfo beanInfo = Introspector.getBeanInfo(personClass);
        PropertyDescriptor[] propertyDescriptors = beanInfo.getPropertyDescriptors();
        for (PropertyDescriptor pd : propertyDescriptors) {
            Method writeMethod = pd.getWriteMethod();
            System.out.println(writeMethod);
        }
    }
```