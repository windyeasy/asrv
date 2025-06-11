import createApp from './app'

createApp({
  port: 9000,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
})
