import createApp from './app'
import jsonServerPlugin from './plugins/json-server'
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
  plugins: [jsonServerPlugin],
})
