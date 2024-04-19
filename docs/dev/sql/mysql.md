# MySql

## find_in_set

find_in_set 使用方式与 in 相似只不过参数变为了使用 `,`分割的字符串,且写法也有一些区别.

```sql
/* 示例
  当在select时会如果搜索值在strlist中存在那么会返回查询的值,如下例就是会返回1
*/
select find_in_set(1,'1,2,3,4');

/* 示例
  当在where作为条件时则是会返回满足条件的数据
  当查询的数据为2时则是查询name中包含2的数据就会返回
 */
select * from ((select '1,2,3,4' as name)
union
(select '1,2,3' as name)
union
(select '1,2' as name)
union
(select '1' as name)) users where find_in_set(2,name)

```

## 递归查询

1. 父级递归查询子级

    ```sql
    WITH RECURSIVE cte as (
    select id,name,parent_id from '要查询的表' where id = '父级id'
    union ALL
    select temp.id,temp.name,temp.parent_id from '要查询的表' temp,cte c where temp.parent_id = c.id
    )
    select * from cte
    ```

2. 子id递归查询父级

    ```sql
    WITH RECURSIVE cte as (
    select id,name,parent_id from org where id = '子集id'
    union ALL
    select temp.id,temp.name,temp.parent_id from org temp,cte c where temp.id = c.parent_id
    )
    select * from cte
    ```

3. 输入父级获取子父级的组织拼接

    ```sql
    /*
        输出示例:
        测试顶级部门
        测试顶级部门->测试部门1
        测试顶级部门->测试部门1 -> 测试部门2
        测试顶级部门->测试部门1 -> 测试部门2 -> 测试部门3

    */
    WITH RECURSIVE cte as (
    select id,name,parent_id,name as path from '要查询的表' where id = '父级id'
    union ALL
    select temp.id,temp.name,temp.parent_id, concat(c.path ,'->',temp.name )as path from '要查询的表' temp,cte c where temp.parent_id = c.id
    )
    select * from cte
    ```

4. 输入子集获取从父级到当前子集的组织拼接

    ```sql
    /*
        输出示例:
        测试顶级部门
        测试顶级部门->测试部门1
        测试顶级部门->测试部门1 -> 测试部门2
        测试顶级部门->测试部门1 -> 测试部门2 -> 测试部门3

    */
    WITH RECURSIVE cte as (
    select id,name,parent_id,name as path from '要查询的表' where id =  '子集ID'
    union ALL
    select temp.id,temp.name,temp.parent_id, concat(temp.name ,'->', c.path )as path from '要查询的表' temp,cte c where temp. id = c.parent_id 
    )
    select * from cte
    ```

> ps: 前四个写法需要注意 MySql 版本为 8.0 以上,可以使用 `select version();` 来查看版本号

## ddl

```sql
-- 创建数据库,数据库不存在时创建
create database if not exists `database_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
