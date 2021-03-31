<a name="cPLzT"></a>
# apply&&call&&bind
<a name="xY08p"></a>
## call
`call()` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。<br />**语法：**
```javascript
function.call(thisArg, arg1, arg2, ...)
```
**参数：**

- `thisArg` ：在 _`function`_ 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。
- `arg1, arg2, ...` ：指定的参数列表。

**模拟实现：**
```javascript
Function.prototype.call = function(context) {
  context = context || window
  const args = Array.from(arguments).slice(1)
  const fn = Symbol('fn')
  context[fn] = this
  const res =context[fn](...args)
  delete context[fn]
  return res
}
```
<a name="6TlSu"></a>
## apply
`apply()` 方法调用一个具有给定`this`值的函数，以及作为一个数组（或类似数组对象）提供的参数。<br />**语法：**
```javascript
func.apply(thisArg, [argsArray])
```
**参数：**

- `thisArg` ：在 _`func`_ 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。
- `argsArray` ：可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数。如果该参数的值为 `null` 或  `undefined`，则表示不需要传入任何参数。

**模拟实现：**
```javascript
Function.prototype.apply = function (context, args = []) {
  context = context || window
  const fn = Symbol('fn')
  context[fn] = this
  const res = context[fn](...args)
  delete context[fn]
  return res
}
```
<a name="bZg5o"></a>
## bind
`bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。<br />**语法：**
```javascript
function.bind(thisArg[, arg1[, arg2[, ...]]])
```
**参数：**

- `thisArg` ：调用绑定函数时作为 `this` 参数传递给目标函数的值。 如果使用`new`运算符构造绑定函数，则忽略该值。当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object`。如果 `bind` 函数的参数列表为空，或者`thisArg`是`null`或`undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。
- `arg1, arg2, ...` ：当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

**返回值：**返回一个原函数的拷贝，并拥有指定的 **`this`** 值和初始参数。<br />**模拟实现：**<br />
```javascript
Function.prototype.bind = function(context) {
  if (typeof this !== "function") {
  	throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
	}
  var fn = this
  var args = Array.from(arguments).slice(1)
  return function fBound() {
  	var returnArgs = Array.from(arguments).slice(0)
    if (this instanceof fBound) {
      return new fn(...[...args, ...returnArgs])
    } else {
      fn.apply(context, [...args, ...returnArgs])
    }
  }
}
```


