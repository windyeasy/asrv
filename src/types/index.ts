import type { NextFunction, Request, Response } from 'express'
import type { Express } from 'express'
import type { Options } from 'http-proxy-middleware'
import type { PluginType } from '@/plugin-deriver'
import type { IServer, ServerContext } from '@/plugins/server-plugin/types'

export type MiddlewareType = (request: Request, response: Response, next: NextFunction) => any

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
  /**
   * 依赖的其他文件，当其他文化变化时，会重新启动服务，当配置api过多时可以分模块定义
   * @example ['./src/app.ts', './src/*.js']
   */
  $deps?: string[]
  port?: number
  /**
   * 代理配置 - 与vite 配置一致
   */
  proxy?: ProxyConfig
  /**
   * 插件
   */
  plugins?: PluginType[]
  /**
   * 是否开启服务端
   * @description - 当接口地址与代理接口相同时，会使用本地定义的，所以设置这个值，可以关闭定义的接口
   * @default true
   */
  enableServer?: boolean
  server?: IServer
  logger?: {
    /**
     * 是否开启日志记录，默认开启
     * @default false
     */
    enable?: boolean
    /**
     * 是否开启日志文件, 默认开启
     * @default false
     */
    enableFile?: boolean
  }
  /**
   * swagger依赖文件，自动解析注入不需要手动传入
   */
  swaggerDeps?: string[]
}

export interface Context {
  app: Express,
  config: AppConfig
  request?: Express.Request
  response?: Express.Response
  port: number
  interceptInfos?: InterceptInfo[]
  server?: ServerContext
}


export type AppConfigCbType = () => AppConfig
