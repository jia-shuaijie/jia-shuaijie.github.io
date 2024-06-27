---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# Mybatis字段自动注入

## 提取公共字段

```java
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class BaseEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 创建人
     */
    @TableField(value = "creator", fill = FieldFill.INSERT)
    private Integer creator;

    /**
     * 更新人
     */
    @TableField(value = "updater", fill = FieldFill.UPDATE)
    private Integer updater;

    /**
     * 创建时间
     * <p>
     * FieldFill.INSERT 仅在插入时进行处理
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     * <p>
     * FieldFill.UPDATE 仅在更新时进行处理
     * </p>
     * FieldFill.INSERT_UPDATE 更新和插入时都进行处理
     * </p>
     * 未指定 FieldFill 时是不会进行自动注入的
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @TableField(value = "update_time", fill = FieldFill.UPDATE)
    private LocalDateTime updateTime;

    /**
     * 是否删除 0: 使用中 1: 已删除
     */
    private Integer del;
}
```

## 自动注入类

```java
import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
public class MybatisMetaObjectHandler implements MetaObjectHandler {
    static final ThreadLocal<Integer> THREAD_LOCAL = new ThreadLocal<>();

    @Override
    public void insertFill(MetaObject metaObject) {
        this.setFieldValByName("createTime", LocalDateTime.now(), metaObject);
        if (null != THREAD_LOCAL.get()) {
            this.setFieldValByName("creator", THREAD_LOCAL.get(), metaObject);
        } else {
            this.setFieldValByName("creator", 0, metaObject);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.setFieldValByName("updateTime", LocalDateTime.now(), metaObject);
        if (null != THREAD_LOCAL.get()) {
            this.setFieldValByName("updater", THREAD_LOCAL.get(), metaObject);
        } else {
            this.setFieldValByName("updater", 0, metaObject);
        }

    }
}
```

> ps: 自动注入类中的用户ID需要在拦截器中进行设置,因为拦截器优先级较高.
