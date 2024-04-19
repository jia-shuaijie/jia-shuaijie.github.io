# poi-tl

[官网地址: http://deepoove.com/poi-tl/](http://deepoove.com/poi-tl/)

导入依赖

```xml
<!--    poi-tl start    -->
        <dependency>
            <groupId>com.deepoove</groupId>
            <artifactId>poi-tl</artifactId>
            <version>1.10.3</version>
            <exclusions>
                <exclusion>
                    <groupId>org.apache.poi</groupId>
                    <artifactId>poi-ooxml</artifactId>
                </exclusion>
            </exclusions>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>ooxml-schemas</artifactId>
            <version>1.4</version>
        </dependency>

        <dependency>
            <groupId>io.github.draco1023</groupId>
            <artifactId>poi-tl-ext</artifactId>
            <version>0.3.3</version>
            <exclusions>
                <exclusion>
                    <groupId>com.deepoove</groupId>
                    <artifactId>poi-tl</artifactId>
                </exclusion>
                <exclusion>
                    <groupId>org.apache.poi</groupId>
                    <artifactId>ooxml-schemas</artifactId>
                </exclusion>
            </exclusions>
        </dependency>

        <!--    poi-tl end    -->
```

## 工具类

```java
import com.deepoove.poi.XWPFTemplate;
import com.deepoove.poi.config.Configure;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

/**
* @author sunset@黑色的小火苗
* @create: 2023-05-28 16:50
*/
public class WordUtil {
    /**
    * 创建Word文档
    *
    * @param stream 输入流
    * @param config 模板绑定的配置
    * @param data   模板所需数据
    * @return byte[]
    * @throws IOException 可能会出现IO错误
    */
    public byte[] createWord(InputStream stream, Configure config, Map<String, Object> data) throws IOException {
        XWPFTemplate template = XWPFTemplate.compile(stream, config).render(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        template.writeAndClose(outputStream);
        template.close();
        return outputStream.toByteArray();
    }
}
```

## 案例

1. 创建输出时案例对象

    ```java
    import com.deepoove.poi.data.PictureRenderData;
    import lombok.Data;
    import lombok.experimental.Accessors;

    import java.util.List;
    import java.util.Map;

    /**
    * Word 生成案例实体
    *
    * @author sunset@黑色的小火苗
    * @create: 2023/6/10 - 18:01
    */
    @Data
    @Accessors(chain = true)
    public class UserWordDemo {

        private String userName;

        /**
        * 例如库中图片地址
        */
        private String imgUrl;

        /**
        * 实际输出的图片
        */
        private PictureRenderData img;
        /**
        * 例如库中图片地址
        */
        private List<String> imgUrlList;


        /**
        * 当一个对象存在多个图片时处理
        */
        private List<Map<String,PictureRenderData>> imgList;
    }
    ```

2. 演示示例

    ```java
    import com.deepoove.poi.config.Configure;
    import com.deepoove.poi.data.PictureRenderData;
    import com.deepoove.poi.data.Pictures;
    import com.deepoove.poi.plugin.table.LoopRowTableRenderPolicy;
    import com.sunset.common.util.WordUtil;
    import org.junit.Test;
    import org.springframework.core.io.ClassPathResource;

    import java.io.File;
    import java.io.FileOutputStream;
    import java.io.IOException;
    import java.io.InputStream;
    import java.util.ArrayList;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;

    /**
    * @author sunset@黑色的小火苗
    * @create: 2023/6/10 - 18:05
    */
    public class WordDemoTest {

        /**
        * 测试生成 Word
        */
        @Test
        public void testGenerateWord() throws IOException {
            // 1. 读取模板,获取模板输入流
            InputStream inputStream = new ClassPathResource("templates/test.docx").getInputStream();

            // 绑定模板配置
            LoopRowTableRenderPolicy rowPolicy = new LoopRowTableRenderPolicy(true); // 循环时在同一行进行循环
            Configure config = Configure.builder()
                    .bind("users", rowPolicy) // 绑定列表
                    .bind("imgList", rowPolicy) // 绑定列表
                    .useSpringEL(true) // 开启Spring表达式
                    .build();
            // 模板标签与数据进行绑定
            Map<String, Object> data = new HashMap<>();
            // 循环给 demoList设置数据 这里就不写了
            data.put("users", getDemoList());
            // 调用方法
            byte[] wordBytes = WordUtil.createWord(inputStream, config, data);
            // 输出到文件
            FileOutputStream fos = new FileOutputStream(new File("D:\\data\\temp\\test.docx"));
            fos.write(wordBytes);
            fos.flush();
            fos.close();
        }

        /**
        * 生成需要的对象 <br/>
        * 读取本地图片使用 Pictures.ofStream("localImgPath")  [ localImgPath 本地图片所在地址 ]<br/>
        * 读取网络图片使用 Pictures.ofUrl("HttpUrl") [ HttpUrl 网络URl路径 ]<br/>
        * <br/>
        * 当循环行中某一列中需要渲染多个图片/文字时 按当前示例这么做就可以 <br/>
        *
        * @return List<UserWordDemo>
        */
        private List<UserWordDemo> getDemoList() throws IOException {
            List<UserWordDemo> demoList = new ArrayList<>();
            for (int i = 0; i < 5; i++) {
                // 当循环行时在一列中生成多个图片/文字时按这种方式可以循环渲染
                List<Map<String, PictureRenderData>> imgList = new ArrayList<>();
                Map<String, PictureRenderData> map = new HashMap<>();
                map.put("img1", Pictures.ofStream(new ClassPathResource("static/2.jpg").getInputStream()).size(100, 100).create());
                imgList.add(map);
                Map<String, PictureRenderData> map1 = new HashMap<>();
                map1.put("img1", Pictures.ofStream(new ClassPathResource("static/2.jpg").getInputStream()).size(100, 100).create());
                imgList.add(map1);

                UserWordDemo userWordDemo = new UserWordDemo()
                        .setUserName("测试用户名" + i)
                        .setImg(Pictures.ofStream(new ClassPathResource("static/1.jpg").getInputStream()).size(100, 100).create())
                        .setImgList(imgList);
                demoList.add(userWordDemo);
            }
            return demoList;
        }
    }
    ```

3. 模板图片与生成的图片
    模板图片
    ![1.png](https://s2.loli.net/2023/09/25/mOb8A2ydWplT7kx.png)

    生成的图片
    ![2.png](https://s2.loli.net/2023/09/25/VEtNjA5sMKlwTgG.png)
