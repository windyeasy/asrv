import express from 'express'
import type { Express } from 'express'
import chalk from 'chalk'
import cors from 'cors'
import { useProxyMiddlewares } from './middleware/proxy'
import type { ProxyConfig } from './middleware/proxy'
import createInterceptMiddleware, { type InterceptInfo } from './middleware/intercept'

export interface Context {
  app: Express
  config: AppConfig
  request?: express.Request
  response?: express.Response
  port: number
  interceptInfos?: InterceptInfo[]
}

export type PluginType = (context: Context) => void

export interface AppConfig {
  port?: number
  proxy?: ProxyConfig
  plugins?: PluginType[]
}

export interface AServerApp extends Express {
  context?: Context
}

function createAppByExpress(): AServerApp {
  const app = express()
  return app
}

const interceptInfos: InterceptInfo[] = []
export default function createApp(config: AppConfig): AServerApp {
  const port = config.port || 9000

  const app = createAppByExpress()
  const context: Context = {
    app,
    config,
    port,
    interceptInfos,
  }
  app.use((req, res, next) => {
    context.request = req
    context.response = res
    return next()
  })
  // 处理请求拦截，请求拦截信息放入上下文
  app.use(createInterceptMiddleware((interceptInfo) => {
    interceptInfos.push(interceptInfo)
  }))
  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  // 配置代理
  if (config.proxy) {
    useProxyMiddlewares(app, config.proxy)
  }
  // 配置插件
  if (config.plugins && config.plugins.length) {
    config.plugins.forEach(m => m && m(context))
  }
  // 挂载context
  app.context = context
  app.listen(port, () => {
    const url = `http://localhost:${port}`
    console.log(`${chalk.gray('server:')}: ${chalk.green(url)}`)
  })

  return app
}
