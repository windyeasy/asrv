import type { App } from 'vue'
import { createPinia } from 'pinia'
import useHistoryStore from './history'

const pinia = createPinia()
function registerPinia(app: App<Element>) {
  app.use(pinia)
  const loginStore = useHistoryStore()
  loginStore.loadLocalCurrent()
}

export default registerPinia
