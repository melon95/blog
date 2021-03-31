<a name="umb3l"></a>
# Promise介绍和实现
<a name="ZOKdT"></a>
## 介绍
`Promise` 是异步编程的一种解决方案，比传统的回调函数更加合理和强大。<br />`Promise` 是一个对象，它代表了一个异步操作的最终完成或者失败。<br />在使用 Promise 时，会有以下约定：

- 在本轮事件循环运行完成之前，回调函数是不会被调用的。
- 即使异步操作已经完成（成功或失败），在这之后通过 `then()` 添加的回调函数也会被调用。
- 通过多次调用 `then()` 可以添加多个回调函数，它们会按照插入顺序执行。
<a name="NsNiR"></a>
## 模拟实现
定义 `Promise` 函数
```javascript
function Promise(fn) {
  const self = this
  // promise状态
  self.status = 'pending'
  // promise的返回值
  self.data = undefined
  // 成功的回掉函数数组
  self.onFulfilledCB = []
  // 失败的回掉函数数组
  self.onRejectedCB = []
  try {
    fn(resolve, reject)
  } catch (error) {
    reject(error)
  }
  function resolve(value) {
    if (self.status === 'pending') {
      self.status = 'fulfilled'
      self.data = value
      // 成功的回掉函数延迟执行
      setTimeout(function() {
        self.onFulfilledCB.forEach((cb) => {
          cb(value)
        })
      }, 0)
    }
  }
  function reject(reason) {
    if (self.status === 'pending') {
      self.status = 'rejected'
      self.data = reason
      // 失败的回掉函数延迟执行
      setTimeout(function () {
        self.onRejectedCB.forEach((cb) => {
          cb(reason)
        })
      }, 0)
    }
  }
}
```
设置 `Promise` 的原型方法：<br />

```javascript
Promise.prototype.then = function (onFulfilled, onRejected) {
  const self = this
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(v) { return v}
  onRejected = typeof onRejected === 'function' ? onRejected : function(r) { return r }
  
  if (self.status === 'fulfilled') {
    // 如果已经成功则延迟执行
    return new Promise(function(resolve, reject) {
      setTimeout(function () {
        try {
          var res = onFulfilled(self.data)
          if (res instanceof Promise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch(err) {
          
          reject(err)
        }
      })
    })
  }
  
  if (self.status === 'rejected') {
    return new Promise(function(resolve, reject) {
      setTimeout(function () {
        try {
          var res = onRejected(self.data)
          if (res instanceof Promise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch(err) {
          reject(err)
        }
      })
    })
  }

  if (self.status === 'pending') {
    return new Promise(function (resolve, reject) {
      self.onFulfilledCB.push(function(value) {
        try {
          var res = onFulfilled(self.data)
          if (res instanceof Promise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch(err) {
          reject(err)
        }
      })
      self.onRejectedCB.push(function(value) {
        try {
          var res = onRejected(self.data)
          if (res instanceof Promise) {
            res.then(resolve, reject)
          } else {
            resolve(res)
          }
        } catch(err) {
          reject(err)
        }
      })
    })
  }
 }

Promise.prototype.catch = function (rejected) {
  return this.then(null, rejected)
}

Promise.prototype.finally = function(fn) {
  return this.then(function(value){
    return Promise.resolve(fn()).then(function(){
      return value
    })
  }, function(error){
    // 防止在执行fn()期间报错
    return Promise.resolve(fn()).then(function() {
      return error
    })
  })
}
```

<br />定义 `Promise` 对象本身的方法：
```javascript
Promise.resolve = function (item) {
  if (item instanceof Promise) return item
  return new Promise(function(resolve, reject) {
    resolve(item)
  })
}

Promise.reject = function(item) {
  return new Promise(function (resolve, reject) {
    reject(item)
  })
}

Promise.race = function(promiseList) {
  var resPromise = new Promise(function(resolve, reject) {
    if (promiseList.length === 0) {
      resolve()
    } else {
      for (let i = 0, len = promiseList.length; i < len; i++) {
        Promise.resolve(promiseList[i]).then(function(val) {
          return resolve(val)
        }).catch(function(err) {
          return reject(err)
        })
      }
    }
  })
}

Promise.all = function (promiseList) {
  var allPromise = new Promise(function(resolve, reject) {
    const len = promiseList.length
    let result = []
    if (len === 0) return resolve(result)
    for(let i = 0; i < len;i++) {
      Promise.resolve(promiseList[i]).then(function(res) {
        result.push(res)
        if (i === len - 1) {
          return resolve(result)
        }
      },function(err) {
        console.log(err)
        return reject(err)
      })
    }
  })
  return allPromise
}
```
<a name="Dqg78"></a>
## 测试


```javascript
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 1000, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
}).catch((err) => {
	console.log(err)
}).finally(() => {
  console.log('end')
})

Promise.resolve(4).then((res) => {
  console.log(res)
})
console.log('start')
```
