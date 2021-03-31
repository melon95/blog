<a name="paaWc"></a>
# nextTick
Vue 在更新 DOM 时是**异步**执行的。只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。如果同一个 watcher 被多次触发，只会被推入到队列中一次。Vue 在内部对异步队列尝试使用原生的 `Promise.then`、`MutationObserver` 和 `setImmediate`，如果执行环境不支持，则会采用 `setTimeout(fn, 0)` 代替，下面看下 Vue 内部是怎么来实现的。<br />Vue 中有两个 `nextTick` 的 api，分别是：
```javascript
Vue.nextTick = nextTick

Vue.prototype.$nextTick = function (fn: Function) {
  return nextTick(fn, this)
}
```
核心都是 `nextTick` 方法：
```javascript
// 回调函数列表
const callbacks = []
// 回调函数是否已经推入队列
let pending = false
// 回调函数
function flushCallbacks () {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    copies[i]()
  }
}

// 异步函数
let timerFunc


function nextTick (cb?: Function, ctx?: Object) {
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    }
  })
  // pending为false，表示回调函数还没有推入队列，通过异步函数把回调函数推入事件队列
  if (!pending) {
    pending = true
    timerFunc()
  }
}
```
`timerFunc` 会根据宿主环境的不同分别采用以下四种异步方法(优先级从高到低)：

1. Promise
1. MutationObserver
1. setImmediate
1. setTimeout
```javascript
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
  }
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}
```


