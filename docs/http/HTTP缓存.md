<a name="9J5dP"></a>
# HTTP缓存
<a name="YGFCA"></a>
## 强缓存
<a name="1zsCU"></a>
### Expires
**Expires是HTTP 1.0提出的一个表示资源过期时间的header，它描述的是一个绝对时间，由服务器返回(response header)，用GMT格式的字符串表示**。<br />Expires表示在Expires的值所在的时间之前都可以使用本地缓存，而不用请求服务器获取更新。<br />**优点**

- 在缓存到期前不会再次发起HTTP请求<br />

**缺点**

- 无法保证和客户端时间统一
<a name="Eu1QG"></a>
### Cache-Control
**Cache-Control也是一个通用首部字段，这意味着它能分别在请求报文和响应报文中使用。**<br />作为请求头部时：<br />![1.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1587027381931-f655e469-56c0-443e-ad00-1a1180a79e34.png#align=left&display=inline&height=433&margin=%5Bobject%20Object%5D&name=1.png&originHeight=433&originWidth=691&size=59185&status=done&style=none&width=691)<br />作为响应头部时：<br />![2.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1587027385902-82608cee-c3d0-47d7-a6da-4d9a73a06240.png#align=left&display=inline&height=511&margin=%5Bobject%20Object%5D&name=2.png&originHeight=511&originWidth=692&size=75039&status=done&style=none&width=692)<br />Cache-Control 允许自由组合可选值，例如：
```javascript
Cache-Control: max-age=3600, must-revalidate
```

<br />**若报文中同时出现了 Expires 和 Cache-Control，则以 Cache-Control 为准。**
<a name="bEMDS"></a>
## 协商缓存
Expires和Cache-Control均能让客户端决定是否向服务器发送请求，比如设置的缓存时间未过期，那么自然直接从本地缓存取数据即可（在chrome下表现为200 from cache），若缓存时间过期了或资源不该直接走缓存，则会发请求到服务器去。<br />但是**如果客户端向服务器发了请求，那么是否意味着一定要读取回该资源的整个实体内容呢？**<br />客户端上某个资源保存的缓存时间过期了，但这时候其实服务器并没有更新过这个资源，如果这个资源数据量很大，客户端要求服务器再把这个东西重新发一遍过来，是否非常浪费带宽和时间呢？<br />为了让客户端与服务器之间能实现缓存文件是否更新的验证、提升缓存的复用率，Http1.1新增了几个首部字段来做这件事情。
<a name="2tbbi"></a>
### Last-Modified
服务器将资源传递给客户端时，会将资源最后更改的时间以“Last-Modified: GMT”的形式加在实体首部上一起返回给客户`端。
```javascript
Last-Modified: Fri, 22 Jul 2016 01:47:00 GMT
```
客户端会为资源标记上该信息，下次再次请求时，会把该信息附带在请求报文中一并带给服务器去做检查，若传递的时间值与服务器上该资源最终修改时间是一致的，则说明该资源没有被修改过，直接返回`304`状态码，**内容为空**，这样就节省了传输数据量 。如果两个时间不一致，则服务器会发回该资源并返回`200`状态码，和第一次请求时类似。<br />![3.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1587027358224-cac4047b-1fe6-41af-ae26-110e372b3d08.png#align=left&display=inline&height=506&margin=%5Bobject%20Object%5D&name=3.png&originHeight=506&originWidth=566&size=31828&status=done&style=none&width=566)
```javascript
If-Modified-Since: Fri, 22 Jul 2016 01:47:00 GMT
```
 <br />响应报文：
```javascript
Last-Modified: Fri, 22 Jul 2016 01:47:00 GMT
```

<br />请求报文：
```javascript
If-Modified-Since: Fri, 22 Jul 2016 01:47:00 GMT // Last-Modified
```
 <br />**缺点**

- Last-Modified只能精确到秒<br />
- 服务器上一个资源被修改了，但其实际内容根本没发生改变，会因为Last-Modified时间匹配不上而返回了整个实体给客户端<br />
<a name="cOFlk"></a>
### ETag
为了解决上述Last-Modified可能存在的不准确的问题，Http1.1还推出了 **ETag 实体首部**字段。 服务器会通过某种算法，给资源计算得出一个唯一标志符（比如md5标志），在把资源响应给客户端的时候，会在实体首部加上“ETag: 唯一标识符”一起返回给客户端。例如：
```javascript
Etag: "5d8c72a5edda8d6a:3239"
```

<br />客户端会保留该 ETag 字段，并在下一次请求时将其一并带过去给服务器。服务器只需要比较客户端传来的ETag跟自己服务器上该资源的ETag是否一致，就能很好地判断资源相对客户端而言是否被修改过了。如果服务器发现ETag匹配不上，那么直接以常规GET `200`回包形式将新的资源（当然也包括了新的ETag）发给客户端；如果ETag是一致的，则直接返回`304`知会客户端直接使用本地缓存即可。<br />请求报文：<br />告诉服务端如果 ETag 没匹配上需要重发资源数据，否则直接回送`304`
```javascript
If-None-Match: ETag-value
```

<br />告诉服务器如果没有匹配到ETag，或者收到了“*”值而当前并没有该资源实体，则应当返回`412`<br /> 
```javascript
If-Match: ETag-value
```

<br />响应报文：
```javascript
Etag: "5d8c72a5edda8d6a:3239"
```
**注意：**<br />如果是分布式部署，需要保证每台服务器的算法一致。
<a name="ynAYc"></a>
###### 对比
![1587023598336.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1587027345085-2226083c-8505-4e67-9532-736e07474528.png#align=left&display=inline&height=413&margin=%5Bobject%20Object%5D&name=1587023598336.png&originHeight=413&originWidth=899&size=72591&status=done&style=none&width=899)<br />
<a name="TpnsM"></a>
## 结论

- 需要兼容HTTP1.0的时候需要使用Expires，不然可以考虑直接使用Cache-Control<br />
- 需要处理一秒内多次修改的情况，或者其他Last-Modified处理不了的情况，才使用ETag，否则使用Last-Modified。<br />
- 对于所有可缓存资源，需要指定一个Expires或Cache-Control，同时指定Last-Modified或者Etag。<br />
- 可以通过标识文件版本名、加长缓存时间的方式来减少304响应。

<br />
<a name="dOUpq"></a>
## 参考资料


- [HTTP缓存控制小结 - 腾讯Web前端 IMWeb 团队社区 | blog | 团队博客](https://imweb.io/topic/5795dcb6fb312541492eda8c)



