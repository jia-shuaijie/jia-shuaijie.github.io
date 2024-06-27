---
icon: book
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# springBoot配置swagger

本文使用的是knife4j(页面好看!!)

导入依赖

```xml
    <!--region swagger-knife4j-->
    <dependency>
        <groupId>com.github.xiaoymin</groupId>
        <artifactId>knife4j-openapi2-spring-boot-starter</artifactId>
        <version>${knife4j.version}</version>
    </dependency>
    <!--endregion-->
```

## swaggerConfig

```java
import com.github.xiaoymin.knife4j.spring.annotations.EnableKnife4j;
import io.swagger.annotations.ApiOperation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2WebMvc;

@EnableKnife4j
@Configuration
@EnableSwagger2WebMvc
public class SwaggerConfig {

    /**
     * 创建API
     */
    @Bean()
    public Docket createRestApi() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(apiInfo())
                .host("https://127.0.0.1:8001")
                .groupName("0.1 版本")
                .select()
                .apis(RequestHandlerSelectors.withMethodAnnotation(ApiOperation.class))
                .paths(PathSelectors.any())
                .build();
    }

    /**
     * 添加摘要信息
     */
    private ApiInfo apiInfo() {
        Contact contact = new Contact("黑色的小火苗", "https://test.com/test", "test@163.com");
        // 用ApiInfoBuilder进行定制
        return new ApiInfoBuilder()
                // 设置标题
                .title("月光后台接口服务")
                // 描述
                .description("描述：月光后台接口服务")
                // 作者信息
                .version("0.1")
                .contact(contact)
                .build();
    }
}
```

## webConfig配置swagger

```java
import cn.moonlight.framework.interceptor.HeaderResolveInterceptor;
import cn.moonlight.framework.interceptor.AuthorityInterceptor;
import cn.moonlight.framework.resolver.UserAnnotationArgumentResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;


@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {
    private final AuthorityInterceptor authorityInterceptor;
    private final HeaderResolveInterceptor headerResolveInterceptor;

    private static final List<String> exclude_path = Arrays.asList("/login/*", "/error",
            "/swagger-resources", "/swagger-resources/configuration/ui", "/doc.html", "/webjars/css/**", "/webjars/js/**", "/favicon.ico");

    /**
     * 接口放开以下接口的访问
     */
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authorityInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(exclude_path);
        registry.addInterceptor(headerResolveInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(exclude_path);
    }

    /**
     * 放开以下静态资源的访问
     */
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //  swagger配置
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
        registry.addResourceHandler("/swagger-ui.html", "doc.html")
                .addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

}
```
