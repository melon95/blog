<a name="6u4gs"></a>
# JavaScript运行机制
<a name="dz7BM"></a>
## 介绍
`JavaScript` 是一种单线程的语言，同一时间只能处理一个任务。必须等执行完上一个任务，才会执行下一个任务。<br />这样的设计在某些情况下，会带来很大的不便。于是就出现了同步任务和异步任务。
> 如果JS是多线程，在同一时间有两个线程，都操作同一个DOM就会出线问题。

<a name="1U7yy"></a>
## 同步任务
在 `JavaScript` 主线程中按顺序执行，会生成一个执行栈。<br />

<a name="fHklg"></a>
## 异步任务
在主线程外，还存在一个**任务队列(task queue)**。当异步任务执行完后，会把它加入到任务队列中，当执行栈里面的同步任务全部执行完的时候，就把任务队列中的任务去回到主线程中执行，然后循环这个过程。<br />
<br />主线程从**任务队列**中读取任务,这个过程时循环不断的,这种运行机制也称为**事件循环(Event Loop) .**
> 任务队列是一个**先进先出**的数据接口,排在前面的优先的主线程取回执行


<br />微任务(**microtask**)和宏任务(**macrotask**):<br />异步任务又细分为微任务和宏任务.

- 微任务<br />- setTimeout<br />- setInterval<br />- setImmediate<br />- MutationObserver

     - ...

- 宏任务<br />- Promise.then()<br />- Promise.catch()<br />- promise.finally()<br />- process.nextTick- script代码块<br />- ...

下图时宏任务和微任务的执行顺序.<br />![164974fa4b42e4af.png](https://cdn.nlark.com/yuque/0/2019/png/299895/1576916485762-0e7aa324-e2be-495f-a80d-cc1b975a262c.png#align=left&display=inline&height=960&margin=%5Bobject%20Object%5D&name=164974fa4b42e4af.png&originHeight=960&originWidth=1146&size=205190&status=done&style=none&width=1146)
