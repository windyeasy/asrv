import type { MiddlewareType } from '@/types'

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

/**
 * 是不是并不需要区分代理和普通请求， 当在web端请求数据时，同样访问的是同一的接口
 * @param callback - 回调函数，用于回传处理后的数据
 * @returns 中间件函数
 */
export default function createInterceptMiddleware(callback: InterceptCbType): MiddlewareType {
  return async function (req, _, next) {
    // 对所有请求进行拦截， 然后区分是否请求的是代理
    // todo: 使用一个页面测试，通过这些信息，进行请求是否有问题， 1. 本来接口 2. 代理接口
    // todo: ws处理，后面完善
    const interceptInfo: InterceptInfo = {
      interceptRequestInfo: {
        url: req.originalUrl,
        method: req.method,
        headers: req.headers,
        body: req.body,
        query: req.query,
        params: req.params,
        timestamp: Date.now(),
      },
    }
    callback(interceptInfo)
    return next()
  }
}
