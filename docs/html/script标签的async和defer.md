<a name="3ejg0"></a>
# script标签的async和defer
<a name="l6eVR"></a>
## aysnc

- 指示浏览器是否在允许的情况下异步执行该脚本。该属性对于内联脚本无作用 (即没有**src**属性的脚本）。
<a name="HkpBj"></a>
## defer

- 这个布尔属性被设定用来通知浏览器该脚本将在文档完成解析后，触发 `DOMContentLoaded` 事件前执行。
- 如果缺少 `src` 属性（即内嵌脚本），该属性不应被使用，因为这种情况下它不起作用。
- 对动态嵌入的脚本使用 `async=false` 来达到类似的效果。
