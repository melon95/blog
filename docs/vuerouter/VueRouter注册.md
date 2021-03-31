<a name="bSjaT"></a>
# VueRouter注册
<a name="n3pgP"></a>
## 注册
在Vue中使用`vue-router` 是通过`Vue.use(VueRouter)` 先来注册。<br />‌<br />然后再在`new Vue()中当参数传入`
```javascript
new Vue({
 router,
 store,
 render: h => h(App)
}).$mount('#app')
```
<a name="Mgpav"></a>
## Vue.use()
接下来分析一下`Vue.use()` ：
```javascript
 Vue.use = function (plugin: Function | Object) {
   const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
   // 如果已经注册过了，就直接返回
   if (installedPlugins.indexOf(plugin) > -1) {
     return this
   }

   // 拿到plugin后面的参数
   const args = toArray(arguments, 1)
   // 把Vue添加到数组的最前面
   args.unshift(this)
   if (typeof plugin.install === 'function') {
     // 如果install是一个函数，则运行install
     plugin.install.apply(plugin, args)
   } else if (typeof plugin === 'function') {
     // 如果plugin是一个函数，直接运行
     plugin.apply(null, args)
   }
   installedPlugins.push(plugin)
   return this
 }
```
<a name="RW6ny"></a>
## install函数
当`Vue.use(VueRouter)` 执行时，会触发`install` 函数：
```javascript
 let _Vue
 export function install (Vue) {
   // 第一个参数Vue就是在Vue.use中Vue是install函数的第一个参数
   // 如果已经执行过了直接返回
   if (install.installed && _Vue === Vue) return
   
   // installed为True表示这个插件已经加载过了
   install.installed = true
 
   _Vue = Vue
   // 判断是不是undefined
   const isDef = v => v !== undefined
   
   // 注册router实例
   const registerInstance = (vm, callVal) => {
     let i = vm.$options._parentVnode
     if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
       i(vm, callVal)
     }
   }
   
   // 往Vue实例中注入方法
   Vue.mixin({
     beforeCreate () {
       // this.$options.router就是在new Vue()中传入的router对象，文章第一段代码
       if (isDef(this.$options.router)) {
         this._routerRoot = this
         this._router = this.$options.router
         // 执行init方法
         this._router.init(this)
         // 把this._route变成响应式
         Vue.util.defineReactive(this, '_route', this._router.history.current)
       } else {
         // 如果没有route对象，则取根实例的_routerRoot或者当前实例
         this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
       }
       registerInstance(this, this)
     },
     destroyed () {
       registerInstance(this)
     }
   })
   // 在Vue原型上添加$router属性
   Object.defineProperty(Vue.prototype, '$router', {
     get () { return this._routerRoot._router }
   })
   // 在Vue原型上添加$route属性
   Object.defineProperty(Vue.prototype, '$route', {
     get () { return this._routerRoot._route }
   })
   
   // 全局注册router-view和router-link
   Vue.component('RouterView', View)
   Vue.component('RouterLink', Link)
 
   const strats = Vue.config.optionMergeStrategies
   // use the same hook merging strategy for route hooks
   strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
 }
```
