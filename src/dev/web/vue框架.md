---
icon: pen-to-square
date: 2024-07-22
category:
  - web
tag:
  - web
headerDepth: 5
---

# Vue框架

## 安装vue框架

1. 直接下载源码然后通过路径引入
    - 开发版本：<https://vuejs.org/js/vue.js>
    - 生产版本：<https://vuejs.org/js/vue.min.js>
2. 在线cdn引入的方式
    - `<script src="https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js"></script>`
3. 采用 npm 安装的方式
    - `npm install vue`
    - 现状: 都会采用npm的方式来进行正式项目开发
    - 注意: Vue.js 不支持 IE8 及其以下版本

下载地址: <https://cn.vuejs.org/v2/guide/installation.html>


## 官方 api

vue官方文档:  https://cn.vuejs.org/

vue开源项目:  https://github.com/opendigg/awesome-github-vue

vue.js 中文社区: https://www.vue-js.com/


## Vue

### vue 实例选项 el
作用:当前Vue实例所管理的html视图

值:通常是id选择器(或者是一个dom对象)

注意！！！！不要让el所管理的视图是html或者body!!!!
```javascript
new Vue({
// el: '#app' , id选择器
// el: '.app', class选择器
el: document.getElementById("#app") // dom对象
})
```

### 实例选项-data
Vue 实例的data(数据对象),是响应式数据(数据驱动视图)

1. data中的值{数据名字:数据的初始值}
2. data中的数据msg/count 可以在视图中通过{{msg/count}}访问数据
3. data中的数据也可以通过实例访问 vm.msg或者vm.$data.msg
4. data中的数据特点:响应式的数据->data中的数据一旦发生变化->视图中使用该数据的位置就会发生变化

```javascript
let vm = new Vue({
  el: "#app",
  data: {
  msg: 'abc',
  count: 100
  list: [1, 2, 3]
}
})

vm.msg = 200
console.log(vm)
console.log(vm.msg)
console.log(vm.$data.msg)
```

### 实例选项-methods

- methods其值为一个对象
- 可以直接通过 VM 实例访问这些方法,或者在指令表达式中使用。
- 方法中的 this 自动绑定为 Vue 实例。
- methods中所有的方法 同样也被代理到了 Vue实例对象上,都可通过this访问
- 注意,不应该使用箭头函数来定义 method 函数。理由是箭头函数绑定了父级作用域的上下文,所以
- this 将不会按照期望指向 Vue 实例

```javascript
let vm =new Vue({
    el:"#app",
    data:{
        name:"Hello world",
        name2:"Hello world2"
    },
    methods:{
        // 常规函数写法
        fn1:function(){
            console.log(this.name)
            this.fn2()
        },
        // es6 函数简写法
        fn2() {
            console.log(this.name2)
        }
    }
})
```

### 术语解释-插值表达式(重要)

作用:    会将绑定的数据实时的显示出来

形式:     `通过 {{ 插值表达式 }} 包裹的形式`

用法:    `{{js表达式、三元运算符、方法调用等}}`

```javascript
{{ a }}
{{a == 10 }}
{{a > 10}}
{{a + b + c}}
{{a.split('').reverse().join('')}}
{{a > 0 ? "成功" : "失败"}}

// 错误写法
<!-- 这是语句,不是表达式 -->
{{ var a = 1 }}
<!-- 流控制也不会生效,请使用三元表达式 -->
{{ if (ok) { return message } }}

// 正确写法
<!-- js表达式 -->
<p>{{ 1 + 2 + 3 }}</p>
<p>{{ 1 > 2 }}</p>
<!-- name为data中的数据 -->
<p>{{ name + ':消息' }}</p>
<!-- count 为data中的数据 -->
<p>{{ count === 1 }}</p>
<!-- count 为data中的数据 -->
<p>{{ count === 1 ? "成立" : "不成立" }}</p>

<!-- 方法调用 -->
<!-- fn为methods中的方法 -->
<p>{{ fn() }}</p>
```

### 系统指令-v-text和v-html
- 很像innerText和innerHTML
- v-text:更新标签中的内容
- v-text和插值表达式的区别
- - v-text 更新 整个 标签中的内容
- - 插值表达式: 更新标签中局部的内容
- v-html:更新标签中的内容/标签
- 可以渲染内容中的html标签
注意:尽量避免使用,容易造成危险 (XSS跨站脚本攻击)

### 系统指令-v-if 和 v-show
使用: v-if 和 v-show 后面跟着表达式的值是布尔值 ,布尔值来决定该元素显示隐藏

注意 : v-if 是直接决定元素 的 添加 或者删除 而 v-show 只是根据样式来决定 显示隐藏

- v-if 有更高的切换开销
- v-show 有更高的初始渲染开销。

如果需要非常频繁地切换,则使用 v-show 较好.

如果在运行时条件很少改变,则使用 v-if 较好

### 系统指令-v-on绑定事件
1. v-on:事件名="方法名"
2. @事件名="方法名"的方式

```html
// v-on:xx事件名='当触发xx事件时执行的语句'
<button v-on:click="fn">按钮</button>
// v-on的简写方法
<button @click="fn">按钮</button>
```

修饰符

- 使用:@事件名.修饰符="方法名"
- .once - 只触发一次回调
- .prevent - 调用 event.preventDefault() 阻止默认事件
```html
// v-on修饰符 如 once: 只执行一次
<button @click.once="fn">只执行一次</button>
// v-on修饰符 如 prevent: 阻止默认事件
<button @contextmenu.prevent="fn">阻止默认事件</button>
```

事件对象(扩展)
- 第一种:方法名中采用$event的方式传形参
- 第二种:直接写事件名 默认第一个参数为event事件参数

### 系统指令-v-for
#### 系统指令-v-for(数组)
v-for 指令基于一个数组来渲染一个列表

v-for 语法 item in items 或者 item of items

其中 items 是源数据数组 而 item 则是被迭代的数组元素的别名
```vue
<!-- 第一种方法 -->
<ul>
    <li v-for="item in items">
        {{ item.name }}
    </li>
</ul>
// data中的数组
data: {
    items: [
        { name: '大娃' },
        { name: '二娃' }
        ]
}
<!-- 第二种用法
    v-for 还支持一个可选的第二个参数,即当前项的索引
-->
<ul>
    <li v-for="(item, index) in items">
        {{ index }} {{ item.name }}
    </li>
</ul>
```


#### 系统指令-v-for(对象)
```html
<!-- 第一种方法
items 为对象 item为当前遍历属性对象的值
-->
v-for="item in items"
<!-- 第二种方法
item为当前遍历属性对象的值 key为当前属性名 index为当前索引的值
-->
v-for="(item, key, index) in items"
```

####  系统指令-v-for(key属性)(非常重要的面试题)
列表数据变动会导致 视图列表重新更新 为了提升性能 方便更新 需要提供一个属性 key
```html
<!--
    使用v-for时 建议给每个元素设置一个key属性 (必须加上)
    key属性的值 要求是每个元素的唯一值 (唯一索引值)
    好处:vue渲染页面标签 速度快
-->
<!--    数组-->
<li v-for="(v,i) in arr" :key="i">{{v}}</li>
<!--    对象-->
<li v-for="(v,k,i) in json" :key="i">{{v}}-{{k}}</li>
```

### 系统指令-v-bind
#### 系统指令-v-bind基本用法
作用: 绑定标签上的任何属性

场景: 当标签上的属性是变量/动态/需要改变的
```html
<!-- ID为数据对象中的变量值 -->
<p v-bind:id="ID"></p>
<!-- 简写 -->
<p :id="ID"></p>
```
#### 系统指令-v-bind绑定class(对象)
绑定class对象语法 :class="{ class名称: 布尔值}
`<p class="obox" :class="{obox:isBn}">内容</p> // isBn为 data选项中的属性`

注意 : 绑定class和原生class会进行合并(但是不会合并重复的)
#### 系统指令-v-bind-绑定class(数组)
绑定class数组语法 :class="[a,b]"

a、b为data属性的key

data中key对应的value 为class名字
```html
<p :class="[a,b]">内容</p>
data:{
    a:'obox',
    b:'left'
}
```
#### 系统指令-v-bind-绑定style(对象)
语法 :style="{css属性名:属性值}"
```html
<p :style="{color:a,fontSize:b}"></p>
//a、b为data属性的key
data: {
a: 'red',
b: '30px'
}
<!-- 注意 css属性名 例如 font-size要写成 fontSize 以此类推 原有的style会覆盖 -->
```
#### 系统指令-v-bind-绑定style(数组)
```html
<!-- 语法: -->
<div :style="[a,b]"></div>
<!-- a,b 为data的属性 -->
data: {
a: { color: "red" },
b: { fontSize: "30px" }
}
```
### 系统指令-v-model-基础用法
作用: 表单元素的绑定

特点: 双向数据绑定

- 数据发生变化可以更新到界面
- 通过界面可以更改数据
- v-model 绑定表单元素,会忽略所有表单元素的 value 、 checked 、 selected 特性的初始值

表单元素会将 Vue 实例的data中的数据作为数据来源,所以应该在 data 选项中声明初始值。
```html
<!-- 表单中设置value值没用 v-model会忽略 -->
<input type="text" v-model="msg" value="zhang">
<p>{{msg}}</p>
<!-- 在data中设置msg -->
data: {
msg: 'zhangsan'
}
```
#### 系统指令-v-model-原理及实现
表单元素绑定的数据改变 => data数据发生改变=> 页面数据变化

```html
<p>{{msg}}</p>
<input type="text" :value="msg" @input="fn($event)">

data: {
    msg: 'abc'
},
methods: {
    fn(e) {
        //msg=最新的value
        this.msg = e.target.value
    }
}
```
#### 系统指令-v-model-绑定其他表单元素
文档地址: https://cn.vuejs.org/v2/guide/forms.html
### 系统指令-v-cloak
场景: 解决页面初次渲染时 页面模板闪屏现象
1. 写入v-cloak指令
2. 在style里面加给v-cloak加上display: none;

注意: 避免多次写入标签 可以一次性 将v-cloak引用在实例视图上
```
<style>
[v-cloak] {
display: none;
}
</style>
<div id="app" v-cloak>
{{msg}}
</div>
```
### 系统指令-v-once
作用: 指令所在元素只渲染一次
```html
<p v-once>{{msg}}</p>
<input type="text" v-model="msg">
```
### 过滤器-过滤器的分析
看过滤器API的用法 <https://cn.vuejs.org/v2/guide/filters.html>

本地
```js
// 组件的选项中定义本地的过滤器
filters: {
    过滤器名字:function (value) {
        return ....
    }
}
```
全局
```js
// 如何注册一个全局过滤器
Vue.filter("过滤器名字", function(value) {
return ......
});
```
使用
```html
// 过滤器应该被添加在尾部 每个过滤器用管道符分隔
// 第一种用法在双花括号中
{{ 数据 | 过滤器名字 }}
// 第二种用法在 v-bind 中
<div v-bind:id="数据 |过滤器名字 "></div>
```

#### 过滤器-过滤器的基本用法
1. 在创建 Vue 实例 之前 定义全局过滤器Vue.filter()
2. 在实例的filter选项中定义局部过滤器
3. 在视图中通过{{数据 | 过滤器名字}}或者v-bind使用过滤器

```js
// 如何注册一个全局过滤器
Vue.filter("过滤器名字", function(value) {
    return value.charAt(0).toUpperCase() + value.substr(1);
});
// 如果注册一个局部过滤器
filters: {
    过滤器名字:function (value) {
        return value.charAt(0).toUpperCase() + value.substr(1);
    }
}
```
#### 过滤器-传参数和串联使用
过滤器可以传递参数,接收的第一个参数永远是前面传递过来的过滤值

过滤器也可以多个串行起来并排使用
```js
// 多个过滤器用 | 分割
<p>{{count|a('元')|b}}</p>

// 定义过滤器
filters：{
    // 第一个参数永远是前面传递过来的过滤值
    a:function(val,y){
    // val 是count值
    // y 是‘元’
    }
}
```
### 表格案例-使用过滤器完成日期格式处理
路径 : 格式化需要借助第三方插件

1. 引入第三方格式化日期插件 moment.js
2. 定义格式化日期过滤器
3. 实现其格式化功能
4. 使用过滤器
```JS
// 全局过滤器代码
Vue.filter("fmtDate", function (v) {
return moment(v).format('YYYY-MM-DD h:mm:ss a')
})
```
### ref属性-获取DOM
给元素定义ref属性, 然后通过$refs.名称 来获取dom对象

```HTML
<input type="text" ref="txt">// 定义ref
// 获取DOM的value值
methods: {
    getVal() {
        //获取dom
        console.log(this.$refs.txt)
    }
}
```
### 自定义指令
#### 全局自定义指令
使用场景:需要对普通 DOM 元素进行底层操作,这时候就会用到自定义指令

分类:全局和局部

全局自定义指令:

1. 在创建 Vue 实例之前定义全局自定义指令Vue.directive(参数1,参数2)
    第一参数是指令名称
    第二参数是一个对象
    对象中要实现inserted方法
    inserted方法中的参数为当前指令 所在元素的DOM对象

```js
// 1.注册一个自定义指令
Vue.directive( '指令名称' , {
inserted(参数){ //参数为使用指令的DOM
//操作
}
})
// 2.使用自定义指令
<input type="text" v-指令名称>

// 示例(全局自动聚焦的自定义指令)
Vue.directive("focus", {
inserted(dom) {
dom.focus();
}
});
// 使用自定义指令
<input type="text" v-focus>
```
#### 局部自定义指令
```js
//局部指令在vue实例内部定义
directives: {
"focus": {
inserted(dom) {
dom.focus();
}
}
}
// 调用
<input type="text" v-focus>
```
### 实例选项-计算属性-文档分析
使用: 在Vue实例选项中 定义 computed:{ 计算属性名: 带返回值 的函数 }

示例: 通过计算属性实现字符串的翻转

1. 定义数据对象
2. 实现计算属性方法
3. 使用计算属性
    ```js
    data: { message: 'hello' },
    computed: { reverseMessage: function () { // this指向 vm 实例
    return this.message.split('').reverse().join('') }
    } // computed里的函数直接用 不加() 但是必须得return
    {{ message }}
    {{ reversedMessage }}
    ```
**计算属性 和 methods方法的区别:**
1. 计算属性不需要调用形式的写法 而methods方法必须采用 方法() 调用的形式
2. 计算属性依赖data中的数据变化,如果data并没有发生变化,则计算属性则会取缓存的结果,
3. methods不论data变化与否 只要调用 都会重新计算

`注意:`当数据对象中 message发生变化时 计算属性也会重新计算计算=> 改变页面视图


## 在Vue中实现发送网络请求
Vue.js中发送网络请求本质还是ajax,我们可以使用插件方便操作。

1. vue-resource: Vue.js的插件,已经不维护,不推荐使用
2. axios : 不是vue的插件 ,可以在任何地方使用,推荐

说明 : 既可以在 浏览器端 又可以在 node.js 中使用的发送http请求的库,支持Promise ,不支持jsonp

如果遇到jsonp请求, 可以使用插件 jsonp 实现

### axios-介绍-及基本使用
```js
// 基本用法
axios.get(url).then((res) => {
// 请求成功 会来到这 res响应体
}).catch((err) => {
// 请求失败 会来到这 处理err对象
})

// 获取
axios.get('http://localhost:3000/brands').then().catch()
// 删除
axios.delete('http://localhost:3000/brands/1').then().catch()
// 添加
axios.post('http://localhost:3000/brands', {name: '小米', date: new Date()}).then().catch()
// 修改
axios.put('http://localhost:3000/brands/1', {name: '小米', date: new Date()}).then().catch()
// get模糊搜索
axios.get("http://localhost:3000/brands?name_like=" + "aaa").then().catch()
```
#### 表格案例-axios-列表
1. 引入axios
2. 在mounted(相当于window.onload)函数中 发送请求获取数据
3. 获取的数据赋值给list列表
```js
// mounted函数 加载完DOM再执行的函数 相当于window.onload
mounted() {
    axios.get("http://localhost:3000/brands").then(result => {
        this.list = result.data;
    });
}
```
#### 表格案例-axios-删除商品
1. 删除方法中传入ID
2. 删除方法中调用删除接口
3. 删除完成后重新调用获取数据
```js
delItem(id) {
    if (confirm("确定删除此条记录")) {
        axios
        .delete("http://localhost:3000/brands/" + id)
        .then(result => {
            this.getList(); // 重新调用拉取数据
        });
    }
}
```
#### 表格案例-axios-添加商品
1. 添加方法中调用新增接口
2. 添加成功后重新拉取数据
3. 清空输入框
```js
addItem() {
// 添加商品
    axios.post("http://localhost:3000/brands", {
        name: this.name,
        date: new Date()
    })
    .then(res => {
    if (res.status == 201) {
        this.getList(); // 重新拉取数据
        this.name = ""; // 清空文本框
    }
    });
}
```
#### 表格案例-axios-搜索功能-实现
1. 监听搜索内容
2. 在监听函数中 发送axios请求实现模糊搜索
3. 把返回值赋值给list列表

```js
// 实例代码
watch: {
    searchval(newV, oldV) {
        axios.get("http://localhost:3000/brands?name_like=" + newV)
        .then((res) => {
            this.list = res.data
        }).catch(err => {
            console.log(err)
        })
    }
}
```

###  实例选项-watch-基本使用
监听data数据变化时 自动触发函数

计算属性和watch区别：
- 计算属性 必须要有返回值 所以说不能写异步请求 因为有人用它的返回值(插值表达式)
- watch选项中可以写很多逻辑 不需要返回值 因为没有人用它的返回值
```js
// 基本用法
data: {
    msg: 'abc'
},
watch: {
// data中的属性msg发生改变时 自动触发该函数
    msg(newV, oldV) {
        console.log(newV, oldV)
    }
}
```
### 组件
#### 组件特点
组件和实例相似之处: data/methods/computed/watch 等一应俱全
注意：

- data和Vue实例的区别为
- 组件中data为一个函数且需要返回一个对象
- 组件没有el选项
- template 代表其 页面结构 (有且只要一个根元素)

每个组件都是 独立 的 运行作用域、数据、逻辑没有任何关联
####  全局组件
全局和局部: 注册方式不同 应用范围不同

注意: 注意命名规范

路径: 实现一个全局组件
1. 定义一个全局组件
2. 写入组件选项
3. 使用组件
```
// 注册组件名称 推荐 小写字母 加横向的结构
Vue.component("content-a", {
    template: `<div>
        {{count}}
        </div>`,
    data() {
        return {  count: 1    };
        }
});
<content-a></content-a>
// 注意 data中必须为一个返回对象的函数
// template必须有且只有一个根元素
```
#### 局部组件
1. 在实例选项compoents中定义局部组件名字
2. 在组件名字相对应的对象中定义选项(template、data()、.....)
3. 在实例视图中使用组件
```js
// 1.实例选项compoents中定义局部组件名字
components: {
// 2.在组件名字相对应的对象中定义选项(template、data()、.....)
    "z-j": {
        template: `<div>我是z-j组件--{{msg}}</div>`,
    data() {
            return {
                msg: "abc"
            }
        }
    }
}
// 3.在实例视图中使用组件
<div id="app">
<z-j></z-j>
</div>
```
#### 组件嵌套
1. 全局组件 嵌套 全局组件
2. 局部组件 嵌套 全局组件
```js
// 全局组件
Vue.component('child-a', {
    template: "<div>我是child-a组件</div>"
})
Vue.component('child-b', {
    template: "<div>我是child-b组件</div>"
})
// 全局嵌套全局(此时 child-a和child-b 是parent-a的子组件)
Vue.component('parent-a', {
    template:
        `<div>
            <child-a></child-a>
            <child-b></child-b>
        </div>`
})
// 局部嵌套全局 (此时 child-a和child-b 是com-a的子组件)
components: {
    "com-a": {
        template: `
            <div>
                <child-a></child-a>
                <child-b><child-b>
            </div>
        `
}}
```
#### 组件通信的几种情况
组件嵌套 => 父子组件 => 父组件传递数据给子组件使用 => 组件之间的传值 => 也叫组件之间的通信

组件之间的通信根据关系的可以分为:
1. 父子组件通信
    - 父组件到子组件
    - 子组件到父组件
2. 兄弟组件通信
#### 父子组件传值-props属性
父子组件的传值有多种方法, 兄弟组件的通信也有自己的写法
1. 子组件的 props 属性值是一个数组
2. 数组中的值 绑定为子组件上的属性 用来接受父组件的传值
3. 在子组件的template中就可以使用 绑定的属性(msg)拿到父组件传递的值
```js
// 调用组件
<div id="app">
    <child-a :msg="msgParent"></child-a>
</div>
// 子组件
Vue.component("child-a", {
    template: ` <div>
        我是子组件
        {{count}}是自己的data中的数据count
        {{msg}}是来源于外部组件的数据</div>
        </div>`,
    data() {
        return {
            count: 100
        }
    },
    props: ["msg"]
})
// 父组件(根组件)
new Vue({
    el：'#app'
    data: {
        msgParent: "我是父组件"
    }
})
```
#### 组件和模块的区别
模块：侧重于功能或者数据的封装

组件：包含了 template、style 和 script,而它的 script 可以由各种模块组成

## 单页应用(简称SPA)
- 传统模式 每个页面及其内容都需要从服务器一次次请求 如果网络差, 体验则会感觉很慢
- SPA模式, 第一次 加载 会将所有的资源都请求到页面 模块之间切换 不会再请求服务器

SPA优点：

1. 用户体验好,因为前端操作几乎感受不到网络的延迟
2. 完全组件化开发 ,由于只有一个页面,所以原来属于一个个页面的工作被归类为一个个 组件 .


SPA缺点:

1. 首屏 加载慢(可以只加载所需部分)
2. 不利于 SEO ( 服务端渲染 可以解决)
3. 开发难度高 (框架)
### 单页应用 SPA-实现原理
- 可以通过页面地址的锚链接来实现spa
- hash(锚链接)位于链接地址 # 之后
- hash值的改变 不会触发 页面刷新
- hash值是url地址的一部分,会存储在页面地址上 我们可以获取到
- 可以通过 事件监听 hash值得改变
- 拿到了hash值,就可以根据不同的hash值进行不同的 内容切换
### 路由-js 实现路由
通过上一个小节内容可以得出 采用 hash值改变 的特性来进行前端路由切换

路径 :

1. 实现导航结构('#/aaa')
2. onhashchange事件监听hash值的改变
3. 获取hash值 根据值的不同 改变视图内容
### 路由-vue-router-文档
- Vue-Router 是 Vue.js 官方的路由管理器。
- 它和 Vue.js 的核心深度集成,让构建单页面应用变得简单
- 实现根据不同的请求地址 而 显示不同的内容
- 如果要使用 vue开发项目,前端路由功能 必须使用 vue-router来实现

用法:
1. CDN
2. 本地文件
3. npm

注意: 本地文件引入vue-router ,一定要先引入vue.js,再引入vue-router

### 路由-vue-router的基本用法
1. 导入vue和vue-router
2. 设置HTML中的内容
3. 实例化路由对象,配置路由规则
4. 创建路由对应的组件
5. 把router实例挂载到vue实例上

```html
<!-- 2.设置HTML中的内容
router-link 最终会被渲染成a标签,to指定路由的跳转地址 -->
<router-link to="/users">用户管理</router-link>
<router-link to="/home">首页展示</router-link>
<!-- 路由匹配到的组件将渲染在这里 -->
<router-view></router-view>
```
```js
// 3.配置路由规则
var router = new VueRouter({
    routes: [
        { path: '/users', component: Users }
        { path: '/home', component: Home }
    ]
});

// 4.创建组件
let Home = {
    template: '<div>这是Home内容</div>'
};
let Users = {
    template: '<div>这是用户管理内容</div>'
};

// 5.把router实例挂载到vue实例上
var vm = new Vue({
    el: '#app',
    router
});
```
### 路由-vue-router-动态路由
点击 列表页 跳转到 详情页 时,跳转的链接需要携带参数,会导致 path 不同

当path不同却需要对应同一个组件时,需要用到动态路由这一概念

1. 标签上传入不同的值
    ```html
    <router-link to="/item/8">小米电视</router-link>
    <router-link to="/item/9">华为电视</router-link>
    <router-view> </router-view>
    ```
2. 路由规则中 尾部 添加动态参数 id
    ```
    { path: '/item/:id', component: Items }
    ```
3. 在组件内部可以使用$route.params 获取当前路由对象的动态参数
    ```js
    let Items = {
        template: '<div>我是商品详情页 {{ $route.params.id }}</div>',
        mounted： {
            console.log(this.$route.params.id);
        }
    }
    ```
### 路由-vue-router-to 属性赋值
```html
<!-- 常规跳转 -->
<!-- <router-link to="/aaa">aaa</router-link> -->
<!-- 变量 -->
<!-- <router-link :to="bbb">bbb</router-link> -->
<!-- 根据对象name跳转 --> (注意:name值是字符串)
<!-- <router-link :to="{name:'ccc'}">ccc</router-link> -->
<!-- 根据对象path跳转 -->(注意：必须得加上/ 不然容易错乱)
<!-- <router-link :to="{path:'/ddd'}">ddd</router-link> -->
<!-- 带参数的跳转 --> (注意获取参数route 不要写成router)
<!--<router-link :to="{name:'eee',params:{id:1}}">体育</router-link> -->
<router-view></router-view>
```
### 路由-vue-router-重定向
```js
path: "/bj",
redirect: "/sh", // 强制跳转上海
component: {
    template: `<div>体育</div>`
}
```
### 路由-vue-router-编程式导航
```js
methods: {
    goPage() {
    // 跳转到新闻页面
    this.$router.push({
        path: "/news"
    });
}}
```
### 路由的激活样式
当前路由在导航中是拥有激活class样式的

审查导航元素,可以发现 激活样式 `<a href="#/bj" class="router-link-exact-active router-link-active">北京</a>`
### 路由-vue-router-嵌套路由
如果存在 组件嵌套 ,就需要提供多个视图容器

同时,router-link和router-view 都可以添加类名、设定样式

路径:

1. 在原有的一级导航的template里面 配置 二级导航的router-link和router-view
2. 在相对应的一级导航路由配置选项children里面 配置 二级导航的路由和模板
```js
path: '/music',
component: Music,
//子路由配置 在children选项
children: [{
    path: 'lx',
    component: Lx
},...]
```
## 过度动画
基本用法就是给我们需要动画的标签外面嵌套 transition 标签 ,并且设置name属性

Vue 提供了 transition 的封装组件,列表中更新,移除,新增 情形中,可以给任何元素和组件添加进入/离开过渡
```html
<transition name="fade">
<div v-show="isShow" class="box"></div>
</transition>
```
进入:
1. fade-enter：进入的 初始状态
2. fade-enter-to: 进入的 过渡结束状态(2.1.8版及以上)
3. fade-enter-active：进入的 过渡效果
离开:
1. fade-leave: 离开的 初始状态
2. fade-leave-to: 离开的 过渡结束状态(2.1.8版及以上)
3. fade-leave-active：离开的 过渡效果


## vue-cli 工具-介绍
介绍: vue-cli 是一个 辅助开发工具 => 代码编译 + 样式 + 语法校验 + 输出设置 + 其他 ...

作用: 可以为开发者提供一个 标准的项目开发结构 和配置 开发者不需要再关注其他 vue-cli 一个 命令行 工具,最新版本也支持 图形化 操作,可快速搭建大型网页应用
### vue-cli-安装
```shell
# 说明: vue-cli本质上是一个npm包,也需要通过npm去安装下载
# 全局安装脚手架 默认安装的最新版本 4.0+
npm i -g @vue/cli
# 安装完成后 可通过 vue命令 来进行检查 脚手架是否安装成功  查看版本
# 查看脚手架版本号
vue -V
# 和上面等价
vue --version
```

问题 : 默认安装的4.0+ 版本,但是企业很多还在用2.0+版本 怎么破?
执行以下命令就可以 2.0 和 4.0 兼得

2.0和4.0创建项目的命令是不一样的

`npm install -g @vue/cli-init // 安装桥接工具 将2.0的功能补齐到目前的脚手架`

vue生成的模板的有难有易

简单业务 => 简易模板

复杂业务 => 内容丰富模板
###  vue-cli-创建项目
 文件目路径不能有中文
创建: 采用 cli 2.0的特性 (生成简易模板)
```shell
# 1.heroes 创建的项目名称
$ vue init webpack-simple heroes // webpack-simple 为模板名称 固定写法
# 2.切换到当前目录
$ cd heroes
# 3.安装依赖
$ npm install
# 4.启动运行项目
$ npm run dev
```
创建： 采用 cli 4.0 特性 (两种 默认 /选填)
```shell
# 4.0下创建项目
$ vue create heroes // create(创建) 为关键字
# 切换到当前目录
$ cd heroes
# 在开发模式下 启动运行项目
$ npm run serve
```
注意 4.0 +创建项目时 有两种模式, 一种 默认模式 , 一种选择模式,

默认模式:一种标准的模板

选择模式: 可以根据自己的需求选择需要的工具和模式

配置:

在vue.config.js中直接配置,例如
```js
module.exports = {
    lintOnSave: true, // 在保存代码的时候开启eslint代码检查机制
    devServer: { // 实时保存、编译的配置段
        open:true, // 自动开启浏览器
        port: 12306 // 服务运行端口
    }
}
```
### vue-cli-项目目录解释
```
|-- node_modules // 项目需要的依赖包
|-- public // 静态资源存储目录
|  |-- index.html // 项目主容器文件
|  |-- favicon.ico // 项目默认索引图片
|-- src
|  |-- assets // 放置一些静态资源文件,例如图片、图标、字体
|  |-- components // 公共组件目录
|  |-- views // 业务组件目录
|  |-- App.vue // 顶层根基路由组件
|  |-- main.js // 主入口文件
|  |-- router.js // 路由配置文件
|-- .editorconfig // 代码规范配置文件
|-- .eslintrc.js // eslint代码规范检查配置文件
|-- .gitignore // git上传需要忽略的文件格式
|-- babel.config.js // babel配置文件
|-- package-lock.json // 依赖包版本锁定文件
|-- package.json // 项目基本信息配置文件
|-- postcss.config.js // css预处理器配置文件
|-- vue.config.js // webpack 配置文件(与webpack.config.js作用一致)
```
### vue-cli-简化模板代码
介绍: 在cli开发模式下, 一个*.vue文件就是一个组件

- template 组件的页面结构 代表它的 html 结构
- 必须在里面放置一个 html 标签来包裹所有的代码
- 我们在其他地方写好了一个组件,然后就可以在当前template中引入
- script 组件的逻辑结构及数据对象
- style 组件的样式
- 就是针对我们的 template 里内容出现的 html 元素写一些样式

注意 : vue-cli的作用就是让我们把精力放在业务编码上,一切准备的工作交给vue-cli去做

### 案例-效果演示
#### 案例-导入素材
将项目所需样式导入到项目中

安装 bootstrap固定版本 `npm i bootstrap@3.3.7`

安装完成之后 ,在入口处引入js文件
```
import "./../node_modules/bootstrap/dist/css/bootstrap.css"; // 引入
import "./assets/index.css"; // 引入index.css
```
#### 案例-提取公共组件-头部-侧边栏-列表
1. 新建vue文件
2. 拷贝html静态内容到 template中
3. 在app.vue中引入组件
4. 注册在app.vue的组件中
5. 在app.vue的模板中使用注册组件
#### 案例-路由功能
步骤:
1. 安装路由
2. 在main.js中引入 路由模块
3. 在vue-cli中使用router
4. 配置router-link
    - router-link上的tag属性 可以指定渲染成什么html元素
5. 实例化router 完善路由表
    - 路由表需要的组件从外部引入
6. 在App.vue中加入路由承载视图(router-view)

```shell
1. npm i vue-router // 安装路由模块
2. import VueRouter from 'vue-router' // 引用router
3. Vue.use(VueRouter) // 使用router
4. <router-link tag="li" to="/heroes">
<a href="#">英雄列表</a>
</router-link>
....
5.
import AppList from "./app-list.vue";
import Foo from "./foo.vue";
import Bar from "./bar.vue";
const router = new VueRouter({
// 路由表
routes: [
{ path: "/heroes", component: AppList },
{ path: "/foo", component: Foo },
{ path: "/bar", component: Bar }
]
});
// router加入实例
new Vue({
el: '#app',
render: h => h(App),
router
})
6.
<div>
<AppHeader></AppHeader>
<div class="row">
<AppSilder></AppSilder>
<div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
<!--加入承载视图-->
<router-view></router-view>
</div>
</div>
</div>
```
#### 案例-提取路由模块
1. 把路由业务抽取到router.js
    注意要引入vue
2. 在最后一行把router对象暴露出去 `export default router`
3. 在main.js中引入router.js

#### 案例-列表渲染
1. 安装axios 插件
2. 人物列表组件中引入 axios ,
3. 定义data选项定义list列表数据
4. 请求列表的方法封装 获取数据赋值list列表
5. 在mounted事件(相当于window.onload)中调用获取数据方法
6. 根据数据渲染列表
```
// 1.安装axios 插件
npm i axios
// 2.引入axios
// 3.定义数据
data() {
return {
list: []
};
}
// 4.请求人物列表的方法封装
loadData() {
//restful规则
axios.get("http://localhost:3000/heroes").then(result => {
this.list = result.data;
})
}
// 5.实例完成事件
mounted() {
this.loadData();
},
// 6.根据数据渲染列表
<tr v-for="item in list" :key="item.id">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.gender}}</td>
<td>
<a href="javascript:;">edit</a> &nbsp;&nbsp;
<a href="javascript:;">delete</a>
</td>
</tr
```
#### 案例-删除功能
1. 注册删除事件
    因为删除需要id 所以定义删除方法的时候 把id传进去
2. 定义删除方法 实现删除逻辑
3. 判断删除成功 刷新数据

```
// 1.注册删除事件
<a href="javascript:；" @click="delItem(item.id)">删除</a>
// 2.定义删除方法
// id为要删除id的方法
delItem(id) {
if (confirm("确认删除此条数据")) {
axios.delete("http://localhost:3000/heroes/" + id).then(result => {
// 3. 判断删除状态 是否成功
if (result.status === 200) {
this.getData(); // 刷新数据
}
});
}
}
```
#### 案例-渲染新增组件
1. 新建add.vue组件 写入静态内容(拷贝静态资源)
2. 在路由表中配置添加功能的路由
3. 给列表组件的添加按钮 添加hash 以对应路由表
4. 根据业务场景调整页面模板

```
// 2.在路由表中配置添加功能的路由
{ path: "/add", component: Add } // 引入组件 配置路由
// 3.给列表组件的添加按钮 添加hash 以对应路由表
<a class="btn btn-success" href="#/add">添加</a>
// 4.根据业务场景调整页面模板
<div>
<h2 class="sub-header">添加人物</h2>
<form>
<div class="form-group">
<label for="exampleInputEmail1">用户名</label>
<input type="email" class="form-control" id="exampleInputEmail1" placeholder="请输入姓名"
/>
</div>
<div class="form-group">
<label for="exampleInputPassword1">性别</label>
<input type="password" class="form-control" id="exampleInputPassword1" placeholder="请输入
性别" />
</div>
<button type="submit" class="btn btn-success">添加人物</button>
</form>
</div>
```
#### 案例-新增功能完善
步骤: 添加功能的实现

1. 定义表单数据 和 表单进行绑定
2. 给确定按钮 添加点击事件和方法
3. 实现添加方法的逻辑
4. 判断填报信息是否为空
5. 发送axios请求以post方式 调用 添加的接口地址
    成功返回状态码是201
6. 成功以后 利用编程式导航 跳转到 ’/heroes‘
```
//1.添加数据
data() {
return {
// 定义一个数据对象 存储 姓名和性别
formData: {
name: "", // 姓名
gender: "" // 性别
}
};
}
<!-- 2.给添加确定注册一个事件 -->
<button type="submit" class="btn btn-success" @click="addHero">确定</button>
// 3.确定按钮方法
addHero() {
// 4.判断填报信息是否为空
if (this.formData.name && this.formData.gender) {
// 5.发送请求 添加人物信息
axios.post("http://localhost:3000/heroes", this.formData)
.then(result => {
// 注意这里添加成功的状态码 是 201
if (result.status === 201) {
// 6. 添加成功之后 要跳转回列表页
// 编程式导航
this.$router.push({ path: "/heroes" });
} else {
alert("添加失败");
}
});
} else {
alert("提交信息不能为空");
}
}
```

#### 案例-显示编辑数据
1. 添加编辑路由 注意 由于需要拿到编辑数据的标识 所以需要动态路由
2. 给 编辑按钮 添加 跳转路由的属性
3. 定义获取英雄数据方法
    1. 通过$router.params来获取动态id
    2. 根据id发送axios请求 获取英雄数据
4. 在mounted事件中 调用加载英雄方法

```
// 1.添加动态路由
{ path: "/edit/:id", component: Edit } // 编辑组件 动态路由
// 2.编辑按钮添加跳转的属性
<router-link :to="{path:'/edit/'+item.id }">编辑</router-link>
// 3.通过id获取英雄数据
loadHero() {
const { id } = this.$route.params; // 通过参数获取id
if (id) {
//判断id
axios.get("http://localhost:3000/heroes/" + id).then(result => {
this.formData = result.data; // 获取数据并赋值给表单对象
});
}
}
// 4.调用获取英雄数据的方法
mounted() {
this.loadHero();
}
```
#### 案例-编辑-提交功能
1. 定义提交方法
2. 实现提交方法的逻辑
    1. 判断提交内容非空
    2. 获取动态参数id
    3. 发送aixos请求put方式 拼接id 把修改的数据带上
    4. 成功以后 利用编程式导航回到 "/heroes"
```
// 编辑英雄
editHero() {
if (this.formData.name && this.formData.gender) {
const { id } = this.$route.params;
axios
.put("http://localhost:3000/heroes/" + id, this.formData)
.then(result => {
if (result.status === 200) {
this.$router.push({ path: "/heroes" });
} else {
alert("编辑失败");
}
});
} else {
alert("提交内容不能为空");
}
}
```
#### 案例优化-axios 统一导入
1.  在入口main.js文件中引入axios,并赋值给全局Vue对象的原型
`Vue.prototype.$http = Axios; `

    //所有的实例都直接共享拥有了 这个方法
2. 调用接口时 采用 实例.属性的方式即可调用
   
   // 把以前用到axios的地方 换成 this.$http

#### 案例优化-设置baseUrl
1. 给axios中的baseUrl设置常态值

    `Axios.defaults.baseURL = "http://localhost:3000"; // 设置共享的方法`
2. 改造所有的的请求
    ```
    // 没改造之前
    'http://localhost:3000/heroes/'
    // 设置完常态值
    '/heroes/'
    ```
#### 案例优化-统一设置激活样式
router.js 的路由表上面加上 `linkActiveClass: "active",`   

active为bootstrap中的 一个class样式



