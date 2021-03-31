<a name="e44da6e1"></a>
# src和href的区别
<a name="ULH7e"></a>
## href

- href是HypertextReference的缩写，包含了指向其他文本的链接，用来建立当前元素和文档之间的链接，是超文本（**引用**）。
- 常用的有：link、a。
- 浏览器不会等待该资源加载完毕
<a name="B2n7r"></a>
## src

- src是source的缩写**，**指向的内容会嵌入到文档中当前标签所在的位置（**引入**）。
- 常用的有：img、script、iframe。
- 当浏览器解析到该元素时，会暂停浏览器的渲染，直到该资源加载完毕。
