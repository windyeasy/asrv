import { createUploadMiddleware, defineConfig, mock, sendFileReadStream, useFileData, useUpload, useAccessFile } from '../dist/index'

interface DbType {
  user: {
    id: string
    name: string
    email: string
  }[]
  file?: {
    id: string | number
    filename: string
    path?: string
    mimetype: string
  }[]
}
export default defineConfig({
  proxy: {
    '/api': {
      target: 'http://localhost:8096',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    },
  },
  // historyResHost: '192.168.1.7',
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
      // 测试文件上传的基础使用
      'post /api/upload': createUploadMiddleware({
        type: 'single',
        filedname: 'file',
      }, async (req, res) => {
        // 通过useData给db对象添加一个文件信息表，可以实现类似数据库的功能
        const [data, setData] = await useFileData<DbType>(req, 'file')
        if (req.file) {
          if (!data.file) {
            data.file = []
          }
          const fileInfo = {
            id: data.file.length + 1,
            name: req.file.originalname,
            mimetype: req.file.mimetype,
            filename: req.file.filename,
          }
          data.file.unshift(fileInfo)

          await setData({...data})
          res.json({
            code: 200,
            message: '上传成功',
            data: {
              id: fileInfo.id,
              path: `http://localhost:9000/file/preview/${fileInfo.id}`,
            },
          })
        }
      }),
      'get api/file/:id': async function (req, res) {
        const id = req.params.id
        const [data] = await useFileData<DbType>(req)
        if (data.file && data.file.length > 0) {
          const fileInfo = data.file.find(item => String(item.id) === String(id))
          if (fileInfo) {
            sendFileReadStream(res, fileInfo.mimetype, fileInfo.filename)
          }
          else {
            res.status(404)
            res.send('file not found')
          }
        }
      },

      // 测试提供的工具方法
      'post api/file2/upload': useUpload({
        handler(res, fileInfos) {
          const sendInfo = fileInfos.map(item => ({
            id: item.id,
            path: 'http://localhost:9000/api/file2/' +  item.id,
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
          } else {
            res.json({
              code: -1,
              message: '上传失败',
            })
          }
        }
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
