---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# springBoot统一数据返回类

## code枚举类

```java
public enum ResultCode {

    OK(200, "OK"),
    ERROR_CODE(-1, "请求失败"),

    public final int code;
    public final String msg;

    ResultCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
```

## 统一返回数据类

```java
import lombok.Getter;

import java.io.Serializable;

/**
 * 统一的 HTTP 响应格式。<br/>
 * code 为 "ok" 表示业务调用成功，否则是失败的错误码，如果有多个则以逗号分隔。<br/>
 * data 是业务数据，如果失败了则是 null。
 * <p/>
 */
@Getter
public class ResponseBo<T> implements Serializable {

    /**
     * 响应码
     */
    private final int code;
    /**
     * 错误信息
     */
    private final String message;
    /**
     * 相应数据
     */
    private final T data;

    private ResponseBo(int code, String message, T data) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public static ResponseBo<?> error() {
        return error(ResultCode.ERROR_CODE, null);
    }

    public static <T> ResponseBo<T> error(String msg) {
        return error(ResultCode.ERROR_CODE, msg);
    }

    public static <T> ResponseBo<T> error(ResultCode code, String msg) {
        return all(code, msg, null);
    }

    public static <T> ResponseBo<T> error(ResultCode code) {
        return all(code, code.msg, null);
    }

    public static ResponseBo<?> ok() {
        return all(ResultCode.OK, null, null);
    }

    public static <T> ResponseBo<T> ok(T data) {
        return all(ResultCode.OK, null, data);
    }


    /**
     * 全参数自定义
     *
     * @param enumCode 错误的枚举
     * @param data     返回的数据实体
     * @param message  错误信息
     * @param <T>      泛型
     * @return ResponseBo<T>
     */
    public static <T> ResponseBo<T> all(ResultCode enumCode, String message, T data) {
        return new ResponseBo<>(enumCode.code, message, data);
    }
}
```
