# 服务

在配置项里面有一个`server`的配置项，这一节我详细介绍这个配置项的使用。
## enableServer

类型：`Boolean`

默认为true，表示启动server配置项。

在使用代理时在后端的接口的功能还没有完成的情况下，我们可以使用server配置项来默认接口来实现功能。通过这个工具会优先使用server里面的服务，导致无法访问到后端的接口，可以通过这个配置项来关闭，达到能够正确访问的目的。

## 相关hooks

- [useData](./hooks.html#usedata) - 使用JSONServer使用的数据源，能够让定义的接口更灵活。

## server

用于生成接口模拟数据和定义接口的配置项。

### server.mode

配置项，用于设置模拟数据模式，可选值有`dynamic`和`static`。

- dynamic: 动态模式（默认值），每次重启服务都会使用db对象，搭配[mock](./mock.md)，可以实现动态数据每次重启服务生成数据不同

不使用mock，请看[快速开始](./index.md)，用法与快速开始一致。

使用mock，详细使用请看[mock](./mock.md)，可以实现每次重启服务生成的数据不同。

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

- static: 静态模式
  - 通过JSON文件生成静态数据
  - 或者通过第一次传入db对象生成JSON文件，下次重启服务时，会读取JSON文件生成静态数据。

使用传入的JSON文件。

```json
// asrv/data/data.json
{
  "users": [
    {
      "id": 1,
      "name": "张三"
    },
    {
      "id": 2,
      "name": "李四"
    }
  ]
}
```

```ts
// asrv.config.ts
import { defineConfig, mock } from 'asrv'

// 默认port为9000
export default defineConfig({
  server: {
    mode: 'static',
    dbFilePath: './asrv/data/data.json'
  },
})
```

没有`asrv/data/db.json`文件第一次会使用传入db配置生成JSON文件，可以搭配mock生成配置

```ts
// asrv.config.ts
import { defineConfig, mock } from 'asrv'

// 默认port为9000
export default defineConfig({
  server: {
    mode: 'static',
    db: {
      users: [
        {
          id: 1,
          name: 'admin',
        },
        {
          id: 2,
          name: 'user',
        }
      ]
    }
  },
})
```

### server.db

传入一个JS对象，这个对象会被用作数据来源的内容，还会被json-server处理用与快速生成符合REST API的接口。

通过前面的例子，db的一些用法，应该已经很清楚了。这里简单介绍生成接口的使用，更多详细用法请查看[json-server](https://github.com/typicode/json-server)。

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

请求演示

```shell
$ curl http://localhost:9000/user
[
    {
        "id": "f9DFfBAA-3DD2-2Be8-b56c-042BA8dee3c6",
        "name": "苏丽",
        "email": "k.exfjq@tgjkyc.pt",
        "address": "上海市 上海市 宝山区",
        "phone": "13843701398"
    },
    {
        "id": "bF26E41a-fB37-C5bf-5DF0-0D4D4517E2Cd",
        "name": "郭秀兰",
        "email": "z.pjxsii@wtclt.bo",
        "address": "新疆维吾尔自治区 喀什地区 岳普湖县",
        "phone": "17704550654"
    },
    {
        "id": "aFE2910b-a7A3-e922-dECC-Cc36A61C8371",
        "name": "田丽",
        "email": "y.kbhmqbjo@tefeo.cq",
        "address": "福建省 莆田市 秀屿区",
        "phone": "15024253532"
    },
    {
        "id": "fB0FF825-EbF0-Ac7E-29a6-EF09bd07cDF8",
        "name": "程敏",
        "email": "s.ufbj@uioauxctz.gl",
        "address": "浙江省 衢州市 开化县",
        "phone": "18251588452"
    },
    {
        "id": "47EffCD2-F7eA-D59d-5dA4-c3FbcAC7bB47",
        "name": "方娟",
        "email": "d.ggvajx@isd.si",
        "address": "内蒙古自治区 呼伦贝尔市 扎赉诺尔区",
        "phone": "18591238063"
    },
    {
        "id": "75f4",
        "name": "windyeasy",
        "email": "test@qq.com",
        "address": "testAddress",
        "phone": "123456789"
    }
]
```

一些其它请求使用httpie演示

POST
```bash
$ http POST http://localhost:9000/user name=windyeasy email=test@qq.com address=testAddress phone=123456789

{
    "address": "testAddress",
    "email": "test@qq.com",
    "id": "75f4",
    "name": "windyeasy",
    "phone": "123456789"
}
```

DELETE
```bash
$ http DELETE http://localhost:9000/user/f9DFfBAA-3DD2-2Be8-b56c-042BA8dee3c6
{
    "address": "上海市 上海市 宝山区",
    "email": "k.exfjq@tgjkyc.pt",
    "id": "f9DFfBAA-3DD2-2Be8-b56c-042BA8dee3c6",
    "name": "苏丽",
    "phone": "13843701398"
}
```

### server.redirectApiPrefixes

重定向API前缀，默认为空。设计这个配置项的原因是，json-server生成的接口是没有接口前缀的，这样我们可以为json-server生成的接口添加接口前缀， 比如`/api/user`。

```ts
// asrv.config.ts
import { defineConfig, mock } from 'asrv'

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

### server.jsonServerResponseInterceptor

对JsonServer的结果进行拦截，使接口返回为想要的格式。

这个配置项强调了jsonServerResponseInterceptor的使用，其它配置与server.redirectApiPrefixes配置一致

```ts
import { defineConfig, mock } from 'asrv'

export default defineConfig({
  port: 9000,
  // ...
  server: {
    // ...
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

请求演示：

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

{
    "code": 0,
    "message": "删除成功"
}
```

post请求操作

```shell
$ http POST http://localhost:9000/api/user name=windyeasy email=test@qq.com address=testAddress phone=123456789

{
    "code": 0,
    "message": "添加成功"
}
```

### server.api

server.api使用用于生成API接口的配置项，通过这个配置项可以生成API接口。

详见: [API定义](./api.md)
