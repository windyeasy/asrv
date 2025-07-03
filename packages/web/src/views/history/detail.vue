<script setup lang="ts">
import VueJsonView from '@matpool/vue-json-view'
import request from '@/services'
import { type AsrvHistory, sendRequest } from '@/utils/send'

const route = useRoute()
const timestamp = route.params.timestamp

const detailData = ref<AsrvHistory | null>(null)
const isLoading = ref(true)
request.get<AsrvHistory>({
  url: `/asrv-history/${timestamp}`,

}).then((res) => {
  detailData.value = res
  isLoading.value = false
}).catch(() => {
  isLoading.value = false
})

const resultLoading = ref(false)
const result = ref<any | null>(null)
function send() {
  if (!detailData.value)
    return
  sendRequest(detailData.value!).then((res) => {
    result.value = res
  })
}
</script>

<template>
  <div v-loading="" class="history-detail p-10 pt-5">
    <header>
      <el-button size="large" type="success" @click="send()">
        Replay Send
      </el-button>
    </header>
    <main>
      <section>
        <div class="title text-lg font-bold theme-color pt-10">
          Request
        </div>
        <div class="content pt-2">
          <VueJsonView :src="detailData" />
        </div>
      </section>
    </main>
    <footer v-if="result" class="mt-4">
      <section v-loading="resultLoading">
        <div class="title text-lg font-bold theme-color mb-4">
          Result
        </div>
        <div class="content">
          <VueJsonView :src="result" />
        </div>
      </section>
    </footer>
  </div>
</template>
