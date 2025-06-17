import type { AServerApp, Context } from '@/app'
import { type Data, isItem } from '@windyeasy/json-server'
import { type Adapter, Low } from 'lowdb'

import { AsrvService } from './service'

export type UseDataType<T = any> = () => [T, (value: T) => void]

export function bindRouter(app: AServerApp, service: AsrvService, prefix = ''): void {
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

  app.use(`${prefix}/:name`, (req, res) => {
    const { data } = res.locals
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

export async function addJonServer(context: Context, data: Data): Promise<void> {
  const app = context.app
  const asrvAdapter = new AsrvAdapter(data)
  const db = new Low(asrvAdapter, data)

  await db.read()
  // Create service
  const service = new AsrvService(db)

  // add use data
  context.server = {
    useData: () => [service.getData(), (data: Data) => service.setData(data)],
  }
  bindRouter(app, service)
}
