<a name="lMkCw"></a>
# TCP三次握手与四次挥手
<a name="tsvNF"></a>
## 三次握手
![threeHand.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1589723092809-8e7cafab-24b3-4bf3-afcd-7c187da79978.png#align=left&display=inline&height=355&margin=%5Bobject%20Object%5D&name=threeHand.png&originHeight=355&originWidth=508&size=22623&status=done&style=none&width=508)<br />![](https://cdn.nlark.com/yuque/0/2020/jpeg/299895/1596006632577-90c671ed-24d4-498d-a45f-f95b2f009d2d.jpeg#align=left&display=inline&height=768&margin=%5Bobject%20Object%5D&originHeight=768&originWidth=1364&size=0&status=done&style=none&width=1364)<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1594775550925-404a6df5-8593-466a-8fdf-5eea91922bee.png#align=left&display=inline&height=357&margin=%5Bobject%20Object%5D&name=image.png&originHeight=357&originWidth=641&size=190214&status=done&style=none&width=641)<br />三次握手三次握手是指在连接服务端指定端口，建立TCP连接时，需要客户端和服务端总共发送三个包。

   - 第一次握手<br />客户端发送一个包给服务端，指明客户端打算连接的服务端端口。<br />服务端接收到包，服务端就能得出结论：客户端的发送能力、服务端的接收能力是正常的。<br />
   - 第二次握手<br />服务端收到客户端发送的包，发送一个确认包给客户端。<br />客户端接收到包，客户端就能得出结论：服务端的接收、发送能力，客户端的接收、发送能力是正常的。不过此时服务端并不能确认客户端的接收能力是否正常。<br />
   - 第三次握手<br />客户端收到服务端发送的包，再次发送一个确认包给服务端，当服务端收到这个包的时候，TCP握手结束建立连接。<br />服务端就能得出结论：客户端的接收、发送能力正常，服务器自己的发送、接收能力也正常。
<a name="dx1iU"></a>
## 四次挥手
![fourHand.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1589723102445-1b11b2a4-e1be-4248-8d2c-e8256fb76585.png#align=left&display=inline&height=367&margin=%5Bobject%20Object%5D&name=fourHand.png&originHeight=367&originWidth=728&size=35889&status=done&style=none&width=728)

![](https://cdn.nlark.com/yuque/0/2020/jpeg/299895/1596006606848-1c474338-9db7-4b35-b0f6-4c5021de6ca4.jpeg#align=left&display=inline&height=384&margin=%5Bobject%20Object%5D&originHeight=384&originWidth=682&size=0&status=done&style=none&width=682)<br />四次挥手是指关闭TCP连接需要发送四个包。

   - 第一次挥手客户端想要关闭TCP连接，发送一个数据包给服务端，表示自己没有数据要发送了，但是还可以接受数据<br />
   - 第二次挥手<br />服务端收到客户端发送的第一个包，发送一个确认包给客户端，表示自己已经收到了客户端关闭连接的请求，但是还没准备好关闭连接，还有数据要发送<br />
   - 第三次挥手<br />服务端发准备好了关闭连接，发送一个包通知客户端<br />
   - 第四次挥手<br />客户端接收到服务端发送的包，发送一个确认包给服务端，服务端收到客户端发送的确认包，关闭连接，<br />客户端等待2MSL，关闭连接。<br />
