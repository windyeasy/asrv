<script setup lang="ts">
import type { AsrvHistory } from '@/utils/send'
import request from '@/services'
import useHistoryStore from '@/store/history'
import { fmtDate } from '@/utils/format'
import { sendRequest } from '@/utils/send'

const historyList = ref<any[]>([])
request.get({
  url: '/asrv-history',
}).then((res) => {
  historyList.value = res
})
const router = useRouter()
function toDetail(data: AsrvHistory) {
  useHistoryStore().changeCurrent(data)
  router.push('/history-detail')
}

function send(info: AsrvHistory) {
  sendRequest(info)
}
</script>

<template>
  <div class="history pt-5 px-20">
    <header class="history pb-5">
      <div class="title text-lg theme-color font-bold">
        History
      </div>
    </header>
    <el-table :data="historyList" style="width: 100%">
      <el-table-column prop="Url" label="url">
        <template #default="scope">
          <el-link type="success" @click="toDetail(scope.row)">
            {{ scope.row.url }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="method" label="method" width="180" align="center" />
      <el-table-column prop="date" label="date" align="center">
        <template #default="scope">
          {{ fmtDate(scope.row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="scope">
          <el-button link type="success" size="small" @click="toDetail(scope.row)">
            Detail
          </el-button>
          <el-button link type="success" size="small" @click="send(scope.row)">
            Send
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
