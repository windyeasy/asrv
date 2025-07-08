import { createUploadMiddleware, defineConfig, mock, sendFileReadStream, useFileData } from '../dist/index'

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
    mode: 'dynamic',
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

    // 测试文件上传
    api: {
      'post /api/upload': createUploadMiddleware({
        type: 'single',
        fieldName: 'file',
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

          await setData(data)
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
      'get file/preview/:id': async function (req, res) {
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
    },
  },
})
