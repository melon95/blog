<a name="q19wn"></a>
# Class
<a name="ahMew"></a>
## 介绍
在 ES6 之前，生成实例对象的是通过构造函数，ES6 新增了一个 `class` 也可以生成实例对象，用来模拟传统面向对象语言中的类，但是大体上可以看做是构造函数的语法糖。新的 `class` 写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。
<a name="8PgZz"></a>
## 语法
`class` 新写法：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
}
const parent = new Parent('parent')
console.log(parent.__proto__ === Parent.prototype) // true
console.log(parent.parentLog === Parent.prototype.parentLog) // true
```

<br />
<br />与之对应的构造函数的写法：
```javascript
function Parent(name) {
  this.name = name
}
Parent.prototype.parentLog = function () {
  console.log('Parent')
}
 
const parent = new Parent('parent')
console.log(parent.__proto__ === Parent.prototype) // true
```

<br />
<br />上面两种写法在功能上是完全一致的。<br />在类中定义的方法其实都是定义在的类的 `prototype` 属性上，并且都是**不可枚举**的(跟**构造函数**有点不同)。
<a name="m40EK"></a>
## 静态属性
实例对象的属性不只可以卸载 `constructor` 方法中，还可以定义在类的最顶层。
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
  egg = 'egg'
}
const parent = new Parent('parent')
console.log(parent.hasOwnProperty('egg')) // true 有这个属性
console.log(Parent.hasOwnProperty('egg')) // false 没有这个属性
```

<br />
<br />可以看到 `parent` 上面多了一个 `egg` 属性。<br />怎么能把属性添加到类上而不是实例对象上呢？可以用 `static` ：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
  egg = 'egg'
  static age = 'age'
}
const parent = new Parent('parent')
console.log(parent.hasOwnProperty('age')) // false 没有这个属性
console.log(Parent.hasOwnProperty('age')) // true 有这个属性
```


<a name="iayst"></a>
## 静态方法
类中定义的方法默认是添加到类的 `prototype` 上的：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
}
const parent = new Parent('parent')
console.log(parent.hasOwnProperty('parentLog'))  // false 没有这个方法
console.log(Parent.hasOwnProperty('parentLog'))  // false 没有这个方法
console.log(Parent.prototype.hasOwnProperty('parentLog')) // true 有这个方法
```

<br />
<br />上文在 `Parent` 中定义了一个 `parentLog` 方法，结果只有`Parent.prototype` 才真正拥有这个方法。<br />要把方法添加到类上，而不是类的 `prototype` 上，可以配合 `static` 属性：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
  static parentTest() {
    console.log('test')
  }
}
const parent = new Parent('parent')
console.log(parent.hasOwnProperty('parentTest')) // false 没有这个方法
console.log(Parent.hasOwnProperty('parentTest')) // true  有这个方法
console.log(Parent.prototype.hasOwnProperty('parentTest')) // false 没有这个方法
```


<a name="aFufr"></a>
## 继承
类与类之间可以通过 `extends` 实现继承：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log('Parent')
  }
}
class Child extends Parent {
  constructor(name) {
    super(name)
  }
  childLog() {
    console.log('Child')
  }
}
const parent = new Parent('parent')
const child = new Child('child')
// => 表示原型链
// parent => Parent.prototype => Object.prototype
// child => Child.prototype => Object.prototype
// Child => Parent => Function.prototype => Object.prototype
```

<br />当子类继承父类的时候，子类上存在两条原型链：

- 子类继承自父类：`Child.__proto__ === Parent`<br />
- 子类 `prototype` 继承自父类 `prototype` ：`Child.prototype.__proto__ === Parent.prototype`<br />

所以当子类继承父类的时候，也会继承父类的静态属性和静态方法，因为父类会成为子类的原型。<br />子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类自己的 `this` 对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用 `super` 方法，子类就得不到 `this` 对象。<br />ES5 的继承，实质是先创造子类的实例对象 `this` ，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到 `this` 上面（所以必须先调用 `super` 方法），然后再用子类的构造函数修改 `this` 。<br />并且在子类的构造函数中，只有调用 `super` 之后，才可以使用 `this` 关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有 `super` 方法才能调用父类实例。
<a name="xa9vF"></a>
## 私有属性和私有方法
私有方法和私有属性是指只能在类的内部访问的方法和属性，外部不能访问。<br />在 ES6 前中私有属性和私有方法一般是通过两种方法来实现：

- 变量名加前缀<br />
- 闭包<br />

在 ES6 中，`class` 内部可以原生实现私有方法和私有属性，在变量名前加一个 `#` ([提案](https://github.com/tc39/proposal-class-fields)) ：
```javascript
class Parent {
  constructor(name) {
    this.name = name
  }
  parentLog() {
    console.log(this.#log)
  }
  #log = 43
}
const parent = new Parent('parent')
parent.parentLog() // 43
console.log(parent.#log) // SyntaxError: Private field '#log' must be declared in an enclosing class
```

<br />
<br />但是在 Chrome83 中暂时还只是实现了私有属性并没有实现私有方法。
