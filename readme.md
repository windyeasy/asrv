# asrv

一个开发助手服务

## TODO

- [x] 实现代理功能
- [x] 实现插件系统
- [x] 拦截所有的请求
- [x] defineConfig
- [x] cli
- [ ] client-plugin
  - [ ] 描述
  - [ ] 展示所有接口
- [ ] server-plugin
  - [ ] 将代理接口重定向，jonserver: 无需在写接口
  - [ ] 增加参数包装，加入JSONServer后，增加失败状态码，返回错误信息如何设计
  - [ ] useJsonServer
  - [ ] useMock
  - [ ] ws处理

## client-plugin 设计

1. 服务端设计
  1. 是否分为两个服务
    1. 一个服务存在的问题
      1. josnserver 应该放在那个接口位置
      2. 其它接口如何不与jsonserver冲突
        1. josnserver作为子功能
      1. 前端静态路由使用`#`
    1. 两个服务存在的问题
  1. mockjs的设计
2. 客户端设计

### Server拦截器设计

开始拦截器：

```js
// 使用代理时需要有API前缀
const url = '/api/user/'
// 1. 重定向到/user通过拦截器
// 2. 通过一个配置重定向， 重定向：[{ from: '/api', to: ''}]
```

响应拦截器：

```js
function responseInterceptor(data) {
  return {
    code: 0,
    data,
    message: 'success'
  }
}
```

## License

[MIT](./LICENSE) License © [windyeasy](https://github.com/windyeasy)
