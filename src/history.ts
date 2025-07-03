import type { Context, MiddlewareType } from './types'
import { existsSync, mkdirSync, read, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { useContext } from './hooks'

export const historyBlackListDefault = [
  'asrv-history',
  'api-swagger-doc',
  'assets',
  'json-server-routes',
  'vite',
  'favicon.ico',
  '#',
]

// 获取历史数据
export function getHistoryFile(): Record<string, any>[] {
  const historyPath = path.join(process.cwd(), './asrv/data/history.json')
  if (!existsSync(historyPath)) {
    return []
  }
  const fileData = readFileSync(historyPath, 'utf-8')
  try {
    return JSON.parse(fileData)
  }
  catch (error) {
    console.warn('Parse history  error:', error)
  }
  return []
}

// 保存历史数据
export function saveHistoryFile(data: Record<string, any> | any[]): void {
  const historyPath = path.join(process.cwd(), './asrv/data/history.json')
  if (!existsSync(path.dirname(historyPath))) {
    mkdirSync(path.dirname(historyPath), { recursive: true })
  }
  const historyData = getHistoryFile()
  historyData.push(data)
  writeFileSync(historyPath, JSON.stringify(historyData, null, 2))
}

/**
 * 匹配历史记录黑名单
 * @param url - 请求url
 * @param blackList - 黑名单
 * @returns - 是否匹配
 */
function matchBlackList(url: string, blackList: string[]): boolean {
  if (url === '/') {
    return true
  }

  for (let i = 0; i < blackList.length; i++) {
    const item = blackList[i]
    if (url.includes(item)) {
      return true
    }
  }
  return false
}

// 创建历史记录中间件
export function createHistoryMiddleware(enable: boolean = true): MiddlewareType {
  return (request, res, next) => {
    // 处理黑名单
    const context = useContext(request)
    const historyBlackList = context!.config?.historyBlackList || []
    historyBlackList.push(...historyBlackListDefault)

    const { method, url, body, query, params } = request
    if (matchBlackList(url, historyBlackList) || !enable) {
      return next()
    }
    const timestamp = Date.now()
    const interceptRequestInfo = {
      url,
      method,
      headers: request.headers,
      body,
      query,
      params,
      timestamp,
    }
    saveHistoryFile(interceptRequestInfo)
    // todo: 使用别人能使用的地址
    // res.set({
    //   'X-Debug-Replay-Address': `http://127.0.0.1:8080/#//history-detail/${timestamp}`,
    // })
    return next()
  }
}

// 通过接口获取历史数据
export const getHistoryDataMiddleware: MiddlewareType = (_, res) => {
  const data = getHistoryFile()
  res.json(data)
}
// 查询历史记录
export const queryHistoryMiddleware: MiddlewareType = (request, res) => {
  const { timestamp } = request.params
  if (!timestamp) {
    res.json({
      code: -1,
      message: '参数错误',
    })
    return
  }
  const data = getHistoryFile()
  const historyData = data.find((item: any) => item.timestamp === Number(timestamp))
  res.json(historyData)
}

// 使用历史记录
export function useHistory(context: Context): void {
  const { config } = context
  context.app.use(createHistoryMiddleware(config.enableHistory))
  context.app.get('/asrv-history/:timestamp', queryHistoryMiddleware)
  context.app.get('/asrv-history', getHistoryDataMiddleware)
}
