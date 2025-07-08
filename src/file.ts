import type { Request, Response } from 'express'
import type { MiddlewareType } from './types'
import fs, { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import chalk from 'chalk'
import muter from 'multer'
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
  fieldName?: string
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
export function createUploadMiddleware(option: CreateUploadOption, ...handleMiddleWares: MiddlewareType[]): CreateUploadReturnType {
  const { type = 'single', fieldName = 'file', maxCount = 1 } = option
  // 判断目录是否存在，不存在创建目录
  if (!existsSync(UPLOAD_PATH)) {
    mkdirSync(UPLOAD_PATH, { recursive: true })
  }
  let middleware: CreateUploadReturnType = upload.single(fieldName)
  if (type === 'multiple') {
    middleware = upload.array(fieldName, maxCount)
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
export function readUploadFile(fileName: string): fs.ReadStream | undefined {
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
export function sendFileReadStream(res: Response, mimetype: string, fileName: string) {
  res.setHeader('Content-Type', mimetype)
  const fileReadStream = readUploadFile(fileName)
  if (fileReadStream) {
    fileReadStream.pipe(res)
  }
}
// 静态文件映射信息
const MAP_FILEINFOPATH = `${UPLOAD_PATH}/filemap.json`

export function getMapFile(): any[] {
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
export function saveMapFile(data: any[]): void {
  if (!existsSync(path.dirname(MAP_FILEINFOPATH))) {
    mkdirSync(path.dirname(MAP_FILEINFOPATH), { recursive: true })
  }
  const mapFData = getMapFile()
  mapFData.unshift(data)
  writeFileSync(MAP_FILEINFOPATH, JSON.stringify(mapFData, null, 2))
}

// 静态模式不做文件映射
export async function useFileData<T extends Record<string, any>>(req: Request, filedName: string = 'files'): Promise<[T, (data: T) => void]> {
  const context = useContext(req)
  if (context?.config?.server?.mode === 'static') {
    return useData<T>(req)
  }
  // 动态模式做文件映射
  const [data, setData] = await useData<Record<string, any>>(req)
  if (!data[filedName]) {
    data[filedName] = []
  }
  // 在动态模式对文件进行映射，服务重启找不到以前的文件
  const fileData = await getMapFile()
  const fileInfosData = Object.assign(fileData, data[filedName])
  data[filedName] = fileInfosData

  return [data as T, (data: T) => {
    if (data && typeof data === 'object') {
      const fileInfos = data[filedName]
      if (Array.isArray(fileInfos)) {
        console.log(fileInfos, 'fileinfos')
        saveMapFile(fileInfos)
      }
    }

    return setData(data)
  }]
}
