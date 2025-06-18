import type { PluginType } from '@/plugin-deriver'
import type { Context } from '@/types'

export default function clientPlugin(): PluginType {
  return {
    name: 'client-plugin',
    apply: (context: Context) => {
      context.app.get('/', (req, res, next) => {
        res.send('Hello World!')
        return next()
      })
    },
  }
}
