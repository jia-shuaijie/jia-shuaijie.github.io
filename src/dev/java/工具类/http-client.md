---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - 工具类
tag:
  - 工具类
  - java
---
# httpClient

## 引入依赖

```xml
<!-- 版本根据自己需要使用,我这里使用的是5.2.1 -->
<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
    <artifactId>httpclient5</artifactId>
    <version>5.2.1</version>
</dependency>
```

## HttpClient 发起请求

```java
@Slf4j
public class HttpClientUtil {
    /**
     * 因为没有设置请求头等数据,所以简单请求可以封装一下
     */
    public static String get(String url) {
        CloseableHttpClient client = HttpClients.createDefault();
        ClassicHttpRequest build = ClassicRequestBuilder.get(url).build();

        try {
          return client.execute(build, response -> {
              if (response.getCode() == 200) {
                  return EntityUtils.toString(response.getEntity());
              }
              return "";

          });
      } catch (IOException e) {
          log.info("[ HTTP GET ] 请求失败!");
          return "";
      }
    }

    /**
     * HttpPost简单请求
     *
     * @param uri  请求地址
     * @param data 请求参数
     * @return String 类型的字符串
     */
    public static String post(String uri, List<BasicNameValuePair> data) {
        CloseableHttpClient client = HttpClients.createDefault();
        ClassicHttpRequest httpPost = ClassicRequestBuilder.post(uri)
                .setEntity(new UrlEncodedFormEntity(data))
                .build();
        try {
            client.execute(httpPost, response -> {
                if (response.getCode() == 200) {
                    return EntityUtils.toString(response.getEntity());
                }
                return "";
            });
        } catch (IOException e) {
            log.info("[ HTTP POST ] 请求失败!");
        }
        return "";
    }

}
```
