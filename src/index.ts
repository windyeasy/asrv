import createApp from './app'

export * from './config'
export type { PluginType } from './plugin-deriver'

export * from './runner'

export {
  createApp,
}
const db = {
  user: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jim' },
  ],
  post: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 },
    { id: 3, title: 'Post 3', userId: 3 },
  ],
}

createApp({
  port: 9000,
  enableServer: true, // default true
  server: {
    db,
    redirectApiPrefixes: [{ from: '/api', to: '' }],
    api: {
      api: 'testString',
      api2: {
        user: {
          list: [],
          info: JSON.stringify({
            id: 30,
            name: 'xiaoming',
            age: 18,
          }),
          // 数据的读写
          list2(_, res, _2, context) {
            const { useData } = context!.server!
            const [data, setData] = useData()
            // todo: 修改数据与保存
            data.user[0] = {
              id: 20,
              name: 'xiaoming',
            }
            setData({ ...data })
            res.send('数据写入成功')
          },
        },
      },
    },
  },
})
