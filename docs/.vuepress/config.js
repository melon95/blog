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
      { text: 'HTML', link: '/html/' },
      { text: 'Javascript', link: '/javascript/数据类型检测与转换' },
      { text: 'Node', link: '/node/' },
      {
        text: 'Vue',
        items: [
          { text: 'Chinese', link: '/language/chinese/' },
          { text: 'Japanese', link: '/language/japanese/' }
        ]
      }
    ],
    sidebar: {
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
    }
  }
}