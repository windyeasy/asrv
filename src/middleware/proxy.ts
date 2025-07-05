import type { Express } from 'express'
import type { ProxyTarget } from 'http-proxy'
import type { ProxyConfig } from '../types/index'
import { createProxyMiddleware } from 'http-proxy-middleware'

export function useProxyMiddlewares(app: Express, config: ProxyConfig): void {
  const keys = Object.keys(config)
  if (keys && keys.length > 0) {
    keys.forEach((key) => {
      const options = config[key]
      if (options) {
        app.use(key, createProxyMiddleware(options))
      }
    })
  }
}

/**
 * 获取代理配置的目标的主机
 * @param target - 代理配置的目标
 * @returns 代理配置的目标的主机
 */
function getHost(target: ProxyTarget): string | undefined {
  if (typeof target === 'string') {
    const value = new URL(target)
    if (value.host) {
      return value.host
    }
  }
  else if (target && target.host) {
    return target.host
  }
}
/**
 * 获取代理目标主机
 * @param config - 代理配置
 * @returns - 代理目标主机列表
 */
export function getProxyHosts(config: ProxyConfig): string[] {
  const keys = Object.keys(config)
  if (keys && keys.length > 0) {
    const hosts: string[] = []
    for (const key of keys) {
      const target = config[key]?.target
      if (target) {
        const host = getHost(target)
        host && hosts.push(host)
      }
    }
    return hosts
  }
  return []
}
