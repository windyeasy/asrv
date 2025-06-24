# asrv

一个开发助手服务

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
- [ ] docker

## License

[MIT](./LICENSE) License © [windyeasy](https://github.com/windyeasy)
