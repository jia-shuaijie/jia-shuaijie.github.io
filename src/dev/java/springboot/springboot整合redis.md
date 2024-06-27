---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - redis
tag:
  - java
---
# spring boot整合redis

springData也是和SpringBoot齐名的项目.

说明: SpringBoot2.x之后,原来使用的Jedis被替换为了lettuce.

jedis: 采用的直连,多个线程操作的话是不安全的,如果想要避免不安全,使用jedis pool连接池! 更像BIO模式.
lettuce: 采用netty, 实例可用再更多个线程中进行共享, 不存在线程不安全的情况.
