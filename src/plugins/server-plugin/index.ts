import type { PluginType } from '@/plugin-deriver'
import type { Context } from '@/types'

import { useJsonServer } from './json-server'
import { useSwagger } from './swagger'
import { apiRegister, changeRedirectApiPrefix } from './utils'

export function applayServer(context: Context): void {
  const app = context.app
  const { enableServer = true, server: serverConfig } = context.config

  if (!enableServer || !serverConfig)
    return
  // register api
  serverConfig.api && apiRegister(serverConfig.api, context)
  // add swagger
  useSwagger(context)
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
  // json-server
  useJsonServer(context)
}

export default function serverPlugin(): PluginType {
  return {
    name: 'server-plugin',
    apply: applayServer,
  }
}
