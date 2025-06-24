import { defineConfig, mock, useData } from './dist/index'

export default defineConfig({
  port: 9000,
  enableLogger: false,
  server: {
    // mock数据, 自动生成接口
    db: mock({
      'user|10-20': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
        },
      ],
      'posts|10-20': [
        {
          id: '@guid',
          title: '@ctitle',
          content: '@cparagraph',
          author: '@cname',
          date: '@date',
        },
      ],
    }),

    api: {
      '/api/testdata': async function (request, res) {
        const [data, setData] = await useData(request)
        data.user[0] = { id: 20, name: 'xiaoming' }
        await setData({ ...data })
        res.send('数据写入成功')
      },
    },
  },

})
