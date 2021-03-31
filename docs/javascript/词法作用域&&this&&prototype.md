<a name="B3VJP"></a>
## 词法作用域
变量是通过**词法作用域**来获取的，当查找一个变量的时候优先在当前作用域内查找，当前作用域不存在这个变量的时，会往父级作用域去查找，直到找到这个变量或者全局作用域。<br />示例：
```javascript
let globalName = 'globalScope'
function parent() {
	let parentName = 'parentScope'
  children()
  function children() {
		let childrenName = 'currentScope'
    console.log(childrenName)  // 在当前作用域下找到
    console.log(parentName)    // 在父级作用域下找到 
    console.log(globalName)    // 在全局作用于下找到
	}
}
parent()
```
变体：分别打印出什么
```javascript
var globalName = 'globalScope'
function parent() {
  let parentName = 'parentScope'
  children()
  function children() {
		let childrenName = 'currentScope'
    console.log(childrenName)
    console.log(parentName)
    console.log(this.globalName)
	}
}
parent()
```
```javascript
let globalName = 'globalScope'
function parent() {
  let parentName = 'parentScope'
  children()
  function children() {
		let childrenName = 'currentScope'
    console.log(childrenName)
    console.log(parentName)
    console.log(this.globalName)
	}
}
parent()
```
<a name="r5Vg8"></a>
## this
`this` 是指当前执行代码的环境对象，大部分情况下都是一个对象，在严格模式下可能为 `undefined` 。<br />`this` 的指向不是在定义时确定的，而是在函数运行时才确定的，并且每次运行 `this` 的指向都可能变化。<br />`this` 的绑定规则可以去看之前的文章。<br />**实例：**
```javascript
var Name = 'global'
function thisOrg() {
  let Name = 'thisOrg'
  // 词法作用域
  console.log(Name) // thisOrg
  // this默认绑定规则
  console.log(this) // window
  thisOrgChild()
  function thisOrgChild() {
    // 词法作用域
    console.log(Name) // thisOrg
    // this默认绑定规则 + 对象属性读取
    console.log(this.Name) // global
    // this默认绑定规则
    console.log(this)  // window
  }
}
thisOrg()

let thisObj = {
  Name: 'thisObj',
  fn() {
    console.log(this.Name)
  }
}
// this隐含绑定规则
thisObj.fn() // thisObj
const fn = thisObj.fn
// this默认绑定规则
fn() // global
```
<a name="THcjl"></a>
## prototype
当当前对象本身不存在某个属性的时候就会沿着原型链去找这个属性，直到在原型链上找到这个属性或者找到最上层的原型链（默认情况下是 `Object.prototype` ），最上层的原型链的原型指向 `null` 。<br />当原型链的函数被调用时，this 指向的是当前对象，而不是原型链函数所在的原型对象。<br />示例：
```javascript
let obj1 = {
  name: 'obj1',
  sayName() {
    console.log(this.name)
  }
}
let obj2 = {
  name: 'obj2'
}
Object.setPrototypeOf(obj2, obj1)
obj2.sayName() // obj2
obj1.sayName() // obj1
console.log(obj2)
console.log(Object.getPrototypeOf(obj2) === obj1) // true
```


