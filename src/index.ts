import Koa from 'koa'
import cors from '@koa/cors'
import KoaRouter from '@koa/router'
import { bodyParser } from '@koa/bodyparser'
import chalk from 'chalk'
import Service from './service/index'

const PORT = 8080

const app = new Koa()
app.use(cors())
app.use(bodyParser())
const router = new KoaRouter()
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
router.get('/:name', async (ctx, next) => {
  const { name } = ctx.params
  ctx.payload = service.find(name)
  await next()
})

router.get('/:name/:id', async (ctx, next) => {
  const { name, id } = ctx.params
  ctx.payload = service.findById(name, id)
  await next()
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use((ctx) => {
  ctx.body = ctx.payload
})

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`
  console.log(`server: ${chalk.green(url)}`)
})
