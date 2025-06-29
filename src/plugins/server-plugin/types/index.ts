import type { NextFunction, Request, Response } from 'express'
import type { AsrvService, Data } from '../service/index'

export type APIMiddlewareType = (request: Request, response: Response, next: NextFunction) => any

type AnyO = Record<string, any>

export type ApiKeyType = string | APIMiddlewareType | APIMiddlewareType[] | AnyO

export interface ApiType {
  [key: string]: string | ApiType | APIMiddlewareType | any[]
}

export interface RedirectApiPrefix {
  from: string
  to: string
}

export interface IServer {
  db?: Data
  api?: ApiType
  /**
   * 重定向api前缀
   * @description - json-server生成的API，没有前缀，所以可以通过这个功能添加前缀
   */
  redirectApiPrefixes?: RedirectApiPrefix[]
  /**
   * json-server响应拦截器
   */
  jsonServerResponseInterceptor?: APIMiddlewareType
  /**
   * JsonServer生成接口的运行模式
   * - `'static'`: 静态模式，传入静态json文件，使用json文件，没有传入会使用db对象生成一个`json`文件
   * - `'dynamic'`: 动态模式，不会生成文件，会直接使用db对象，和mock结合使用可以实现重启后数据不一致
   * @default 'dynamic'
   */
  mode?: 'static' | 'dynamic',
  dbFilePath?: string
}

export interface ServerContext {
  service?: AsrvService
}
