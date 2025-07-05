import { defineConfig, mock } from '../dist/index'

export default defineConfig({
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
