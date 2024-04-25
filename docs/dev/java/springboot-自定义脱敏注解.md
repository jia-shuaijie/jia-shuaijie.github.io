# springBoot实现自定义脱敏注解

## 创建脱敏枚举

```java
/**
 * 隐私数据类型枚举
 */
public enum PrivacyTypeEnum {
    /**
     * 身份证号
     */
    ID_CARD("(\\d{4})\\d{10}(\\w{4})", "$1*****$2"),

    /**
     * 手机号
     */
    PHONE("(\\d{3})\\d{4}(\\d{4})", "$1****$2"),

    /**
     * 邮箱
     */
    EMAIL("(\\w?)(\\w+)(\\w)(@\\w+\\.[a-z]+(\\.[a-z]+)?)", "$1****$3$4");

    public final String regex;
    public final String replacement;


    PrivacyTypeEnum(String regex, String replacement) {
        this.regex = regex;
        this.replacement = replacement;
    }
}
```

## 创建脱敏注解处理类

```java
import cn.moonlight.common.enums.PrivacyTypeEnum;
import cn.moonlight.common.interfaces.PrivacyEncrypt;
import cn.moonlight.common.util.StringUtil;
import com.alibaba.excel.util.StringUtils;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.ContextualSerializer;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Objects;

@Slf4j
@NoArgsConstructor
@AllArgsConstructor
public class PrivacySerializer extends JsonSerializer<String> implements ContextualSerializer {
    private PrivacyEncrypt encrypt;


    @Override
    public com.fasterxml.jackson.databind.JsonSerializer<?> createContextual(SerializerProvider prov, BeanProperty property) throws JsonMappingException {
        // 如果bean为null那么直接设置为null
        if (property == null) {
            return prov.findNullValueSerializer(null);
        }
        // 如果不是String类型或者当前属性没有脱敏注解那么直接设置为原始处理的BeanProperty
        PrivacyEncrypt privacyEncrypt = property.getAnnotation(PrivacyEncrypt.class);
        if (!Objects.equals(property.getType().getRawClass(), String.class) || privacyEncrypt == null) {
            return prov.findNullValueSerializer(property);
        }
        // 走到这里说明是String类型且存在脱敏注解那么将脱敏注解设置为当前String的处理就好
        return new PrivacySerializer(privacyEncrypt);
    }

    @Override
    public void serialize(String value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        // 如果值为空那么直接退出不再处理
        if (StringUtils.isBlank(value)) return;

        // 如果处理类型不为空那么根据处理类型进行处理
        if (encrypt.type() != null) {
            PrivacyTypeEnum privacyTypeEnum = encrypt.type();
            gen.writeString(value.replaceAll(privacyTypeEnum.regex, privacyTypeEnum.replacement));
            return;
        }

        // 如果处理类型为空那么根据正则表达式和替换字符串进行处理
        if (StringUtils.isNotBlank(encrypt.regex()) && StringUtils.isNotBlank(encrypt.replacement())) {
            gen.writeString(value.replaceAll(encrypt.regex(), encrypt.replacement()));
            return;
        }

        // 如果处理类型为空且正则表达式和替换字符串都为空那么根据前缀不脱敏长度和后缀不脱敏长度进行处理
        if (encrypt.prefixNoMaskLen() >= 0 && encrypt.suffixNoMaskLen() > 0) {
            gen.writeString(StringUtil.privacyEncrypt(value, encrypt.prefixNoMaskLen(), encrypt.suffixNoMaskLen(),
                    encrypt.symbol()));
        }

    }
}
```

## 创建脱敏注解

```java
import cn.moonlight.common.enums.PrivacyTypeEnum;
import cn.moonlight.common.serializer.PrivacySerializer;
import com.fasterxml.jackson.annotation.JacksonAnnotationsInside;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 自定义数据脱敏注解
 */
@Target(ElementType.FIELD) // 作用在字段上
@Retention(RetentionPolicy.RUNTIME) // class文件中保留，运行时也保留，能通过反射读取到
@JacksonAnnotationsInside // 表示自定义自己的注解PrivacyEncrypt
@JsonSerialize(using = PrivacySerializer.class) // 该注解使用序列化的方式
public @interface PrivacyEncrypt {

    /**
     * 脱敏数据类型（没给默认值，所以使用时必须指定type）
     */
    PrivacyTypeEnum type();

    /**
     * 正则表达式
     */
    String regex() default "";

    /**
     * 表达式替换
     */
    String replacement() default "";

    /**
     * 前置不需要打码的长度
     */
    int prefixNoMaskLen() default 0;

    /**
     * 后置不需要打码的长度
     */
    int suffixNoMaskLen() default 0;

    /**
     * 用什么打码
     */
    char symbol() default '*';

}
```
