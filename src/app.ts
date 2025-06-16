import type { Express } from 'express'
import type { ProxyConfig } from './middleware/proxy'
import type { PluginType } from './plugin-deriver'
import type { IServer, ServerContext } from './plugins/server-plugin'
import chalk from 'chalk'
import cors from 'cors'
import express from 'express'
import createInterceptMiddleware, { type InterceptInfo } from './middleware/intercept'
import { useProxyMiddlewares } from './middleware/proxy'
import PluginDeriver from './plugin-deriver'
import clientPlugin from './plugins/client-plugin'
import serverPlugin from './plugins/server-plugin'

export interface AppConfig {
  port?: number
  proxy?: ProxyConfig
  plugins?: PluginType[]
  enableServer?: boolean
  server?: IServer

}

export interface Context {
  app: AServerApp
  config: AppConfig
  request?: express.Request
  response?: express.Response
  port: number
  interceptInfos?: InterceptInfo[]
  server?: ServerContext
}

export interface AServerApp extends Express {
  context?: Context
}

function createAppByExpress(): AServerApp {
  const app = express()
  return app
}

const interceptInfos: InterceptInfo[] = []

function installPlugins(context: Context, plugins: PluginType[]): void {
  const pluginDeriver = new PluginDeriver(context)
  plugins.forEach(plugin => pluginDeriver.install(plugin))
}

function reslovePlugins(config: AppConfig): AppConfig {
  const plugins = config.plugins || []
  const defaultPlugin = [
    clientPlugin(),
    serverPlugin()
  ]

  return {
    ...config,
    plugins: [
      ...defaultPlugin,
      ...plugins,
    ],
  }
}

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

  
  config = reslovePlugins(config)
  // 配置插件
  if (config.plugins && config.plugins.length) {
    installPlugins(context, config.plugins)
  }


  // todo: 开始静态地址，认别人能够访问
  app.listen(port, () => {
    const url = `http://localhost:${port}`
    console.log(`${chalk.gray('server:')}: ${chalk.green(url)}`)
  })

  return app
}
