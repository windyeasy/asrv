import { defineConfig,  } from './dist/index'

export default defineConfig({
  port: 9000,
  server: {
    // 重定义向为接口添加前缀, 重api过来的接口会将api前缀去掉
    redirectApiPrefixes: [
      {
        from: '/api',
        to: '',
      },
    ],
    api: {
      'test': 'hello world'
    }
  },
})
