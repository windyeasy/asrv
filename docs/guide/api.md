# API定义

可以通过配置项生成API，实现接口的模拟。输入`server.api`配置项。

## server.api

server.api使用用于生成API接口的配置项，通过这个配置项可以生成API接口。

### 定义路由

可以通过嵌套结构生成路由，或者通过`/`来分割路由，如果生成路由地址一致后面的路由会覆盖前面的路由。

嵌套生成路由

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      api: {
        user: {
          // 生成的路由：get /api/user/list， 默认请求是get
          'list': JSON.stringify({
            code: 0,
            message: '获取用户列表成功',
            data: [
              {
                id: 1,
                name: '张三',
                age: 18,
              },
              {
                id: 2,
                name: '李四',
                age: 19,
              },
            ],
          }),
          // 生成的路由：get /api/user/detail/:id
          'detail': JSON.stringify({
            code: 0,
            message: '获取用户详情成功',
            data: {
              id: 1,
              name: '张三',
              age: 18,
            },
          }),
          /**
           * 定义其它请求方式
           */
          // post /api/user/add
          'post add': JSON.stringify({
            code: 0,
            message: '添加用户成功',
          }),
        },
      },
    },
  },
})
```

使用`/`分割生成路由，也支持嵌套

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      // get /api/posts
      'api/posts': JSON.stringify([
        {
          id: 1,
          title: 'asrv',
          author: 'windyeasy',
        },
      ]),
      /**
       * 其它请求方式
       */
      'post /api/posts/add': '添加成功',
    },
  },
})
```

**注意**:

`api/posts`前面没有`/`在转化为路由的时候会加上`/`变成`/api/posts`。有`/`不添加比如：`/api/posts`转化的路由就是`/api/posts`

### 配置项属性说明

属性类型是字符串，有两种书写方式：

1. `api/posts`直接传入一个字符串默认`GET`请求
2. `get api/posts`传入字符串，通过一个空格进行分割，超过一个空格会提示警告并且不可用。空格前是请求方式，空格后是路由。使用错误请求方式提示警告并且不可用。
3. 请求方式，不区分大小写
```ts
type RequestMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
```

### 属性值

属性值类型：

```ts
export type ApiKeyType = string | APIMiddlewareType | APIMiddlewareType[] | AnyO
```

值为字符串：

当是JSON字符串，`response`会通过JSON的方式返回。可以通过JSON.stringify转换。

```ts
const config = {
  api: {
    '/api/test': '{"code": 0, "message": "success"}',
    '/api/test2': JSON.stringify({ code: 0, message: 'success' })
  }
}
```

不是JSON字符串，`response.send`发送数据。

```ts
const config = {
  api: {
    '/api/test': 'hello world'
  }
}
```

值为对象：

由于定义API可以通过对象嵌套的方式生成路由地址，所有值为对象的情况

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      // 嵌套演示
      api: {
        user: {
          'get list': '用户列表',
          'post add': '添加用户'
        },
      }
    },
  },
})
```

值为中间件函数：

是express中间件函数，与express的写法一致，[express](https://expressjs.com/en/guide/using-middleware.html#using-middleware)。

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      'api/user/:id': (req, res) => {
        const id = req.params.id
        res.json({
          code: 0,
          message: 'success',
          data: {
            id,
            name: '张三',
            age: 18
          }
        })
      }
    },
  },
})
```

值为中间件函数数组：

可以通过数组形式传入中间件函数。

相关hook

- [useMiddlewares](./hooks.md#usemiddlewares) - 通过函数多个参数形式传入中间件。

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    api: {
      // 嵌套演示
      api: {
        login: [
          function (req, res, next) {
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
          },
          function (_, res) {
            res.json({
              code: 0,
              message: '登录成功',
            })
          },
        ]
      }
    },
  },
})
```

使用演示：

1. 没有通过验证

```shell
$ http POST http://localhost:9000/api/login username=test password=123456

{
    "code": -101,
    "message": "用户名或密码错误"
}
```

2. 通过验证

```shell
$ http POST http://localhost:9000/api/login username=admin password=123456

{
    "code": 0,
    "message": "登录成功"
}
```

### 将API拆分为模块

有些情况下写了很多的接口，在一个文件里面写不利于维护，这时我们可以将API拆分为多个文件，每个文件对应一个模块。

详细使用：[配置项模块化](https://www.yuque.com/huangjian/doc/module)
