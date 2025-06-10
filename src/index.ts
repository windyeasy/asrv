import Koa from 'koa'
import cors from '@koa/cors'
import KoaRouter from '@koa/router'
import { bodyParser } from '@koa/bodyparser'

const PORT = 3000

const app = new Koa()
app.use(cors())
app.use(bodyParser())
const router = new KoaRouter()

router.get('/', async (ctx) => {
  ctx.body = 'Hello World'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
