---
icon: book
date: 2024-07-03
category:
  - 后端开发
  - 工具类
tag:
  - 工具类
  - java
---
# httpClient

我们在使用HttpClient有时候会不知道该怎么使用,甚至与不好找到对应的api来使用.

这里我将简单的请求进行了一些封装,变成一个简单的工具类来使用

> 引入依赖

```xml
<!-- 版本根据自己需要使用,我这里使用的是5.2.1 -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
    <version>5.2.1</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.32</version>
</dependency>
```

## 封装实体类和枚举类

### HttpType枚举

```java
public enum HttpType {
    GET, POST, PUT, DELETE, HEAD, OPTIONS, TRACE, CONNECT;
}
```

### HttpResponse(返回实体)

```java
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.Header;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.NameValuePair;
import org.apache.hc.core5.http.io.entity.EntityUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
public class HttpResponse {

    /**
     * -- GETTER --
     * 获取所有的响应头
     */
    @Getter
    private Map<String, String> headers;

    private byte[] body;

    public byte[] getBody() {
        return body;
    }

    public String getBodyString() {
        return new String(body, StandardCharsets.UTF_8);
    }

    public boolean getBodyToFile(String filenamePath) {
        File file = new File(filenamePath);
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(body);
            fos.flush();
            return true;
        } catch (IOException e) {
            log.error("[ httpClient ] 请求文件流输出为文件时出现异常: ", e);
            return false;
        }

    }

    public void setBody(HttpEntity body) throws IOException {
        this.body = EntityUtils.toByteArray(body);
    }

    /**
     * 获取响应头
     *
     * @param name 头名
     * @return 头值
     */
    public String getHeader(String name) {
        return headers.get(name);
    }

    public void setHeaders(Header[] headers) {
        this.headers = Arrays.stream(headers).collect(Collectors.toMap(NameValuePair::getName, NameValuePair::getValue));
    }
}
```

## 组织请求体

```java
import org.apache.hc.client5.http.classic.methods.*;
import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.entity.UrlEncodedFormEntity;
import org.apache.hc.core5.http.*;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.apache.hc.core5.http.message.BasicNameValuePair;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class HttpRequestBuilder {
    private HttpUriRequestBase request;

    public static HttpRequestBuilder builder() {
        return new HttpRequestBuilder();
    }

    /**
     * 设置请求方式
     *
     * @param method 请求方式
     * @param uri    请求地址
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder uri(HttpType method, String uri) {
        switch (method) {
            case GET:
                this.request = new HttpGet(uri);
                break;
            case POST:
                this.request = new HttpPost(uri);
                break;
            case PUT:
                this.request = new HttpPut(uri);
                break;
            case DELETE:
                this.request = new HttpDelete(uri);
                break;
        }
        return this;
    }

    /**
     * 设置请求参数
     *
     * @param param 请求参数 GET请求方式：?key=value
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder setQueryParam(Map<String, String> param) {
        List<NameValuePair> params = param.entrySet()
                .stream()
                .map((item) -> new BasicNameValuePair(item.getKey(), item.getValue()))
                .collect(Collectors.toList());
        this.request.setEntity(new UrlEncodedFormEntity(params));
        return this;
    }

    /**
     * 设置请求体
     *
     * @param jsonBody json字符串 POST请求方式
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder setJsonBody(String jsonBody) {
        this.request.setEntity(new StringEntity(jsonBody, ContentType.APPLICATION_JSON));
        return this;
    }

    /**
     * 设置请求头
     *
     * @param headerName  请求头名称
     * @param headerValue 请求头值
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder header(String headerName, Object headerValue) {
        this.request.setHeader(headerName, headerValue);
        return this;
    }

    /**
     * 设置请求头
     *
     * @param map 请求头
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder headers(Map<String, Object> map) {
        map.forEach((k, v) -> this.request.setHeader(k, v));
        return this;
    }

    /**
     * 添加请求配置
     *
     * @param config 请求配置
     * @return HttpRequestBuilder
     */
    public HttpRequestBuilder setConfig(RequestConfig config) {
        this.request.setConfig(config);
        return this;
    }

    /**
     * 构建请求
     *
     * @return HttpRequest
     */
    public ClassicHttpRequest build() {
        return this.request;
    }
}
```

## 工具类

```java
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ClassicHttpRequest;

import java.io.IOException;

@Slf4j
public class HttpClientUtils {

    /**
     * get请求
     *
     * @param uri 请求地址
     * @return HttpResponse
     * @throws IOException 当请求出现异常时抛出IOException
     */
    public static HttpResponse get(String uri) throws IOException {
        ClassicHttpRequest request = HttpRequestBuilder.builder().uri(HttpType.GET, uri).build();
        return execute(request);
    }

    /**
     * post请求
     *
     * @param uri 请求地址
     * @return HttpResponse
     * @throws IOException 当请求出现异常时抛出IOException
     */
    public static HttpResponse post(String uri) throws IOException {
        ClassicHttpRequest request = HttpRequestBuilder.builder().uri(HttpType.POST, uri).build();
        return execute(request);
    }

    /**
     * 请求执行使用方法
     *
     * @param request 请求体
     * @return HttpResponse
     * @throws IOException 当请求出现异常时抛出IOException
     */
    public static HttpResponse execute(ClassicHttpRequest request) throws IOException {
        return HttpClients.createDefault().execute(request, response -> {
            HttpResponse result = new HttpResponse();
            result.setHeaders(response.getHeaders());
            result.setBody(response.getEntity());
            System.out.println();
            return result;
        });
    }
}

```

> 这个工具类其实可以不要用上面的建造者模式的`HttpRequestBuilder`生成出HttpRequest后之间进行执行也可以.
> 执行方法可以参考这里的execute方法.
