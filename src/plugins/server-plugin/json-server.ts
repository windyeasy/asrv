import type { Data } from './service'
import type { Context } from '@/types'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path, { extname } from 'node:path'
import process from 'node:process'
import { isItem } from '@windyeasy/json-server'
import { Observer } from '@windyeasy/json-server'
import chalk from 'chalk'
import { watch } from 'chokidar'
import JSON5 from 'json5'
import { type Adapter, Low } from 'lowdb'
import { DataFile, JSONFile } from 'lowdb/node'
import { resolveConfigPath } from '@/config'

import { AsrvService } from './service'

export function bindRouter(context: Context, service: AsrvService, prefix = ''): void {
  const app = context.app
  app.get(`${prefix}/:name`, (req, res, next) => {
    const { name = '' } = req.params
    const query = Object.fromEntries(
      Object.entries(req.query)
        .map(([key, value]) => {
          if (
            ['_start', '_end', '_limit', '_page', '_per_page'].includes(key)
            && typeof value === 'string'
          ) {
            return [key, Number.parseInt(value)]
          }
          else {
            return [key, value]
          }
        })
        .filter(([, value]) => !Number.isNaN(value)),
    )
    res.locals.data = service.find(name, query)
    next?.()
  })

  app.get(`${prefix}/:name/:id`, (req, res, next) => {
    const { name = '', id = '' } = req.params
    res.locals.data = service.findById(name, id, req.query)
    next?.()
  })

  app.post(`${prefix}/:name`, async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals.data = await service.create(name, req.body)
    }
    next?.()
  })

  app.put(`${prefix}/:name`, async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals.data = await service.update(name, req.body)
    }
    next?.()
  })

  app.put(`${prefix}/:name/:id`, async (req, res, next) => {
    const { name = '', id = '' } = req.params
    if (isItem(req.body)) {
      res.locals.data = await service.updateById(name, id, req.body)
    }
    next?.()
  })

  app.patch(`${prefix}/:name`, async (req, res, next) => {
    const { name = '' } = req.params
    if (isItem(req.body)) {
      res.locals.data = await service.patch(name, req.body)
    }
    next?.()
  })

  app.patch(`${prefix}/:name/:id`, async (req, res, next) => {
    const { name = '', id = '' } = req.params
    if (isItem(req.body)) {
      res.locals.data = await service.patchById(name, id, req.body)
    }
    next?.()
  })

  app.delete(`${prefix}/:name/:id`, async (req, res, next) => {
    const { name = '', id = '' } = req.params
    res.locals.data = await service.destroyById(
      name,
      id,
      req.query._dependent as string,
    )
    next?.()
  })

  app.use(`${prefix}/:name`, (req, res, next) => {
    const { data } = res.locals

    if (context.config.server?.jsonServerResponseInterceptor) {
      return context.config.server.jsonServerResponseInterceptor(req, res, next)
    }
    if (data === undefined) {
      res.sendStatus(404)
    }
    else {
      if (req.method === 'POST')
        res.status(201)
      res.json(data)
    }
  })
}

export class AsrvAdapter implements Adapter<Data> {
  constructor(private db: Data) {
  }

  async write(data: Data): Promise<void> {
    this.db = data
  }

  async read(): Promise<Data> {
    return this.db
  }
}

export async function addJonServer(context: Context, db: Low<Data>): Promise<void> {
  await db.read()
  // Create service
  const service = new AsrvService(db)
  if (context.server) {
    context.server.service = service
  }
  else {
    context.server = {
      service,
    }
  }

  bindRouter(context, service)
}

/**
 * 
 * test:
 *  1. static
 *     
 */
export function useJsonServer(context: Context): void {
  const serverConfig = context.config.server!
  const data = serverConfig.db
  console.log(data, 'test data')
  if (!serverConfig.dbFilePath && !data) {
    console.warn(chalk.yellow('[json-server] db is not defined'))
    return
  }
  // 处理使用静态文件和比使用静态文件
  let adapter: Adapter<Data> = new AsrvAdapter(data!)
  let dbFilePath = serverConfig.dbFilePath ? resolveConfigPath(serverConfig.dbFilePath) : serverConfig.dbFilePath
  if (serverConfig.mode === 'static') {
    // 没有传入文件手动生成
    if (!dbFilePath) {
      dbFilePath = path.join(process.cwd(), './asrv/data/db.json')

      // 判断目录不存在， 创建目录
      if (!existsSync(path.dirname(dbFilePath))) {
        mkdirSync(path.dirname(dbFilePath), { recursive: true })
      }
      // 文件存在，不创建
      if (!existsSync(dbFilePath))
        writeFileSync(dbFilePath, JSON.stringify(data || {}, null, 2))
    }
    // Handle empty string JSON file
    if (readFileSync(dbFilePath, 'utf-8').trim() === '') {
      writeFileSync(dbFilePath, '{}')
    }
    // 判断传入文件是否存在
    if (!existsSync(dbFilePath)) {
      console.log(chalk.yellow(`dbFile ${dbFilePath} not found`))
    }
    else {
      if (extname(dbFilePath) === '.json5') {
        adapter = new DataFile<Data>(dbFilePath, {
          parse: JSON5.parse,
          stringify: JSON5.stringify,
        })
      }
      else {
        adapter = new JSONFile<Data>(dbFilePath)
      }
    }
  }
  let writing = false
  const observer = new Observer(adapter)
  observer.onWriteStart = () => {
    writing = true
  }
  observer.onWriteEnd = () => {
    writing = false
  }

  const db = new Low(observer, data!)
  if (dbFilePath) {
    watch(dbFilePath).on('change', () => {
      if (!writing) {
        db.read().catch((e) => {
          if (e instanceof SyntaxError) {
            return console.log(
              chalk.red(['', `Error parsing ${dbFilePath}`, e.message].join('\n')),
            )
          }
          console.log(e)
        })
      }
    })
  }
  addJonServer(context, db)
}
