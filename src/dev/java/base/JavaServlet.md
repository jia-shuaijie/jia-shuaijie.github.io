---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - java
tag:
  - java
---
# Servlet
Servlet(Server Applet),全称Java Servlet。是⽤Java编写的服务器端程序,其主要功能在于交互式地浏览和修改数据,生成动态Web内容。

狭义的Servlet是指Java语言实现的一个接口,广义的Servlet是指任何实现了这个Servlet接口的类,一般情况下,人们将Servlet理解为后者。

Servlet运行于支持Java的应用服务器中。从实现上讲,Servlet可以响应任何类型的请求,但绝大多数情况下Servlet只用来扩展基于HTTP协议的Web服务器。

Servlet工作作模式:
- 客户端发送请求至服务器
- 服务器启动并调用Servlet,Servlet根据客户端请求生成响应内容并将其传给服务器
- 服务器将响应返回客户端
    

## HttpServlet
常用方法

- void doGet(HttpServletRequest req, HttpServletResponse resp): 接收 get 请求并处理
- void doPost(HttpServletRequest req, HttpServletResponse resp): 接收 post  请求并处理
- void service(HttpServletRequest req, HttpServletResponse resp): 接收所有请求并处理

Servlet 3.0后支持注解,下面是常用注解
```Java
@WebServlet(
    name = "myUserServlet",
    urlPatterns = "/user/test",
    loadOnStartup = 1, 
    initParams = {
        @WebInitParam(name="name", value="⼩明"),
        @WebInitParam(name="pwd", value="123456")
    }
)
/* 解释: 
    name:  
        表示当前 servlet 在运行时的名称
    urlPatterns: 
        请求的链接地址
        String[]类型,可以配置多个映射,如: urlPatterns={"/user/test","/user/example"} 
    loadOnStartup: 
        标记当前 Servlet 是否在服务启动时就加载此 Servlet.
        默认不配置或数值为负数时表示客户端第一次请求Servlet时再加载；
        0或正数表示启动应用就加载,正数情况下,数值越小,加载该Servlet的优先级越高；
    initParams: 
        配置初始化参数
*/
```

在 Servlet 中处理接收的请求时都需要 HttpServletRequest/ HttpServletResponse 两个对象. 

下面时这俩个对象的常用方法

HttpServletRequest常用方法
```java
public class TestServlet extends HttpServlet {

    // 无论前台使用的是什么格式传输的 后台全部使用的是String 接收

    @Override // 处理get请求
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String uage = req.getParameter("uage");
        System.out.println("uage->"+uage);
    }

    @Override // 处理post请求
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // 设置字符集编码 --> post请求需要 get在jdk1.8版本之前的也需要设置
        req.setCharacterEncoding("utf-8");
        // 页面跳转方式  [ forward(req,resp); ] 这是固定格式  注意这条代码所在位置会影响下面获取后的页面反馈
        req.getRequestDispatcher("/se.html").forward(req,resp);
        // 通过 标签的name属性获取传过来的值
        String username = req.getParameter("username");
        // 获取一组数据 这里获取的是复选框中的数据
        String[] aihaos = req.getParameterValues("aihao");
        for (String s : aihaos) {
            System.out.println(s);
        }
        System.out.println("username-->"+username);
        // 前台向后台传输数据 获取方法是 : req.getParameter
        // 后台向前台传输数据 传输方法是 : req.setAttribute("key",value);
        // 后前向前台传输数据取值 使用的是: req.getAttribute("key");
    }
}
```

HttpServletResponse 常用方法

- resp.addCookie(); //  设置cookie存值
- resp.setContentType("text/html"); //  设置响应内容
- resp.sendRedirect(""); // 等同于 req.getRequestDispatcher("/se.html").forward(req,resp);
- PrintWriter writer = resp.getWriter(); // 得到一个可以给前端输出信息的输出流对象



使用 HttpServlet 写一个示例

```java
@WebServlet(
        urlPatterns = "/user"
)
public class UsersController extends HttpServlet {

    private final UserService usersService = new UsersServiceImpl();

    @Override
    public void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String method = req.getParameter("method");
        if (Manager.SELECT.equals(method)) {
            isLogin(req,resp);
        }
    }

    protected void isLogin(HttpServletRequest req,HttpServletResponse resp) throws IOException {
        Users users = new Users();
        users.setLoginName(req.getParameter("loginName"));
        users.setPassWord(req.getParameter("passWord"));
        PrintWriter writer = resp.getWriter();
        writer.println(usersService.isLogin(users));
    }
}
```
