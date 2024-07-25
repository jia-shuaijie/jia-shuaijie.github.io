---
icon: pen-to-square
date: 2024-07-23
category:
  - android
order: 2
---
# Android系列之UI
> 学习于: <http://8.136.122.222/book/primary/>

android的UI可以分为两类,一类叫做ViewGroup容器,一类叫做View视图.
- View视图: TextView,Button,InageView都是常见的视图.
- ViewGroup视图: 内部可以承载/放置/添加View视图.

基础布局容易
- LinearLayout线性布局: 横着或竖着按顺序排列.
- RelativceLayout相对布局: 起始坐标时屏幕左上角,以同级或上级为参考系定位位置.
- FrameLayout帧布局: 像千层饼一样,一层压着一层.
- ConstrainLayout约束布局: Google于2016年新发布的一种布局方式,它不在android的基础api包里,需额外引入.
- ~~AbsoluteLayout~~绝对布局: 以屏幕左上角为参考系,定位自己的位置,android2.2后废弃.
- ~~GridLayout~~网格布局: 可以指定行数列数,子控件自动根据行列数进行分配位置,于android 4.0后新增进api中
- ~~TableLayout~~表格布局: 类似于网格布局,以一个TableRow标签定义为一行或一列.

## LinearLayout线性布局
线性布局就是**从左到右**或**从上到下**按顺序排列的一种布局.

| 属性                       | 可选值                                                                                                                                                           | 说明                                                                                                                                                     |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| orientaion                 | vertical: 垂直排列 horizontal: 水平排列                                                                                                                         | 也就是这个线性布局到底是水平还是垂直方向逐个排列                                                                                                         |
| layout_width layout_height | 1. match_parent: 填充父容器的剩余空间 2. wrap_content: 根据子视图宽高自适应自己的宽高 3. 自定义大小 单位为`dp`                                                   | layout_width和layout_height 是android中控件的必要属性,规定了控件的宽度和高度,这两个的属性的值可以是自定的值,也可以根据内容自适应,还可以填充整个剩余空间. |
| background                 | #ff0000 红色                                                                                                                                                     | 填充背景色                                                                                                                                               |
| gravity                    | 1.center：所有子视图相对于父容器居中显示 2.horizontal_center:所有子容器的横向方向上相对父容器居中显示 3.vertical_center:所有子视图的纵向方向上相对父容器居中显示 | 决定子控件相对该父容器的位置                                                                                                                             |
| layout_gravity             | 1.center：该容器相对于它的父容器居中显示 2.horizontal_center:该容器横向方向上相对它的父容器居中显示 3.vertical_center:该容器纵向方向上相对它的父容器居中显示     | 决定该容器相对它的父容器的位置                                                                                                                           |
| weight                     |                                                                                                                                                                  | 按比例分配父容器剩余的宽度或高度                                                                                                                         |

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"            //子视图相对父视图居中显示
    android:orientation="horizontal">   //所有子视图横向摆放
     .........  省略
</LinearLayout>
```

## 相对布局RelativeLayout
相对布局在摆放子视图位置时，按照指定的参考系来摆放子视图的位置，默认以屏幕左上角(0,0)位置作为参考系摆放位置

### 相对于父元素 7个常用属性

| 属性                     |   可选值   | 说明                           |
| :----------------------- | :--------: | :----------------------------- |
| layout_alignParentTop    | true/false | 是否让控件相对于父容器顶部对齐 |
| layout_alignParentBottom | true/false | 是否让控件相对于父容器底部对齐 |
| layout_alignParentLeft   | true/false | 是否让控件相对于父容器左边对齐 |
| layout_alignParentRight  | true/false | 是否让控件相对于父容器右边对齐 |
| layout_centerHorizontal  | true/false | 相对父容器水平居中显示         |
| layout_centerVertical    | true/false | 相对父容器垂直居中显示         |
| centerInParent           | true/false | 相对父容器居中显示             |

### 相对于兄弟元素 4个常用属性

| 属性                     | 可选值 | 说明                 |
| ------------------------ | ------ | -------------------- |
| layout_above             | @+id/  | 指定在那个控件的上侧 |
| layout_below             | @+id/  | 指定在那个控件的上侧 |
| android:layout_toLeftOf  | @+id/  | 指定在那个控件的左侧 |
| android:layout_toRightOf | @+id/  | 指定在那个控件的右侧 |

### 相对于兄弟元素的对齐方式
| 属性               | 可选值 | 说明                                 |
| ------------------ | ------ | ------------------------------------ |
| layout_alignLeft   | @+id/  | 该控件的左边沿与指定控件的左边对齐   |
| layout_aliginRight | @+id/  | 该控件的右边沿与指定控件的右边对齐   |
| layout_alignTop    | @+id/  | 该控件的上边沿与指定控件的上边沿对齐 |
| layout_alignBottom | @+id/  | 该控件的下边沿与指定控件的下边沿对齐 |

## 帧布局FrameLayout

组件的默认位置都是左上角，组件之间可以重叠。

像千层饼一样，一层压着一层 可以设置上下左右的对齐、水平垂直居中、设置方式与线性布局相似

| 属性                  | 可选值                                      | 说明          |
|---------------------|------------------------------------------|-------------|
| layout_gravity      | center/center_vertical/center_horizontal | 组件相对父容器的位置  |
| layout_marginLeft   | 具体的数值100dp                               | 左侧外间距       |
| layout_marginTop    | 具体的数值100dp                               | 上侧外间距       |
| layout_marginRight  | 具体的数值100dp                               | 右侧外间距       |
| layout_marginBottom | 具体的数值100dp                               | 下侧外间距       |
