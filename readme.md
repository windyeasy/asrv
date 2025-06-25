# asrv

[![Node.js CI](https://github.com/typicode/json-server/actions/workflows/node.js.yml/badge.svg)](https://github.com/typicode/json-server/actions/workflows/node.js.yml)

一个开发助手服务，结合了[Mockjs](http://mockjs.com/)和[json-server](https://github.com/typicode/json-server)快速生成符合REST API规范接口。

快速定义接口能够获取数据，对数据进行操作。

## 特性

- 添加了mock功能，使用mockjs生成数据
- 添加了json-server功能，使用json-server生成`REST API`规范接口
- 可以对json-server输出的结果进行拦截，从而达到接口返回的结果与日常使用数据一致
- 添加了代理功能，而且代理配置与vite代理配置一致
- 集成了swagger，可以通过swagger注释生成接口文档
- 添加日志功能

## 安装
```shell
npm install asrv
```
## 使用

创建一个`asrv.config.js`或者`asrv.config.ts`文件，导出了`defineConfig`提供了更好配置体验。

下面的案例结合了mockjs和json-server的基础使用，更多mockjs的使用方法请查看[mockjs](http://mockjs.com/)，jonson-server用法请查看[json-server](https://github.com/typicode/json-server)

```ts
import { defineConfig, mock } from 'asrv'

export default defineConfig({
  port: 9000,
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
    })
  },
})
```

在控制台使用CLI，默认会查询项目跟目录的`asrv.config.js/asrv.config.ts/asrv.config.mjs`等文件。

```bash
npx asrv
```

指定配置文件
```bash
npx asrv -c ./config.js
```

在`package.json`中添加脚本

```json
{
  "scripts": {
    "server": "asrv" // or "asrv -c ./config.js"
  }
}
```

### 使用搭配mock基础使用
```ts
// asrv.config.ts
import { defineConfig, mock } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    // mock数据, 自动生成接口
    db: mock({
      'user|3-5': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
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

```shell
$ curl http://localhost:9000/user
[
    {
        "id": "BD9d311f-da1d-dF4D-45fb-3bF94EfB9EF2",
        "name": "蔡平",
        "email": "e.myncqsrhr@hhltw.nr",
        "address": "广西壮族自治区 百色市 那坡县",
        "phone": "18728635647"
    },
    {
        "id": "7bA7CC76-C6A7-1f4c-FD8B-aCE299A0E2fb",
        "name": "张娟",
        "email": "f.dwjajthg@jogpmks.bw",
        "address": "湖北省 随州市 广水市",
        "phone": "18476018723"
    },
    {
        "id": "f30FEd58-bbbf-5bCC-33BE-94066C93F4B6",
        "name": "田艳",
        "email": "t.nvwucdonj@jdaqxl.ml",
        "address": "四川省 凉山彝族自治州 会理县",
        "phone": "18010322709"
    },
]
```

#### 使用重定向为json-server的接口加前缀`api`

```ts
// asrv.config.ts
import { defineConfig, mock } from './dist/index'

export default defineConfig({
  port: 9000,
  server: {
    // 重定义向为接口添加前缀, 重api过来的接口会将api前缀去掉
    redirectApiPrefixes: [
      {
        from: '/api',
        to: '',
      },
    ],
    // mock数据, 自动生成接口
    db: mock({
      'user|3-5': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
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
    }),
  },
})
```

```shell
$ curl http://localhost:9000/api/user
[
  {
  "id": "DD1B9B5d-c65f-BBDE-661E-e91b4EA7D85E",
  "name": "高秀英",
  "email": "t.bgctw@uqjfusmul.ht",
  "address": "黑龙江省 佳木斯市 富锦市",
  "phone": "17331264518"
  },
  {
  "id": "ECADE614-0bFE-a9b6-df3a-6c4934EC414d",
  "name": "易霞",
  "email": "k.xsxnx@gucgteyncj.ma",
  "address": "浙江省 杭州市 下城区",
  "phone": "13812227134"
  },
  {
  "id": "E98bc4cd-b17D-c3E7-9725-bBF3Aa3c9B2a",
  "name": "赵平",
  "email": "r.jwok@olbq.mn",
  "address": "甘肃省 定西市 渭源县",
  "phone": "18577041233"
  }
]
```

#### 对JsonServer的结果进行拦截，使接口返回为常用形式

非必要部分被省略， 接口mock和重定向，与上面一致

```ts
import { defineConfig, mock } from './dist/index'

export default defineConfig({
  port: 9000,
  server: {
    jsonServerResponseInterceptor(req, res) {
      const { data } = res.locals

      if (data === undefined) {
        res.json({
          code: -404,
          message: '数据不存在',
        })
      }
      else {
        if (req.method === 'POST') {
          res.json({
            code: 0,
            message: '添加成功',
          })
        }
        else if (req.method === 'DELETE') {
          res.json({
            code: 0,
            message: '删除成功',
          })
          // ... 其它自行判断
        }
        else {
          res.json({
            code: 0,
            message: '查询成功',
            data,
          })
        }
      }
    },
  },
})
```
```shell
$ curl http://localhost:9000/api/user

{
"code": 0,
"message": "查询成功",
"data": [
    {
      "id": "2F28d39d-2EEd-4a21-b8e8-26a2FAdF51e7",
      "name": "曾军",
      "email": "c.fmxertfaj@cqgb.gw",
      "address": "湖北省 黄石市 铁山区",
      "phone": "14543167560"
    },
    {
      "id": "7dCC714E-ceC0-d815-c48C-9cb3659dd5BF",
      "name": "蒋勇",
      "email": "k.jdoscp@wwelnt.ge",
      "address": "河南省 许昌市 鄢陵县",
      "phone": "13730245562"
    },
    {
      "id": "F27ABdcB-1Ab6-c37f-d7f1-DcB4d1Bf3C15",
      "name": "董平",
      "email": "g.xppyg@opdk.is",
      "address": "浙江省 台州市 三门县",
      "phone": "17497495282"
    }
  ]
}
```

delete请求操作，返回拦截后的数据

```shell
$ http DELETE http://localhost:9000/api/user/F27ABdcB-1Ab6-c37f-d7f1-DcB4d1Bf3C15
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 35
Content-Type: application/json; charset=utf-8
Date: Wed, 25 Jun 2025 11:53:45 GMT
ETag: W/"23-dtOKsPC9fU6cUvZdm5ZzPrg6ycE"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "code": 0,
    "message": "删除成功"
}
```

post请求操作

```shell
$ http POST http://localhost:9000/api/user name=windyeasy email=test@qq.com address=testAddress phone=123456789
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 35
Content-Type: application/json; charset=utf-8
Date: Wed, 25 Jun 2025 12:00:15 GMT
ETag: W/"23-EElcT2sjIuMSY8rZcDGQpKq+b10"
Keep-Alive: timeout=5
X-Powered-By: Express

{
    "code": 0,
    "message": "添加成功"
}
```


## README-TODO

1. JSONServer
   1. 接口的基础MOCK
   2. MOCK文档
   3. 如何访问接口
   4. JSONServer文档
   5. 重定向使用
   6. JSONServer拦截器的使用
2. API定义
   1. 基础定义
      1. 字符串
         1. 默认
         2. JSON.stringify
      2. 函数
         1. 默认
         2. 使用jsonServerData
      3. 中间件数组
   2. 分模块定义
      1. `$deps`的使用
      2. defineServerConfig
      3. defineApiConfig
   3. swagger的使用
      1. 使用swagger案例
3. 日志使用
4. 代理工能使用

## TODO

- [x] 实现代理功能
- [x] 实现插件系统
- [x] 拦截所有的请求
- [x] defineConfig
- [x] cli
- [x] 监听文件变化重启服务
- [ ] client-plugin
  - [x] 描述
  - [ ] 展示所有接口
  - [x] 使用vue开发页面
- [x] 允许局域网访问
- [ ] server-plugin
  - [x] 将代理接口重定向，jonserver: 无需在写接口
  - [x] json-server
  - [x] json-server拦截器-由拦截器进行返回
  - [x] 为API添加swagger
  - [ ] 为json-server添加swagger生成描述文件
  - [ ] ws处理

- [x] 日志功能
- [x] 添加MOCK函数
- [x] proxy提示
- [x] defineServer
- [x] defineApi
- [ ] 接口定义处理
  - [x] useData不放在中间件中
  - [x] 定义接口时可以传入多个中间件
  - [x] 日志功能从新定义
    - [x] 默认值false
    - [x] level 默认info
- [x]修改配置文件过程中出错导致进程死亡，待修复
- [ ] 数据持久化
- [ ] history-plugin
  - [ ] 对所有请求的数据进行缓存，可以在页面上显示，支持重新请求
  - [ ] 先不考虑文件上传接口
- [ ] readme
- [ ] doc

- [ ]  文档流
  - [ ] 上传文件，有一个配置缓存位置
  - [ ] 使用默认文件，通过接口返回文件，模拟文件下载
- [ ] 加载静态资源

## License

[MIT](./LICENSE) License © [windyeasy](https://github.com/windyeasy)
