<script lang="ts" setup>
const baseServerUrl = ref('')
if (import.meta.env.MODE === 'development') {
  baseServerUrl.value = 'http://localhost:9000'
}
else if (import.meta.env.MODE === 'production') {
  baseServerUrl.value = location.origin
}
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
            class=" text-green"
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
      
    </main>
  </div>
</template>

<style lang="scss" scoped>
.description {
  color: var(--text-sub-color);
}
main {
  font-size: 14px;

  .title {
    color: var(--text-sub-color);
  }
  .link a {
    text-decoration: none;

  }
}
</style>
