# asrv

一个开发助手服务

## TODO

- [x] 实现代理功能
- [x] 实现插件系统
- [x] 拦截所有的请求
- [x] defineConfig
- [x] cli
- [ ] client-plugin
- [ ] mock-server-plugin

## client-plugin 设计

1. 服务端设计
  1. 是否分为两个服务
    1. 一个服务存在的问题
      1. josnserver 应该放在那个接口位置
      2. 其它接口如何不与jsonserver冲突
        1. josnserver作为子功能
```js
const data = {
  user: {

  }
}

const config = {
  enableServer: true, // default true
  server: {
    'db': data,
    
    'api': {

      'get user/list': function (req, res, next, context) {
        // todo: 这里如何得到data， req中得到data
        const { useData } = context.server
        const [data, setData] = useData()
        // todo: 修改数据与保存
        data.user[0] = {
          id: 20,
          name: 'xiaoming'
        }
        setData({ ...data })
        // todo: 与代理如何放行, mock
      },
      // todo: 可能实现，可能不实现, 考虑: useJsonServer方法，
      'user/list2': useJSONServer(data),

    },

    '/app-api': {

    }
  }

}
```

test:

```js
  const api =  {
      'api': 'testString',
      api2: {
        user: {
          'list': [],
          'info': JSON.stringify({
            id: 30,
            name: 'xiaoming',
            age: 18
          }),
          // 数据的读写
          'list2': function (req, res, next, context) {
            const { useData } = context.server
            const [data, setData] = useData()
            // todo: 修改数据与保存
            data.user[0] = {
              id: 20,
              name: 'xiaoming'
            }
            setData({ ...data })
            res.send("数据写入成功")
          }
        }
      }
    }
```
      3. 前端静态路由使用`#`
    2. 两个服务存在的问题
  2. mockjs的设计
    1.
2. 客户端设计

## License

[MIT](./LICENSE) License © [windyeasy](https://github.com/windyeasy)
