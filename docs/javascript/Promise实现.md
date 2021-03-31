```javascript
function Promise(executor) {
  this.status = 'pending'
  this.value = undefined

  this.onResolveCallback = []
  this.onRejectCallback = []
  const resolve = (val) => {
    if (this.status === 'pending') {
      this.status = 'fulfilled'
      this.value = val
      this.onResolveCallback.forEach((cb) => {
        cb(val)
      })
    }
  }
  const reject = (val) => {
    if (this.status === 'pending') {
      this.status = 'rejected'
      this.value = val
      this.onRejectCallback.forEach((cb) => {
        cb(val)
      })
    }
  }
  try {
    executor(resolve, reject)
  } catch (err) {
    reject(err)
  }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
  const onExecutionFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(v) { return v}
  const onExecutionRejected = typeof onRejected === 'function' ? onRejected : function(r) { return r }
  let p2
  if (this.status === 'pending') {
    p2 = new Promise((resolve, reject) => {
      this.onResolveCallback.push((value) => {
        setTimeout(() => {
          try {
            if (this.status === 'fulfilled' && typeof onFulfilled !== 'function') {
              resolve(this.value)
            }
            let ret = onExecutionFulfilled(value)
            resolvePromise(p2, ret, resolve, reject)
          } catch(err) {
            reject(err)
          }
        })
      })
      this.onRejectCallback.push((val) => {
        setTimeout(() => {
          try {
            if (this.status === 'rejected' && typeof onRejected !== 'function') {
              resolve(this.value)
            }
            let ret = onExecutionRejected(value)
            resolvePromise(p2, ret, resolve, reject)
          } catch(err) {
            reject(err)
          }
        })
      })
    })
  }
  if (this.status === 'fulfilled') {
    p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onFulfilled !== 'function') {
            resolve(this.value)
          }
          let ret = onExecutionFulfilled(this.value)
          resolvePromise(p2, ret, resolve, reject)
        } catch(err) {
          reject(err)
        }
      })
    })
  }

  if (this.status === 'rejected') {
    p2 = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (typeof onRejected !== 'function') {
            reject(this.value)
          }
          let ret = onExecutionRejected(this.value)
          resolvePromise(p2, ret, resolve, reject)
        } catch(err) {
          reject(err)
        }
      })
    })
  }
  return p2
}

function resolvePromise(p2, x, resolve, reject) {
  if (p2 === x) {
      return reject(new TypeError('循环引用'))
  }
  let then, called
  // x是对象或者函数
  if (x != null && (typeof x === 'function' || typeof x === 'object')) {
    try {
      // 尝试访问then属性
      then = x.then
      // then是函数
      if (typeof then === 'function') {
        then.call(x, function (data) {
          if (called) return
          called = true
          resolvePromise(p2, data, resolve, reject)
        }, function (err) {
          if (called) return
          called = true
          reject(err)
        })
      } else {
        // then不是函数，返回x,或者调用then发生了错误
        resolve(x)
      }
    } catch (e) {
      // 如果不存在x上不存在then方法，返回x
      if (called) return
      called = true
      reject(e)
    }
  } else {
    // 不是对象或者函数，则返回x
    resolve(x);
  }
}


Promise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected)
}

Promise.prototype.finally = function (fn) {
  return this.then((val) => {
    return new Promise.resolve(fn()).then((res) => res)
  }, 
  (err) => {
    return new Promise.resolve(fn()).then(() => { throw err })
  })
}

Promise.resolve = function(val) {
  return new Promise((resolve, reject) => {
    resolve(val)
  })
}

Promise.reject = function(val) {
  return new Promise((resolve, reject) => {
    reject(val)
  })
}

Promise.race = function(arr) {
  return new Promise((resolve, reject) => {
    arr.forEach((item) => {
      item.then(resolve, reject)
    })
  })
}

Promise.all = function (arr) {
  const len = arr.length
  const ans = []
  return new Promise((resolve, reject) => {
    arr.forEach((item, index) => {
      item.then((val) => {
        ans[index] = val
        if (ans.length === len) resolve(ans)
      }).catch((err) => {
        reject(err)
      })
    })
  })
}

Promise.allSettled = function (arr) {
  const len = arr.length
  const ans = []
  return new Promise((resolve, reject) => {
    arr.forEach((item, index) => {
      item.then((res) => {
        ans[index] = res
        if (ans.length === len) resolve(ans)
      }).catch((err) => {
        ans[index] = err
        if (ans.length === len) resolve(ans)
      })
    })
  })
}

let t1 = Promise.resolve('t2')
new Promise((resolve, reject) => {
  resolve(t1)
}).then((val) => {
  return val
}).then((res) => {
  console.log(res)
  return res
}).then((res) => {
  console.log(res)
})
```
