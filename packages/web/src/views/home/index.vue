<script lang="ts" setup>
import request from '@/services'
import { BASE_URL } from '@/services/config'

const jsonServerRoutes = ref<string[]>([])
const isLoading = ref(true)
request.get<string[]>({
  url: '/json-server-routes',
}).then((res) => {
  jsonServerRoutes.value = res
  isLoading.value = false
}).catch(() => {
  isLoading.value = false
})

function toRoute(route: string) {
  window.open(`${BASE_URL}/${route}`)
}
</script>

<template>
  <div class="wrapper mt-6">
    <div class="description  text-sub-color text-size-lg ml-2em pt-3">
      A server-side tool that assists front-end development.
    </div>
    <main class="mt-3">
      <section class="json-server-routes">
        <div class="title text-l theme-color">
          JSON Server Routes
        </div>
        <div v-loading="" class="routes">
          <div v-for="route in jsonServerRoutes" :key="route" class="route">
            <el-button
              type="success"
              plain
              :href="`${BASE_URL}/${route}`"
              class="theme-color"
              @click="toRoute(route)"
            >
              {{ BASE_URL }}/{{ route }}
            </el-button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
main {
  font-size: 14px;
  .title {
    font-size: 20px;
    font-weight:bold;
  }
   a {
    font-size: 16px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  .json-server-routes {
    padding-top: 20px;
  }
  .routes {
    .route {
      padding-top: 20px;
      a {
         font-size: 16px;
      }
    }
  }
}
</style>
