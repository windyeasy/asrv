import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'asrv',
  description: 'A server-side tool that assists front-end development',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: 'MocK.js', link: 'http://mockjs.com/' },
      { text: 'json-server', link: 'https://github.com/typicode/json-server' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '为什么使用ASRV?', link: '/guide/why' },
          { text: '快速开始', link: '/guide/index' },
          { text: '服务', link: '/guide/server' },
          { text: 'API定义', link: '/guide/api' },
          { text: '配置项模块化', link: '/guide/module' },
          { text: '实现文件接口', link: '/guide/file' },
          { text: 'Hooks', link: '/guide/hooks' },
          { text: 'Mock', link: '/guide/mock' },
          { text: 'Swagger', link: '/guide/swagger' },
          { text: '代理', link: '/guide/proxy' },
          { text: '历史记录', link: '/guide/history' },
          { text: '日志', link: '/guide/logger' },
        ],
      },
      // todo: mock, json-server
      {
        text: '案例',
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/windyeasy/asrv' },
    ],
  },
})
