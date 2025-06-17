import createApp from './app'

export * from './config'
export type { PluginType } from './plugin-deriver'

export * from './runner'

export {
  createApp,
}
const db = {
  posts: [
    { id: '1', title: 'a title' },
    { id: '2', title: 'another title' },
  ],
  comments: [
    { id: '1', text: 'a comment about post 1', postId: '1' },
    { id: '2', text: 'another comment about post 1', postId: '1' },
  ],
  profile: {
    name: 'typicode',
  },
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
            const newData = data as typeof db
            // todo: 修改数据与保存
            newData.posts.push({ id: '3', title: 'another title 3' })
            setData({ ...data })
            res.send('数据写入成功')
          },
        },
      },
    },
  },
})
