import type { RequestConfig } from '@/services/request/type'
import request from '@/services'

export interface AsrvHistory {
  id: string
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, any>
  body?: Record<string, any>
  query?: Record<string, string>
  params?: Record<string, string>
  timestamp: number
}

const FORBIDDEN_HEADERS = [
  'host',
  'connection',
  'content-length',
  'transfer-encoding',
  'keep-alive',
  'upgrade',
  'expect',
  'proxy-*',
  'sec-*',
]

/**
 * 过滤不允许的请求头
 * @param headers 请求头
 * @returns - 删除禁止的请求头
 */
export function sanitizeHeaders(headers: Record<string, string>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    const k = key.toLowerCase()
    if (FORBIDDEN_HEADERS.some(f => k === f || k.startsWith(f)))
      continue
    result[key] = value
  }
  return result
}

export function sendRequest(requestInfo: AsrvHistory) {
  const data = requestInfo.method === 'GET' ? requestInfo.query : requestInfo.body
  const headers = sanitizeHeaders(requestInfo.headers || {})
  const requestConfig: RequestConfig = {
    url: requestInfo.url,
    headers,
    method: requestInfo.method,
    data,
    params: requestInfo.params,
  }

  return request.request<any>(requestConfig)
}
