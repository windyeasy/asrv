import type { NextFunction, Request, Response } from 'express'
import type { Express } from 'express'
import type { Options } from 'http-proxy-middleware'
import type { PluginType } from '@/plugin-deriver'
import type { IServer, ServerContext } from '@/plugins/server-plugin/types'

export type MiddlewareType = (request: Request, response: Response, next: NextFunction) => void

/**
 * 代理配置
 * @example
 */
export interface ProxyConfig {
  [path: string]: Options | undefined
}

/**
 * 请求拦截信息，用于后面获取请求信息实现replay
 */
export interface interceptRequestInfo {
  url: string
  method: string
  headers: Record<string, any>
  body?: any
  query?: any
  params?: any
  timestamp: number
}

export interface InterceptInfo {
  interceptRequestInfo?: interceptRequestInfo
}

export type InterceptCbType = (interceptInfo: InterceptInfo) => void

// app
export interface AppConfig {
  $deps: string[]
  port?: number
  proxy?: ProxyConfig
  plugins?: PluginType[]
  enableServer?: boolean
  server?: IServer
}

export interface Context {
  app: AServerApp
  config: AppConfig
  request?: Express.Request
  response?: Express.Response
  port: number
  interceptInfos?: InterceptInfo[]
  server?: ServerContext
}

export interface AServerApp extends Express {
  context?: Context
}

export type AppConfigCbType = () => AppConfig
