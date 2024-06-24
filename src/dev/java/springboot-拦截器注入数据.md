---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - spring系列
tag:
  - java
---
# SpringBoot 拦截器注入数据

## 创建注解

```java
import java.lang.annotation.*;

@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface CurrentUser {}
```

## 创建拦截器

```java
/**
 * redis 中存在的key
 */
public class KeyConstant {

    public final static String REQUEST_HEADER_TOKEN_KEY = "token";
    public final static String USER_SESSION_KEY = "CARBON_TOKEN_";
    public final static long TOKEN_TIMEOUT = 86400;
    public final static String CURRENT_USER_KEY = "CURRENT_USER";
    public final static String NOW_CARBON_PRICE = "NOW_CARBON_PRICE_";


}

import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Slf4j
@Component
public class HeaderResolveInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        try {
            //获取当前用户redis session, UserSession 就是我们在redis中存储的数据.具体怎么从redis获取可以根据自己情况进行获取
            Integer userId = TokenUtil.getUserId(request.getHeader(KeyConstant.REQUEST_HEADER_TOKEN_KEY));
            MybatisMetaObjectHandler.THREAD_LOCAL.set(userId);
            UserSession userSession = JSONObject.parseObject((String) RedisUtil.get(KeyConstant.USER_SESSION_KEY + userId), UserSession.class);
            log.info("[ preHandle ] 获取的 userSession 为: {}", userSession);
            if (userSession != null) {
                //绑定到request
                request.setAttribute(KeyConstant.CURRENT_USER_KEY, userSession);
            }
        } catch (Exception e) {
            log.error("解析请求头失败:{}", e.toString());
        }
        return true;
    }
}
```

## 接口注入数据

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Slf4j
@Component
public class UserAnnotationArgumentResolver implements HandlerMethodArgumentResolver {
    /**
     * 判断当前请求方法中是否存在 @CurrUser/@CurrOrg 注解,存在则返回 true 不存在则返回 false
     *
     * @param methodParameter 参数集合
     * @return 存在则返回 true 不存在则返回 false
     */
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.hasParameterAnnotation(CurrentUser.class) && methodParameter.getParameterType().equals(UserSession.class);
    }

    /**
     * @param methodParameter       入参集合
     * @param modelAndViewContainer model 和 view
     * @param nativeWebRequest      web相关
     * @param webDataBinderFactory  入参解析
     * @return 参数值
     */
    @Override
    public Object resolveArgument(MethodParameter methodParameter, ModelAndViewContainer modelAndViewContainer, NativeWebRequest nativeWebRequest, WebDataBinderFactory webDataBinderFactory) {
        CurrentUser currUser = methodParameter.getParameterAnnotation(CurrentUser.class);
        UserSession session = (UserSession) nativeWebRequest.getAttribute(KeyConstant.CURRENT_USER_KEY, RequestAttributes.SCOPE_REQUEST);
        log.info(" [ resolveArgument ] 获取的 userSession 为: {}", session);
        if (null != currUser && null != session) {
            return session;
        }
        return null;
    }
}
```

## 将拦截器进行注册

```java
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
            "/swagger-resources", "/swagger-resources/configuration/ui", "/doc.html");

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(headerResolveInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(exclude_path);
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        // 这里切记使用的是new而不是spring管理的实体,否则会注入失败. 
        resolvers.add(new UserAnnotationArgumentResolver());
    }
}
```
