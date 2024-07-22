---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - java
tag:
  - java
---
# JDBC 链接 Mysql
```xml
<!-- 
    下载好jar导入或者使用 maven 从 pom 进行导入
 -->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.28</version>
</dependency>
``` 

## 为了方便使用我们将jdbc封装成一个工具类
### version 1.0.1
```java
import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * @author blackFire
 * @version 1.01
 * 去除 getMap();
 */
public class JdbcUtil {
    private Connection connection;
    private PreparedStatement pps;
    private ResultSet resultSet;
    private final static String USERNAME = "root";
    private final static String PASSWORD = "root";
    private final static String JDBC_URL = "jdbc:mysql://127.0.0.1:3306/school?serverTimezone=UTC";

    // 只加载一次驱动
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取 jdbc 链接
     *
     * @return 当前对象的 Connection 对象
     * @throws SQLException sql异常
     */
    private Connection getConnection() throws SQLException {
        this.connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
        return this.connection;
    }


    /**
     * 对 sql 语句进行赋值处理
     *
     * @param sql  要执行的 sql
     * @param list 要填充的字符按
     * @throws SQLException sql 异常
     */
    private PreparedStatement getExecutePps(String sql, List<?> list) throws SQLException {
        this.pps = getConnection().prepareStatement(sql);
        if (!list.isEmpty()) {
            for (int item = 0; item < list.size(); item++) {
                this.pps.setObject(item + 1, list.get(item));
            }
        }
        return this.pps;
    }

    /**
     * 增删改使用
     *
     * @param sql  sql语句
     * @param list 填充字段
     * @return 是否成功
     */
    public Boolean executeSql(String sql, List<?> list) {
        int row = 0;
        try {
            row = getExecutePps(sql, list).executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return row > 0;
    }


    /**
     * 条件查询使用
     *
     * @param sql    sql语句
     * @param list   填充的字段
     * @param tClass 返回类型
     * @param <T>    泛型
     * @return 查询结果
     */
    public <T> List<T> query(String sql, List<?> list, Class<T> tClass) {
        try {
            this.resultSet = getExecutePps(sql, list).executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return getList(this.resultSet, tClass);
    }

    /**
     * 无条件时使用
     *
     * @param sql    sql语句
     * @param tClass 返回类型
     * @param <T>    泛型
     * @return 查询结果
     */
    public <T> List<T> query(String sql, Class<T> tClass) {
        try {
            this.pps = getConnection().prepareStatement(sql);
            this.resultSet = this.pps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return getList(this.resultSet, tClass);
    }


    /**
     * 将 resultSet 中的数据取出并存储与 List 中返回
     * @param resultSet 查询结果集
     * @param tClass 返回类型的 class
     * @param <T> 泛型
     * @return List<object>
     */
    public  <T> List<T> getList(ResultSet resultSet, Class<T> tClass) {
        List<T> tList = new ArrayList<>();
        // 获取所有属性
        Field[] fields = tClass.getDeclaredFields();
        while (true) {
            try {
                if (!resultSet.next()) {
                    break;
                }
                List<Object> list = new ArrayList<>();
                for (Field field : fields) {
                    list.add(resultSet.getObject(field.getName()));
                }
                T t = tClass.getConstructor().newInstance();
                for (int index = 0; index < fields.length; index++) {
                    PropertyDescriptor pd = new PropertyDescriptor(fields[index].getName(), tClass);
                    Method writeMethod = pd.getWriteMethod();
                    writeMethod.invoke(t, list.get(index));
                }
                tList.add(t);
            } catch (SQLException | InstantiationException | InvocationTargetException | NoSuchMethodException | IllegalAccessException | IntrospectionException e) {
                e.printStackTrace();
            }
        }
        closeAll();
        return tList;
    }

    /**
     * 关闭流, 秉持着先开后关原则
     */
    public void closeAll() {
        try {
            if (this.resultSet != null) {
                this.resultSet.close();
            }
            if (this.pps != null) {
                this.pps.close();
            }
            if (this.connection != null) {
                this.connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

### version 1.0.0
```java
import java.lang.reflect.InvocationTargetException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * @author blackFire
 */
public class JdbcUtil {
    private Connection connection;
    private PreparedStatement pps;
    private ResultSet resultSet;
    private final static String USERNAME = "root";
    private final static String PASSWORD = "root";
    private final static String JDBC_URL = "jdbc:mysql://127.0.0.1:3306/school?serverTimezone=UTC";

    // 只加载一次驱动
    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取 jdbc 链接
     *
     * @return 当前对象的 Connection 对象
     * @throws SQLException sql异常
     */
    private Connection getConnection() throws SQLException {
        this.connection = DriverManager.getConnection(JDBC_URL, USERNAME, PASSWORD);
        return this.connection;
    }


    /**
     * 对 sql 语句进行赋值处理
     *
     * @param sql  要执行的 sql
     * @param list 要填充的字符按
     * @throws SQLException sql 异常
     */
    private PreparedStatement getExecutePps(String sql, List<?> list) throws SQLException {
        this.pps = getConnection().prepareStatement(sql);
        if (!list.isEmpty()) {
            for (int item = 0; item < list.size(); item++) {
                this.pps.setObject(item + 1, list.get(item));
            }
        }
        return this.pps;
    }

    /**
     * 增删改使用
     *
     * @param sql  sql语句
     * @param list 填充字段
     * @return 是否成功
     */
    public Boolean executeSql(String sql, List<?> list) {
        int row = 0;
        try {
            row = getExecutePps(sql, list).executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return row > 0;
    }



    /**
     *  条件查询使用
     * @param sql sql语句
     * @param list 填充的字段
     * @param map 取出参数 {"sqlColName": ["setMethodName", Class]}  示例 {数据库字段名 :  [对应的set方法名, java属性类型 ] }
     * @param tClass 返回类型
     * @param <T> 泛型
     * @return 查询结果
     */
    public <T> List<T> query(String sql, List<?> list,Map<String,List<?>> map, Class<T> tClass) {
        try {
            this.resultSet = getExecutePps(sql, list).executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return getList(this.resultSet,map,tClass);
    }

    /**
     * 无条件时使用
     * @param sql sql语句
     * @param map 取出参数 {"sqlColName": ["setMethodName", Class]}  示例 {数据库字段名 :  [对应的set方法名, java属性类型 ] }
     * @param tClass 返回类型
     * @param <T> 泛型
     * @return 查询结果
     */
    public <T> List<T> query(String sql,Map<String,List<?>> map, Class<T> tClass) {
        try {
            this.pps = getConnection().prepareStatement(sql);
            this.resultSet = this.pps.executeQuery();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return getList(this.resultSet,map,tClass);
    }

    /**
     * 在 resultSet 中获取相应参数
     *
     * @param resultSet resultSet
     * @param map       取出参数 {"sqlColName": ["setMethodName", Class]}  示例 {数据库字段名 :  [对应的set方法名, java属性类型 ] }
     * @param tClass    要返回对象的 class
     * @param <T>       泛型
     * @return 结果集取出后以 List 形式返回
     */
    public static <T> List<T> getList(ResultSet resultSet, Map<String,List<?>> map, Class<T> tClass) {
        List<T> tList = new ArrayList<T>();
        while (true) {
            try {
                if (!resultSet.next()) {
                    break;
                }
                T t = tClass.cast(tClass.getConstructor().newInstance());
                for (String col : map.keySet()) {
                    List<?> objects = map.get(col);
                    tClass.getMethod((String) objects.get(0), (Class<?>) objects.get(1)).invoke(t,resultSet.getObject(col));
                }
                tList.add(t);
            } catch (SQLException | InstantiationException | InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return tList;
    }


    public void closeAll() {
        try {
            if (this.resultSet != null) {
                this.resultSet.close();
            }
            if (this.pps != null) {
                this.pps.close();
            }
            if (this.connection != null) {
                this.connection.close();
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

如果使用此 jdbcUtil 请在实现实体类时,自定义一个 getMap(); 示例如下
```java
import lombok.Data;

import java.util.*;

/**
 * @author black fire
 */
@Data
public class Student {
    /**
     * 学生id
     */
    private Integer stuId;
    /**
     * 学生姓名
     */
    private String stuName;
    /**
     * 学生学号
     */
    private String stuNo;
    /**
     * 性别
     */
    private Integer sex;
    /**
     * 手机号
     */
    private String phone;
    /**
     * 邮箱
     */
    private String email;
    /**
     * 所在地址
     */
    private String address;
    /**
     * 专业
     */
    private String profession;

    /**
     * 政治面貌
     */
    private String politics;
    /**
     * 创建时间
     */
    private Date regDate;

    private Integer state;
    /**
     * 简介
     */
    private String introduction;
    /**
     * 班级
     */
    private Integer gId;

    public static Map<String,List<?>> getMap(){
        Map<String, List<?>> map = new HashMap<>(1);
        map.put("stuid", new ArrayList<>(Arrays.asList("set".concat("StuId"),Integer.class)));
        map.put("stuname", new ArrayList<>(Arrays.asList("set".concat("StuName"),String.class)));
        map.put("stuno", new ArrayList<>(Arrays.asList("set".concat("StuNo"),String.class)));
        map.put("sex", new ArrayList<>(Arrays.asList("set".concat("Sex"),Integer.class)));
        map.put("phone", new ArrayList<>(Arrays.asList("set".concat("Phone"),String.class)));
        map.put("email", new ArrayList<>(Arrays.asList("set".concat("Email"),String.class)));    
        map.put("address", new ArrayList<>(Arrays.asList("set".concat("Address"),String.class)));
        map.put("profession", new ArrayList<>(Arrays.asList("set".concat("Profession"),String.class)));
        map.put("politics", new ArrayList<>(Arrays.asList("set".concat("Politics"),String.class)));
        map.put("regdate", new ArrayList<>(Arrays.asList("set".concat("RegDate"),Date.class)));
        map.put("state", new ArrayList<>(Arrays.asList("set".concat("State"),Integer.class)));
        map.put("introduction", new ArrayList<>(Arrays.asList("set".concat("Introduction"),String.class)));
        map.put("gid", new ArrayList<>(Arrays.asList("set".concat("GId"),Integer.class)));
        return map;
    }
}
```