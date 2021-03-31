<a name="Po8vu"></a>
# DOM的解析和渲染
DOM解析就是把html文件从上到下解析成 `DOM Tree` ，<br />DOM渲染 `DOM Tree` 结合css生成 `Render Tree` ，最后渲染到客户端。<br />css解析生成 `CSS Tree` 的过程不会阻塞DOM的解析，但是会阻塞DOM的渲染。<br />同步JS下载和解析过程中，客户端不知道JS代码中是否有操作DOM，所以会先暂停DOM的解析和渲染。<br />现在还有一个疑问：css的加载和解析会影响JS的解析和执行吗？<br />来看个例子：
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>index</title>
  <link href="https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
</head>
<body>
  <div class="parent">
  </div>
</body>
<script src="./index.js"></script>
```
`index.js` 
```javascript
console.log('start')
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOMContentLoaded');
})
console.log('end')
```
在Chrome最新版本83下，把网络环境调成Slow 3G，得到如下结果：<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1592733446855-62930cb9-dbb1-4e42-b85d-89ebddd86422.png#align=left&display=inline&height=90&margin=%5Bobject%20Object%5D&name=image.png&originHeight=179&originWidth=973&size=18282&status=done&style=none&width=486.5)<br />![image.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1592733469657-01f6f4ac-a232-4261-8d7c-cecd844e1e37.png#align=left&display=inline&height=51&margin=%5Bobject%20Object%5D&name=image.png&originHeight=101&originWidth=963&size=5307&status=done&style=none&width=481.5)<br />在HTTP连接数没有达到客户端最大限制的时候，css的加载和解析不会阻塞JS的解析和执行。<br />如果HTTP的连接数已经达到了客户端的最大限制，则之后的资源不会被加载知道有空余的HTTP连接。
