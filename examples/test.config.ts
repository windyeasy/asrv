import { defineConfig, mock } from '../dist/index'

// text proxy
// asrv -c ./examples/test.config.ts
export default defineConfig({
  port: 8096,
  server: {
    mode: 'dynamic',
    db: mock({
      'posts|2-3': [
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
