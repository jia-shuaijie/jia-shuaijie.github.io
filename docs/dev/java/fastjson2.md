# fastjson2

## 引入依赖

github文档: <https://github.com/alibaba/fastjson2>
gitee文档: <https://gitee.com/wenshao/fastjson2>

```xml
<dependency>
  <groupId>com.alibaba.fastjson2</groupId>
  <artifactId>fastjson2</artifactId>
  <version>2.0.39</version>
</dependency>
```

## 简单使用

### 将 json 解析为JSONObject

```java
String text = "...";
JSONObject data = JSON.parseObject(text);

byte[] bytes = ...;
JSONObject data = JSON.parseObject(bytes);
```

### 将json解析为JSONArray

```java
String text = "...";
JSONArray data = JSON.parseArray(text);
```

### 将json解析为Java对象

```java
String text = "...";
User data = JSON.parseObject(text, User.class);
```

### 将java对象序列化为JSON

```java
Object data = "...";
String text = JSON.toJSONString(data);
byte[] text = JSON.toJSONBytes(data);
```

## 使用 JSONObject/JSONArray

### 获取简单属性

```java
String text = "{\"id\": 2,\"name\": \"fastjson2\"}";
JSONObject obj = JSON.parseObject(text);

int id = obj.getIntValue("id");
String name = obj.getString("name");
```

```java
String text = "[2, \"fastjson2\"]";
JSONArray array = JSON.parseArray(text);

int id = array.getIntValue(0);
String name = array.getString(1);
```

### 读取javaBean

```java
JSONArray array = ...
JSONObject obj = ...

User user = array.getObject(0, User.class);
User user = obj.getObject("key", User.class);
```

### 转换为JavaBean

```java
JSONArray array = ...
JSONObject obj = ...

User user = obj.toJavaObject(User.class);
List<User> users = array.toJavaList(User.class);
```

## JSONB 使用

### 将 JavaBean对象序列化JSONB

```java
User user = ...;
byte[] bytes = JSONB.toBytes(user);
byte[] bytes = JSONB.toBytes(user, JSONWriter.Feature.BeanToArray);
```

## 将 JSONB数据解析为JavaBean

```java
byte[] bytes = ...
User user = JSONB.parseObject(bytes, User.class);
User user = JSONB.parseObject(bytes, User.class, JSONReader.Feature.SupportBeanArrayMapping);
```

## JSONPath 使用

### 使用JSONPath读取部分数据

```java
String text = ...;
JSONPath path = JSONPath.of("$.id"); // 缓存起来重复使用能提升性能

JSONReader parser = JSONReader.of(text);
Object result = path.extract(parser);
```

### 使用JSONPath读取部分byte[]的数据

```java
byte[] bytes = ...;
JSONPath path = JSONPath.of("$.id"); // 缓存起来重复使用能提升性能

JSONReader parser = JSONReader.of(bytes);
Object result = path.extract(parser);
```

### 使用JSONPath读取部分byte[]的数据

```java
byte[] bytes = ...;
JSONPath path = JSONPath.of("$.id"); // 缓存起来重复使用能提升性能

JSONReader parser = JSONReader.ofJSONB(bytes); // 注意这里使用ofJSONB方法
Object result = path.extract(parser);
```
