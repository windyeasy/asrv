# 快速开始
## 在前端项目添加
### 安装

使用npm
```shell
npm install asrv -D
```

使用yarn
```shell
yarn add asrv -D
```

使用pnpm
```shell
pnpm add asrv -D
```
### 使用

创建一个`asrv.config.js`或者`asrv.config.ts`文件，导出了`defineConfig`提供了更好配置体验。

基础案例，快速生成通过[json-server](https://github.com/typicode/json-server)，快速生成符合REST API的接口。

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  server: {
    db: {
      user: [
        {
          id: 1,
          name: '张三'
        },
        {
          id: 2,
          name: '李四'
        }
      ]
    }
  },
})
```

在控制台使用CLI，默认会查询项目根目录的`asrv.config.js/asrv.config.ts/asrv.config.mjs`等文件。

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
生成了REST API接口
```shell
$ curl http://localhost:9000/user
[
  {
    "id": 1,
    "name": '张三'
  },
  {
    "id": 2,
    "name": '李四'
  }
]
```

json-server的更多用法: <https://github.com/typicode/json-server>

## 其它用法

- 搭配Mock使用

查看： [Mock](./mock.md)，这一节

- 通过配置项定义接口

查看： [服务](./server.md)，这一节
