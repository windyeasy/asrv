import type { NextFunction, Request, Response } from 'express'
import type { AsrvService, Data } from '../service/index'

export type APIMiddlewareType = (request: Request, response: Response, next: NextFunction) => any

type AnyO = Record<string, any>

export type ApiKeyType = string   | APIMiddlewareType | APIMiddlewareType[] | AnyO

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
}

export interface ServerContext {
  service?: AsrvService
}
