---
icon: pen-to-square
date: 2024-07-22
category:
  - 后端开发
tag:
  - java
---
# ElasticSearch全文检索
将⾮结构化数据中的⼀部分信息提取出来,重新组织,使其变得有⼀定结构,然后对此有⼀定结构的数
据进⾏搜索,从⽽达到搜索相对较快的⽬的。这部分从⾮结构化数据中提取出的然后重新组织的信息,
我们称之索引.

例如
```
字典的拼⾳表和部⾸检字表就相当于字典的索引,对每⼀个字的解释是⾮结构化的,如果字典没有⾳节表和部⾸检字表,在茫茫辞海中找⼀个字只能顺序扫描。

然⽽字的某些信息可以提取出来进⾏结构化处理,⽐如读⾳,就⽐较结构化,分声母和韵母,分别只有⼏种可以⼀⼀列举,于是将读⾳拿出来按⼀定的顺序排列,每⼀项读⾳都指向此字的详细解释的页数。

我们搜索时按结构化的拼⾳搜到读⾳,然后按其指向的页数,便可找到我们的⾮结构化数据——也即对字的解释。
```
这种先建⽴索引,再对索引进⾏搜索的过程就叫全⽂检索(Full-text Search)。

## 相关概念
索引库
```
索引库就是存储索引的保存在磁盘上的⼀系列的⽂件.
⾥⾯存储了建⽴好的索引信息以及⽂档对象。
⼀个索引库相当于数据库中的⼀张表
```

document对象
```
获取原始内容的⽬的是为了索引,在索引前需要将原始内容创建成⽂档(Document),⽂档中包括⼀个⼀个的域(Field),域中存储内容。每个⽂档都有⼀个唯⼀的编号,就是⽂档id。 

document对象相当于表中的⼀条记录。
```
field对象
```
如果我们把document看做是数据库中⼀条记录的话,field相当于是记录中的字段。field是索引库中存储数据的最⼩单位。field的数据类型⼤致可以分为数值类型和⽂本类型,⼀般需要查询的字段都是⽂本类型的.

field的还有如下属性：
    是否分词：是否对域的内容进⾏分词处理。前提是我们要对域的内容进⾏查询。
    是否索引：将Field分析后的词或整个Field值进⾏索引,只有索引⽅可搜索到。
        ⽐如：商品名称、商品简介分析后进⾏索引,订单号、⾝份证号不⽤分词但也要索引,这些将来都要作为查询条件。
    是否存储：将Field值存储在⽂档中,存储在⽂档中的Field才可以从Document中获取
        ⽐如：商品名称、订单号,凡是将来要从Document中获取的Field都要存储。
```
term对象
```
从⽂档对象中拆分出来的每个单词叫做⼀个Term,不同的域中拆分出来的相同的单词是不同的term。
term中包含两部分⼀部分是⽂档的域名,另⼀部分是单词的内容。term是创建索引的关键词对象。
```

# ElasticSearch 全文检索
简介
```
Elaticsearch,简称为es, es是⼀个开源的⾼扩展的分布式全⽂检索引擎,它可以近乎实时的存储、检索数据；
本⾝扩展性很好,可以扩展到上百台服务器,处理PB级别的数据。es也使⽤Java开发并使⽤Lucene作为其核⼼来实现所有索引和搜索的功能,但是它的⽬的是通过简单的RESTful API来隐藏 Lucene的复杂性,从⽽让全⽂搜索变得简单
```

ElasticSearch对⽐Solr
```
Solr 利⽤ Zookeeper 进⾏分布式管理,⽽ Elasticsearch ⾃⾝带有分布式协调管理功能;
Solr ⽀持更多格式的数据,⽽ Elasticsearch 仅⽀持json⽂件格式；
Solr 官⽅提供的功能更多,⽽ Elasticsearch 本⾝更注重于核⼼功能,⾼级功能多有第三⽅插件提供；
Solr 在传统的搜索应⽤中表现好于 Elasticsearch,但在处理实时搜索应⽤时效率明显低于 Elasticsearch
```

## ES 术语
Elasticsearch是⾯向⽂档(document oriented)的,这意味着它可以存储整个对象或⽂档(document)。然⽽它不仅仅是存储,还会索引(index)每个⽂档的内容使之可以被搜索。在Elasticsearch中,你可以对⽂档(⽽⾮成⾏成列的数据)进⾏索引、搜索、排序、过滤。

Elasticsearch⽐传统关系型数据库如下:
```
Relational DB -> Databases -> Tables -> Rows -> Columns
Elasticsearch -> Indices -> Types -> Documents -> Fields

简单来说就是  
    数据库 对应 es 的索引
    数据表 对应 es 的类型
    表记录 对应 es 的文档
    表的列 对应 es 的fields(属性)
```
### Indices(索引)
```
⼀个索引就是⼀个拥有⼏分相似特征的⽂档的集合。
⼀个集群中,可以定义任意多的索引.
示例
    比如说现在由三个索引,客户数据索引,产品目录索引,订单数据索引.
    一个索引由一个名字来标识,并且当我们要对对应于这个索引中的文档进行索引,搜索,更新,删除的时候都需要使用这个标识(名字).
```
### type(类型)
```
在⼀个索引中,你可以定义⼀种或多种类型。
⼀个类型是你的索引的⼀个逻辑上的分类/分区,其语义完全由你来定。

通常,会为具有⼀组共同字段的⽂档定义⼀个类型。

示例
    ⽐如说现在运营⼀个博客平台并且将所有的数据存储到⼀个索引中。
    在这个索引中,可以为⽤户数据定义⼀个类型,为博客数据定义另⼀个类型,当然也可以为评论数据定义另⼀个类型。
```
### Field(字段)
```
相当于是数据表的字段,对⽂档数据根据不同属性进⾏的分类标识
```
### mapping(映射)
```
mapping是处理数据的⽅式和规则⽅⾯做⼀些限制,如某个字段的数据类型、默认值、分析器、是否被索引等等,这些都是映射⾥⾯可以设置的,其它就是处理es⾥⾯数据的⼀些使⽤规则设置也叫做映射,按着最优规则处理数据对性能提⾼很⼤,因此才需要建⽴映射,并且需要思考如何建⽴映射才能对性能更好
```
### document(⽂档)
```
⼀个⽂档是⼀个可被索引的基础信息单元。⽐如,你可以拥有某⼀个客户的⽂档,某⼀个产品的⼀个⽂档,当然,也可以拥有某个订单的⼀个⽂档。⽂档以JSON(Javascript Object Notation)格式来表⽰,⽽JSON是⼀个到处存在的互联⽹数据交互格式。
在⼀个index/type⾥⾯,你可以存储任意多的⽂档。注意,尽管⼀个⽂档,物理上存在于⼀个索引之中,⽂档必须被索引/赋予⼀个索引的type。
```

### NRT(接近实时)
```
Elasticsearch是⼀个接近实时的搜索平台。
这意味着,从索引⼀个⽂档直到这个⽂档能够被搜索到有⼀个轻微的延迟(通常是1秒以内)
```
###  cluster(集群)
```
⼀个集群就是由⼀个或多个节点组织在⼀起,它们共同持有整个的数据,并⼀起提供索引和搜索功能。
⼀个集群由⼀个唯⼀的名字标识,这个名字默认就是“elasticsearch”。
这个名字是重要的,因为⼀个节点只能通过指定某个集群的名字,来加⼊这个集群
```
###  node(节点)
```
⼀个节点是集群中的⼀个服务器,作为集群的⼀部分,它存储数据,参与集群的索引和搜索功能。

和集群类似,⼀个节点也是由⼀个名字来标识的,默认情况下,这个名字是⼀个随机的漫威漫画⾓⾊的名字,这个名字会在启动的时候赋予节点。这个名字对于管理⼯作来说挺重要的,因为在这个管理过程中,你会去确定⽹络中的哪些服务器对应于Elasticsearch集群中的哪些节点。

⼀个节点可以通过配置集群名称的⽅式来加⼊⼀个指定的集群。默认情况下,每个节点都会被安排加⼊到⼀个叫做“elasticsearch”的集群中,这意味着,如果你在你的⽹络中启动了若⼲个节点,并假定它们能够相互发现彼此,它们将会⾃动地形成并加⼊到⼀个叫做“elasticsearch”的集群中。

在⼀个集群⾥,只要你想,可以拥有任意多个节点。⽽且,如果当前你的⽹络中没有运⾏任何 Elasticsearch节点,这时启动⼀个节点,会默认创建并加⼊⼀个叫做“elasticsearch”的集群。
```

###  shards&replicas(分⽚和复制)
```
⼀个索引可以存储超出单个结点硬件限制的⼤量数据。⽐如,⼀个具有10亿⽂档的索引占据1TB的磁盘空间,⽽任⼀节点都没有这样⼤的磁盘空间；或者单个节点处理搜索请求,响应太慢。为了解决这个问题,Elasticsearch提供了将索引划分成多份的能⼒,这些份就叫做分⽚。当你创建⼀个索引的时候,你可以指定你想要的分⽚的数量。每个分⽚本⾝也是⼀个功能完善并且独⽴的“索引”,这个“索引”可以被放置到集群中的任何节点上。分⽚很重要,主要有两⽅⾯的原因：

    1. 允许你⽔平分割/扩展你的内容容量。
    2. 允许你在分⽚(潜在地,位于多个节点上)之上进⾏分布式的、并⾏的操作,进⽽提⾼性能/吞吐
量。

⾄于⼀个分⽚怎样分布,它的⽂档怎样聚合回搜索请求,是完全由Elasticsearch管理的,对于作为⽤户的你来说,这些都是透明的。

在⼀个⽹络/云的环境⾥,失败随时都可能发⽣,在某个分⽚/节点不知怎么的就处于离线状态,或者由于任何原因消失了,这种情况下,有⼀个故障转移机制是⾮常有⽤并且是强烈推荐的。为此⽬的,Elasticsearch允许你创建分⽚的⼀份或多份拷贝,这些拷贝叫做复制分⽚,或者直接叫复制。

复制之所以重要,有两个主要原因： 在分⽚/节点失败的情况下,提供了⾼可⽤性。因为这个原因,注意到复制分⽚从不与原/主要(original/primary)分⽚置于同⼀节点上是⾮常重要的。

扩展你的搜索量/吞吐量,因为搜索可以在所有的复制上并⾏运⾏。总之,每个索引可以被分成多个分⽚。

⼀个索引也可以被复制0次(意思是没有复制)或多次。⼀旦复制了,每个索引就有了主分⽚(作为复制源的原来的分⽚)和复制分⽚(主分⽚的拷贝)之别。分⽚和复制的数量可以在索引创建的时候指定。在索引创建之后,你可以在任何时候动态地改变复制的数量,但是你事后不能改变分⽚的数量。

默认情况下,Elasticsearch中的每个索引被分⽚5个主分⽚和1个复制,这意味着,如果你的集群中⾄少
有两个节点,你的索引将会有5个主分⽚和另外5个复制分⽚(1个完全拷贝),这样的话每个索引总共
就有10个分⽚
```

## ElasticSearch的客户端操作
```
1. elasticsearch-head插件
2. 使⽤elasticsearch提供的Restful接⼜直接访问
3. 使⽤elasticsearch提供的API进⾏访问
```
### elasticsearch-head
```
ElasticSearch不同于Solr⾃带图形化界⾯,我们可以通过安装ElasticSearch的head插件,完成图形化界⾯的效果,完成索引数据的查看。

安装插件的⽅式有两种,在线安装和本地安装。
本⽂档采⽤本地安装⽅式进⾏head插件的安装。
elasticsearch-5-*以上版本安装head需要安装node和grunt

下载head插件：https://github.com/mobz/elasticsearch-head
```
将elasticsearch-head-master压缩包解压到任意⽬录,但是要和elasticsearch的安装⽬录区别开

下载nodejs：https://nodejs.org/en/download/

使用 nodejs 安装
```
# 在 elasticsearch-head-master 根目录下运行下面命令
npm install -g grunt-cli
# 进⼊elasticsearch-head-master⽬录启动head
npm install
grunt server
# 打开浏览器,输⼊ http://localhost:9100 即可访问到web页面
```

### 使用 apifox 工具进行 Resuful 接口访问
接口语法
```
curl -X<VERB> '<PROTOCOL>://<HOST>:<PORT>/<PATH>?<QUERY_STRING>' -d '<BODY>'
```
|     参数     | 解释                                                                                                               |
| :----------: | :----------------------------------------------------------------------------------------------------------------- |
|     VERB     | 适当的 HTTP ⽅法 或 谓词 : GET、 POST、 PUT、 HEAD 或者 DELETE。                                                    |
|   PROTOCOL   | http 或者 https(如果你在 Elasticsearch 前⾯有⼀个 https 代理)                                                        |
|     HOST     | Elasticsearch 集群中任意节点的主机名,或者⽤ localhost 代表本地机器上的节点。                                        |
|     PORT     | 运⾏ Elasticsearch HTTP 服务的端⼜号,默认是 9200 。                                                                  |
|     PATH     | API 的终端路径(例如 _count 将返回集群中⽂档数量)。Path 可能包含多个组件,例如：_cluster/stats 和 _nodes/stats/jvm 。 |
| QUERY_STRING | 任意可选的查询字符串参数 (例如 ?pretty 将格式化地输出 JSON 返回值,使其更容易阅读)                                  |
|     BODY     | ⼀个 JSON 格式的请求体 (如果请求需要的话)                                                                           |

#### 创建索引(index)和映射(mapping)
请求url
```
PUT ip:9200/test1
```
请求体
```
{
    "mappings":{
        "article": {
            "properties": {
                "id": {
                    "type": "long",
                    "store": true,
                    "index":"not_analyzed"
                },
                "title": {
                    "type": "text",
                    "store": true,
                    "index":"analyzed",
                    "analyzer":"standard"
                },
                "content": {
                    "type": "text",
                    "store": true,
                    "index":"analyzed",
                    "analyzer":"standard"
                }
            }
        }
    }
}
```
示例图

![es_put_test](https://i.jpg.dog/31748f789171695b7e891f59303969c8.png)
![es_put_test_success](https://i.jpg.dog/01af999291e79fb81d7af20acab8aecf.png)

在 es_head 中查看

![es_head_test1](https://i.jpg.dog/e61a153cf0809b390dbe8916660833d1.png)

#### 先创建索引后设置 mapping
请求的url
```
# 创建索引
PUT http://centos:9200/test2
# 设置 mapping
POST http://centos:9200/test2/hello/_mapping
```
请求体
```
{
    "hello":{
        "properties": {
            "id":{
                "type":"long",
                "store":true
            },
            "title":{
                "type":"text",
                "store":true,
                "index":true,
                "analyzer":"standard"
            },
            "content":{
                "type":"text",
                "store":true,
                "index":"analyzed",
                "analyzer":"standard"
            }
            
        }
    }
}
```

#### 删除索引
请求 url
```
DELETE http://192.168.65.128:9200/test1
```

#### 创建文档
请求 url
```
POST http://centos:9200/test2/hello/1
```
请求体
```
{
    "id":1,
    "title":"ElasticSearch是⼀个基于Lucene的搜索服务器",
    "content":"它提供了⼀个分布式多⽤户能⼒的全⽂搜索引擎，基于RESTful web接⼝"
}
```
成功截图

![es apifox success](https://i.jpg.dog/ffe882e0b2cb5d1953dbb32394310a17.png)

es_head 数据截图

![es head index](https://i.jpg.dog/a03c50adb9229e1b0832cef4e92a04e3.png)


#### 删除⽂档document
请求 url
```
DELETE http://centos:9200/test2/hello/1
```

#### 查询文档-根据id查询
请求url
```
GET centos:9200/test2/hello/1
```
请求成功

![es apifox get](https://i.jpg.dog/ce9a1026e4d1ae6098aa053d4665b18c.png)

#### 查询⽂档-querystring查询
请求url
```
POST http://centos:9200/test2/hello/_search
```

请求体
```
{
    "query":{
        "query_string":{
            "default_field":"title",
            "query":"搜索服务器"
        }
    }
}
```

请求成功返回

![es apifox search](https://i.jpg.dog/7183f92b033dd03d7db3c23dfb547b78.png)

使用标准分词的时候是一个字一个词进行分词的,所以我们查询不同的词也可以查询出该结果例如 `刚索`

#### 查询⽂档-term查询
请求url
```
POST http://centos:9200/test2/hello/_search
```
请求体
```
{
    "query":{
        "term":{
            "title":"搜索服务器"
        }   
    }
}
```
因为 term 是不分词查找所以是在当前案例中是没有结果的.

## IK 分词器
简介
```
IKAnalyzer是⼀个开源的，基于java语⾔开发的轻量级的中⽂分词⼯具包。从2006年12⽉推出1.0版开始，IKAnalyzer已经推出 了3个⼤版本。最初，它是以开源项⽬Lucene为应⽤主体的，结合词典分词和⽂法分析算法的中⽂分词组件。

新版本的IKAnalyzer3.0则发展为 ⾯向Java的公⽤分词组件，独⽴于Lucene项⽬，同时提供了对Lucene的默认优化实现。
```
### IK分词器 分词

请求 url
```
http://centos:9200/_analyze?analyzer=ik_smart&pretty=true&text=我是程序员

http://centos:9200/_analyze?analyzer=ik_max_word&pretty=true&text=我是程序员

解释
analyzer 分词模式
    ik_smart        粗粒度分词,根据语义进行最粗粒度的分词
    ik_max_word     细粒度分词,会将⽂本做最细粒度的拆分
    standard        es自己的分词模式,一个中文字符一个词

pretty
    格式输出

text
    分词的字符串
```

#### 使用 Ik 进行分词
创建索引请求url
```
PUT http://centos:9200/test3
```
请求体
```
{
    "mappings":{
        "ik_test": {
            "properties": {
                "id": {
                    "type": "long",
                    "store": true,
                    "index":"not_analyzed"
                },
                "title": {
                    "type": "text",
                    "store": true,
                    "index":"analyzed",
                    "analyzer":"ik_max_word"
                },
                "content": {
                    "type": "text",
                    "store": true,
                    "index":"analyzed",
                    "analyzer":"ik_max_word"
                }
            }
        }
    }
}
```

创建文档的请求url
```
POST http://centos:9200/test3/ik_test/1
```
请求体
```
{
    "id":1,
    "title":"ElasticSearch是⼀个基于Lucene的搜索服务器",
    "content":"它提供了⼀个分布式多⽤户能⼒的全⽂搜索引擎，基于RESTful web接⼝"
}
```

查询文档title的请求
```
GET http://centos:9200/test3/_search
```
请求体
```
{
    "query":{
        "term":{
            "title":"搜索"
        }
    }
}
```
这样是可以查出来的,但是如果我们换成刚才查询使用的 '钢索' 这个词的时候就搜不出来了.

## Kibana
简介
```
Kibana 是⼀款开源的数据分析和可视化平台，它是 Elastic Stack 成员之⼀，设计⽤于和 Elasticsearch协作。
可以使⽤ Kibana 对 Elasticsearch 索引中的数据进⾏搜索、查看、交互操作。
可以很⽅便的利⽤图表、表格及地图对数据进⾏多元化的分析和呈现。
Kibana 可以使⼤数据通俗易懂。
它很简单，基于浏览器的界⾯便于您快速创建和分享动态数据仪表板来追踪 Elasticsearch 的实时数据变化。
```
快捷键
```
ctrl+i      ⾃动缩进
ctrl+enter  提交请求
down        打开⾃动补全菜单
enter或tab  选中项⾃动补全
esc         关闭补全菜单
```
### Kibana 设置
要是 Kibana必须至少配置一个索引,索引用于标识 Elasticsearch 索引进行分析和搜索也可以用于配置字段.

根据以下图片进行配置索引


![Kibana indesx patterns](https://i.jpg.dog/8dd3c15e0938f0ce38dc7b12350f4b85.png)
![kibana create index](https://i.jpg.dog/96c49b5d628132e46bf8aac8a4ea40a6.png)
![kibana create index succes](https://i.jpg.dog/61f602d3faf49e766f7006e288b0f661.png)

搜索数据
![kibana search](https://i.jpg.dog/1d06b0c6a4c7310ac19a105dc43ffe19.png)

### Kibana DSL 使用
Query DSL是⼀个Java开源框架⽤于构建类型安全的SQL查询语句。采⽤API代替传统的拼接字符串来构造查询语句。

⽬前Querydsl⽀持的平台包括JPA,JDO，SQL，Java Collections，RDF，Lucene，Hibernate Search。

elasticsearch提供了⼀整套基于JSON的DSL语⾔来定义查询

#### 索引操作
查询所有索引
```
GET /_cat/indices?v
```
结果图如下
![kibana search all](https://i.jpg.dog/43a71d126bddb5ee5eee5dc490751e40.png)

删除某个索引
```
DELETE /test2
```
结果图如下
![kibana delete test2 success](https://i.jpg.dog/176a630a9c58ce12540e788ed46f8067.png)

新增一个索引
```
# 因为没有这个所以了,先创建这个索引
PUT test2
# 为 test2 这个索引添加 mapping 映射
PUT /test2/testinfo/_mapping
{
  "properties": {
    "name": {
      "type": "text",
      "analyzer": "ik_smart",
      "search_analyzer": "ik_smart"
    },
    "city": {
      "type": "text",
      "analyzer": "ik_smart",
      "search_analyzer": "ik_smart"
    },
    "age": {
      "type": "long"
    },
    "description": {
      "type": "text",
      "analyzer": "ik_smart",
      "search_analyzer": "ik_smart"
    }
  }
}
# 解释
# "name": 域
# analyzer: 分词器
# search_analyzer: 搜索分词器
```


新增文档数据
```
PUT test2/testinfo/1
{
  "name":"李四",
  "age":22,
  "city":"北京",
  "description":"北京东城区"
}
# 为了一行方便查数据,多添加几条.

PUT test2/testinfo/2
{
  "name":"王一",
  "age":26,
  "city":"陕西",
  "description":"王一来自陕西东部"
}

PUT test2/testinfo/3
{
  "name":"张三",
  "age":25,
  "city":"黄河",
  "description":"张三来自黄河流域"
}

PUT test2/testinfo/4
{
  "name":"王老五",
  "age":24,
  "city":"杭州",
  "description":"王老五来自杭州某乡"
}
PUT test2/testinfo/5
{
  "name":"李老六",
  "age":23,
  "city":"四川",
  "description":"李老六来自四川成都"
}
```

修改文档数据
```
PUT test2/testinfo/4
{
  "name":"王老五_put",
  "age":22,
  "city":"杭州",
  "description":"王老五来自杭州某乡"
}
```

查询所有数据
```
# 根据id 查询
GET /test2/testinfo/4

# 查询所有
GET /test2/testinfo/_search
```
sort 排序
```
GET /test2/_search
{
  "query": {
      # match_all 所有字段 
    "match_all": {}
  },
  "sort": [
    {
        # 根据 age 这个字段进行倒序排序
      "age": {
        "order": "desc"
      }
    }
  ]
}
```
分页实现
```
GET /test2/_search
{
  "query": {
    "match_all": {}
  },
  "sort": [
    {
      "age": {
        "order": "desc"
      }
    }
  ],
  "from": 0,
  "size": 2
}
```
term 查询
```
GET _search
{
  "query": {
      # 使用 term 时是不分词的
    "term": {
      "city": {
        "value": "四川"
      }
    }
  }
}
```
terms 多个词条查询
```
GET _search
{
  "query": {
    "terms": {
      "city": [
        "四川",
        "杭州"
      ]
    }
  }
}
```
mathc 查询
```
GET _search
{
  "query": {
      # 使用 match 时是分词的
    "match": {
      "city": "四川杭州 "
    }
  }
}
```
query_string 查询
```
GET _search
{
  "query": {
    "query_string": {
      "default_field": "city",
      "query": "四川杭州"
    }
  }
}
```
range 查询(范围查询) 例如年龄范围
```
GET _search
{
  "query": {
    "range": {
      "age": {
        "gte": 20,
        "lte": 24
      }
    }
  }
}
```
exists 查询(exists 过滤可以⽤于查找拥有某个域的数据)
```
GET _search
{
  "query": {
    "exists":{
      "field":"address"
    }
  }
}
```

bool 查询

bool 可以⽤来合并多个条件查询结果的布尔逻辑，它包含⼀下操作符：
1. must : 多个查询条件的完全匹配,相当于 and。
2. must_not : 多个查询条件的相反匹配，相当于 not。
3. should : ⾄少有⼀个查询条件匹配, 相当于 or。

```
# bool --- must
GET _search
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "city": {
              "value": "四川"
            }
          }
        },
        {
          "range": {
            "age": {
              "gte": 20,
              "lte": 30
            }
          }
        }
      ]
    }
  }
}


# bool --- must_not
GET _search
{
  "query": {
    "bool": {
      "must_not": [
        {
          "term": {
            "city": {
              "value": "四川"
            }
          }
        },
        {
          "range": {
            "age": {
              "gte": 20,
              "lte": 30
            }
          }
        }
      ]
    }
  }
}

# bool --- should
GET _search
{
  "query": {
    "bool": {
      "should": [
        {
          "term": {
            "city": {
              "value": "四川"
            }
          }
        },
        {
          "range": {
            "age": {
              "gte": 20,
              "lte": 30
            }
          }
        }
      ]
    }
  }
}
```

prefix 匹配开头查询
```
GET _search
{
  "query": {
    "prefix": {
      "name": {
        "value": "李"
      }
    }
  }
}
```

multi_match 在那些字段中查找匹配字符
```
GET _search
{
  "query": {
    "multi_match": {
      "query": "四川",
      "fields": [
        "city",
        "description"
        ]
    }
  }
}
```

bool -filter (filter 只能用在 bool 里面)
```
GET _search
{
  "query": {
    "bool": {
      "must": [
        {"match": {
          "city": "四川"
        }}
      ],
      "filter": {
        "range": {
          "age": {
            "gte": 20,
            "lte": 24
          }
        }
      }
    }
  }
}
```
因为过滤可以使⽤缓存，同时不计算分数，通常的规则是，使⽤查询(query)语句来进⾏ 全⽂ 搜索或者其它任何需要影响 相关性得分 的搜索。除此以外的情况都使⽤过滤(filters)

## JavaApi 操作 ElasticSearch
pom 导入依赖
```xml
<dependencies>
    <dependency>
        <groupId>org.elasticsearch</groupId>
        <artifactId>elasticsearch</artifactId>
        <version>5.6.8</version>
    </dependency>
    <dependency>
        <groupId>org.elasticsearch.client</groupId>
        <artifactId>transport</artifactId>
        <version>5.6.8</version>
    </dependency>
    <dependency>
        <groupId>org.apache.logging.log4j</groupId>
        <artifactId>log4j-to-slf4j</artifactId>
        <version>2.9.1</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-api</artifactId>
        <version>1.7.24</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-simple</artifactId>
        <version>1.7.21</version>
    </dependency>
    <dependency>
        <groupId>log4j</groupId>
        <artifactId>log4j</artifactId>
        <version>1.2.12</version>
    </dependency>
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
    </dependency>
</dependencies>
```
### 创建索引
```java
/**
 * @author black_fire
 */
public class CreateIndexTest {
    TransportClient client;

    @Before
    public void init() throws Exception{
        // 1. 配置
        Settings settings = Settings.builder().put("cluster.name","my-elasticsearch").build();
        // 2. 客户端
        client = new PreBuiltTransportClient(settings);
        // 给客户端创建连接节点
        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("192.168.65.128"),9300));
    }

    /**
     * 创建索引不添加映射
     *      Settings.builder().put("cluster.name","my-elasticsearch").build()
     *          根据 es 名创建一个设置
     *      new PreBuiltTransportClient(settings)
     *          创建客户端
     *      InetSocketTransportAddress(InetAddress address, int port)
     *          创建链接节点,需要传入 ip地址和 请求端口
     *      prepareCreate(String index)
     *          传入 要创建的索引名
     *      .get()
     *          执行当前方法
     */
    @Test
    public void test() throws Exception{
        // 3. 创建索引 .get() 是执行 该创建
        client.admin().indices().prepareCreate("index_hello").get();
        // 释放资源
        client.close();
    }

}
```

### 创建映射
```java
/**
 * @author black_fire
 */
public class CreateIndexTest {
    TransportClient client;

    @Before
    public void init() throws Exception{
        // 1. 配置
        Settings settings = Settings.builder().put("cluster.name","my-elasticsearch").build();
        // 2. 客户端
        client = new PreBuiltTransportClient(settings);
        // 给客户端创建连接节点
        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("192.168.65.128"),9300));
    }

    @Test
    public void setMappings() throws Exception{
        // mapping 主体
        XContentBuilder builder = XContentFactory.jsonBuilder()
                .startObject()
                .startObject("article")
                .startObject("properties")
                .startObject("id")
                .field("type","integer")
                .field("store","yes")
                .endObject()
                .startObject("title")
                .field("type","string")
                .field("store","yes")
                .field("analyzer","ik_smart")
                .endObject()
                .startObject("content")
                .field("type","string")
                .field("store","yes")
                .field("analyzer","ik_smart")
                .endObject()
                .endObject()
                .endObject()
                .endObject();
        // 使用 api 给索引创建 mapping
        client.admin().indices().preparePutMapping("index_hello").setType("article").setSource(builder).get();
        // 释放资源
        client.close();
    }
}
```

### 创建文档
#### XContentBuilder 构建 Document 对象
```java
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.junit.Before;
import org.junit.Test;

import java.net.InetAddress;

/**
 * @author black_fire
 */
public class CreateIndexTest {
    TransportClient client;

    @Before
    public void init() throws Exception{
        // 1. 配置
        Settings settings = Settings.builder().put("cluster.name","my-elasticsearch").build();
        // 2. 客户端
        client = new PreBuiltTransportClient(settings);
        // 给客户端创建连接节点
        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("192.168.65.128"),9300));
    }


    /**
     * 使用  XContentBuilder 构建 Document 对象
     */
    @Test
    public void testAddDocument() throws Exception{
        // 创建一个文档对象
        XContentBuilder builder = XContentFactory.jsonBuilder()
                .startObject()
                .field("id",2L)
                .field("title","北方入秋速度明显加快,多地降温明显")
                .field("content","客机在某某机场被隔离,10多名乘客病倒")
                .endObject();
        // 把文档对象添加到索引库
        client.prepareIndex()
                // 设置索引名称
                .setIndex("index_hello")
                // 设置type
                .setType("article")
                // 设置id
                .setId("2")
                // 设置文档信息
                .setSource(builder)
                // 执行操作
                .get();
        // 关闭客户端
        client.close();
    }
}
```

#### 使用 jackson 将实体类转换
pom导入依赖
```xml
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.13.1</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
    <version>2.13.1</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.13.1</version>
</dependency>
```

实体类
```java
public class Article {
    private Integer id;
    private String title;
    private String content;
    // 省略 get/set 方法
}
```
使用 jackson 转换实体类进行创建文档
```java
import com.black_fire.admin.Article;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.common.xcontent.XContentBuilder;
import org.elasticsearch.common.xcontent.XContentFactory;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.junit.Before;
import org.junit.Test;

import java.net.InetAddress;

/**
 * @author black_fire
 */
public class CreateIndexTest {
    TransportClient client;

    @Before
    public void init() throws Exception {
        // 1. 配置
        Settings settings = Settings.builder().put("cluster.name", "my-elasticsearch").build();
        // 2. 客户端
        client = new PreBuiltTransportClient(settings);
        // 给客户端创建连接节点
        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("192.168.65.128"), 9300));
    }

    @Test
    public void testAddDocument1() throws Exception {
        Article article = new Article();
        article.setId(1);
        article.setTitle("测试 jackson 转换- title");
        article.setContent("测试 jackson 转换- content");
        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(article);
        // 把文档对象添加到索引库
        client.prepareIndex("index_hello", "article", "3")
                // 设置文档信息
                .setSource(json, XContentType.JSON)
                // 执行操作
                .get();
        // 关闭客户端
        client.close();
    }

    /**
     * 为查询准备数据
     */
    @Test
    public void testAddDocument3() throws Exception {
        for (int i = 4; i < 100; i++) {
            //创建⼀个Article对象
            Article article = new Article();
            //设置对象的属性
            article.setId(i);
            article.setTitle("⼥护⼠路遇昏迷男⼦跪地抢救：救⼈是职责更是本能" + i);
            article.setContent("江⻄变质营养餐事件已致24⼈就医 多名官员被调查" + i);
            //把article对象转换成json格式的字符串。
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonDocument = objectMapper.writeValueAsString(article);
            System.out.println(jsonDocument);
            //使⽤client对象把⽂档写⼊索引库
            client.prepareIndex("index_hello", "article", i + "")
                    .setSource(jsonDocument, XContentType.JSON)
                    .get();
        }
        //关闭客户端
        client.close();
    }
}
```

### 查询文档操作
#### 重复代码提取(看此篇幅前先看这里)
```java
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.InetSocketTransportAddress;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.junit.Before;
import org.junit.Test;

import java.net.InetAddress;
import java.util.Iterator;
import java.util.Map;

/**
 * @author black_fire
 */
public class IndexSearchTest {
    TransportClient client;

    @Before
    public void init() throws Exception {
        // 1. 配置
        Settings settings = Settings.builder().put("cluster.name", "my-elasticsearch").build();
        // 2. 客户端
        client = new PreBuiltTransportClient(settings);
        // 给客户端创建连接节点
        client.addTransportAddress(new InetSocketTransportAddress(InetAddress.getByName("192.168.65.128"), 9300));
    }

    private void search(QueryBuilder builder) {
        // 执行查询得到一个结果
        SearchResponse searchResponse = client.prepareSearch("index_hello")
                .setTypes("article")
                .setQuery(builder)
                .get();
        // 处理结果
        SearchHits searchHits = searchResponse.getHits();

        System.out.println("总行数" + searchHits.getTotalHits());

        Iterator<SearchHit> searchHitIterator = searchHits.iterator();
        while (searchHitIterator.hasNext()) {
            SearchHit searchHit = searchHitIterator.next();
            // source  --> document 文档输出
            System.out.println(searchHit.getSourceAsString());
            System.out.println("----文档属性----");
            Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
            System.out.println(sourceAsMap.get("id"));
            System.out.println(sourceAsMap.get("title"));
            System.out.println(sourceAsMap.get("content"));
        }
    }
}
```

#### termQuery
```java
@Test
public void testQueryByTeam() throws Exception {
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.termQuery("title", "跪地");
    search(builder);
}
```

#### queryString
```java
@Test
public void testQueryByQueryString() throws Exception {
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.queryStringQuery("美丽的女护士");

    search(builder);
}

```

#### mathQuery
```java
@Test
public void testQueryByMathQuery() throws Exception {
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.matchQuery("title","女护士");
    search(builder);

}
```

#### 根据id 查询
```java
@Test
public void testQueryById(){
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.idsQuery().addIds("2","3");
    search(builder);
}
```

#### 分页
```java
@Test
public void testQueryByMachAll(){
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.matchAllQuery();
    // 执行查询得到一个结果
    SearchResponse searchResponse = client.prepareSearch("index_hello")
            .setTypes("article")
            .setQuery(builder)
            .setFrom(0)
            .setSize(5)
            .get();
    // 处理结果
    SearchHits searchHits = searchResponse.getHits();

    System.out.println("总行数" + searchHits.getTotalHits());

    Iterator<SearchHit> searchHitIterator = searchHits.iterator();
    while (searchHitIterator.hasNext()) {
        SearchHit searchHit = searchHitIterator.next();
        // source  --> document 文档输出
        System.out.println(searchHit.getSourceAsString());
        System.out.println("----文档属性----");
        Map<String, Object> sourceAsMap = searchHit.getSourceAsMap();
        System.out.println(sourceAsMap.get("id"));
        System.out.println(sourceAsMap.get("title"));
        System.out.println(sourceAsMap.get("content"));
    }
}
```

#### 查询结果高亮代码实现
```java
@Test
public void testQueryByHighlight(){
    // 产生 queryBuilder
    QueryBuilder builder = QueryBuilders.multiMatchQuery("测试","title","content");
    // 对高亮进行标注
    HighlightBuilder highlightBuilder = new HighlightBuilder();
    highlightBuilder.field("title");
    highlightBuilder.preTags("<em>");
    highlightBuilder.postTags("</em>");

    // 执行查询得到一个结果
    SearchResponse searchResponse = client.prepareSearch("index_hello")
            .setTypes("article")
            .setQuery(builder)
            .highlighter(highlightBuilder)
            .get();

    // 处理结果
    SearchHits searchHits = searchResponse.getHits();

    System.out.println("总行数" + searchHits.getTotalHits());

    Iterator<SearchHit> searchHitIterator = searchHits.iterator();
    while (searchHitIterator.hasNext()) {
        SearchHit searchHit = searchHitIterator.next();
        // source  --> document 文档输出
        System.out.println("----文档内容----");
        System.out.println(searchHit.getSourceAsString());
        System.out.println("----高亮结果----");
        Map<String, HighlightField> highlightFieldMap = searchHit.getHighlightFields();
        for (Map.Entry<String,HighlightField> entry :highlightFieldMap.entrySet()){
            System.out.println(entry.getKey() + "\t" + Arrays.toString(entry.getValue().getFragments()));
        }
    }
}
```


## Spring Data ElasticSearch
### Dao 编写规则
⽅法命名规则查询的基本语法findBy + 属性 + 关键词 + 连接符

|    关键字     |       命名规则        |            解释            |          ⽰例          |
| :-----------: | :-------------------: | :------------------------: | :-------------------: |
|      and      | findByField1AndField2 | 根据Field1和Field2获得数据 | findByTitleAndContent |
|      or       | findByField1OrField2  | 根据Field1或Field2获得数据 | findByTitleOrContent  |
|      is       |      findByField      |     根据Field获得数据      |      findByTitle      |
|      not      |    findByFieldNot     |   根据Field获得补集数据    |    findByTitleNot     |
|    between    |  findByFieldBetween   |     获得指定范围的数据     |  findByPriceBetween   |
| lessThanEqual |  findByFieldLessThan  |  获得⼩于等于指定值的数据   |  findByPriceLessThan  |

### 案例
使用spring boot形式创建,pom依赖如下
```xml
?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.1.16.RELEASE</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.black_fire</groupId>
    <artifactId>es-demo2</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>es-demo2</name>
    <description>Demo project for Spring Boot</description>
    <properties>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```
application.yml如下
```yml
spring:
  data:
    elasticsearch:
      cluster-name: my-elasticsearch
      cluster-nodes: 192.168.65.128:9300
```

创建实体类
```java
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * @author black_fire
 */
@Document(indexName = "black_fire_test",type = "article")
public class Article {
    @Id
    @Field(type = FieldType.Long,store = true)
    private Integer id;
    @Field(type = FieldType.Text,store = true,analyzer = "ik_smart")
    private String title;
    @Field(type = FieldType.Text,store = true,analyzer = "ik_smart")
    private String content;
    // 省略 get/set 方法
}
```

#### 创建 Dao接口
```java
import com.black_fire.admin.Article;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.awt.print.Pageable;
import java.util.List;

/**
 * @author black_fire
 */
public interface ArticleDao extends ElasticsearchRepository<Article, Long> {
    /**
     * 根据 title 查询结果
     *
     * @param title 要查询的 title
     * @return 多条结果
     */
    List<Article> findByTitle(String title);

    /**
     * 根据 title 和 content 查询结果
     *
     * @param title   要查询的 title
     * @param content 要查询的 content
     * @return 多条结果
     */
    List<Article> findByTitleAndAndContent(String title, String content);

    /**
     * 根据 title 或 content 查询结果
     *
     * @param title   要查询的 title
     * @param content 要查询的 content
     * @param pageable  分页接口
     * @return 多条结果
     */
    List<Article> findByTitleOrContent(String title, String content, Pageable pageable);
}
``` 

#### 常用方法案例
```java
import com.black_fire.esdemo2.dao.ArticleDao;
import com.black_fire.esdemo2.domain.Article;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.query.NativeSearchQuery;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
class EsDemo2ApplicationTests {

    @Autowired
    private ElasticsearchTemplate template;
    @Autowired
    private ArticleDao articleDao;

    /**
     * 添加索引和映射
     */
    @Test
    public void test(){
        //创建索引，并配置映射关系 如果这里执行后没有 映射直接执行下面那行就可以了
        template.createIndex(Article.class);
        //配置映射关系
        template.putMapping(Article.class);
    }

    /**
     * 给某个索引添加文档 这里使用的是内置方法
     */
    @Test
    public void addDocument() {
        for (int i = 1; i <= 10; i++) {
            //创建⼀个Article对象
            Article article = new Article();
            article.setId(i);
            article.setTitle("⼥护⼠路遇昏迷男⼦跪地抢救：救⼈是职责更是本能" + i);
            article.setContent("这是⼀个美丽的⼥护⼠妹妹" + i);
            //把⽂档写⼊索引库
            articleDao.save(article);
        }
    }

    /**
     * 根据 文档id 删除一个文档
     */
    @Test
    public void deleteDocument(){
        articleDao.deleteById(3L);
    }

    /**
     * 查询所有文档
     */
    @Test
    public void findAll(){
        articleDao.findAll().forEach(System.out::println);
    }

    /**
     * 根据文档id 查询文档
     */
    @Test
    public void findById(){
        System.out.println(articleDao.findById(1L));
    }

    /**
     * 刚才自定义的查询方法
     */
    @Test
    public void findByTitle(){
//        articleDao.findByTitle("跪地").forEach(System.out::println);
        articleDao.findByTitleLike("跪地救人").forEach(System.out::println);
    }

    /**
     * 使用自定义查询方法
     *      加上 Like 就是分词查,不加就是普通 math
     */
    @Test
    public void findByTitleOrContent(){
//        articleDao.findByTitleOrContent("跪地","救人").forEach(System.out::println);
        articleDao.findByTitleLikeOrContent("跪地女护士","救人").forEach(System.out::println);
    }


    /**
     * 使用自定义分页查询方法
     */
    @Test
    public void findByTitlePage(){
        Pageable page = PageRequest.of(1,5);
        articleDao.findByTitleOrContent("跪地","救人",page).forEach(System.out::println);
    }

    /**
     * 使用本地 Query 进行查询
     */
    @Test
    public void testNativeSearchQuery(){
        NativeSearchQuery nativeSearchQuery = new NativeSearchQueryBuilder()
                .withQuery(QueryBuilders.queryStringQuery("跪地").defaultField("title"))
                .withPageable(PageRequest.of(1,5)).build();
        template.queryForList(nativeSearchQuery,Article.class).forEach(System.out::println);
    }
}
```

#### 聚合查询
创建 汽车实体类
```java
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * @author black_fire
 */
@Document(indexName = "car_index",type = "car")
public class Car {
    @Id
    @Field(type = FieldType.Long,store = true)
    private Long id;
    @Field(type = FieldType.Text,store = true ,analyzer = "ik_smart")
    private String name;
    @Field(type = FieldType.Text,store = true,analyzer = "ik_smart",fielddata = true)
    private String  brand;
    @Field(type = FieldType.Text,store = true,analyzer = "ik_smart",fielddata = true)
    private String color;
    @Field(type = FieldType.Double,store = true)
    private Double price;
    // get/set/构造器/toString 省略
}
```
创建 Dao
```java
import com.black_fire.esdemo2.domain.Car;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * @author black_fire
 */
public interface CarDao extends ElasticsearchRepository<Car,Long> {}
```

使用示例
```java
import com.black_fire.esdemo2.domain.Car;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.StringTerms;
import org.elasticsearch.search.aggregations.metrics.avg.InternalAvg;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.elasticsearch.core.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.aggregation.AggregatedPage;
import org.springframework.data.elasticsearch.core.query.FetchSourceFilter;
import org.springframework.data.elasticsearch.core.query.NativeSearchQueryBuilder;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * @author black_fire
 */
@SpringBootTest
@RunWith(SpringRunner.class)
public class CarTest {
    @Autowired
    private ElasticsearchTemplate template;
    @Autowired
    private CarDao carDao;

    @Test
    public void test() {
        //创建索引，并配置映射关系 如果这里执行后没有 映射直接执行下面那行就可以了
        template.createIndex(Car.class);
        //配置映射关系
        template.putMapping(Car.class);
    }

    /**
     * 准备一些数据
     */
    @Test
    public void addDocument() {
        carDao.save(new Car(1l, "⽐亚迪A1", "⽐亚迪", "红⾊", 50000d));
        carDao.save(new Car(2l, "⽐亚迪A2", "⽐亚迪", "⽩⾊", 70000d));
        carDao.save(new Car(3l, "⽐亚迪A3", "⽐亚迪", "⽩⾊", 80000d));
        carDao.save(new Car(4l, "⽐亚迪A4", "⽐亚迪", "红⾊", 60000d));
        carDao.save(new Car(5l, "⽐亚迪A5", "⽐亚迪", "红⾊", 90000d));
        carDao.save(new Car(6l, "宝⻢A1", "宝⻢", "红⾊", 10000d));
        carDao.save(new Car(7l, "宝⻢A2", "宝⻢", "⿊⾊", 20000d));
        carDao.save(new Car(8l, "宝⻢A3", "宝⻢", "⿊⾊", 30000d));
        carDao.save(new Car(9l, "宝⻢A4", "宝⻢", "红⾊", 40000d));
        carDao.save(new Car(10l, "宝⻢A5", "宝⻢", "红⾊", 50000d));
        carDao.save(new Car(11l, "奔驰A1", "奔驰", "红⾊", 10000d));
        carDao.save(new Car(12l, "奔驰A2", "奔驰", "⿊⾊", 20000d));
        carDao.save(new Car(13l, "奔驰A3", "奔驰", "⿊⾊", 30000d));
        carDao.save(new Car(14l, "奔驰A4", "奔驰", "红⾊", 40000d));
        carDao.save(new Car(15l, "奔驰A5", "奔驰", "红⾊", 50000d));
    }

    /*
        划分桶
        GET /car_index/car/_search
        {
          "query": {
            "bool":{
              "should": [
                {"match_all": {}}
              ]
            }
          },
          "aggs": {
            "group_by_color": {
              "terms": {
                "field": "color"
              },
              "aggs": {
                "avg_price": {
                  "avg": {
                    "field": "price"
                  }
                }
              }
            }
          }
        }
     */

    /**
     * 将上面的划分桶 使用java 代码实现
     */
    @Test
    public void testQuerySelfAgs() {
        //查询条件的构建器
        NativeSearchQueryBuilder queryBuilder = new
                NativeSearchQueryBuilder().withQuery(QueryBuilders.matchAllQuery());
        //排除所有的字段查询，
        queryBuilder.withSourceFilter(new FetchSourceFilter(new String[]
                {}, null));

        //添加聚合条件
//        queryBuilder.addAggregation(AggregationBuilders.terms("group_by_color").field("color"));
        queryBuilder.addAggregation(AggregationBuilders.terms("group_by_color").field("color")
                .subAggregation(AggregationBuilders.avg("avg_price")).field("price"));

        //执⾏查询，把查询结果直接转为聚合page
        AggregatedPage<Car> aggPage = (AggregatedPage<Car>)
                carDao.search(queryBuilder.build());
        //从所有的聚合中获取对应名称的聚合
        StringTerms agg = (StringTerms) aggPage.getAggregation("group_by_color");
        //从聚合的结果中获取所有的桶信息
        List<StringTerms.Bucket> buckets = agg.getBuckets();
        for (StringTerms.Bucket bucket : buckets) {
            String brand = bucket.getKeyAsString();
            long docCount = bucket.getDocCount();
//            System.out.println("color = " + brand + " 总数：" + docCount);
            // 取得内部聚合
            InternalAvg avg = (InternalAvg) bucket.getAggregations().asMap().get("avg_price");
            System.out.println("color = " + brand + " 总数：" + docCount+ "平均价格"+avg.getValue());
        }

    }
}
```