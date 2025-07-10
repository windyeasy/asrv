# 代理

使用[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)实现。经过`asrv`的请求都会被拦截，生成历史记录，用于需要重新请求的场景。

## 代理搭配历史记录使用

详细使用，请查看-[历史记录](./history.md)

## 代理配置

```ts
import { defineConfig } from './dist'

export default defineConfig({

  proxy: {
    '/api': {
      target: 'http://localhost:3000/api',
      changeOrigin: true,
    },
  },
})
```
