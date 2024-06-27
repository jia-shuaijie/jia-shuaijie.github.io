---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# 全局异常拦截器

我们也可以拦截自定义的异常类,下面是一个异常类的demo

```java
public class RsaException extends RuntimeException {
    public RsaException(String message) {
        super(message);
    }
}
```

全局拦截异常案例

```java
import cn.moonlight.exception.ExcelException;
import cn.moonlight.exception.RsaException;
import cn.moonlight.response.ResponseBo;
import cn.moonlight.response.ResultCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Objects;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RsaException.class)
    public ResponseBo<?> rasException(RsaException e) {
        log.error("异常信息：{}，{}", e.getMessage(), e.getClass());
        return ResponseBo.error(ResultCode.EXCEL_ERROR, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseBo<?> bindException(MethodArgumentNotValidException e) {
        log.error("异常信息：{}，{}", e.getMessage(), e.getClass());
        return ResponseBo.error(Objects.requireNonNull(e.getBindingResult().getFieldError()).getDefaultMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseBo<?> handleException(Exception exception) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        exception.printStackTrace(new PrintStream(byteArrayOutputStream));
        log.info(byteArrayOutputStream.toString());
        log.error("异常信息：" + exception.getMessage());
        return ResponseBo.error(ResultCode.ERROR_CODE, exception.getMessage());
    }

}
```
