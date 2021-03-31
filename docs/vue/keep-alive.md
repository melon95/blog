<a name="ofBT9"></a>
# keep-alive
`keep-alive` 是`vue` 的内置组件，包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。`keep-alive` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。<br />‌<br />接下来看一下`keep-alive` 的源码实现：<br />‌<br />首先接受三个`props` 参数：
```javascript
   props: {
     include: patternTypes, // 字符串或正则表达式。只有名称匹配的组件会被缓存。
     exclude: patternTypes, // 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
     max: [String, Number] // 数字。最多可以缓存多少组件实例。
   },
```
<a name="g0Ffx"></a>
## 生命周期函数
然后定义了三个生命周期函数：
```javascript
   created () {
     // 存放缓存组件的对象
     this.cache = Object.create(null)
     // 存放缓存组件key的数组，也是LRU的关键
     this.keys = []
   },
 
   destroyed () {
     // 卸载组件时，遍历所有的缓存组件并调用$destoryed方法
     for (const key in this.cache) {
       pruneCacheEntry(this.cache, key, this.keys)
     }
   },
 
   mounted () {
     // 监听include的变化
     this.$watch('include', val => {
       pruneCache(this, name => matches(val, name))
     })
     // 监听exclude的变化
     this.$watch('exclude', val => {
       pruneCache(this, name => !matches(val, name))
     })
   },
```
<a name="88TUh"></a>
## render函数
最后也是最重要的`render` 函数：
```javascript
   render () {
     // 获取keep-alive的slot内容也就是keep-alive包裹着的代码
     const slot = this.$slots.default
     // 获取第一个组件
     const vnode: VNode = getFirstComponentChild(slot)
     const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
     if (componentOptions) {
       // check pattern
       const name: ?string = getComponentName(componentOptions)
       const { include, exclude } = this
       // 如果不匹配included或者匹配excluded就直接返回 不缓存
       if (
         // not included
         (include && (!name || !matches(include, name))) ||
         // excluded
         (exclude && name && matches(exclude, name))
       ) {
         return vnode
       }
 
       const { cache, keys } = this
       // 取得独一无二的key值
       const key: ?string = vnode.key == null
         // same constructor may get registered as different local components
         // so cid alone is not enough (#3269)
         ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
         : vnode.key
       
       // 判断是否已经缓存
       if (cache[key]) {
         // 如果已经缓存，直接赋值
         vnode.componentInstance = cache[key].componentInstance
         // make current key freshest
         // 把当前的key移到数组的最后一个
         // 数组的第一个就是最近最少使用的组件
         remove(keys, key)
         keys.push(key)
       } else {
         // 如果没有缓存，就利用cache对象缓存
         cache[key] = vnode
         // 把当前的key值push到keys的最后
         keys.push(key)
         // prune oldest entry
         // 如果props传入了max属性，并且keys的长度大于max
         // 表示缓存的组件数量超过了缓存组件的最大值，就把最近最少使用的(keys的第一个key)移除
         if (this.max && keys.length > parseInt(this.max)) {
           pruneCacheEntry(cache, keys[0], keys, this._vnode)
         }
       }
 
       vnode.data.keepAlive = true
     }
     return vnode || (slot && slot[0])
   }
```
`keep-alive` 的代码到这里就结束了，整体比较简单。
<a name="eoDov"></a>
## 总结<br />


- `keep-alive` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中<br />
- 通过`slot` 来获取被包裹的组件<br />
- 空间换时间<br />
