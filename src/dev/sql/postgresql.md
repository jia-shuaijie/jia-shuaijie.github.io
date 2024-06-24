---
icon: pen-to-square
date: 2024-06-24
category:
  - 后端开发
  - 数据库
tag:
  - sql
---
# PostgreSql

## 不常用sql方法

### 查询所有表中是否存在某个字段

```sql
select *
from information_schema.columns
WHERE table_schema = 'public'
  and column_name = '要查询的字段名';
```

### 自增序列

```sql
-- 生成自增序列 定义自增序列时一般使用 表名称_id_seq 来表示
CREATE SEQUENCE "public"."xxx_id_seq"
INCREMENT 1
MINVALUE  1
NO MAXVALUE
START 1
CACHE 1;

-- 将自增序列以下面这种形式弄好后,放至ID 默认值即可
nextval('xxx_id_seq'::regclass)

-- 查询序列最大值
select nextval('xxx_id_seq'::regclass)

--将当前序列值设置为当前表最大ID值
SELECT setval( 'xxx_id_seq', (SELECT MAX(id) FROM `表名称` ) +1 );
```

## 递归查询

### 父级递归查询子级

```sql
WITH RECURSIVE cte as (
 select id,name,parent_id from '要查询的表' where id = '父级ID'
 union all
 select temp.id,temp.name,temp.parent_id from  '要查询的表' temp INNER JOIN  cte c  on temp.parent_id = c.id
)
select * from cte
```

### 子级递归查询父级

```sql
WITH RECURSIVE cte as (
 select id,name,parent_id from '要查询的表' where id = '子集ID'
 union all
 select temp.id,temp.name,temp.parent_id from  '要查询的表' temp INNER JOIN  cte c  on temp.id = c.parent_id
)
select * from cte
```

## 根据父级获取子父级的组织拼接

```sql
/*
    输出示例:
    测试顶级部门
    测试顶级部门->测试部门1
    测试顶级部门->测试部门1 -> 测试部门2
    测试顶级部门->测试部门1 -> 测试部门2 -> 测试部门3

 */
WITH RECURSIVE cte as (
 select id,name,parent_id,cast(name as TEXT) as path from '要查询的表' where id = '父级ID' and is_delete = 0
 union all
 select temp.id,temp.name,temp.parent_id,cast( c.path|| '->'||  temp.name  as TEXT)path from  '要查询的表' temp INNER JOIN  cte c  on temp.parent_id = c. id
 where temp.is_delete = 0
)
select * from cte
```

### 根据子集获取从父级到当前子集的组织拼接

```sql
/*
    输出示例:
    测试顶级部门
    测试顶级部门->测试部门1
    测试顶级部门->测试部门1 -> 测试部门2
    测试顶级部门->测试部门1 -> 测试部门2 -> 测试部门3

 */
WITH RECURSIVE cte as (
 select id,name,parent_id,cast(name as TEXT) as path from '要查询的表' where id = '子集ID'
 union all
 select temp.id,temp.name,temp.parent_id,cast( temp.name || '->'|| c.path  as TEXT)path from  '要查询的表' temp INNER JOIN  cte c  on temp.id = c. parent_id
)
select * from cte
```

## Json操作

可以参考[官网](http://www.postgres.cn/docs/12/functions-json.html)Json 字符串的解释

### json和 jsonb操作符

![json&jsonb](https://img.gsimg.top/2024/04/08/nt19ku.png)

### 额外jsonb操作符

![jsonb](https://img.gsimg.top/2024/04/08/nt13np.png)
