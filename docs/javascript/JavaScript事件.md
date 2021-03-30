<a name="XSF3W"></a>
## 事件绑定
在 `JavaScript` 中可以通过以下三种方法给DOM元素绑定处理事件。

1. 在DOM元素上通过 `onclick` 绑定



```javascript
<p onclick="handleClick()"></p>
```


2. 在 `JavaScript` 中通过 `onclick` 绑定



```javascript
<p id="p"></p>

document.getElementById('p').onclick = function () {
	...
}
```


3. 通过 `addEventListener` 来绑定



```javascript
<p id="p"></p>

document.getElementById('p').addEventListener('click', function () {
...
}, useCapture)

// useCapture: false为冒泡，ture为捕获，默认为false
// 第三个参数也可以是一个options对象，不过浏览器的支持还不完善
```

<br />第三种方法相当于前面个两种方式的优点：

- 它允许给一个事件注册多个监听器
- 它提供了一种更精细的手段控制 `listener` 的触发阶段。(即可以选择捕获或者冒泡)
- 它对任何 DOM 元素都是有效的，而不仅仅只对 HTML 元素有效
> 源于[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

<a name="r4fuZ"></a>
### 
<a name="6PME0"></a>
## 事件冒泡
当一个子节点的绑定事件触发的时候，子节点的上级、上上级一直到 `document` 都能够响应这个事件。<br />

<a name="iYAlN"></a>
## 事件捕获
事件捕获则与事件冒泡完全相反，当一个子节点的绑定事件触发的时候，事件从 `document` 一级一级的往下传递，直到子节点本身。
> W3C把两者相结合，事件模型变成了三个阶段，第一阶段是捕获阶段，第二阶段是目标阶段,第三阶段是冒泡阶段



<a name="8GWuy"></a>
## 事件委托(事件代理)
事件委托就是如果很多人都要处理同一样的一件事，就把这件事都委托给另一个人来处理。比如：一个公司的员工都要收快递，就可以把这件事委托给公司前台统一收取。<br />上一波代码:<br />

```javascript
<div id="list">
  <p class="item">item 1</p>
  <p class="item">item 2</p>
  <p class="item">item 3</p>
  <div>item 4</div>
  <p class="item">item n</p>
</div>
```
需求是点击其中的每一个 `p` 都要打印出它的文本内容。<br />有两种方法：

1. 给每个 `p` 都添加一个点击事件。



```javascript
const nodeArr = document.getElementsByClassName('item')
const len = nodeArr.length
for(let i = 0; i < len; i++) {
	nodeArr[i].onclick = function () {
    // 没有处理兼容性
		console.log(e.target.innerHTML)
  }
}
```

2. 给外部的 `div` 添加一个点击事件,利用事件冒泡来实现需求。



```javascript
document.getElementById('list').onclick = function (e) {
  // 没有处理兼容性
  if (e.target.localName.toLowerCase() === 'p') {
    console.log(e.target.innerHTML)
  }
}
```
第二种方法也就是事件委托。<br />事件委托相比于第一种方法有如下优点：

- 减少内存占用率.每个函数都一个对象,都会占据内存空间,节点越多的时候,越明显。
- 能够响应 `JavaScript` 动态添加的DOM元素
<a name="22Gr9"></a>
## 思考

1. 当DOM元素上同时绑定冒泡事件和捕获事件，触发顺序是什么。
1. 怎么才能让事件代理中第二个方法只响应外部 `div` 的子节点触发的事件，而不响应孙节点。
1. 利用 `vue` 和原生 `JavaScript` 同时给1000个DOM元素绑定事件有什么不同，哪种方式的性能更好。



<a name="No6ib"></a>
## 答案

1. 当DOM元素上同时绑定冒泡事件和捕获事件，哪个先定义就先触发哪个，下面上代码



```javascript
<div id="parent">
  <div id="child">点击</div>
</div>
```
我们分两种情况下实验，第一种先在 `child` 上绑定冒泡事件，在绑定捕获事件，第二种则反过来。<br />第一种情况： 先绑定冒泡事件，在绑定捕获事件<br />

```javascript
  const parent = document.getElementById('parent')
  const child = document.getElementById('child')
  // 在parent上绑定事件
  parent.addEventListener('click', function() {
    console.log('parent 冒泡')
  }, false)
  parent.addEventListener('click', function() {
    console.log('parent 捕获')
  }, true)
	// 在child上绑定事件
  child.addEventListener('click', function() {
    console.log('child 冒泡')
  }, false)
  child.addEventListener('click', function() {
    console.log('child 捕获')
  }, true)

  // 在浏览器运行代码后，得到下面4个console：
  // parent 捕获
  // child 冒泡
  // child 捕获
  // parent 冒泡
```
第二种情况：先绑定捕获事件，在绑定冒泡事件<br />

```javascript
  const parent = document.getElementById('parent')
  const child = document.getElementById('child')
  // 在parent上绑定事件
  parent.addEventListener('click', function() {
    console.log('parent 冒泡')
  }, false)
  parent.addEventListener('click', function() {
    console.log('parent 捕获')
  }, true)
	// 在child上绑定事件
  child.addEventListener('click', function() {
    console.log('child 捕获')
  }, true)
  child.addEventListener('click', function() {
    console.log('child 冒泡')
  }, false)


  // 在浏览器运行代码后，得到下面4个console：
  // parent 捕获
  // child 捕获
  // child 冒泡
  // parent 冒泡
```

2. 把事件代理第二个方法中的代码稍稍改动以下



```javascript
  <div id="list">
    <p class="item">item 1</p>
    <p class="item">item 2</p>
    <p class="item">item 3</p>
    <p class="item">item n</p>
    <div>
      // 孙节点
      <p class="item">item n + 1</p>
    </div>
  </div>
```
按照之前的代码来说，孙节点上的点击事件也会打印出 `item n + 1` ，应该如何改动才能让它不打印出来。<br />其实也很简单，通过 `e.target` 上的 `parentNode` 或者 `parentElement` 属性判断目标节点的父节点是不是最完成的 `div` 元素。

3. <br />
