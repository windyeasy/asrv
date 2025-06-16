import type { NextFunction, Request, Response } from 'express'
import type { Context } from '@/app'
import type { PluginType } from '@/plugin-deriver'
import chalk from 'chalk'
import Service from './service/index'
import { apiRegister, changeRedirectApiPrefix } from './utils'

export type APIMiddlewareType = (request: Request, response: Response, next: NextFunction, context: Context) => void

type AnyO = Record<string, any>

export type ApiKeyType = string | AnyO | APIMiddlewareType

export interface ApiType {
  [key: string]: string | ApiType | APIMiddlewareType | any[]
}

export interface RedirectApiPrefix {
  from: string
  to: string
}

export interface IServer<T = AnyO> {
  db: T
  api: ApiType
  redirectApiPrefixes?: RedirectApiPrefix[]
}

export interface ServerContext<T = AnyO> {
  useData: () => [T, (value: T) => void]
}

export function jsonServer(context: Context): void {
  const app = context.app
  const { enableServer, server: serverConfig } = context.config
  
 
  if (!enableServer || !serverConfig)
    return

  // handle redirectApiPrefixes
  if (serverConfig.redirectApiPrefixes && serverConfig.redirectApiPrefixes.length){
    app.use((req, res, next) => {
      for (const redirect of serverConfig.redirectApiPrefixes!){
        if (req.url.startsWith(redirect.from)){
          req.url = changeRedirectApiPrefix(req.url, redirect)
        }
      }
      return next()
    })
  }
  
  const db = serverConfig.db
  if (!db) {
    console.warn(chalk.yellow('[json-server] db is not defined'))
    return
  }

  const service = new Service(db)

  // 添加server方法
  context.server = {
    useData() {
      const db = service.db
      function setDb(newDb: AnyO): void {
        if (db !== newDb) {
          service.db = db
        }
      }
      return [db, setDb]
    },
  }

  apiRegister(serverConfig.api, context)

  app.get('/:name', async (req, res, next) => {
    const { name } = req.params
    res.locals.data = service.find(name)
    await next()
  })

  app.get('/:name/:id', async (req, res, next) => {
    const { name, id } = req.params
    res.locals.data = service.findById(name, id)
    await next()
  })

  app.use((_, res) => {
    const data = res.locals.data
    if (data) {
      res.json(data)
    }
    else {
      res.status(404)
    }
  })
}

export default function serverPlugin(): PluginType {
  return {
    name: 'server-plugin',
    apply: jsonServer,
  }
}
