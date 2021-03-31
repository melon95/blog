<a name="W1H9M"></a>
# VueRouter类
首先看下`VueRouter` 实例的属性：
```javascript
 constructor (options: RouterOptions = {}) {
   // 保存Vue实例
   this.app = null
   // Vue实例数组，可能存在多个vue-router实例
   this.apps = []
   this.options = options
   this.beforeHooks = []
   this.resolveHooks = []
   this.afterHooks = []
   // 后面有详细代码
   this.matcher = createMatcher(options.routes || [], this)

   let mode = options.mode || 'hash'
   // supportsPushState检测浏览器是否支持history模式
   this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
   // 如果浏览器不支持history模式就自动降级为hash模式
   if (this.fallback) {
     mode = 'hash'
   }
   // 如果不是浏览器环境
   if (!inBrowser) {
     mode = 'abstract'
   }
   this.mode = mode

   switch (mode) {
     case 'history':
       this.history = new HTML5History(this, options.base)
       break
     case 'hash':
       this.history = new HashHistory(this, options.base, this.fallback)
       break
     case 'abstract':
       this.history = new AbstractHistory(this, options.base)
       break
     default:
       if (process.env.NODE_ENV !== 'production') {
         assert(false, `invalid mode: ${mode}`)
       }
   }
 }
```
它上面还定义了很多原型方法，比如上一篇中的`init`：
```javascript
 init (app: any /* Vue component instance */) {
   
   this.apps.push(app)

   // set up app destroyed handler
   // https://github.com/vuejs/vue-router/issues/2639
   app.$once('hook:destroyed', () => {
     // clean out app from this.apps array once destroyed
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
       app._route = route
     })
   })
 }
```
`createMatcher` :
```javascript
export function createMatcher (
 routes: Array<RouteConfig>,
 router: VueRouter
): Matcher {
 // 把自定义路由对象数组，解析成路径数组，路径映射和名称映射
 const { pathList, pathMap, nameMap } = createRouteMap(routes)
 
 // 添加新的路由记录routerRecord对象
 function addRoutes (routes) {
   createRouteMap(routes, pathList, pathMap, nameMap)
 }
 // 根据目标路由和当前路由计算出路径
 function match (
   raw: RawLocation,
   currentRoute?: Route,
   redirectedFrom?: Location
 ): Route {
   const location = normalizeLocation(raw, currentRoute, false, router)
   const { name } = location

   if (name) {
     const record = nameMap[name]
     if (process.env.NODE_ENV !== 'production') {
       warn(record, `Route with name '${name}' does not exist`)
     }
     if (!record) return _createRoute(null, location)
     const paramNames = record.regex.keys
       .filter(key => !key.optional)
       .map(key => key.name)

     if (typeof location.params !== 'object') {
       location.params = {}
     }

     if (currentRoute && typeof currentRoute.params === 'object') {
       for (const key in currentRoute.params) {
         if (!(key in location.params) && paramNames.indexOf(key) > -1) {
           location.params[key] = currentRoute.params[key]
         }
       }
     }

     location.path = fillParams(record.path, location.params, `named route "${name}"`)
     return _createRoute(record, location, redirectedFrom)
   } else if (location.path) {
     location.params = {}
     for (let i = 0; i < pathList.length; i++) {
       const path = pathList[i]
       const record = pathMap[path]
       if (matchRoute(record.regex, location.path, location.params)) {
         return _createRoute(record, location, redirectedFrom)
       }
     }
   }
   // no match
   return _createRoute(null, location)
 }

 function redirect (
   record: RouteRecord,
   location: Location
 ): Route {
   const originalRedirect = record.redirect
   let redirect = typeof originalRedirect === 'function'
     ? originalRedirect(createRoute(record, location, null, router))
     : originalRedirect

   if (typeof redirect === 'string') {
     redirect = { path: redirect }
   }

   if (!redirect || typeof redirect !== 'object') {
     if (process.env.NODE_ENV !== 'production') {
       warn(
         false, `invalid redirect option: ${JSON.stringify(redirect)}`
       )
     }
     return _createRoute(null, location)
   }

   const re: Object = redirect
   const { name, path } = re
   let { query, hash, params } = location
   query = re.hasOwnProperty('query') ? re.query : query
   hash = re.hasOwnProperty('hash') ? re.hash : hash
   params = re.hasOwnProperty('params') ? re.params : params

   if (name) {
     // resolved named direct
     const targetRecord = nameMap[name]
     if (process.env.NODE_ENV !== 'production') {
       assert(targetRecord, `redirect failed: named route "${name}" not found.`)
     }
     return match({
       _normalized: true,
       name,
       query,
       hash,
       params
     }, undefined, location)
   } else if (path) {
     // 1. resolve relative redirect
     const rawPath = resolveRecordPath(path, record)
     // 2. resolve params
     const resolvedPath = fillParams(rawPath, params, `redirect route with path "${rawPath}"`)
     // 3. rematch with existing query and hash
     return match({
       _normalized: true,
       path: resolvedPath,
       query,
       hash
     }, undefined, location)
   } else {
     if (process.env.NODE_ENV !== 'production') {
       warn(false, `invalid redirect option: ${JSON.stringify(redirect)}`)
     }
     return _createRoute(null, location)
   }
 }

 function alias (
   record: RouteRecord,
   location: Location,
   matchAs: string
 ): Route {
   const aliasedPath = fillParams(matchAs, location.params, `aliased route with path "${matchAs}"`)
   const aliasedMatch = match({
     _normalized: true,
     path: aliasedPath
   })
   if (aliasedMatch) {
     const matched = aliasedMatch.matched
     const aliasedRecord = matched[matched.length - 1]
     location.params = aliasedMatch.params
     return _createRoute(aliasedRecord, location)
   }
   return _createRoute(null, location)
 }
 // 创建一个routerRecord对象
 function _createRoute (
   record: ?RouteRecord,
   location: Location,
   redirectedFrom?: Location
 ): Route {
   if (record && record.redirect) {
     return redirect(record, redirectedFrom || location)
   }
   if (record && record.matchAs) {
     return alias(record, location, record.matchAs)
   }
   return createRoute(record, location, redirectedFrom, router)
 }

 return {
   match,
   addRoutes
 }
}
```
