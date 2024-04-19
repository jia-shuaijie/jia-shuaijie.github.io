# redis工具类

## RedisConfigBean配置

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

    @Bean
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        RedisSerializer<String> redisSerializer = new StringRedisSerializer();
        template.setConnectionFactory(factory);
        //key序列化方式
        template.setKeySerializer(redisSerializer);
        //value序列化
        template.setValueSerializer(redisSerializer);
        //key haspMap序列化
        template.setHashKeySerializer(redisSerializer);
        //value hashmap序列化
        template.setHashValueSerializer(redisSerializer);
        return template;
    }
}
```

## RedisUtil工具类

```java
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.*;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;


@Component
public class RedisUtil {
    public static RedisTemplate<String, String> redisTemplate;
    public static HashOperations<String, String, String> hashOperations;
    public static ValueOperations<String, String> valueOperations;
    public static ListOperations<String, String> listOperations;
    public static SetOperations<String, String> setOperations;

    public RedisUtil(RedisTemplate<String, String> redisTemplate) {
        RedisUtil.redisTemplate = redisTemplate;
        RedisUtil.hashOperations = redisTemplate.opsForHash();
        RedisUtil.valueOperations = redisTemplate.opsForValue();
        RedisUtil.listOperations = redisTemplate.opsForList();
        RedisUtil.setOperations = redisTemplate.opsForSet();
    }

    /**
     * 根据正则匹配key获取所有对应的key
     *
     * @param pattern 正则匹配路径 例如examUserId:* 获取 examUserId:101,examUserId:102,examUserId:103...
     * @return List<String>
     */
    public static List<String> findMatchingKeys(String pattern) {
        List<String> matchedKeys = new ArrayList<>();

        ScanOptions scanOptions = ScanOptions.scanOptions().match(pattern).count(100).build();
        RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
        if (null == connectionFactory) {
            throw new RuntimeException("使用 ScanOptions 获取 keys 时 connectionFactory 获取为空");
        }

        try (Cursor<byte[]> cursor = connectionFactory.getConnection().scan(scanOptions)) {
            while (cursor.hasNext()) {
                byte[] rawKey = cursor.next();
                String key = new String(rawKey, StandardCharsets.UTF_8);
                matchedKeys.add(key);
            }
        }

        return matchedKeys;
    }

    /**
     * 排序
     *
     * @param sortQuery 排序条件
     * @return List<String>
     */
    public static List<String> sort(SortQuery<String> sortQuery) {
        return redisTemplate.sort(sortQuery);
    }

    /**
     * 给一个指定的 key 值附加过期时间
     */
    public static void expire(String key, long time) {
        redisTemplate.expire(key, time, TimeUnit.SECONDS);
    }

    /**
     * 根据key 获取过期时间
     *
     * @param key 键 不能为null
     * @return 时间(秒) 返回 0 代表为永久有效
     */
    public static long getTime(String key) {
        Long expire = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        return null == expire ? -1 : expire;
    }

    /**
     * 根据key 判断该key是否已过期
     */
    public static boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * 移除指定key 的过期时间
     */
    public static boolean persist(String key) {
        return Boolean.TRUE.equals(redisTemplate.boundValueOps(key).persist());
    }

    /**
     * 从redis中删除指定的一个key
     *
     * @param key redisKey
     */
    public static void del(String key) {
        redisTemplate.delete(key);
    }
    //region String类型
    //- - - - - - - - - - - - - - - - - - - - -  String类型 - - - - - - - - - - - - - - - - - - - -

    /**
     * 根据key获取值
     *
     * @param key 键
     * @return 值
     */
    public static Object get(String key) {
        return key == null ? null : valueOperations.get(key);
    }

    /**
     * 将值放入缓存
     *
     * @param key   键
     * @param value 值
     */
    public static void set(String key, String value) {
        valueOperations.set(key, value);
    }

    /**
     * 将值放入缓存并设置时间
     *
     * @param key   键
     * @param value 值
     * @param time  时间(秒) -1为无期限
     */
    public static void set(String key, String value, long time) {
        valueOperations.set(key, value, time, TimeUnit.SECONDS);
    }

    /**
     * 批量添加 key (重复的键会覆盖)
     */
    public static void batchSet(Map<String, String> keyAndValue) {
        valueOperations.multiSet(keyAndValue);
    }

    /**
     * 批量添加 key-value 只有在键不存在时,才添加
     * map 中只要有一个key存在,则全部不添加
     */
    public static void batchSetIfAbsent(Map<String, String> keyAndValue) {
        valueOperations.multiSetIfAbsent(keyAndValue);
    }

    /**
     * 对一个 key-value 的值进行加减操作,
     * 如果该 key 不存在 将创建一个key 并赋值该 number
     * 如果 key 存在,但 value 不是长整型 ,将报错
     */
    public static Long increment(String key, long number) {
        return valueOperations.increment(key, number);
    }

    /**
     * 对一个 key-value 的值进行加减操作,
     * 如果该 key 不存在 将创建一个key 并赋值该 number
     * 如果 key 存在,但 value 不是 纯数字 ,将报错
     */
    public static Double increment(String key, double number) {
        return valueOperations.increment(key, number);
    }
    //endregion

    //region set类型
    //- - - - - - - - - - - - - - - - - - - - -  set类型 - - - - - - - - - - - - - - - - - - - -

    /**
     * 将数据放入set缓存
     */
    public static void sSet(String key, String value) {
        setOperations.add(key, value);
    }

    /**
     * 获取变量中的值
     */
    public static Set<String> members(String key) {
        return setOperations.members(key);
    }

    /**
     * 随机获取变量中指定个数的元素
     */
    public static void randomMembers(String key, long count) {
        setOperations.randomMembers(key, count);
    }

    /**
     * 随机获取变量中的元素
     */
    public static String randomMember(String key) {
        return setOperations.randomMember(key);
    }

    /**
     * 弹出变量中的元素
     */
    public static Object pop(String key) {
        return setOperations.pop("key");
    }

    /**
     * 获取变量中值的长度
     */
    public static long size(String key) {
        Long size = setOperations.size(key);
        return null == size ? -1 : size;
    }

    /**
     * 根据value从一个set中查询,是否存在
     *
     * @param key   键
     * @param value 值
     * @return true 存在 false不存在
     */
    public static boolean sHasKey(String key, Object value) {
        return Boolean.TRUE.equals(setOperations.isMember(key, value));
    }

    /**
     * 检查给定的元素是否在变量中。
     */
    public static boolean isMember(String key, Object obj) {
        return Boolean.TRUE.equals(setOperations.isMember(key, obj));
    }

    /**
     * 转移变量的元素值到目的变量。
     */
    public static boolean move(String key, String value, String destKey) {
        return Boolean.TRUE.equals(setOperations.move(key, value, destKey));
    }

    /**
     * 批量移除set缓存中元素
     *
     * @param key    set集合Key
     * @param values set集合中需要移除的元素值
     */
    public static void remove(String key, Object... values) {
        redisTemplate.opsForSet().remove(key, values);
    }

    /**
     * 通过给定的key求2个set变量的差值
     *
     * @param key     set集合Key
     * @param destKey set集合Key
     * @return Set<String> 两个set集合的差值
     */
    public static Set<String> difference(String key, String destKey) {
        return setOperations.difference(key, destKey);
    }

    /**
     * 弹出元素并删除
     *
     * @param key 要弹出的key
     */
    public static String popValue(String key) {
        return setOperations.pop(key);
    }
    //endregion

    //region hash类型
    //- - - - - - - - - - - - - - - - - - - - -  hash类型 - - - - - - - - - - - - - - - - - - - -

    /**
     * hash 添加一个hash类型的数据进行存储
     * <p>
     * 给一个key设置所有相应的属性
     */
    public static void hmSet(String key, Map<String, String> map) {
        hashOperations.putAll(key, map);
    }

    /**
     * hash表设置一个值
     *
     * @param key     hash表Key
     * @param hashKey hash表字段Key
     * @param value   hash表字段Key所对应的值
     */
    public static void hmSet(String key, String hashKey, String value) {
        hashOperations.put(key, hashKey, value);
    }

    /**
     * hash 获取某个key下所有的value
     */
    public static List<String> hashValues(String key) {
        return hashOperations.values(key);
    }


    /**
     * 获取当前key下所有的键值对
     *
     * @param key 要取的key值
     * @return 返回所有键值对
     */
    public static Map<String, String> hashEntries(String key) {
        return hashOperations.entries(key);
    }

    /**
     * 获取某个 hash key 下指定hashKey的值
     *
     * @param key      key
     * @param hashKeys hashKeys
     * @return hashKey的value值
     */
    public static List<String> hashMultiGet(String key, List<String> hashKeys) {
        return hashOperations.multiGet(key, hashKeys);
    }

    /**
     * 验证指定 key 下 有没有指定的 hash key
     *
     * @param key     hash表Key
     * @param hashKey hash表字段key
     * @return 存在为true, 不存在为false
     */
    public static boolean hashKey(String key, String hashKey) {
        return redisTemplate.opsForHash().hasKey(key, hashKey);
    }


    /**
     * 获取指定key的值string
     *
     * @param key     hash表Key
     * @param hashKey hash表字段key
     * @return String
     */
    public static String hGet(String key, String hashKey) {
        return hashOperations.get(key, hashKey);
    }

    /**
     * 删除指定 hash 的 HashKey
     *
     * @param key      hash表Key
     * @param hashKeys hash表字段Key(多个)
     * @return 删除成功的 数量
     */
    public static Long delete(String key, String... hashKeys) {
        return hashOperations.delete(key, (Object) hashKeys);
    }

    /**
     * 给指定 hash 的 hash key 做增减操作
     *
     * @param key     hash表Key
     * @param hashKey hash表字段Key,一般称为hashKey
     * @param number  增减值
     * @return Double
     */
    public static Double increment(String key, String hashKey, Double number) {
        return hashOperations.increment(key, hashKey, number);
    }

    /**
     * 获取 key 下的 所有 hash key 字段
     *
     * @param key hash表Key
     * @return Set<String>
     */
    public static Set<String> hashKeys(String key) {
        return hashOperations.keys(key);
    }

    /**
     * 获取指定 hash 下面的 键值对 数量
     *
     * @param key hash表Key
     */
    public static Long hashSize(String key) {
        return hashOperations.size(key);
    }
    //endregion

    //region list类型
    //- - - - - - - - - - - - - - - - - - - - -  list类型 - - - - - - - - - - - - - - - - - - - -

    /**
     * 在变量左边添加元素值
     *
     * @param key   listKey
     * @param value 元素值
     */
    public static void leftPush(String key, String value) {
        listOperations.leftPush(key, value);
    }


    /**
     * 获取集合指定位置的值。
     *
     * @param key   listKey
     * @param index 索引位置
     * @return String
     */
    public static String index(String key, long index) {
        return listOperations.index(key, index);
    }


    /**
     * 获取指定区间的值。
     *
     * @param key   listKey
     * @param start 起始区间
     * @param end   结束区间
     * @return List<String>
     */
    public static List<String> range(String key, long start, long end) {
        return redisTemplate.opsForList().range(key, start, end);
    }


    /**
     * 把最后一个参数值放到指定集合的第一个出现中间参数的前面，如果中间参数值存在的话。
     *
     * @param key   listKey
     * @param pivot 某个值,将value放置于第一个该值前
     * @param value 元素值
     */
    public static void leftPush(String key, String pivot, String value) {
        redisTemplate.opsForList().leftPush(key, pivot, value);
    }

    /**
     * 向左边批量添加参数元素。
     *
     * @param key    listKey
     * @param values 多个元素数组
     */
    public static void leftPushAll(String key, String... values) {
        redisTemplate.opsForList().leftPushAll(key, values);
    }

    /**
     * 向集合最右边添加元素。
     *
     * @param key   listKey
     * @param value 元素值
     */
    public static void rightPush(String key, String value) {
        listOperations.rightPush(key, value);
    }


    /**
     * 向集合最右边添加元素。
     *
     * @param key        listKey
     * @param value      元素值
     * @param expireTime 过期时间
     */
    public static void rightPush(String key, String value, long expireTime) {
        listOperations.rightPush(key, value);
        expire(key, expireTime);
    }

    /**
     * 向左边批量添加参数元素。
     *
     * @param key    listKey
     * @param values 多个元素数组
     */
    public static void rightPushAll(String key, String... values) {
        listOperations.rightPushAll(key, values);
    }

    /**
     * 向已存在的集合中添加元素。
     *
     * @param key   listKey
     * @param value 元素值
     */
    public static void rightPushIfPresent(String key, String value) {
        listOperations.rightPushIfPresent(key, value);
    }

    /**
     * 向已存在的集合中添加元素。
     */
    public static long listLength(String key) {
        Long size = listOperations.size(key);
        return null == size ? -1 : size;
    }

    /**
     * 移除集合中的左边第一个元素。
     *
     * @param key listKey
     */
    public static void leftPop(String key) {
        listOperations.leftPop(key);
    }

    /**
     * 移除集合中左边的元素在等待的时间里，如果超过等待的时间仍没有元素则退出。
     *
     * @param key     redisKey
     * @param timeout 等待时间
     * @param unit    时间类型
     */
    public static void leftPop(String key, long timeout, TimeUnit unit) {
        listOperations.leftPop(key, timeout, unit);
    }

    /**
     * 移除集合中右边的元素。
     *
     * @param key 删除listKey中最右侧的元素
     */
    public static void rightPop(String key) {
        listOperations.rightPop(key);
    }

    /**
     * 移除集合中右边的元素在等待的时间里，如果超过等待的时间仍没有元素则退出。
     *
     * @param key     redisKey
     * @param timeout 等待时间
     * @param unit    时间类型
     */
    public static void rightPop(String key, long timeout, TimeUnit unit) {
        listOperations.rightPop(key, timeout, unit);
    }
    //endregion
}
```
