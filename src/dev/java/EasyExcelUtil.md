---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - 工具类
tag:
  - 工具类
  - java
---
# EasyExcel 工具类

## 创建相关注解

### FieldRequired

```java
import java.lang.annotation.*;

/**
 * 当前注解可以使用在类或成员变量上,请不要同时在类和成员变量上同时使用,同时使用会进行两次判断.
 * <P>
 * 在头部使用时表示当前所有成员变量都需要进行必填校验
 * <P>
 * 在成员变量上使用时表示当前成员变量需要进行必填校验
 * @author 黑色的小火苗
 *
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE,ElementType.FIELD})
public @interface FieldRequired {
}
```

### HeadVerification

```java
import java.lang.annotation.*;

/**
 * @author 黑色的小火苗
 * easyexcel 头校验
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface HeadVerification {
}
```

### NotFieldRequired

```java
import java.lang.annotation.*;

/**
 * 该字段只可以使用在字段上,和@FieldRequired注解搭配使用
 * <p>
 * 当@FieldRequired注解存在时,该注解可以使用在字段上,表示该字段不必须
 * <p>
 * ps: @FieldRequired注解放在class上是才起作用
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface NotFieldRequired {
}
```

### NotHeadRequired

```java
import java.lang.annotation.*;

/**
 * 该字段只可以使用在字段上,和@HeadVerification注解搭配使用
 * <p>
 * 当@HeadVerification注解在类上存在时,该注解在字段上使用会将其认为不需要进行校验的行头参数
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface NotHeadRequired {
}
```

## 工具类

```java
import cn.moonlight.common.excel.interfaces.FieldRequired;
import cn.moonlight.common.excel.interfaces.HeadVerification;
import cn.moonlight.common.excel.interfaces.NotFieldRequired;
import cn.moonlight.common.excel.interfaces.NotHeadRequired;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.fastjson2.JSON;
import com.alibaba.fastjson2.JSONObject;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EasyExcelUtil {

    /**
     * 校验请求头,如果多行请求头
     *
     * @param headCellMap 当前行头数据
     * @param context     行
     */
    public static void verificationHead(Map<Integer, ReadCellData<?>> headCellMap, AnalysisContext context) {
        Map<Integer, String> headMap = getHeadMap(context.readWorkbookHolder().getClazz());
        if (headMap == null) return;
        if (headCellMap.size() != headMap.size()) throw new RuntimeException("请检查导入模板是否正确!");
        headCellMap.forEach((k, v) -> {
            if (!v.getStringValue().equals(headMap.get(k))) throw new RuntimeException("请检查导入模板是否正确!");
        });
    }

    /**
     * 校验请求头,如果多行请求头
     *
     * @param headNumber  需要校验的行头是第几行? 从0开始
     * @param headCellMap 当前行头数据
     * @param context     行
     */
    public static void verificationHead(Map<Integer, ReadCellData<?>> headCellMap, AnalysisContext context, Integer headNumber) {
        if (context.readRowHolder().getRowIndex() < headNumber) return;
        Map<Integer, String> headMap = getHeadMap(context.readWorkbookHolder().getClazz());
        if (headMap == null) return;
        if (headCellMap.size() != headMap.size()) throw new RuntimeException("请检查导入模板是否正确!");
        headCellMap.forEach((k, v) -> {
            if (!v.getStringValue().equals(headMap.get(k))) throw new RuntimeException("请检查导入模板是否正确!");
        });
    }

    /**
     * 通过传入要校验的必填字段来判断都是那些字段需要进行校验
     *
     * @param fieldNames 必填字段
     * @param t          本次需校验的数据
     * @param <T>        泛型
     */
    public static <T> boolean verificationData(List<String> fieldNames, T t) {
        if (fieldNames.isEmpty()) return true;
        boolean success = true;
        JSONObject json = JSON.parseObject(JSON.toJSONString(t));
        for (String fileName : fieldNames) {
            String fileValue = json.getString(fileName);
            success = fileValue == null || fileValue.isEmpty();
        }
        return success;
    }

    /**
     * @param fieldNames 必填参数
     * @param t          当前行数据据
     * @param <T>        泛型
     * @return Map<Boolean, List < String>> 错误行数据
     */
    public static <T> Map<Boolean, List<String>> verificationData(Map<String, String> fieldNames, T t) {
        Map<Boolean, List<String>> map = new HashMap<>();
        if (fieldNames.isEmpty()) return map;
        JSONObject json = JSON.parseObject(JSON.toJSONString(t));
        List<String> fields = new ArrayList<>();
        for (Map.Entry<String, String> field : fieldNames.entrySet()) {
            String fileValue = json.getString(field.getKey());
            if (fileValue == null || fileValue.isEmpty()) {
                fields.add(field.getValue());
            }
        }
        if (!fields.isEmpty()) map.put(false, fields);
        return map;
    }

    /**
     * 使用反射获取实体类的excel表头,与导入的表头进行对应校验来验证模板是否一致
     *
     * @param clazz 需要校验的class
     */
    public static Map<Integer, String> getHeadMap(Class<?> clazz) {
        // 如果当前要读取的类没有表头校验注解，则返回空
        if (!clazz.isAnnotationPresent(HeadVerification.class)) return null;
        Map<Integer, String> map = new HashMap<>();
        Field[] fields = clazz.getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            field.setAccessible(true);
            if (field.isAnnotationPresent(ExcelProperty.class) && !field.isAnnotationPresent(NotHeadRequired.class)) {
                String[] value = field.getAnnotation(ExcelProperty.class).value();
                map.put(i, value[value.length - 1]);
            }
        }
        return map;
    }


    /**
     * @param clazz 通过class获获取需要必填校验的字段
     * @return 必填字段List
     */
    public static List<String> getFieldNames(Class<?> clazz) {
        List<String> list = new ArrayList<>();
        Field[] fields = clazz.getDeclaredFields();
        if (clazz.isAnnotationPresent(FieldRequired.class)) {
            for (Field field : fields) {
                field.setAccessible(true);
                if (field.isAnnotationPresent(ExcelProperty.class) && !field.isAnnotationPresent(NotFieldRequired.class)) {
                    list.add(field.getName());
                }
            }
            return list;
        }
        // 如果走到这里就是没有在导入类上添加 @ExcelFieldVerification,那么就判断字段上是否存在 @ExcelFieldVerification 注解
        for (Field field : fields) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(FieldRequired.class)) {
                list.add(field.getName());
            }
        }
        return list;
    }

    /**
     * @param clazz 通过class获获取需要必填校验的字段
     * @return 必填字段List
     */
    public static Map<String, String> getFieldNameMap(Class<?> clazz) {
        Map<String, String> map = new HashMap<>();
        Field[] fields = clazz.getDeclaredFields();
        if (clazz.isAnnotationPresent(FieldRequired.class)) {
            for (Field field : fields) {
                field.setAccessible(true);
                if (field.isAnnotationPresent(ExcelProperty.class) && !field.isAnnotationPresent(NotFieldRequired.class)) {
                    map.put(field.getName(), field.getAnnotation(ExcelProperty.class).annotationType().getName());
                }
            }
            return map;
        }
        // 如果走到这里就是没有在导入类上添加 @ExcelFieldVerification,那么就判断字段上是否存在 @ExcelFieldVerification 注解
        for (Field field : fields) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(FieldRequired.class)) {
                map.put(field.getName(), field.getAnnotation(ExcelProperty.class).annotationType().getName());
            }
        }
        return map;
    }
}
```

## 示例Listener

```java
import cn.moonlight.common.excel.util.EasyExcelUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.read.listener.ReadListener;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 简易的示例监听器,本监听器智能校验参数是否必填,其他无法处理,如需其他处理请可以复制当前监听器后重写即可.
 *
 * @author 黑色的小火苗
 */

@Getter
public class EasyListener<T> implements ReadListener<T> {
    private final List<T> errorList;
    private final List<T> successList;

    public EasyListener() {
        errorList = new ArrayList<>();
        successList = new ArrayList<>();
    }


    @Override
    public void invoke(T t, AnalysisContext context) {
        List<String> fieldNames = EasyExcelUtil.getFieldNames(context.readWorkbookHolder().getClazz());
        if (!fieldNames.isEmpty() && EasyExcelUtil.verificationData(fieldNames, t)) {
            errorList.add(t);
            return;
        }
        successList.add(t);
    }

    @Override
    public void invokeHead(Map<Integer, ReadCellData<?>> headCellMap, AnalysisContext context) {
        EasyExcelUtil.verificationHead(headCellMap, context);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {}
}
```
