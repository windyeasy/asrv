import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'asrv',
  description: 'A server-side tool that assists front-end development',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '什么是ASRV?', link: '/guide/why' },
          { text: '快速开始', link: '/guide/index' },
          { text: '服务', link: '/guide/server' },
          { text: 'Mock', link: '/guide/mock' },
          { text: 'Swigger', link: '/guide/history' },
          { text: '代理', link: '/guide/proxy' },
          { text: '历史记录', link: '/guide/history' },
          { text: '日志', link: '/guide/logger' },
        ],
      },
      // todo: mock, json-server
      {
        text: '案例',
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/windyeasy/asrv' },
    ],
  },
})
