<a name="7Mdpn"></a>
# this
this指向大概有5中规则(规则的权重大小是逐渐增大的，当可以应用多个规则时取权重大的)：

- 默认绑定
- 隐含绑定
- 明确绑定
- new绑定
- 箭头函数绑定



<a name="gvOX4"></a>
## 默认绑定
独立函数调用。可以认为这种 `this` 规则是在没有其他规则适用时的默认规则。<br />比如：<br />

```javascript
// 根据this来访问变量
function foo() {
  var a = 'foo'
	console.log( this.a );
}
var a = 'window'
foo() // window
```

<br />上面这段代要和下面这段代码区分开来，这是两个不一样的东西：<br />

```javascript
// 根据词法作用域来访问变量
function foo() {
  var a = 'foo'
	console.log( a );
}
var a = 'window'
foo() // foo


function foo1() {
	console.log( a );
}
var a1 = 'window'
foo1() // window
```


<a name="nedJM"></a>
## 隐含绑定


```javascript
function foo() {
  console.log(this.a)
}
var obj = {
  a: 'obj',
  foo,
}
var a = 'window'
obj.foo() // obj

// 或者
var obj = {
  a: 'obj',
  foo: function foo() {
    console.log(this.a)
  }
}
var a = 'window'
obj.foo() // obj
```

<br />但是当我们尝试把 `obj.foo` 赋值给一个变量时，又会回到第一种情况：默认绑定，因为函数引用类型的数据<br />

```javascript
var obj = {
  a: 'obj',
  foo: function foo() {
    console.log(this.a)
  }
}
var a = 'window'
var bar = obj.foo
bar() // window
```


<a name="OfEsN"></a>
## 明确绑定
通过调用 `call` 、 `apply` 、 `bind` 函数或者给JS本身某些内置方法的可选this参数传递值，来明确的绑定this。<br />

```javascript
function bar() {
  console.log(this.a)
}
var obj1 = {
  a: 'obj1'
}
var obj2 = {
  a: 'obj2'
}
var obj3 = {
  a: 'obj3'
}
bar.call(obj1) // obj1
bar.apply(obj2) // obj2
bar() // undefined
var baz = bar.bind(obj3)
baz() // obj3
```


<a name="MttZr"></a>
## new绑定


```javascript
function Foo(a) {
	this.a = a;
}

var bar = new Foo( 2 );
console.log( bar.a ); // 2
```


<a name="cSR7G"></a>
## 箭头函数绑定


```javascript
function foo() {
  // 因为foo是通过call来调用的，所以此时foo的this是指向{ id: 42 }这个对象的
  // 箭头函数强行绑定了setTimeout里面函数的this就是外部环境的this
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;
// 隐含帮绑定
foo.call({ id: 42 }); // 42



function foo1() {
  // setTimeout里面的函数是独立调用，适用第一条规则默认绑定，this是window对象
  setTimeout(function() {
    console.log('id:', this.id);
  }, 100);
}

var id = 21;

foo1.call({ id: 42 }); // 21
```

<br />箭头函数有几个需要注意的点：

- 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象。
- 不可以使用`arguments`对象
- 不能使用 `new` 操作符
- 不可以使用`yield`命令



