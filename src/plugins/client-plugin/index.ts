import type { PluginType } from '@/plugin-deriver'
import type { Context } from '@/types'
import path from 'node:path'
import { __dirname } from '@/config'
import express from 'express'

export default function clientPlugin(): PluginType {
  return {
    name: 'client-plugin',
    apply: (context: Context) => {
      const app = context.app
      const staticPath = path.resolve(__dirname, '../packages/web/dist')
      // 挂载静态目录
      app.use(express.static(staticPath))
    },
  }
}
