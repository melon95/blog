<a name="mprdl"></a>
# VueX
<a name="vtK4A"></a>
## 介绍
Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。<br />接下来通过代码来看看`Vuex` 到底是什么。
```javascript
 // src/index.js
 import { Store, install } from './store'
 import { mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers } from './helpers'
 
 export default {
   Store,
   install,
   version: '__VERSION__',
   mapState,
   mapMutations,
   mapGetters,
   mapActions,
   createNamespacedHelpers
 }
```
可以看出`VueX` 本质就是一个对象。

在`Vue` 项目中使用`VueX` 往往都是通过`Vue.use(VueX)` 来注册，当触发`Vue.use(VueX)` 的时候会调用`VueX` 的。
<a name="t4uhD"></a>
## install函数
```javascript
 // src/store.js
 let _Vue
 function install (_Vue) {
   if (Vue && _Vue === Vue) {
     return
   }
   Vue = _Vue
   applyMixin(Vue)
 }
 
 // src/mixin.js
 export default function applyMixin(Vue) {
   const version = Number(Vue.version.split('.')[0])
 
   if (version >= 2) {
     Vue.mixin({ beforeCreate: vuexInit })
   }
 }
 
 function vuexInit () {
     const options = this.$options
     // store injection
     // 只有根实例才有store
     if (options.store) {
       this.$store = typeof options.store === 'function'
         ? options.store()
         : options.store
     } else if (options.parent && options.parent.$store) {
       // 如果没有就引用父组件上的$store属性
       this.$store = options.parent.$store
     }
   }
 }
```
<a name="store"></a>
### Store
‌在项目中实例化`VeuX` 的时候是这么写的：
```javascript
 new VueX.Store({})
```
下面来看看`Store` 的源码：
```javascript
 // src/store.js
 constructor (options = {}) {
   // 如果Vue存在切是浏览器环境，自动调用install方法
   if (!Vue && typeof window !== 'undefined' && window.Vue) {
     install(window.Vue)
   }
 
   const {
     plugins = [],
     strict = false
   } = options
 
   // store internal state
   this._committing = false  // 标识是否通过mutation改变的state
   this._actions = Object.create(null)
   this._actionSubscribers = []
   this._mutations = Object.create(null)
   this._wrappedGetters = Object.create(null)
   // 很关键的一步 下面有介绍
   this._modules = new ModuleCollection(options)  // 子模块
   this._modulesNamespaceMap = Object.create(null) // 子模块命名空间map
   this._subscribers = []
   this._watcherVM = new Vue()
   this._makeLocalGettersCache = Object.create(null)
 
   // bind commit and dispatch to self
   const store = this
   const { dispatch, commit } = this
   // 重写dispatch  绑定dispatch的this
   this.dispatch = function boundDispatch (type, payload) {
     return dispatch.call(store, type, payload)
   }
   // 重写commit  绑定commit的this
   this.commit = function boundCommit (type, payload, options) {
     return commit.call(store, type, payload, options)
   }
 
   // 是否严格模式
   this.strict = strict
 }
```
<a name="LUtV2"></a>
## **_modules**
```javascript
 // src/module/module-collection.js
 
 // ModuleCollection
 class ModuleCollection {
   constructor (rawRootModule) {
     // register root module (Vuex.Store options)
     // 注册根模块
     this.register([], rawRootModule, false)
   }
   register (path, rawModule, runtime = true) {
     if (process.env.NODE_ENV !== 'production') {
       assertRawModule(path, rawModule)
     }
 
     const newModule = new Module(rawModule, runtime)
     if (path.length === 0) {
       // 当path为空数组的时候表示当前模块是根模块
       this.root = newModule
     } else {
       // 获取当前命名模块的父级
       const parent = this.get(path.slice(0, -1))
       // 往父级的_childred上添加属性
       parent.addChild(path[path.length - 1], newModule)
     }
 
     // register nested modules
     if (rawModule.modules) {
       // 如果还有子模块，递归调用注册
       forEachValue(rawModule.modules, (rawChildModule, key) => {
         this.register(path.concat(key), rawChildModule, runtime)
       })
     }
   }
 }
```
<a name="X8S4Y"></a>
## module
```javascript
 // src/module/module.js
 
 // Module
 constructor (rawModule, runtime) {
   this.runtime = runtime
   // Store some children item
   this._children = Object.create(null)
   // 保存原本的module对象
   this._rawModule = rawModule
   const rawState = rawModule.state
 
   // Store the origin module's state
   this.state = (typeof rawState === 'function' ? rawState() : rawState) || {}
 }
```
所以这个时候的`this._modules` 大概就是这样的：
```javascript
 {
   root: {
     state: {}, 
     runtime: false,
     _children: {
       a: {
         state: {},
         runtime: false,
         ...
       }
     },
     _rowModule: {},
   }
 }
```
下面继续看`Store` 的源码：
```javascript
 // 取到根组件state对象的引用
 const state = this._modules.root.state
 
 // init root module.
 // this also recursively registers all sub-modules
 // and collects all module getters inside this._wrappedGetters
 installModule(this, state, [], this._modules.root)
 
 // initialize the store vm, which is responsible for the reactivity
 // (also registers _wrappedGetters as computed properties)
 resetStoreVM(this, state)
 
 // apply plugins
 plugins.forEach(plugin => plugin(this))
```
<a name="VnCnH"></a>
## **installModule**
```javascript
 // src/store.js
 
 function installModule (store, rootState, path, module, hot) {
   const isRoot = !path.length
   // 获取模块的命名，如果是根模块则为''
   const namespace = store._modules.getNamespace(path)
 
   // register in namespace map
   if (module.namespaced) {
     store._modulesNamespaceMap[namespace] = module
   }
 
   // set state
   if (!isRoot && !hot) {
     const parentState = getNestedState(rootState, path.slice(0, -1))
     const moduleName = path[path.length - 1]
     store._withCommit(() => {
       // 往父级的state上添加当前的state对象
       Vue.set(parentState, moduleName, module.state)
     })
   }
   // 根据命名模块的名字取到命名模块内部的数据
   const local = module.context = makeLocalContext(store, namespace, path)
   // 注册mutation
   module.forEachMutation((mutation, key) => {
     const namespacedType = namespace + key
     registerMutation(store, namespacedType, mutation, local)
   })
   // 注册action
   module.forEachAction((action, key) => {
     const type = action.root ? key : namespace + key
     const handler = action.handler || action
     registerAction(store, type, handler, local)
   })
   // 注册getter
   module.forEachGetter((getter, key) => {
     const namespacedType = namespace + key
     registerGetter(store, namespacedType, getter, local)
   })
   // 如果还有子模块迭代注册
   module.forEachChild((child, key) => {
     installModule(store, rootState, path.concat(key), child, hot)
   })
 }
 
 
 function makeLocalContext (store, namespace, path) {
   const noNamespace = namespace === ''
 
   const local = {
     dispatch: noNamespace ? store.dispatch : (_type, _payload, _options) => {
       const args = unifyObjectStyle(_type, _payload, _options)
       const { payload, options } = args
       let { type } = args
 
       if (!options || !options.root) {
           return
         }
       }
       return store.dispatch(type, payload)
     },
 
     commit: noNamespace ? store.commit : (_type, _payload, _options) => {
       const args = unifyObjectStyle(_type, _payload, _options)
       const { payload, options } = args
       let { type } = args
 
       if (!options || !options.root) {
           return
         }
       }
       store.commit(type, payload, options)
     }
   }
 
   // getters and state object must be gotten lazily
   // because they will be changed by vm update
   Object.defineProperties(local, {
     getters: {
       get: noNamespace
         ? () => store.getters
         : () => makeLocalGetters(store, namespace)
     },
     state: {
       get: () => getNestedState(store.state, path)
     }
   })
 
   return local
 }
```
当执行完`installModule` 方法，`state` 变成了一个树状结构，模块钳模块。
<a name="7CKx7"></a>
## **resetStoreVM**
```javascript
 function resetStoreVM (store, state, hot) {
   const oldVm = store._vm
   // bind store public getters
   store.getters = {}
   // reset local getters cache
   store._makeLocalGettersCache = Object.create(null)
   const wrappedGetters = store._wrappedGetters
   const computed = {}
   forEachValue(wrappedGetters, (fn, key) => {
     // 利用computed缓存
     computed[key] = function () {
       return fn(store)
     }
     // 访问store.getters就是访问store._vm的computed
     Object.defineProperty(store.getters, key, {
       get: () => store._vm[key],
       enumerable: true // for local getters
     })
   })
   
   const silent = Vue.config.silent
   Vue.config.silent = true
   store._vm = new Vue({
     data: {
       $$state: state
     },
     computed
   })
   Vue.config.silent = silent
 
   // enable strict mode for new vm
   if (store.strict) {
     // 深度监听state
     enableStrictMode(store)
   }
 
   if (oldVm) {
     if (hot) {
       // dispatch changes in all subscribed watchers
       // to force getter re-evaluation for hot reloading.
       store._withCommit(() => {
         oldVm._data.$$state = null
       })
     }
     // 注销旧的vm实例
     Vue.nextTick(() => oldVm.$destroy())
   }
 }
```
到这里`Store` 的实例化就结束了。<br />‌<br />到最后的在`new VueX.store(options)` 中的 **options** 中定义的getters、mutations、actions、state都会被整合到一起：<br />![getters.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1590941443492-4d2ac875-b61f-483b-b723-d000a6133933.png#align=left&display=inline&height=86&margin=%5Bobject%20Object%5D&name=getters.png&originHeight=86&originWidth=301&size=2692&status=done&style=none&width=301)![mutation.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1590941467011-7afaf044-6341-4c75-8628-00e766f75bfb.png#align=left&display=inline&height=85&margin=%5Bobject%20Object%5D&name=mutation.png&originHeight=85&originWidth=241&size=2731&status=done&style=none&width=241)![actions.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1590941472159-b246aa4c-3b9c-4a8a-af20-0773c039cd5d.png#align=left&display=inline&height=86&margin=%5Bobject%20Object%5D&name=actions.png&originHeight=86&originWidth=289&size=3012&status=done&style=none&width=289)![state.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1590941484789-db726bea-921e-477e-b239-9de7a9ab21bb.png#align=left&display=inline&height=85&margin=%5Bobject%20Object%5D&name=state.png&originHeight=85&originWidth=237&size=2367&status=done&style=none&width=237)<br />其中图片中的a和B是两个子模块。
<a name="Rzjjn"></a>
## 总结
![VueX.png](https://cdn.nlark.com/yuque/0/2020/png/299895/1590941525892-5a214a23-5ded-4189-b670-4abb09872cd7.png#align=left&display=inline&height=951&margin=%5Bobject%20Object%5D&name=VueX.png&originHeight=951&originWidth=1235&size=81167&status=done&style=none&width=1235)
