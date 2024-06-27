---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - redis
tag:
  - java
---
# Jedis

Redis 官方推荐的java链接工具.

## 导入依赖

```xml
 <!--region jedis redis链接工具 -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.1.0</version>
</dependency>
<!--endregion-->
<!--region jackson包 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.17.0</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.17.0</version>
</dependency>
<!--endregion-->
```

### 测试链接

```java
import redis.clients.jedis.Jedis;

public class TestPing {
    public static void main(String[] args) {
        // 1. 创建redis链接
        try (Jedis jedis = new Jedis("127.0.0.1", 6379)) {
            // 设置密码
            jedis.auth("123456");
            System.out.println(jedis.ping());
        }
    }
}
```
