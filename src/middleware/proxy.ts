import { createProxyMiddleware } from 'http-proxy-middleware'
import { type Options } from 'http-proxy-middleware'

import { type Express } from 'express'

export interface ProxyConfig {
  [path: string]: Options | undefined
}

export function useProxyMiddlewares(app: Express, config: ProxyConfig) {
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
