import type { PluginType } from '@/plugin-deriver'
import type { Context } from '@/types'
import path from 'node:path'
import process from 'node:process'
import express from 'express'

export default function clientPlugin(): PluginType {
  return {
    name: 'client-plugin',
    apply: (context: Context) => {
      const app = context.app
      const staticPath = path.resolve(process.cwd(), 'packages/web/dist')
      // 挂载静态目录
      app.use(express.static(staticPath))
    },
  }
}
