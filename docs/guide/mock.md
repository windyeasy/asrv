# Mock.js

可以搭配mockjs生成随机数据，默认已经集成和导出。Mock.js使用方法参考[mockjs](http://mockjs.com/)。

## 导出

```ts
import Mock from 'mockjs'
export {
  Mock
}
export const mock = Mock.mock
```

## 基础使用
### 生成server.db配置项数据

生成随机的数据，放在`server.db`配置项中，可以快速的得到复合REST API接口。接口是由JSONServer生成的，的详细使用方式参考[json-server](https://github.com/typicode/json-server)

```ts
// asrv.config.ts
import { defineConfig, mock } from 'asrv'

export default defineConfig({
  server: {
    mode: 'dynamic', // 可以不配置，默认值：dynamic
    // mock数据, 自动生成接口
    db: mock({
      'user|3-5': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
          avatar: '@image',
        },
      ],
      'posts|3-5': [
        {
          id: '@guid',
          title: '@ctitle',
          content: '@cparagraph',
          author: '@cname',
          date: '@date',
        },
      ],
    })
  },
})
```

### 搭配接口使用

- 直接使用

```ts
import { defineConfig, mock } from 'asrv'

export default defineConfig({
  server: {
    api: {
      'api/user/detail': JSON.string(mock({
        id: '@guid',
        name: '@cname',
        age: '@integer(18, 30)',
      })),
      // 通过中间件使用
      'api/post/detail': (req, res) => {
        res.json(mock({
          id: '@guid',
          title: '@ctitle',
          content: '@cparagraph',
        }))
      }
    }
  }
})
```

- 提供一个model

```ts
import { defineConfig, mock } from 'asrv'

function successModel(data: Record<string, any> | any[], type: 'string' | 'object' = 'string') {
  const newData = typeof data === 'object' ? data : { data }

  const model = {
    code: 0,
    message: 'success',
    ...newData,
  }
  if (type === 'string') {
    return JSON.stringify(model)
  }
  return model
}

export default defineConfig({
  server: {
    api: {
      'api/user/list': successModel(mock({
        'data|10-50': [
          {
            id: '@uuid',
            name: '@cname',
          }
        ]
      })),

      // 通过中间件使用
      'api/post/list': (req, res) => {
        const postModel = successModel(mock({
          'data|10-50': [
            {
              id: '@uuid',
              content: '@cparagraph',
            }
          ]
        }), 'object')

        res.json(postModel)
      }
    }
  }
})
```
