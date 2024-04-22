# fastjson2

文档地址:

github文档: <https://github.com/alibaba/fastjson2>

gitee文档: <https://gitee.com/wenshao/fastjson2>

maven引入依赖:

```xml
<dependency>
  <groupId>com.alibaba.fastjson2</groupId>
  <artifactId>fastjson2</artifactId>
  <version>2.0.39</version>
</dependency>
```

## 简单使用

### JSON字符串与JavaObject相互转换

```java
  @Test
  public void jsonTest() {
      @Data
      class User {
          public int id;
          public String name;
      }

      User user = new User();
      user.id = 2;
      user.name = "FastJson2";
      String userJsonStr = JSON.toJSONString(user);
      log.info("Java对象转换为Json字符串: {}", userJsonStr);
      // 输出结果 Java对象转换为Json字符串: {"id":2,"name":"FastJson2"}

      String userJsonStr1 = JSONObject.toJSONString(user);
      log.info("Java对象转换为Json字符串: {}", userJsonStr1);
      // 输出结果 Java对象转换为Json字符串: {"id":2,"name":"FastJson2"}

      User user1 = JSON.parseObject(userJsonStr, User.class);
      log.info("JSON转换为Java对象后: {}", user1);
      // 输出结果: JSON转换为Java对象后: User(id=2, name=FastJson2)

      User user2 = JSONObject.parseObject(userJsonStr1, User.class);
      log.info("JSON转换为Java对象后: {}", user2);
      // 输出结果: JSON转换为Java对象后: User(id=2, name=FastJson2)
      /*
          小结:
              当我们仅转换一个对象时我们使用 JSON.parseObject()或JSONObject.parseObject()方法 都可以做到java对象的转换
        */
  }
```

### JSONArray与Java的List相互转换

```java
  @Test
  public void jsonArrayTest() {

      List<Integer> list = Arrays.asList(1, 2, 3, 4, 5, 6, 7);
      String jsonString = JSON.toJSONString(list);
      log.info("jsonString: {}", jsonString);
      // 输出结果 jsonString: [1,2,3,4,5,6,7]

      String jsonString2 = JSONObject.toJSONString(list);
      log.info("jsonString: {}", jsonString2);
      // 输出结果 jsonString: [1,2,3,4,5,6,7]

      String jsonString1 = JSONArray.toJSONString(list);
      log.info("jsonString: {}", jsonString1);
      // 输出结果 jsonString: [1,2,3,4,5,6,7]

      List list1 = JSON.parseObject(jsonString, List.class);
      log.info("转换后的List: {}", list1);
      // 输出结果 转换后的List: [1, 2, 3, 4, 5, 6, 7]

      List list2 = JSONObject.parseObject(jsonString2, List.class);
      log.info("转换后的List: {}", list2);
      // 输出结果 转换后的List: [1, 2, 3, 4, 5, 6, 7]

      List<Integer> integers = JSONArray.parseArray(jsonString1, Integer.class);
      log.info("转换后的List: {}", integers);
      // 输出结果 转换后的List: [1, 2, 3, 4, 5, 6, 7]
      /*
          小结:
              当在使用fastjson2时，如果要转换的json字符串是数组，那么需要使用JSONArray.parseArray()方法.
              因为我们需要转换为指定的对象而不是List<Object>

        */
  }
```
