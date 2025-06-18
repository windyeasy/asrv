import type { Express } from 'express'
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
