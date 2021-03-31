module.exports = {
  title: 'Melon95',
  description: 'Blog',
  host: '127.0.0.1',
  port: '8888',
  base: '/blog/',
  markdown: {
    anchor: { permalink: false },
    lineNumbers: true,
    // markdown-it-toc 的选项
    toc: { includeLevel: [2, 3] },
    // extendMarkdown: md => {
    //   // 使用更多的 markdown-it 插件!
    //   md.use(require('markdown-it-xxx'))
    // }
  },
  plugins: [
    ['@vuepress/nprogress'],
    [
      '@vuepress/active-header-links',
      {
        sidebarLinkSelector: '.sidebar-link',
        headerAnchorSelector: '.header-anchor'
      }
    ],
    ['@vuepress/back-to-top']
  ],
  themeConfig: {
    nextLinks: false,
    prevLinks: false,
    sidebarDepth: 2,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'HTML', link: '/html/DOCTYPE' },
      { text: 'Javascript', link: '/javascript/数据类型检测与转换' },
      { text: 'HTTP', link: '/http/HTTP' },
      { text: 'Node', link: '/node/' },
      {
        text: 'Vue系列',
        items: [
          { text: 'Vue', link: '/vue/计算属性和侦听属性' },
          { text: 'VueRouter', link: '/vuerouter/VueRouter类' },
          { text: 'VueX', link: '/vuex/VueX' }
        ]
      },
      { text: '算法', link: '/algorithm/排序算法' },
    ],
    sidebar: {
      '/html/': [
        {
          title: 'DOCTYPE',
          path: '/html/DOCTYPE',
        },
        {
          title: 'meta标签',
          path: '/html/meta标签',
        },
        {
          title: 'script标签的async和defer',
          path: '/html/script标签的async和defer',
        },
        {
          title: 'DOM的解析和渲染',
          path: '/html/DOM的解析和渲染',
        },
        {
          title: 'src和href的区别',
          path: '/html/src和href的区别',
        },
      ],
      '/node/': [
        {
          title: '介绍',
          path: '/node/',
        },
        {
          title: 'test1',
          path: '/node/test1',  
        },
        {
          title: 'test',
          children: [
            ['test2.md', 'test2'],
            ['test3.md', 'test3'],
          ]
        },
      ],
      '/javascript/': [
        {
          title: '数据类型检测与转换',
          path: '/javascript/数据类型检测与转换',
        },
        {
          title: 'JavaScript事件',
          path: '/javascript/JavaScript事件', 
        },
        {
          title: '模拟原生方法',
          path: '/javascript/模拟原生方法',
        },
        {
          title: '深拷贝和浅拷贝',
          path: '/javascript/深拷贝和浅拷贝', 
        },
        {
          title: '防抖和节流',
          path: '/javascript/防抖和节流', 
        },
        {
          title: '原型链和实现继承的方式',
          path: '/javascript/原型链和实现继承的方式', 
        },
        {
          title: '作用域和闭包',
          path: '/javascript/作用域和闭包', 
        },
        {
          title: 'this',
          path: '/javascript/this', 
        },
        {
          title: '词法作用域&&this&&prototype',
          path: '/javascript/词法作用域&&this&&prototype'
        },
        {
          title: 'JavaScript事件循环',
          path: '/javascript/JavaScript事件循环',
        },
        {
          title: 'JavaScript运行机制',
          path: '/javascript/JavaScript运行机制',
        },
        {
          title: 'Promise介绍和实现',
          path: '/javascript/Promise介绍和实现',
        },
        {
          title: '模块',
          path: '/javascript/模块',
        },
        {
          title: 'Class',
          path: '/javascript/Class',
        },
        {
          title: '跨域解决方案',
          path: '/javascript/跨域解决方案',
        },
      ],
      '/http/': [
        {
          title: 'HTTP',
          path: '/http/HTTP',
        },
        {
          title: 'HTTP结构',
          path: '/http/HTTP结构',
        },
        {
          title: 'HTTP状态码',
          path: '/http/HTTP状态码',
        },
        {
          title: 'HTTP缓存',
          path: '/http/HTTP缓存',
        },
        {
          title: 'TCP三次握手与四次挥手',
          path: '/http/TCP三次握手与四次挥手',
        },
      ],
      '/vue/': [
        {
          title: '计算属性和侦听属性',
          path: '/vue/计算属性和侦听属性',
        },
        {
          title: '响应式原理',
          path: '/vue/响应式原理',
        },
        {
          title: 'nextTick',
          path: '/vue/nextTick',
        },
        {
          title: 'keep-alive',
          path: '/vue/keep-alive',
        },
        {
          title: 'patch',
          path: '/vue/patch',
        },
      ],
      '/vuerouter/': [
        {
          title: 'VueRouter类',
          path: '/vuerouter/VueRouter类',
        },
        {
          title: 'VueRouter注册',
          path: '/vuerouter/VueRouter注册',
        },
        {
          title: 'VueRouter跳转',
          path: '/vuerouter/VueRouter跳转',
        },
        {
          title: '组件更新',
          path: '/vuerouter/组件更新',
        },
      ],
      '/vuex/': [
        {
          title: 'VueX',
          path: '/vuex/VueX',
        },
      ],
      '/algorithm/': [
        {
          title: '排序算法',
          path: '/algorithm/排序算法',
        },
        {
          title: 'BFS(广度优先搜索)',
          path: '/algorithm/BFS',
        },
        {
          title: 'DFS(深度优先搜索)',
          path: '/algorithm/DFS',
        },
        {
          title: '双指针法',
          path: '/algorithm/双指针法',
        },
        {
          title: '动态规划',
          path: '/algorithm/动态规划',
        },
        {
          title: '贪心算法',
          path: '/algorithm/贪心算法',
        },
      ],
    }
  }
}