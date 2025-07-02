import type { RequestConfig } from '@/services/request/type'
import request from '@/services'

export interface AsrvHistory {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, any>
  body?: Record<string, any>
  query?: Record<string, string>
  params?: Record<string, string>
  timestamp: number
}

export function sendRequest(requestInfo: AsrvHistory) {
  const data = requestInfo.method === 'GET' ? requestInfo.query : requestInfo.body
  const requestConfig: RequestConfig = {
    url: requestInfo.url,
    headers: requestInfo.headers,
    method: requestInfo.method,
    data,
    params: requestInfo.params,
  }

  return request.request<any>(requestConfig)
}
