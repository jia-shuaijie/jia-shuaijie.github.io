import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',

  theme: defaultTheme({
    logo: 'https://i.postimg.cc/Y0Jfvw7P/head1.jpg',
    navbar: [
      {
        text: 'Java',
        link: '/dev/java/spring'
      },
      {
        text: '数据库',
        link: '/dev/sql/mysql'
      },
      {
        text: '前端',
        link: '/dev/web-page'
      },
      {
        text: '软件安装',
        link: '/install/linux/emqx'
      },
      {
        text: '收集',
        link: '/collect/url'
      },
    ],
    sidebar: {
      "/dev/java/": [
        {
          text: 'spring系列',
          collapsible: true,
          children: [
            '/dev/java/spring',
            '/dev/java/maven.md',
            '/dev/java/mybatis.md',
            '/dev/java/springSSM整合.md',
            '/dev/java/mybatis字段自动注入.md',
            '/dev/java/springboot定时任务.md',
            '/dev/java/springboot-统一数据返回类.md',
            '/dev/java/springboot-swagger.md',
            '/dev/java/springboot-自定义脱敏注解.md',
            '/dev/java/springboot-处理类-全局异常处理类.md',
            '/dev/java/springboot-拦截器注入数据.md',
          ],
        }, {
          text: '工具类',
          collapsible: true,
          children: [
            '/dev/java/poi-tl.md',
            '/dev/java/fastjson2.md',
            '/dev/java/http-client.md',
            '/dev/java/redisUtils.md',
            '/dev/java/redis-rank.md',
            '/dev/java/EasyExcelUtil.md',
            '/dev/java/rsa-encryption.md',
          ]
        }, {
          text: '设计模式',
          collapsible: true,
          children: [
            '/dev/java/工厂模式.md',
            '/dev/java/责任链模式.md',
          ]
        },
        {
          text: '错误收集',
          collapsible: true,
          children: [
            '/dev/java/错误收集.md',
          ]
        }
      ],
      "/dev/sql/": [
        {
          "text": '数据库',
          children: [
            '/dev/sql/mysql.md',
            '/dev/sql/postgresql.md'
          ],
        }
      ],
      "/dev/web-page": [
        {
          "text": 'Java',
          children: [],
        },
      ],
      "/install/": [{
        text: '软件安装',
        children: [
          "/install/linux/emqx.md",
          '/install/linux/mysql8.md',
          '/install/win/mysql8.md',
          '/install/win/nvm.md',
        ]
      }],
      '/collect/': [{
        text: '收集',
        children: ['/collect/url.md', '/collect/software.md'],
      }],
    },
  }),
  plugins: [
    searchProPlugin({
      indexContent: true,
      hotReload: true,
    }),
  ],
  bundler: viteBundler({}),
  open: true
});

