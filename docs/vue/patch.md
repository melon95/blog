<a name="SXLYF"></a>
# patch
虚拟 DOM 是将状态映射为视图的众多解决方法的一种，它的运作原理是使用状态生成虚拟节点 VNode，然后使用虚拟节点 VNode 渲染视图。<br />由于每次渲染时都是先创建 VNode，然后使用它去创建真实的 DOM 插入到页面中，所以可以将上一次生成的  VNode 缓存起来，每当需要重新渲染视图时，将新的 VNode 和旧的 VNode 进行对比，找出不一样的 DOM 节点并基于此去修改真实的 DOM。<br />对比新旧 VNode 并找出不同的 DOM 节点并基于此去修改真实的 DOM 的过程称为 **patch **，也是 虚拟 DOM 最核心的部分。<br />patch 过程中对 DOM 的修改需要三件事：

- 新增节点
- 删除节点
- 更新节点
<a name="y3xmV"></a>
## 新增节点
新增节点有三种情况：

- 首次渲染，oldVNode 为空
- VNode 中存在而 oldVNode 中不存在
- oldVNode 和 VNode 完全不是同一个节点

新增节点是比较简单的，调用当前环境的 `createElement`  方法创建一个节点，如果该节点还有子节点，递归生成子节点，再调用 `appendChild`  把节点插入到指定父节点中。
<a name="MDvGG"></a>
## 删除节点
当一个节点只在 oldVNode 中存在，在 VNode 中并不存在，所以需要删除这个节点
<a name="EfTcB"></a>
## 更新节点
当 VNode 和 oldVNode 是同一个节点时，使用更详细的对比操作对真实 DOM 进行更新

1. 两个节点是静态节点，直接跳过
1. VNode 有文本属性，用文本属性替代 DOM 的内容
1. VNode 没有文本属性
   1. 没有 children ，是一个空节点
   1. 有children，则还需要对 children 进行一个比较
<a name="FOBg7"></a>
## 更新子节点
更新子节点其实就是同时遍历新子节点（newChildren）和旧子节点（oldChildren），每遍历一次都去旧子节点（oldChildren）中去找本次遍历的新子节点。<br />在对比 children 的过程中，有4个 DOM 操作：
<a name="DiAoj"></a>
### 新增子节点
和新增节点相同，插入的位置是 oldChildren 中所有未处理节点的前面。如果 oldChileren 先遍历完成，则 newChildren 中剩下的节点都是新增节点
<a name="FDRbi"></a>
### 更新子节点
重复进行更新节点的一系类处理
<a name="CteEJ"></a>
### 移动子节点
移动节点通常发生在 newChildren 中的某个节点和 oldChildren 中的某个节点是同一个节点，但是位置不同，所以需要在真实 DOM 中移动这个节点到 oldChildren 未处理节点的前面
<a name="JkehZ"></a>
### 删除子节点
删除子节点是删除只存在于 oldChildren 中的节点，当 newChildren 遍历完成后，oldChildren 中所有未处理的节点都是要删除的节点
