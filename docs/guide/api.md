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
import { defineConfig } from '../dist/index'

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
1.

### 属性值

类型作用
