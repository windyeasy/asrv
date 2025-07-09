import type { Request, Response } from 'express'
import type { MiddlewareType } from './types'
import fs, { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import muter from 'multer'
import { v4 as uuidv4 } from 'uuid'
import { useContext, useData } from './hooks'

// 文件上传

export {
  muter,
}

const UPLOAD_PATH = path.resolve(process.cwd(), 'asrv/uploads/')

const storage = muter.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOAD_PATH)
  },
  filename(_, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = muter({
  storage,
})

export interface CreateUploadOption {
  /**
   * 上传类型
   * @default single
   */
  type?: 'single' | 'multiple'
  /**
   * 上传字段名
   * @default 'file'
   */
  filedname?: string
  /**
   * 上传最大数量
   * @default 1
   */
  maxCount?: number
}

export type CreateUploadReturnType = MiddlewareType | MiddlewareType[]
/**
 * 创建上传文件中间件
 * @see {@link https://github.com/expressjs/multer#readme} 如何通过中间件处理文件上传
 * @param option
 * @param handleMiddleWares 可以添加其他中间件，用于处理文件上传
 * @returns 返回中间件函数或者中间件函数数组
 */
export function createUploadMiddleware(option: CreateUploadOption = {}, ...handleMiddleWares: MiddlewareType[]): CreateUploadReturnType {
  const { type = 'single', filedname = 'file', maxCount = 1 } = option
  // 判断目录是否存在，不存在创建目录
  if (!existsSync(UPLOAD_PATH)) {
    mkdirSync(UPLOAD_PATH, { recursive: true })
  }
  let middleware: CreateUploadReturnType = upload.single(filedname)
  if (type === 'multiple') {
    middleware = upload.array(filedname, maxCount)
  }
  if (handleMiddleWares && handleMiddleWares.length > 0) {
    middleware = [middleware, ...handleMiddleWares]
  }
  return middleware
}

/**
 * 获取上传文件的信息
 * @param fileName - 文件名
 * @returns
 */
 function readUploadFile(fileName: string): fs.ReadStream | undefined {
  try {
    const fileReadStream = fs.createReadStream(`${UPLOAD_PATH}/${fileName}`)
    return fileReadStream
  }
  catch (error) {
    console.log(chalk.yellow('[read uploadfile error:', error))
  }
}

/**
 * 发送文件流可以实现前端预览
 * @param res - 响应对象
 * @param mimetype  -
 * @param fileName - 文件名称
 */
export function sendFileReadStream(res: Response, mimetype: string, fileName: string, download: boolean = false) {
  const dispositionType = download ? 'attachment' : 'inline'
  const fileReadStream = readUploadFile(fileName)
  if (fileReadStream) {
    res.setHeader('Content-Type', mimetype)
    res.setHeader('Content-Disposition', `${dispositionType}; filename="${fileName}"`)
    fileReadStream.pipe(res).on('error', (err) => {
      console.error('Stream error:', err)
      res.status(500).send('Stream error')
    })
  }
}
// 静态文件映射信息
const MAP_FILEINFOPATH = `${UPLOAD_PATH}/filemap.json`

 function getMapFile(): any[] {
  if (!existsSync(MAP_FILEINFOPATH)) {
    return []
  }
  const fileData = readFileSync(MAP_FILEINFOPATH, 'utf-8')
  try {
    return JSON.parse(fileData)
  }
  catch (error) {
    console.warn('Parse history  error:', error)
  }
  return []
}


// 保存映射信息
 function saveMapFile(data: any[]): void {
  if (!existsSync(path.dirname(MAP_FILEINFOPATH))) {
    mkdirSync(path.dirname(MAP_FILEINFOPATH), { recursive: true })
  }

  const mapFData = getMapFile()
  // 过滤重复数据
  const saveData: any[] = []
  const cacheMapFileIds: (string|number)[] = mapFData.map(item => item.id)
  data.forEach(item => {
    if (!cacheMapFileIds.includes(item.id)){
      saveData.push(item)
    }
  })
  mapFData.unshift(...saveData)
  writeFileSync(MAP_FILEINFOPATH, JSON.stringify(mapFData, null, 2))
}

/**
 * 使用文件数据
 * @param req express.Request
 * @param fieldname 访问文件信息的字段名名称
 */
export async function useFileData<T extends Record<string, any>>(req: Request, fieldname: string = 'files'): Promise<[T, (data: T) => void]> {
  const context = useContext(req)
  // 静态模式不做文件映射
  if (context?.config?.server?.mode === 'static') {
    return useData<T>(req)
  }
  // 动态模式做文件映射
  const [data, setData] = await useData<Record<string, any>>(req)
  if (!data[fieldname]) {
    data[fieldname] = []
  }
  // 在动态模式对文件进行映射，服务重启找不到以前的文件
  const fileData = await getMapFile()
  data[fieldname] = fileData

  return [data as T, (data: T) => {
    if (data && typeof data === 'object') {
      const fileInfos = data[fieldname]
     
      if (Array.isArray(fileInfos)) {
        saveMapFile(fileInfos)
      }
    }

    return setData({...data})
  }]
}


export interface FileDataType {
  id: string | number
  mimetype: string
  filename: string
  size: number
  originalname: string
  createAt?: number
  updateAt?: number
}

export interface UseUploadOptions extends CreateUploadOption {
  /**
   * 在db保存的字段名称
   * @default 'files'
   */
  fieldname?: string
  /**
   * 通过文件信息返回访问信息
   * @param res 响应对象
   * @param fileInfos 处理后的文件信息
   * @returns 
   */ 
  handler: (res: Response, fileInfos: FileDataType[]) => void
}

/**
 * 直接使用的上传
 * @param options - 上传文件配置项
 * @param cb - 上传文件成功后的回调
 * @returns - 中间件
 */
export function useUpload(options: UseUploadOptions): MiddlewareType | MiddlewareType[] {
  const { fieldname = 'files', ...createOptions } = options
  const { type = 'single', filedname = 'file'} = createOptions
  return createUploadMiddleware({ type, filedname, ...createOptions }, async (req, res) => {
    const [data, setData] = await useFileData(req, fieldname)
    const fileData: FileDataType[] = []
 
    if (type === 'single') {
      if (req.file) {
        fileData.unshift({
          id: uuidv4(),
          mimetype: req.file.mimetype,
          filename: req.file.filename,
          size: req.file.size,
          originalname: req.file.originalname,
          createAt: Date.now(),
        })
      }
    }
    else if (req.files && type === 'multiple') {
      const files = req.files as Express.Multer.File[]
      fileData.unshift(...files.map(item => ({
        id: uuidv4(),
        name: item.originalname,
        mimetype: item.mimetype,
        filename: item.filename,
        size: item.size,
        originalname: item.originalname,
        createAt: Date.now(),
      })))

    }
    if (data[fieldname]){
      data[fieldname].unshift(...fileData)
    }else{
      data[fieldname] = fileData
    }
  
    await setData({...data})

    options.handler && options.handler(res, fileData)
  })
}

export interface UseAccessFileOptions {
  /**
   * 请求参数类型
   * @default 'params'
   */
  paramType?: 'params' | 'query' | 'body'
  /**
   * 请求参数字段名
   * @default 'id'
   */
  paramFieldname?: string
  /**
   * 在db保存的字段名称
   * @default 'files'
   */
  fieldname?: string
  /**
   * 是否下载文件
   * @default false
   */
  download?: boolean  
}

/**
 * 用于访问文件
 * @param options - 配置项
 * @returns 中间件
 */
export function useAccessFile(options: UseAccessFileOptions = {}): MiddlewareType { 
  const { paramType = 'params', paramFieldname = 'id', download = false, fieldname = 'files' } = options
  return async (req, res) => {
    let id = req[paramType][paramFieldname]
    if (id){
        const [data] = await useFileData<any>(req)
        if (data[fieldname] && data[fieldname].length > 0) {
          const fileInfo = data[fieldname].find((item: any) => String(item.id) === String(id))
          if (fileInfo) {
            sendFileReadStream(res, fileInfo.mimetype, fileInfo.filename, download)
          }
          else {
            res.status(404)
            res.send('file not found')
          }
        }
    }
  }
}
