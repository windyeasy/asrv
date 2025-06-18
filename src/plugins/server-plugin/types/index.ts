import type { Data } from '@windyeasy/json-server/lib'
import type { NextFunction, Request, Response } from 'express'

import type { Context } from '@/types'

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
