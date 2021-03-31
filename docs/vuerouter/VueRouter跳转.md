<a name="soUyH"></a>
# VueRouter跳转
在`VueRouter` 的install方法中通过`Vue.mixin` 往每个组件的`beforeCreate` 中注入了一些方法：
```javascript
Vue.mixin({
  beforeCreate () {
    // 只有根组件才有router对象
    if (isDef(this.$options.router)) {
      this._routerRoot = this
      this._router = this.$options.router
      // 执行init方法
      // 定义在src/index.js下面
      this._router.init(this)
      // 把_route变成响应式，以此来触发组件更新
      Vue.util.defineReactive(this, '_route', this._router.history.current)
    } else {
      // 拿到根组件的__routerRoot
      this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
    }
    // 在route的matched对象上添加一个路由映射
    // 在router-view组件中执行
    registerInstance(this, this)
  },
  destroyed () {
    registerInstance(this)
  }
})
```
在`init` 方法中判断你所设置的路由模式来进行一系列的处理，以hash模式为例：
```javascript
init (app: any /* Vue component instance */) {
  // 收集vue实例
  this.apps.push(app)
  // set up app destroyed handler
  // https://github.com/vuejs/vue-router/issues/2639
  app.$once('hook:destroyed', () => {
    // clean out app from this.apps array once destroyed
    // 当vue实例卸载时从apps中移除
    const index = this.apps.indexOf(app)
    if (index > -1) this.apps.splice(index, 1)
    // ensure we still have a main app or null if no apps
    // we do not release the router so it can be reused
    if (this.app === app) this.app = this.apps[0] || null
  })
  // main app previously initialized
  // return as we don't need to set up new history listener
  // 保证后面的代码只执行一次
  if (this.app) {
    return
  }
  this.app = app
  // 路由模式对象
  const history = this.history
  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation())
  } else if (history instanceof HashHistory) {
    const setupHashListener = () => {
      // 添加hashchange或者popstate监听器
      history.setupListeners()
    }
    // 路由跳转
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    )
  }

  history.listen(route => {
    this.apps.forEach((app) => {
      // 触发_route的setter
      app._route = route
    })
  })
}

// src/history/base.js History
listen (cb) {
  this.cb = cb
}
```
`HashHistory` 类：
```javascript
class HashHistory extends History {
  constructor (router: Router, base: ?string, fallback: boolean) {
    super(router, base)
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash()
  }
    
  ensureURL (push?: boolean) {
    const current = this.current.fullPath
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current)
    }
  }
    
  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  setupListeners () {
    const router = this.router
    const expectScroll = router.options.scrollBehavior
    const supportsScroll = supportsPushState && expectScroll
	// 滚动事件
    if (supportsScroll) {
      setupScroll()
    }
	// 添加事件监听器
    // 当浏览器发生回退或者前进时触发
    window.addEventListener(
      supportsPushState ? 'popstate' : 'hashchange',
      () => {
        const current = this.current
        if (!ensureSlash()) {
          return
        }
        this.transitionTo(getHash(), route => {
          if (supportsScroll) {
            handleScroll(this.router, route, current, true)
          }
          if (!supportsPushState) {
            replaceHash(route.fullPath)
          }
        })
      }
    )
  }
  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    const { current: fromRoute } = this
    this.transitionTo(
      location,
      route => {
        // 在这里改变页面URL
        pushHash(route.fullPath)
        handleScroll(this.router, route, fromRoute, false)
        onComplete && onComplete(route)
      },
      onAbort
    )
  }
}
```
在`VueRouter` 中页面的跳转都是通过`transitionTo` 这个函数来统一实现的：
```javascript
// src/history/base.js
transitionTo (
  location: RawLocation,
  onComplete?: Function,
  onAbort?: Function
) {
  // route是一个路由对象，包括自定义的所有属性：path、name、redirect、meta等等
  // 实现在src/create-router-map.js中
  const route = this.router.match(location, this.current)
  this.confirmTransition(
    route,
    () => {
      // 更新url
      this.updateRoute(route)
      onComplete && onComplete(route)
      this.ensureURL()

      // fire ready cbs once
      if (!this.ready) {
        this.ready = true
        this.readyCbs.forEach(cb => {
          cb(route)
        })
      }
    },
    err => {
      if (onAbort) {
        onAbort(err)
      }
      if (err && !this.ready) {
        this.ready = true
        this.readyErrorCbs.forEach(cb => {
          cb(err)
        })
      }
    }
  )
}
```
```javascript
confirmTransition (route: Route, onComplete: Function, onAbort?: Function) {
  const current = this.current
  // updated可复用的组件
  // deactivated失活组件
  // activated激活组件
  const { updated, deactivated, activated } = resolveQueue(
    this.current.matched,
    route.matched
  )
	// 要触发的方法队列
  const queue: Array<?NavigationGuard> = [].concat(
    // in-component leave guards
    // 触发失活组件的beforeRouteLeave
    extractLeaveGuards(deactivated),
    // global before hooks
    // 触发全局beforeEach
    this.router.beforeHooks,
    // in-component update hooks
    // 触发复用组件内部的beforeRouteUpdate
    extractUpdateHooks(updated),
    // in-config enter guards
    // 触发激活组件的beforeEnter
    activated.map(m => m.beforeEnter),
    // async components
    // 解析异步组件
    resolveAsyncComponents(activated)
  )

  this.pending = route
  const iterator = (hook: NavigationGuard, next) => {
    if (this.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, (to: any) => {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this.ensureURL(true)
          abort(to)
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' &&
            (typeof to.path === 'string' || typeof to.name === 'string'))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort()
          if (typeof to === 'object' && to.replace) {
            this.replace(to)
          } else {
            this.push(to)
          }
        } else {
          // confirm transition and pass on the value
          next(to)
        }
      })
    } catch (e) {
      abort(e)
    }
  }

  runQueue(queue, iterator, () => {
    const postEnterCbs = []
    const isValid = () => this.current === route
    // wait until async components are resolved before
    // extracting in-component enter guards
    // 取到定义的beforeRouteEnter
    const enterGuards = extractEnterGuards(activated, postEnterCbs, isValid)
    // 拼接全局的beforeResolve
    const queue = enterGuards.concat(this.router.resolveHooks)
    // 再次轮询
    runQueue(queue, iterator, () => {
      if (this.pending !== route) {
        return abort()
      }
      this.pending = null
      // 这里是调用transitionTo中调用confirmTransition传的第二个参数
      onComplete(route)
      if (this.router.app) {
        this.router.app.$nextTick(() => {
          postEnterCbs.forEach(cb => {
            cb()
          })
        })
      }
    })
  })
}
```
```javascript
// fn是iterator
// cb是最后那个箭头函数
function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    // 当遍历结束 调用cb
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        // 调用iterator
        // iterator中的next方法就是执行step(index + 1)
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }
  step(0)
}
```
当你手动设置了一个导航守卫的时候，必须手动调用next。比如：
```javascript
router.beforeEach((to, from, next) => {
 console.log(next);
 next();
});
```
这里的`next` 方法就是`iterator` 中传入`hook` 的第三个参数，导航守卫的`next` 方法里面会调用`iterator` 的`next` 也就是`step(index + 1)` ，从而能够继续遍历。这样即使你在导航守卫中定义了异步函数，也能保证导航守卫的按顺序触发。<br />‌<br />最后一个比较有意思的事情：<br />‌<br />当新启动一个Vue项目，复制项目地址在浏览器中打开会自动给你添加一个为/的hash。<br />‌<br />就像你复制`http://localhost:8080` 就会变成`http://localhost:8080/#/`  。<br />‌<br />原因是在实例化`HashHistory` 的最后执行了`ensureSlash` 函数：
```javascript
constructor (router: Router, base: ?string, fallback: boolean) {
  super(router, base)
  // check history fallback deeplinking
  if (fallback && checkFallback(this.base)) {
    return
  }
  ensureSlash()
}


function ensureSlash (): boolean {
  // 当输入http://localhost:8080的时候
  // getHash返回一个空的字符串
  const path = getHash()
  if (path.charAt(0) === '/') {
    return true
  }
  // 替换当前的历史记录：也就是http://localhost:8080的这条历史记录
  replaceHash('/' + path)
  return false
}
```
