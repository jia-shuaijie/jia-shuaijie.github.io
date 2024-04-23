# redis设计实时排行榜

## 使用redis先试思路可行性

思路:

1. 由于redis的sort排序仅支持一个字段进行升序或降序,那么可以考虑将一个字段变更为升序排序且由于我们这边是以考试为思路来设计所以可以考虑使用考试的最高分减去当前人的考试分数获取一个新的升序分数.
2. 同分数时我们需要按照考试是时长进行升序,由此我们可以思考将两个分数组装为一个double类型的分数来进行排序,由此我们可以进行尝试是否可行

准备测试数据

```text
# 我们使用hash来将各个数据进行存储
hmset exam_1_user:2001 examId 1 userId 2001 score 80 examTime 81 sortScore 20.81
hmset exam_1_user:2002 examId 1 userId 2002 score 82 examTime 83 sortScore 18.83
hmset exam_1_user:2003 examId 1 userId 2003 score 81 examTime 90 sortScore 19.90
hmset exam_1_user:2004 examId 1 userId 2004 score 90 examTime 80 sortScore 10.80
hmset exam_1_user:2005 examId 1 userId 2005 score 90 examTime 70 sortScore 10.70
hmset exam_1_user:2006 examId 1 userId 2006 score 90 examTime 90 sortScore 10.90

# 将其唯一值设置为外部列表进行存储且使用这个来进行存储
rpush exam_1_user_sort 2001 2002 2003 2004 2005 2006
```

我们使用sort将其进行排序后输出key

```text
sort exam_1_user_sort by exam_1_user:*->sortScore asc  get #

# 输出结果为:  2005 2004 2006 2002 2003 2001
# 和我们预期结果一致.
```

## 使用java来实现排行榜

redis工具类不会写的可以去看[redisUtil工具类](./redisUtils.md)

### 接收数据实体类

```java
package cn.moonlight.common.dto;

import cn.moonlight.common.util.ExamRankUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.util.HashMap;
import java.util.Map;

@Data
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class RedisRankDto {
    private Integer examId;
    private Integer userId;
    private Double score;
    private Integer examTime;
    private Double maxScore;

    public String getSortScore() {
        return String.valueOf((maxScore - score) + ((double) examTime / 100000));
    }

    public Map<String, String> toMap() {
        return new HashMap<String, String>() {{
            put("examId", String.valueOf(examId));
            put("userId", String.valueOf(userId));
            put("score", String.valueOf(score));
            put("examTime", String.valueOf(examTime));
            put(ExamRankUtil.SORT_SCORE, getSortScore());
        }};
    }
}
```

### 排行榜工具类

```java
package cn.moonlight.common.util;

import cn.moonlight.common.dto.RedisRankDto;
import org.springframework.data.redis.connection.SortParameters;
import org.springframework.data.redis.core.query.SortQuery;
import org.springframework.data.redis.core.query.SortQueryBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 考试排行榜工具类
 */
public class ExamRankUtil {
    /**
     * 过期时长 默认为一年,测试时请不要使用该参数
     */
    public static final long EXPIRE = 31536000;
    /**
     * 排行榜最大人数 -- 默认限制为50
     */
    public static final int MAX_RANK_NUMBER = 50;
    /**
     * 排行榜所存key,该字符串需要进行拼接
     * <p>
     * 1. 需要使用 String.format(RANK_KEY, examId); 拼接为本场考试使用的key
     * <p>
     * 2. 需要再后面拼接本场考试是谁的数据也就是 String.format(RANK_KEY, examId) + userId; 来区分是谁的数据
     */
    private static final String RANK_KEY = "exam_%d_user:";
    /**
     * 排序所用的key 同样需要使用 String.format(RANK_SOFT_KEY, examId); 来拼接为本场的数据
     */
    private static final String RANK_SORT_KEY = "exam_%d_user_sort";
    public static final String SORT_SCORE = "sortScore";
    private static final String RANK_SOFT_BY = RANK_KEY + "*->" + SORT_SCORE;


    /**
     * 根据考试ID获取对应的排行版数据
     *
     * @param examId 考试ID
     * @return List<Map < String, String>>
     */
    public static List<Map<String, String>> findRankByExamId(Integer examId) {
        String rankKey = String.format(RANK_KEY, examId);
        SortQuery<String> sortQuery = SortQueryBuilder.sort(String.format(RANK_SORT_KEY, examId))
                .by(String.format(RANK_SOFT_BY, examId))
                .order(SortParameters.Order.ASC)
                .build();
        List<String> sort = RedisUtil.sort(sortQuery);
        List<Map<String, String>> list = new ArrayList<>(MAX_RANK_NUMBER);
        for (int i = 0; i < sort.size(); i++) {
            Map<String, String> map = RedisUtil.hashEntries(rankKey + sort.get(i));
            map.put("rank", String.valueOf(i + 1));
            list.add(map);
        }
        return list;
    }

    /**
     * 给排行榜添加一个人员内部自动判断是否可以存在于排行榜中
     *
     * @param dto 排行榜数据
     */
    public static void addRank(RedisRankDto dto) {
        // 设置变量
        String SCORE = "score";
        String EXAM_TIME = "examTime";
        // 组装key
        String rankKey = String.format(RANK_KEY, dto.getExamId());
        // 使用模糊查询获取当前场考试所有用户的key
        List<String> matchingKeys = RedisUtil.findMatchingKeys(rankKey + "*");
        // 如果当前为空那么直接将本次数据添加进去即可
        if (matchingKeys.isEmpty()) {
            rankPutData(dto);
            return;
        }
        // 组装key
        String examUserRedisKey = String.format(RANK_KEY, dto.getExamId()) + dto.getUserId();
        // 如果exam_user在redis的hash表数据存在
        if (RedisUtil.hasKey(examUserRedisKey)) {
            // 获取hash表中所有数据
            Map<String, String> redisExamUser = RedisUtil.hashEntries(examUserRedisKey);
            // 只有当前分数大于redis中存储的分数或分数一直且时长更短时才更新数据
            if (dto.getScore() > Double.parseDouble(redisExamUser.get(SCORE)) ||
                    (Double.valueOf(redisExamUser.get(SCORE)).equals(dto.getScore()) &&
                            Double.parseDouble(redisExamUser.get(EXAM_TIME)) > dto.getExamTime())) {
                RedisUtil.hmSet(examUserRedisKey, SCORE, String.valueOf(dto.getScore()));
                RedisUtil.hmSet(examUserRedisKey, EXAM_TIME, String.valueOf(dto.getExamTime()));
                RedisUtil.hmSet(examUserRedisKey, SORT_SCORE, String.valueOf(dto.getSortScore()));
            }
            return;
        }
        // 如果当前redis不存在相同key且未超过排行榜最大人数时直接放入redis即可
        if (matchingKeys.size() < MAX_RANK_NUMBER) {
            rankPutData(dto);
            return;
        }
        // 排序key
        String rankSortKey = String.format(RANK_SORT_KEY, dto.getExamId());
        // 排序条件组装
        SortQuery<String> sortQuery = SortQueryBuilder.sort(rankSortKey)
                .by(String.format(RANK_SOFT_BY, dto.getExamId()))
                .order(SortParameters.Order.DESC)
                .build();
        // 获取排序后所有的key
        List<String> sort = RedisUtil.sort(sortQuery);
        for (String userId : sort) {
            String examUserRedisTempKey = rankKey + userId;
            Map<String, String> redisExamUser = RedisUtil.hashEntries(examUserRedisTempKey);
            double redisScore = Double.parseDouble(redisExamUser.get(SCORE));
            int examTime = Integer.parseInt(redisExamUser.get(EXAM_TIME));
            // 如果当前分数大于redis中存储的分数或分数一致且时长更短时移除当前redis中的数据且将当前数据存入redis中
            if (dto.getScore() > redisScore || (dto.getScore() == redisScore && examTime > dto.getExamTime())) {
                RedisUtil.del(examUserRedisTempKey);
                RedisUtil.lRemove(rankSortKey, userId);
                rankPutData(dto);
                break;
            }
        }
    }

    /**
     * 给Redis中push一条排行榜数据
     *
     * @param dto redis中需要push的数据
     */
    public static void rankPutData(RedisRankDto dto) {
        // 组装key
        String key = String.format(RANK_KEY, dto.getExamId()) + dto.getUserId();
        // 设置一张hash表数据
        RedisUtil.hmSet(key, dto.toMap());
        // 给定一个过期时间
        RedisUtil.expire(key, EXPIRE);
        // 给排序的列表添加当前的为一值
        RedisUtil.rightPush(String.format(RANK_SORT_KEY, dto.getExamId()), String.valueOf(dto.getUserId()), EXPIRE);
    }
}
```
