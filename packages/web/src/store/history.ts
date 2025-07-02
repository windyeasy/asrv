import type { AsrvHistory } from '@/utils/send'
import { defineStore } from 'pinia'
import { localCache } from '@/utils/cache'

interface HistoryState {
  current: AsrvHistory | null
}

const useHistoryStore = defineStore('history', {
  state: (): HistoryState => ({
    current: null,
  }),
  actions: {
    changeCurrent(info: AsrvHistory) {
      this.current = info
      this.saveCurrentByLocal()
    },
    saveCurrentByLocal() {
      localCache.setCache('history-current', this.current)
    },
    loadLocalCurrent() {
      this.current = localCache.getCache('history-current')
    },
  },
})
export default useHistoryStore
