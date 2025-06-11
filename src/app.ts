import express from 'express'
import type { Express } from 'express'
import chalk from 'chalk'
import cors from 'cors'
import { useProxyMiddlewares } from './middleware/proxy'
import type { ProxyConfig } from './middleware/proxy'

export interface AppOptions {
  port?: number
  proxy?: ProxyConfig
  pungins?: any[]
}
export default function createApp(options: AppOptions): Express {
  const port = options.port || 9000

  const app = express()
  app.use(cors())
  if (options.proxy) {
    useProxyMiddlewares(app, options.proxy)
  }

  app.listen(port, () => {
    const url = `http://localhost:${port}`
    console.log(`${chalk.gray('server:')}: ${chalk.green(url)}`)
  })
  return app
}
