import type { Data } from '@windyeasy/json-server/lib'
import type { NextFunction, Request, Response } from 'express'
import type { Context } from '@/app'
import type { PluginType } from '@/plugin-deriver'
import chalk from 'chalk'
import { addJonServer } from './json-server'
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

export interface IServer {
  db: Data
  api: ApiType
  redirectApiPrefixes?: RedirectApiPrefix[]
}

export interface ServerContext {
  useData: () => [Data, (value: Data) => Promise<void>]
}

export function applayServer(context: Context): void {
  const app = context.app
  const { enableServer, server: serverConfig } = context.config

  if (!enableServer || !serverConfig)
    return
  // register api
  apiRegister(serverConfig.api, context)
  // handle redirectApiPrefixes
  if (serverConfig.redirectApiPrefixes && serverConfig.redirectApiPrefixes.length) {
    app.use((req, _, next) => {
      for (const redirect of serverConfig.redirectApiPrefixes!) {
        if (req.url.startsWith(redirect.from)) {
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

  // add json server
  addJonServer(context, db)
}

export default function serverPlugin(): PluginType {
  return {
    name: 'server-plugin',
    apply: applayServer,
  }
}
