# 配置项模块化

由于写很多配置项，会导致配置项越来杂，可读性差，可维护性差，所以建议将配置项模块化，将配置项拆分为多个模块。

为了能够在拆分模块时，有更友好的提示提供了`defineServerConfig`和`defineApiConfig`方法，可以在拆分默认时使用这两个方法定义配置项。

## $dep

用于配置依赖项，文件地址，支持通配符。

在对模块进行分离时当配置项发生改变应该重启服务，所以需要传入这个依赖项。

为什么不直接扫描所有文件改变重启服务，修改与`asrv`功能无关的代码时，也会导致服务重启，频繁重启体验不是很好。

```ts
// asrv.config.ts
import {defineConfig} from 'asrv'
import serverConfig from './asrv/server.ts'

export default defineConfig({
  $deps: ['./asrv/**/*.ts']
})
```

## defineServerConfig

用于拆分server的配置项。



新建一个`asrv/server.ts`文件配置server的配置项。

**注意：**由于拆分模块时，使用传入文件地址使用相对地址可能出错，使用相对地址时是相对于`asrv.config.ts`文件的地址。

```ts
import {defineServerConfig} from 'asrv'
import apiConfig from "./api/index.ts"

export default defineServerConfig({
  mode: 'static',
  db: {},
  // 
  dbFilePath: 'asrv/db.json',
  redirectApiPrefixes: [{from: '/api', to: ''}],
  jsonServerResponseInterceptor: (req, res) => {
    return res.json({})
  }
  // 可以对API在进行拆分
  api: apiConfig,
})
```

在`asrv.config.ts`中引入`asrv/server.ts`文件。

```ts
// asrv.config.ts
import {defineConfig} from 'asrv'
import serverConfig from './asrv/server.ts'

export default defineConfig({
  $deps: ['./asrv/**/*.ts'],
  server: serverConfig,
})
```

## defineApiConfig

`defineApiConfig`函数用于定义API配置，可以用来拆分`api`模块。

新建一个`asrv/api/`目录用于存放相关配置。

新建一个用户相关的模块`asrv/api/user.ts`

```ts
// asrv/api/user.ts
import { defineApiConfig } from "asrv";

export default defineApiConfig({
  user: {
    list: '用户列表',
    detail: '用户详情',
    'post add': '新增用户',
    'delete /:id': '删除用户'
  }
});

```

新建一个帖子相关的模块`asrv/api/post.ts`

```ts
// asrv/api/post.ts
import { defineApiConfig } from "asrv";

export default defineApiConfig({
  post: {
    list: 'post列表',
    detail: 'post详情',
    'post add': '新增post',
    'delete /:id': '删除post'
  }
});

```

在`asrv/api/index.ts`中导出所有接口

```ts
import { defineApiConfig } from "asrv";
import userApi from "./user";
import postApi from "./post";

export default defineApiConfig({
  // 加前缀
  api: {
    ...userApi,
    ...postApi
  }
})
```

在`asrv.config.ts`或`asrv.config.js`中使用

```ts
import apiConfig from "./asrv/api/index"
export default {
  $deps: ['./asrv/**/*.ts'],
  server: {
    api: apiConfig
  }
}
```
