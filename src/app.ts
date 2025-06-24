import type { PluginType } from './plugin-deriver'
import type { AppConfig, Context, InterceptInfo } from './types'

import cors from 'cors'
import express from 'express'
import { createLoggerMiddleware } from './logger'
import createInterceptMiddleware from './middleware/intercept'
import { useProxyMiddlewares } from './middleware/proxy'
import PluginDeriver from './plugin-deriver'
import clientPlugin from './plugins/client-plugin'
import serverPlugin from './plugins/server-plugin'

function installPlugins(context: Context, plugins: PluginType[]): void {
  const pluginDeriver = new PluginDeriver(context)
  plugins.forEach(plugin => pluginDeriver.install(plugin))
}

function reslovePlugins(config: AppConfig): AppConfig {
  const plugins = config.plugins || []
  const defaultPlugin = [
    clientPlugin(),
    serverPlugin(),
  ]

  return {
    ...config,
    plugins: [
      ...defaultPlugin,
      ...plugins,
    ],
  }
}

function createAppByExpress() {
  const app = express()
  return app
}

const interceptInfos: InterceptInfo[] = []
export function createApp(config: AppConfig) {
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
    app.locals.context = context
    return next()
  })
  // 是否开启日志
  const loggerConfig = config.logger ??  { enable: false,  enableFile: false}

  if (loggerConfig.enable) {
    app.use(createLoggerMiddleware({
      enableLoggerFile: loggerConfig.enableFile
    }))
  }

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

  // add plugins
  if (config.plugins && config.plugins.length) {
    installPlugins(context, config.plugins)
  }

  return app
}
