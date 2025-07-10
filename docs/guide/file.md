# 实现文件接口

提供两个hook用于生成文件上传接口中间件，以及文件预览和下载。

- useUpload 文件上传
- useAccessFile 访问文件，实现文件预览以及下载

## 利用hook实现文件上传与预览

```ts
import {  defineConfig, mock, useAccessFile, useUpload } from 'asrv'

export default defineConfig({
  server: {
    // mode: 'static',
    db: mock({
      'user|2-3': [
        {
          id: '@guid',
          name: '@cname',
          email: '@email',
          address: '@county(true)',
          phone: '@phone',
        },
      ],
    }),
    api: {
      'post api/file2/upload': useUpload({
        handler(res, fileInfos) {
          const sendInfo = fileInfos.map(item => ({
            id: item.id,
            path: `http://localhost:9000/api/file2/${item.id}`, // 访问文件地址
          }))
          // 一条数据
          if (sendInfo.length === 1) {
            res.json({
              code: 0,
              message: '上传成功',
              data: sendInfo[0],
            })
          }
          // 多条数据
          else if (sendInfo.length > 1) {
            res.json({
              code: 0,
              message: '上传成功',
              data: sendInfo,
            })
          }
          else {
            res.json({
              code: -1,
              message: '上传失败',
            })
          }
        },
      }),
      // 文件预览
      'api/file2/:id': useAccessFile(),
      // 文件下载
      'api/file2/download/:id': useAccessFile({
        download: true,
      }),
    },
  },
})
```
