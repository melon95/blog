<a name="aSAti"></a>
## 异步任务
`JavaScript` 中的异步任务分为：

- 宏任务Macrotask：
   - `setTimeout` 
   - `setInterval` 
   - I/O
   - UI事件
- 微任务Microtask：
   - `Promise` 回调
   - `MutationObserver` 
<a name="XEf9e"></a>
## 运行时
一个`JavaScript` 运行时包括有：

- 任务队列(Queue)：待处理消息的队列(宏任务列表)<br />
- 栈(Stack)：函数调用形成了一个由若干帧组成的栈<br />
- 堆(Heap)：存储对象的值

可视化描述：<br />![](https://cdn.nlark.com/yuque/0/2020/svg/299895/1593758195712-2e6fb4dc-abed-4b14-9624-6f200f3fe162.svg#align=left&display=inline&height=271&margin=%5Bobject%20Object%5D&originHeight=271&originWidth=295&size=0&status=done&style=shadow&width=295)
<a name="p2I0W"></a>
## 事件循环
在上个任务处理完毕或者有新任务被添加到空的任务队列的时候，运行时会从先处理任务列表中的第一个宏任务：

1. 开始执行处理这个任务的回调函数
1. 当调用栈（Call Stack）为空的时候，会检查宏任务的微任务队列（Microtask Queue）是否为空，不为空循环执行直到为空
1. 结束当前宏任务，并从任务队列中取出下一个继续执行

以上就是事件循环大体的一个机制。以下是一些补充：

- 每个宏任务包括有一个微任务列表
- 总是在宏任务的最后执行微任务
- 在当前宏任务或者微任务执行中产生的新的微任务会在本次循环中执行完毕<br />

<br />
