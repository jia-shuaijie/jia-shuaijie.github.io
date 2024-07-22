---
icon: book
date: 2024-07-22
category:
  - 后端开发
  - java
tag:
  - java
---
# 网络编程
## 网络编程 程序的分类
> B/S 程序 : 浏览器与服务器程序
> 
> C/S 程序 : 客户端与服务器程序

## TCP协议 - OSI网络模型
> 指的是 从一台计算机的软件中,将数据发送刀另一台计算机的软件中的过程
> 
> 七层网络模型:  应用层/ 表现层/ 会话层/ 传输层/ 网络层/ 数据链路层/ 物理层

## 三次握手 和 四次挥手 
> tcp协议客户端与服务器链接时,存在三次握手操作,确保消息能准确无误的发送. 
> 
> 断开连接时,存在四次挥手操作

## 套接字[ ServerSocket ]
### 构造器

| 变量         | 构造器                                                       | 描述                                                         |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
|              | `Socket()`                                                   | 创建一个未连接的套接字,系统默认类型为SocketImpl。           |
|              | `Socket(String host,  int port)`                             | 创建流套接字并将其连接到指定主机上的指定端口号。             |
|              | `Socket(String host, int port,  boolean stream)`             | 已过时。  使用DatagramSocket代替UDP传输。                    |
|              | `Socket(String host, int port,  InetAddress localAddr,  int localPort)` | 创建套接字并将其连接到指定远程端口上的指定远程主机。         |
|              | `Socket(InetAddress address,  int port)`                     | 创建流套接字并将其连接到指定IP地址处的指定端口号。           |
|              | `Socket(InetAddress host,  int port, boolean stream)`        | 已过时。  使用DatagramSocket代替UDP传输。                    |
|              | `Socket(InetAddress address,  int port, InetAddress localAddr, int localPort)` | 创建套接字并将其连接到指定远程端口上的指定远程地址。         |
|              | `Socket(Proxy proxy)`                                        | 创建一个未连接的套接字,指定应该使用的代理类型(如果有),而不管其他任何设置。 |
| `protected ` | `Socket(SocketImpl impl)`                                    | 使用用户指定的SocketImpl创建未连接的Socket。                 |


### 方法
|    变量和类型    |                                    方法                                     |                                                                     描述                                                                      |
| --------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `void`          | `bind(SocketAddress bindpoint)`                                            | 将套接字绑定到本地地址。                                                                                                                        |
| `void`          | `close()`                                                                  | 关闭此套接字。                                                                                                                                 |
| `void`          | `connect(SocketAddress endpoint)`                                          | 将此套接字连接到服务器。                                                                                                                        |
| `void`          | `connect(SocketAddress endpoint,  int timeout)`                            | 使用指定的超时值将此套接字连接到服务器。                                                                                                         |
| `SocketChannel` | `getChannel()`                                                             | 返回与此套接字关联的唯一[`SocketChannel`](../nio/channels/SocketChannel.html)对象(如果有)。                                                    |
| `InetAddress`   | `getInetAddress()`                                                         | 返回套接字连接的地址。                                                                                                                          |
| `InputStream`   | `getInputStream()`                                                         | 返回此套接字的输入流。                                                                                                                          |
| `boolean`       | `getKeepAlive()`                                                           | 测试是否启用了 [`SO_KEEPALIVE`](SocketOptions.html#SO_KEEPALIVE) 。                                                                            |
| `InetAddress`   | `getLocalAddress()`                                                        | 获取套接字绑定的本地地址。                                                                                                                      |
| `int`           | `getLocalPort()`                                                           | 返回此套接字绑定的本地端口号。                                                                                                                   |
| `SocketAddress` | `getLocalSocketAddress()`                                                  | 返回此套接字绑定的端点的地址。                                                                                                                   |
| `boolean`       | `getOOBInline()`                                                           | 测试是否启用了 [`SO_OOBINLINE`](SocketOptions.html#SO_OOBINLINE) 。                                                                            |
| ` T`            | `getOption(SocketOption name)`                                             | 返回套接字选项的值。                                                                                                                            |
| `OutputStream`  | `getOutputStream()`                                                        | 返回此套接字的输出流。                                                                                                                          |
| `int`           | `getPort()`                                                                | 返回此套接字连接的远程端口号。                                                                                                                   |
| `int`           | `getReceiveBufferSize()`                                                   | 获取此 `Socket`的 [`SO_RCVBUF`](SocketOptions.html#SO_RCVBUF)选项的值,该值是平台在此  `Socket`上用于输入的缓冲区大小。                            |
| `SocketAddress` | `getRemoteSocketAddress()`                                                 | 返回此套接字连接到的端点的地址,如果未连接则返回 `null` 。                                                                                        |
| `boolean`       | `getReuseAddress()`                                                        | 测试是否启用了 [`SO_REUSEADDR`](SocketOptions.html#SO_REUSEADDR) 。                                                                            |
| `int`           | `getSendBufferSize()`                                                      | 获取此 `Socket`的 [`SO_SNDBUF`](SocketOptions.html#SO_SNDBUF)选项的值,即此平台在此  `Socket`上用于输出的缓冲区大小。                              |
| `int`           | `getSoLinger()`                                                            | 返回 [`SO_LINGER`的](SocketOptions.html#SO_LINGER)设置。                                                                                       |
| `int`           | `getSoTimeout()`                                                           | 返回[`SO_TIMEOUT`的](SocketOptions.html#SO_TIMEOUT)设置。  0返回意味着该选项被禁用(即无穷大的超时)。                                             |
| `boolean`       | `getTcpNoDelay()`                                                          | 测试是否启用了 [`TCP_NODELAY`](SocketOptions.html#TCP_NODELAY) 。                                                                              |
| `int`           | `getTrafficClass()`                                                        | 获取从此Socket发送的数据包的IP头中的流量类或服务类型                                                                                              |
| `boolean`       | `isBound()`                                                                | 返回套接字的绑定状态。                                                                                                                          |
| `boolean`       | `isClosed()`                                                               | 返回套接字的关闭状态。                                                                                                                          |
| `boolean`       | `isConnected()`                                                            | 返回套接字的连接状态。                                                                                                                          |
| `boolean`       | `isInputShutdown()`                                                        | 返回套接字连接的读半部分是否已关闭。                                                                                                             |
| `boolean`       | `isOutputShutdown()`                                                       | 返回套接字连接的写半部分是否已关闭。                                                                                                             |
| `void`          | `sendUrgentData(int data)`                                                 | 在套接字上发送一个字节的紧急数据。                                                                                                               |
| `void`          | `setKeepAlive(boolean on)`                                                 | 启用/禁用 [`SO_KEEPALIVE`](SocketOptions.html#SO_KEEPALIVE) 。                                                                                 |
| `void`          | `setOOBInline(boolean on)`                                                 | 启用/禁用 [`SO_OOBINLINE`](SocketOptions.html#SO_OOBINLINE)  (接收TCP紧急数据)默认情况下,此选项被禁用,并且套接字上收到的TCP紧急数据将被静默丢弃。 |
| ` Socket`       | `setOption(SocketOption name, T value)`                                    | 设置套接字选项的值。                                                                                                                            |
| `void`          | `setPerformancePreferences(int connectionTime,  int latency, int bandwidth)` | 设置此套接字的性能首选项。                                                                                                                      |
| `void`          | `setReceiveBufferSize(int size)`                                           | 设置 [`SO_RCVBUF`](SocketOptions.html#SO_RCVBUF)选项,此规定值  `Socket` 。                                                                     |
| `void`          | `setReuseAddress(boolean on)`                                              | 启用/禁用 [`SO_REUSEADDR`](SocketOptions.html#SO_REUSEADDR)套接字选项。                                                                         |
| `void`          | `setSendBufferSize(int size)`                                              | 设置 [`SO_SNDBUF`](SocketOptions.html#SO_SNDBUF)选项,此规定值  `Socket` 。                                                                     |
| `static void`   | `setSocketImplFactory(SocketImplFactory fac)`                              | 设置应用程序的客户端套接字实现工厂。                                                                                                             |
| `void`          | `setSoLinger(boolean on,  int linger)`                                     | 使用指定的延迟时间(以秒为单位)启用/禁用 [`SO_LINGER`](SocketOptions.html#SO_LINGER) 。                                                          |
| `void`          | `setSoTimeout(int timeout)`                                                | 使用指定的超时启用/禁用 [`SO_TIMEOUT`](SocketOptions.html#SO_TIMEOUT) ,以毫秒为单位。                                                           |
| `void`          | `setTcpNoDelay(boolean on)`                                                | 启用/禁用 [`TCP_NODELAY`](SocketOptions.html#TCP_NODELAY)  (禁用/启用Nagle的算法)。                                                           |
| `void`          | `setTrafficClass(int tc)`                                                  | 为从此Socket发送的数据包的IP标头设置流量类或服务类型八位字节。                                                                                     |
| `void`          | `shutdownInput()`                                                          | 将此套接字的输入流放在“流结束”。                                                                                                                 |
| `void`          | `shutdownOutput()`                                                         | 禁用此套接字的输出流。                                                                                                                          |
| `Set>`          | `supportedOptions()`                                                       | 返回此套接字支持的一组套接字选项。                                                                                                               |
| `String`        | `toString()`                                                               | 将此套接字转换为 `String` 。                                                                                                                   |


## 多线程的客户端与服务器之间的交互
### 服务器端
```java
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * @author black fire
 */
public class SocketService {

    /**
     * 线程池
     */
    private final ExecutorService executor;
    /**
     * 端口号
     */
    private final Integer port;

    /**
     * 套接字总服务
     */
    private ServerSocket server;

    /**
     * 推出
     */
    private Boolean quit = false;

    /**
     * 当创建对象时需要出入 端口号
     * @param port 端口号
     */
    public SocketService(Integer port) {
        this.port = port;
        // 创建线程池 [10]
        executor = Executors.newFixedThreadPool(10);
    }


    /**
     * 退出方法
     */
    public void quit(){
        this.quit = true;
        try {
            server.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @author black fire
     * 以多线程形式运行服务中的 socket
     */
    private final static class SocketTask implements Runnable{
        // 套接字中的 socket
        private final Socket socket;
        public SocketTask(Socket socket) {
            this.socket = socket;
        }
        @Override
        public void run() {
            try {
                System.out.println("".concat(socket.getInetAddress().toString()).concat(String.valueOf(socket.getPort())).concat("请求链接") );
                // 从套接字中获取输出流
                OutputStream outputStream = socket.getOutputStream();
                // 将 outputStream 输出流转换为 PrintStream 打印流
                PrintStream ps = new PrintStream(outputStream);
                ps.println("欢迎链接服务器".concat(Thread.currentThread().getName()).concat("线程为您服务"));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * 多线程启动方法
     */
    public void start(){
        try {
            // 创建一个 套接字对象
            server = new ServerSocket(port);
            while (!quit){
                // 监听 ServerSocket 并接受它
                Socket accept = server.accept();
                // 向线程池中添加一个线程
                executor.execute(new SocketTask(accept));
            }
            quit();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 启动多线程
     */
    public static void main(String[] args) {
        new SocketService(55655).start();
    }

}
```

### 客户端
```java
import java.io.*;
import java.net.Socket;

/**
 * @author black fire
 */
public class SocketClient {

    public  void client(String host,Integer port){
        // 向指定服务器端口, 进行链接获取 套接字
        Socket socket;
        try {
            socket = new Socket(host,port);
            // 从套接字中获取输入流
            InputStream inputStream = socket.getInputStream();
            // 将 inputStream 输入流 转换为  BufferedReader 读取流
            BufferedReader br = new BufferedReader(new InputStreamReader(inputStream));
            String s = br.readLine();
            System.out.println("客户端接收到了:".concat(s));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        // 链接 localhost 上 55655 端口的服务
        new SocketClient().client("localhost",55655);
    }
}
```