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
      { text: 'Javascript', link: '/javascript/' },
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
    }
  }
}