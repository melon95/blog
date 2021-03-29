module.exports = {
  title: 'Gitee Blog',
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
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Javascript', link: '/guide/' },
      { text: 'Node', 
        items: [
          { text: 'Test', link: '/node/test/' },
        ]  
      },
      {
        text: 'Vue',
        items: [
          { text: 'Chinese', link: '/language/chinese/' },
          { text: 'Japanese', link: '/language/japanese/' }
        ]
      }
    ]
  }
}