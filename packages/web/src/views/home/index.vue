<script lang="ts" setup>
import Request from '@/services/request'

const baseServerUrl = ref('')
if (import.meta.env.MODE === 'development') {
  baseServerUrl.value = import.meta.env.VITE_BASE_URL
}
else if (import.meta.env.MODE === 'production') {
  baseServerUrl.value = location.origin
}

const request = new Request({
  baseURL: baseServerUrl.value,
  timeout: 10000,
  interceptors: {

    responseSuccessFn: (res) => {
      return res.data
    },
  },
})

const jsonServerRoutes = ref<string[]>([])

request.get<string[]>({
  url: '/json-server-routes',
}).then((res) => {
  jsonServerRoutes.value = res
})
</script>

<template>
  <div class="wrapper mt-6">
    <div class="description text-size-lg ml-2em">
      A server-side tool that assists front-end development.
    </div>
    <main class="mt-10">
      <section class="flex py-2">
        <div class="title mr-2">
          API Swagger:
        </div>
        <div class="link">
          <a
            rel="noreferrer"
            :href="`${baseServerUrl}/api-swagger-doc`"
            target="_blank"
          >
            {{ baseServerUrl }}/api-swagger-doc
          </a>
        </div>
      </section>
      <!-- <section class="flex py-2">
        <div class="title mr-2">
          History:
        </div>
        <div class="link">
          <a
            rel="noreferrer"
            href="https://api.juejin.cn/swagger-ui/index.html"
            target="_blank"
            class="text-green"
          >
            https://api.juejin.cn/swagger-ui/index.html
          </a>
        </div>
      </section> -->
      <section class="json-server-routes">
        <div class="title">
          JSON-Server-Routes:
        </div>
        <div class="routes">
          <div v-for="route in jsonServerRoutes" :key="route" class="route">
            <a
              rel="noreferrer"
              :href="`${baseServerUrl}/${route}`"
              target="_blank"
            >
              {{ baseServerUrl }}/{{ route }}
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.description {
  color: var(--text-color);
}
main {
  font-size: 14px;

  .title {
    color: var(--text-color);
    font-size: 16px;
    font-weight:bold;
  }
   a {
    font-size: 16px;
    color: var(--a-color);
    text-decoration: none;

    &:hover {
      color: var(--a-hover-color);
    }
  }

  .json-server-routes {
    padding-top: 20px;
  }
  .routes {
    padding-left: 20px;
    .route {
      padding-top: 5px;
      font-size: 16px;
    }
  }
}
</style>
