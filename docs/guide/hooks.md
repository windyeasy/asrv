# hooks

定义钩子函数，更方便使用。

## useData

可以使用JSONServer使用的数据源，能够让定义的接口更灵活。支持传入泛型提供更友好的提示。

```ts
import { defineConfig, useData } from 'asrv'

interface DBType {
  user: {
    id: number
    name: string
  }[]
}
export default defineConfig({
  port: 9000,
  server: {
    db: {
      user: [
        {
          id: 1,
          name: 'windyeasy',
        },
        {
          id: 2,
          name: 'xiaoming',
        },
      ],
    },
    api: {
      api: {
        'delete user/remove/:id': async function (req, res) {
          const { id } = req.params
          // 传入泛型，提供更好的类型提示
          const [data, setData] = await useData<DBType>(req)
          const index = data.user.findIndex(item => String(item.id) === String(id))
          data.user.splice(index, 1)
          await setData(data)
          res.json({
            code: 200,
            message: '删除成功',
          })
        },
      },
    },
  },
})
```

## useMiddlewares

类似`express`的use方法给函数传入多个参数的形式使用中间件。

```ts
import { defineConfig, useMiddlewares } from '../dist/index'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      // 嵌套演示
      api: {
        login: useMiddlewares((req, res, next) => {
          const body = req.body
          if (body.username === 'admin' && body.password === 'admin') {
            next()
          }
          else {
            // 提前提示错误
            res.json({
              code: -101,
              message: '用户名或密码错误',
            })
          }
        }, (_, res) => {
          res.json({
            code: 0,
            message: '登录成功',
          })
        },)
      }
    },
  },
})
```
