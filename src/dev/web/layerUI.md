---
icon: pen-to-square
date: 2024-07-22
category:
  - web
tag:
  - web
---
# layerUI
官网地址为: https://www.layui.com/v1/doc/modules/layer.html

简单使用:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="js/jquery2.1.4.js"></script>
    <script src="layui/layui.js"></script>
</head>
<body>
    <button onclick="msgTest()">msg函数(重点)</button>
    <button onclick="loadTest()">load函数(重点)</button>
    <button onclick="msg_loadTest()">msg函数(load效果)</button>
    <button onclick="alertTest()">alert函数</button>
    <button onclick="tipsTest()">tips函数</button>
<P>
    锄禾日<span id="s1">当午</span>
</p>
</body>
</html>
<script>
    function msgTest() {
        // layer.msg("提示的文字")
        layer.msg("提示的文字",function () {
            // 窗口关闭时执行 会有抖动效果 而上面没有
        });
    }

    function loadTest() {
        // 会有返回值 返回的是弹出层的id
        var windowId = layer.load(0) // 0-6 之间 推荐使用0
        // 不写延时的话会直接执行,没有什么效果
        layer.close(windowId)
        // setTimeout 超时 
        // setTimeout(function () {
        //     // 通过窗口id ,关闭窗口
        //     layer.close(windowId)
        // },2000)
    }
    
    function msg_loadTest() {
        layer.msg("提示的文字",{icon:16,shade:0.01})
    }

    function alertTest() {
        layer.alert("文字内容",{icon:10})
    }

    function tipsTest() {
        layer.tips("文字内容","#s1",{tipsMore:true,tips:1})
    }
</script>
```