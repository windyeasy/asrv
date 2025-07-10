import type { Express } from 'express'
import type { PluginType } from './plugin-deriver'
import type { AppConfig, Context } from './types'
import cors from 'cors'
import express from 'express'
import { useHistory } from './history'
import { createLoggerMiddleware } from './logger'

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


export function createApp(config: AppConfig): Express {
  const port = config.port || 9000
  const app = express()

  const context: Context = {
    app,
    config,
    port,
    
  }
  app.use((req, res, next) => {
    context.request = req
    context.response = res

    // 静止修改app.locals的context
    Object.defineProperty(app.locals, 'context', {
      value: context, // 原始对象，不冻结
      writable: false, // ✅ 不能重新赋值
      configurable: false, // ✅ 不能重新定义
      enumerable: true,
    })
    return next()
  })

  // 是否开启日志
  const loggerConfig = config.logger ?? { enable: false, enableFile: false }

  if (loggerConfig.enable) {
    app.use(createLoggerMiddleware({
      enableLoggerFile: loggerConfig.enableFile,
      level: loggerConfig.level,
    }))
  }


  app.use(cors())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  // 使用历史记录
  useHistory(context)


  config = reslovePlugins(config)


  // add plugins
  if (config.plugins && config.plugins.length) {
    installPlugins(context, config.plugins)
  }

    // 配置代理
  if (config.proxy) {
    useProxyMiddlewares(app, config.proxy)
  }

  return app
}
