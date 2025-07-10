# 日志

日志功能默认是关闭的，需要打开。日志分为控制日志和文件日志，文件日志放在`/asrv/logs/`目录下面。

```ts
import { defineConfig } from 'asrv'

export default defineConfig({
  port: 9000,
  logger: {
    // 开启日志，默认并开启控制台日志
    enable: true,
    // 开启文件日志
    enableFile: true,
  },
})
```
