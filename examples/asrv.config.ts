import { defineConfig, mock } from '../dist/index'

export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:8096',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  // historyResHost: '192.168.1.7',
  server: {
    mode: 'dynamic',
    db: mock({
      'user|2-3': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
        },
      ],
    }),
  },
})
