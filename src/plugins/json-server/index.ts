import type { Context } from '../../app'
import Service from './service/index'

const db = {
  user: [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Jim' },
  ],
  post: [
    { id: 1, title: 'Post 1', userId: 1 },
    { id: 2, title: 'Post 2', userId: 2 },
    { id: 3, title: 'Post 3', userId: 3 },
  ],
}
const service = new Service(db)

export default function jsonServerPlugin(context: Context): void {
  const app = context.app
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
