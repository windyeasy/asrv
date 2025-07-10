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

## 文档

[windyeasy.github.io/asrv](https://windyeasy.github.io/asrv)

## 安装
```shell
npm install asrv -D
```
## 使用

创建一个`asrv.config.js`或者`asrv.config.ts`文件，导出了`defineConfig`提供了更好配置体验。

下面的案例结合了mockjs和json-server的基础使用，更多mockjs的使用方法请查看[mockjs](http://mockjs.com/)，jonson-server用法请查看[json-server](https://github.com/typicode/json-server)

```ts
import { defineConfig, mock } from 'asrv'

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

```shell
# 生成了REST API接口
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

## TODO

- [ ] server-plugin
  - [ ]  ws处理
- [x] 数据持久化

- [ ] doc
- [ ] 贡献指南

## License

[MIT](./LICENSE) License © [windyeasy](https://github.com/windyeasy)
