---
icon: book
date: 2024-06-24
category:
  - redis
tag:
  - redis
headerDepth: 5
---
# redis

## 概述

> redis 是什么?

Redis（Remote Dictionary Server ），即远程字典服务，是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

免费开源! 是当下最热门的NoSQL技术之一! 也被人称之为结构化数据库!

> redis 能做什么?

1. 内存存储,持久化,内存中是断电即失,所以说持久化很重要(rdb,aof)
2. 效率高,可用用于高速缓存
3. 发布订阅系统
4. 地图信息分析
5. 计时器,计数器(浏览量!)
6. ...

> 特性

1. 多样的数据类型
2. 持久化
3. 集群
4. 事务
5. ....

> 学习中需要用到的东西

1. 狂神的公众号: 狂神说 (本文学习狂神说来的)
2. 官网: <https://redis.io/downloads/>
3. 英文官网命令查询: <https://redis.io/docs/latest/commands/>

注意: Windows再Github上下载(停止更新很久了)

==Redis推荐都是再linux服务器上搭建的, 我们是基于Linux学习==

## Linux安装

1. 下载安装包! 最新稳定版本: 最新的稳定版本始终可在固定 <https://download.redis.io/redis-stable.tar.gz> URL 及其 SHA-256 总和中找到

    ![找下载示例](https://i.jpg.dog/fde8293541278f1dae1f55be6b23bd99.png)

2. 将安装包上传到linux服务器上并解压[ 上传目录为 `/opt`]
3. 安装gcc,执行 `yum install gcc-c++`命令即可
4. 在reids根目录执行

    ```shell
    make
    make install
    ```

5. redis的默认安装路径 `/usr/local/bin`
6. 将redis配置文件复制到 `/usr/local/bin` 目录下

    ```shell
    mkdir my-config
    cp /opt/redis/redis.conf my-config
    ```

7. redis默认不是后台启动的,需修改配置文件.

    ```shell
    # redis.conf
    # 找到dameonize 将参数修改为yes
    dameonize yes
    ```

8. 启动redis服务

    ```shell
    # 通过指定的配置文件启动服务
    redis-server /usr/local/bin/my-config/redis.conf
    ```

9. 使用redis客户端进行链接测试

    ```shell
    # 使用redis客户端进行链接
    reids-cli -p 6379
    ```

10. 查看redis进程是否开启命令 `ps -ef|grep redis`
11. 关闭redis服务命令 `shutdown`

## 测试性能

**redis-benchmark** 是一个压力测试工具.

官方自带的性能测试工具!

使用: redis-benchmark 命令参数!

命令参数[图片来自菜鸟教程]:

  ![redis命令参数](https://i.jpg.dog/fb15e2e3bc5eb4fd9124590754005d48.png)

简单测试下

```shell
# 测试: 100个并发链接 100000请求
redis-benchmark -h localhost -p 6379 -c 100 -n 100000
```

![Snipaste 2024 06 26 17 58 26](https://i.jpg.dog/b99bd7bdfebf880a18d7a35dff1d4ab2.png)

## 基础知识

redis默认存在16个数据库

1. 切换数据库命令: `select index` index为几号数据库.
2. 查看库数据大小命令: `dbsize`
3. 查看所有的key命令: `keys *`
4. 清空当前数据库命令: `flushdb`
5. 清空全部数据库内容命令: `flushall`

> redis 是单线程的.

Redis为什么单线程还很快?

1. 误区1: 高性能服务器一定是多线程的?
2. 误区2: 多线程(CPU上下文会切换)一定比单线程效率高!

核心:

1. redis是将所有的数据全部放在内存中的,所以说使用单线程去操作效率就是最高的.
2. 多线程的上下文切换本身就是耗时操作,但对于内存系统来说没有上下文切换效率就是最高的.
3. 多次读写都是在一个CPU上的,在内存情况下,这个就是最佳的方案.

## 五大数据类型

### Redis-key

```shell
# 更换数据库
select index

# 查看数据库现在有多少key
dbsize

# 查看库内所有的key
keys *

# 将当前数据库清空
flushdb

# 清空所有数据库
flushall

# expire 过期命令 key 要被过期的名称 seconds 多少秒后过期
expire key seconds

# ttl 查看过期时间命令 查看key还有多长时间过期
# 注意: -2 表示已经过期
ttl key

# del 删除命令 将key从redis中删除
del key

# move 移动命令 将key从当前数据库移动至指定数据库中
move key db

# type 查看key所存储的类型
type key

# exists 查看key是否存在的命令
exists key
```

### String(字符串)

```shell
# set 设置一个key, key 存储的键名 value 存储的值
set key value
# 将value关联到key,并将key的过期时间设置为seconds(以秒为单位)
setex key seconds value

# 当key不存在时设置key的值,当key存在时不会设置.
setnx key value

# 给key设置一个新的value值并将旧值返回回去
getset key value

# append 追加命令 在key的后面追加上value的值
append key value

# get 获取命令,获取key的value值返回
get key

# strlen 查看key的长度
strlen key
```

#### 同时设置或获取多个属性值

```shell
# 同时设置一个或多个key-value,且所有给定的key都不存在
# 如果key存在时新值会覆盖旧值
mset key value[key1 value1 ...]

# 同时设置一个或多个key-value,当所有key都不存在时成功
# 这是一个原子性的操作,要么一起成功,要么一起失败
msetnx key vlaue[key1 value1]

# 获取所有给定的key的值,value值返回的索引位置与key的顺序一致
mget key1[key2..]
```

#### 字符串范围获取或替换

```shell
# 获取key关联的value,且获取value从start位置到end位置的字符进行返回
getrange key start end

# 将key的value进行覆写,从偏移量(offset)开始
setrange key offset value
```

#### 自增或自减

```shell
# 将key中存储的数字值增1
incr key

# 对key的值加上指定的增值量(increment)
incrby key increment

# 对key的值加上指定的浮点增值量(increment)
incrbyfloat key increment

# 对key中存储的数字值减一
decr key

# 对key所存储的值减去指定的减量值(decrement)
decrby key decrement
```

### List(列表)

可以当成栈,队列,阻塞队列使用.

- 本质上是一个链表, before node after, left right 都可以插入值
- 当key不存在,创建新的链表,key存在新增内容
- 如果移除了所有值,空链表,也代表不存在
- 两个插入或改动值,效率最高! 中间元素,相对来说效率会低一点.

消息队列: lpush rpop
栈: lpush lpop

```shell
# 获取key的长度.
llen key

# lpush 向list添加一个或多个值添加到列表头部
# 当添加多个值的时候,value2会在value1前面,因为这个命令是向列表头部添加一个值
# 也就是多个值时,先进入的反而在最后,最后进入的反而在最前面
lpush key value1[value2...]

# lpushx 向已存在的列表的头部添加一个值,列表不存在时不执行且返回0
lpushx key value

# rpush 向列表尾部添加一个或多个值
rpush key value1[value2...]

# rpushx 为已存在的列表的尾部添加值,列表不存在时不执行且返回0
rpushx key value

# 通过索引设置列表指定位置的值,当key不存在时会报错,当索引不存在时也不执行
# 例如key中长度为3但是向索引为10的位置设置值时就是失败的.
lset key index value

# 在列表的元素前或后插入元素
# 向pivot[元素名]前或后插入value
LINSERT key BEFORE|AFTER pivot value
```

#### 获取列表中的元素

```shell

# 取出指定范围内的元素,当 start=0 stop=-1时会取出全部
lrange key start stop

# 通过索引获取列表中的元素
lindex key index

```

#### 移除或弹出一个元素

```shell
# lpop 移除并获取列表的第一位元素
lpop key

# rpop 移除并获取列表的最后一位元素
rpop key

# 移除key中指定个数的value, count 代表要移除的个数
# 移除时是从头部开始找要移除的元素
lrem key count value

# 移除key中指定个数的value,conunt 代表要移除的个数
# 移除时是从尾部开始找要移除的元素
rrem key cont value

# 移除source列表的最后一位元素,并将该元素添加到destination列表的头部,最后将source移除的元素返回
# destination不存在时会创建
rpoplpush source destination
```

#### 阻塞命令

```shell
# 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。
# 当列表中存在元素时会直接从头部移除一位,若列表中没有任何元素时也就是这个key都不存在的情况下,会阻塞指定的秒数[timeout]
blpop key1[key2] timeout

# 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止
# 当列表中存在元素时会直接从尾部移除一位元素,若列表中没有任何元素时也就是这个key都不存在的情况下,会阻塞指定的秒数[timeout]
brpop key1[key2] timeout

# 从列表中弹出一个值，将弹出的元素插入到另外一个列表中并返回它；
# 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。
# 将source尾部移除一个值,追加到destination的头部,当source不存在元素时,阻塞指定的秒数[timeout]或发现一个元素可以弹出
brpoplpush source destination timeout
```

#### 保留区间内的元素

```shell
# 对一个列表进行修建,仅保留指定区间内的元素,不存在区间内的元素都被删除
# 这个区间是个闭区间,也就是指定的索引位也包含在内
ltrim key start stop
```

### Set(集合)

set中的值是不能重复的.

```shell
# 向集合中添加一个或多个成员,成员不能重复
sadd key member1 [member2]

# 判断 member 元素是否是集合 key 的成员
SISMEMBER key member

# 返回集合中的所有成员
SMEMBERS key

# 将 member 元素从 source 集合移动到 destination 集合
SMOVE source destination member

# 移除并返回集合中的一个随机元素
SPOP key

# 返回集合中一个或多个随机数
SRANDMEMBER key [count]

# 移除集合中一个或多个成员
SREM key member1 [member2]

# 迭代集合中的元素
SSCAN key cursor [MATCH pattern] [COUNT count]

# 返回第一个集合与其他集合之间的差异。
SDIFF key1 [key2]

# 获取集合的成员数
SCARD key
```

#### 交集

```shell
# 返回给定所有集合的交集
SINTER key1 [key2]

# 返回给定所有集合的差集并存储在 destination 中
SDIFFSTORE destination key1 [key2]
```

#### 并集

```shell
#返回所有给定集合的并集
SUNION key1 [key2]

# 所有给定集合的并集存储在 destination 集合中
SUNIONSTORE destination key1 [key2]
```

### Hash

Map集合,key-map这时候值是map集合

```shell
# 将哈希表key中的字段field的值设置为value.redis4.0后该命令支持设置多个field
hset key field value

# 将哈希表key中的字段field的值不存在时,设置值为value
HSETNX key field value

# 同时将多个field-value设置到hash表的key中,该命令后续已经移除
hmset key field1 value1 [field2 value2]


# 获取存储在哈希表中指定字段的值。
HGET key field

# 获取所有给定字段的值
hmget key field1 [field2]

# 获取在哈希表中指定 key 的所有字段和值
hgetAll key

# 查看哈希表 key 中，指定的字段是否存在。
HEXISTS key field

# 删除一个或多个哈希表字段
HDEL key field1 [field2]

#获取哈希表中的所有字段
HKEYS key

# 获取哈希表中所有的值
hvals key

# 获取哈希表中字段的数量
HLEN key

# 迭代hash表中的键值对
HSCAN key cursor [MATCH pattern] [COUNT count]
```

#### 字段添加指定增量

```shell

# 为哈希表 key 中的指定字段的整数值加上增量 increment 。
HINCRBY key field increment

# 为哈希表 key 中的指定字段的浮点数值加上增量 increment 。
HINCRBYFLOAT key field increment
```

### Zset(有序集合)

```shell
# 获取有序集合的成员数
ZCARD key

# 向有序集合添加一个或多个成员，或者更新已存在成员的分数
# 新成员会从头部进行插入,而不是从尾部插入.
ZADD key score1 member1 [score2 member2]

# 返回有序集合中指定成员的索引
ZRANK key member

# 返回有序集中，成员的分数值
ZSCORE key member

# 通过索引区间返回有序集合指定区间内的成员
ZRANGE key start stop [WITHSCORES]

# 返回有序集中指定区间内的成员，通过索引，分数从高到低
ZREVRANGE key start stop [WITHSCORES]

# 返回有序集中指定分数区间内的成员，分数从高到低排序
# -inf 代表负无穷 +inf 代表正无穷
ZREVRANGEBYSCORE key max min [WITHSCORES]

# 返回有序集合中指定成员的排名，有序集成员按分数值递减(从大到小)排序
ZREVRANK key member

# 通过字典区间返回有序集合的成员
ZRANGEBYLEX key min max [LIMIT offset count]

# 通过分数返回有序集合指定区间内的成员
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT]

#移除有序集合中的一个或多个成员
ZREM key member [member ...]

# 移除有序集合中给定的字典区间的所有成员
ZREMRANGEBYLEX key min max

# 移除有序集合中给定的排名区间的所有成员
ZREMRANGEBYRANK key start stop

# 移除有序集合中给定的分数区间的所有成员
ZREMRANGEBYSCORE key min max

# 计算在有序集合中指定区间分数的成员数
ZCOUNT key min max

# 在有序集合中计算指定字典区间内成员数量
ZLEXCOUNT key min max

# 计算给定的一个或多个有序集的交集并将结果集存储在新的有序集合 destination 中
ZINTERSTORE destination numkeys key [key ...]

# 计算给定的一个或多个有序集的并集，并存储在新的 key 中
ZUNIONSTORE destination numkeys key [key ...]

# 迭代有序集合中的元素（包括元素成员和元素分值）
ZSCAN key cursor [MATCH pattern] [COUNT count]
```

#### 对分数进行指定增量

```shell
# 有序集合中对指定成员的分数加上增量 increment
ZINCRBY key increment member
```

### Geo(地理位置)

Redis GEO 主要用于存储地理位置信息，并对存储的信息进行操作，该功能在 Redis 3.2 版本新增。

```shell
# 添加地理位置的坐标。
GEOADD key longitude latitude member [longitude latitude member ...]

# 获取地理位置的坐标。
GEOPOS key member [member ...]

# 计算两个位置之间的距离。
GEODIST key member1 member2 [m|km|ft|mi]

# 根据用户给定的经纬度坐标来获取指定范围内的地理位置集合。
GEORADIUS key longitude latitude radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]

# 根据储存在位置集合里面的某个地点获取指定范围内的地理位置集合。
GEORADIUSBYMEMBER key member radius m|km|ft|mi [WITHCOORD] [WITHDIST] [WITHHASH] [COUNT count] [ASC|DESC] [STORE key] [STOREDIST key]

# 返回一个或多个位置对象的 geohash 值
GEOHASH key member [member ...]
```

### hyperLogLog(基数统计)

Redis 在 2.8.9 版本添加了 HyperLogLog 结构。

Redis HyperLogLog 是用来做基数统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定 的、并且是很小的。

```shell
# 添加指定元素到 HyperLogLog 中。
PFADD key element [element ...]

# 返回给定 HyperLogLog 的基数估算值。
PFCOUNT key [key ...]

# 将多个 HyperLogLog 合并为一个 HyperLogLog
PFMERGE destkey sourcekey [sourcekey ...]
```

### stream

Redis Stream 是 Redis 5.0 版本新增加的数据结构。

Redis Stream 主要用于消息队列（MQ，Message Queue），Redis 本身是有一个 Redis 发布订阅 (pub/sub) 来实现消息队列的功能，
但它有个缺点就是消息无法持久化，如果出现网络断开、Redis 宕机等，消息就会被丢弃。

#### 消息队列相关命令

```shell
# XADD - 添加消息到末尾 key 队列名称 id 消息id field value记录
XADD key ID field value [field value ...]

# XTRIM - 对流进行修剪，限制长度 key队列名称 maxlen 长度 count 数量
XTRIM key MAXLEN [~] count

# XDEL - 删除消息
XDEL key ID [ID ...]

# XLEN - 获取流包含的元素数量，即消息长度
XLEN key

# XRANGE - 获取消息列表，会自动过滤已经删除的消息
# start ：开始值， - 表示最小值 end ：结束值， + 表示最大值 count ：数量
XRANGE key start end [COUNT count]

# XREVRANGE - 反向获取消息列表，ID 从大到小
# start ：开始值， - 表示最小值 end ：结束值， + 表示最大值 count ：数量
XREVRANGE key end start [COUNT count]

# XREAD - 以阻塞或非阻塞方式获取消息列表
# count ：数量 milliseconds ：可选，阻塞毫秒数，没有设置就是非阻塞模式
# key ：队列名 id ：消息 ID
XREAD [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] id [id ...]
```

#### 消费者组相关命令

```shell
# XGROUP CREATE - 创建消费者组
# key ：队列名称，如果不存在就创建
# groupname ：组名。
# $ ： 表示从尾部开始消费，只接受新消息，当前 Stream 消息会全部忽略。
# 0-0: 表示从头消费
XGROUP [CREATE key groupname id-or-$] [SETID key groupname id-or-$] [DESTROY key groupname] [DELCONSUMER key groupname consumername]


# XREADGROUP GROUP - 读取消费者组中的消息
# group ：消费组名
# consumer ：消费者名。
# count ： 读取数量。
# milliseconds ： 阻塞毫秒数。
# key ： 队列名。
# ID ： 消息 ID。
XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] [NOACK] STREAMS key [key ...] ID [ID ...]

XACK - 将消息标记为"已处理"
XGROUP SETID - 为消费者组设置新的最后递送消息ID
XGROUP DELCONSUMER - 删除消费者
XGROUP DESTROY - 删除消费者组
XPENDING - 显示待处理消息的相关信息
XCLAIM - 转移消息的归属权
XINFO - 查看流和消费者组的相关信息；
XINFO GROUPS - 打印消费者组的信息；
XINFO STREAM - 打印流信息
```

## 事务

Redis 事务可以一次执行多个命令， 并且带有以下三个重要的保证：

- 批量操作在发送 EXEC 命令前被放入队列缓存。
- 收到 EXEC 命令后进入事务执行，事务中任意命令执行失败，其余的命令依然被执行。
- 在事务执行过程，其他客户端提交的命令请求不会插入到事务执行命令序列中。

```shell
# 标记一个事务块的开始。
multi

# 执行所有事务块内的命令
EXEC

# 取消事务，放弃执行事务块内的所有命令。
DISCARD

# 取消 WATCH 命令对所有 key 的监视。
UNWATCH

# 监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。
WATCH key [key ...]
```
