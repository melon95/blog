<a name="jF6Wd"></a>
# meta标签
`meta` 元素表示那些不能由其它HTML元相关元素 (`<base>`, `<link>`, `<script>`, `<style>` 或 `<title>`) 之一表示的任何元数据信息。<br />具有如下属性：<br />

- **charset**：设置文档的字符编码，默认是utf-8。
- **name：**定义文档级元数据的名称，与 `content` 属性包含的值相关联。可能的值有：
   - application-name：定义正运行在该网页上的网络应用名称
   - author：文档的作者名称，可以用自由的格式去定义
   - description：对页面内容的简短和精确的描述
   - keywords：包含与逗号分隔的页面内容相关的单词
   - referrer：控制所有从该文档发出的 HTTP 请求中HTTP `Referer` 首部的内容
   - viewport：它提供有关视口初始大小的提示，仅供移动设备使用
- **http-equiv：**定义了能改变服务器和用户引擎行为的编译
- **content：**包含`http-equiv` 或`name` 属性的值，具体取决于所使用的值。

注意事项：

- 如果设置了name，则是文档等级的元数据，应用到整个页面
- 如果设置了http-equiv，则是编译指示——信息通常用于服务器和页面之间的通信
- 如果设置了charset，则是一个字符申明——字符编码应用于页面
