<script setup lang="ts">
import { BASE_URL } from '@/services/config'

const { toggleDark } = useTheme()
</script>

<template>
  <div class="main-nav">
    <div class="nav-wrapper  flex wrapper justify-between py-4 items-center">
      <div class="logo text-2xl font-bold theme-color">
        <router-link to="/" class="theme-color">
          ASRV
        </router-link>
      </div>
      <div class="nav-list flex items-center">
        <a
          :href="`${BASE_URL}/api-swagger-doc`"
          title="API Swagger"
          class="text mr-4 text-sm"
          rel="noreferrer"
          target="_blank"
        >
          API Swagger
        </a>
        <router-link
          to="/history"
          class="text mr-4 text-sm"
          rel="noreferrer"
          title="History"
        >
          History
        </router-link>
        <a
          href="https://github.com/windyeasy/asrv"
          icon-btn
          class="i-carbon-logo-github text-lg"
          rel="noreferrer"
          title="GitHub"
        />
        <a
          rel="noreferrer"
          icon-btn
          class="i-carbon-sun dark:i-carbon-moon toggle-theme text-lg ml-2"
          title="Toggle theme"
          @click="toggleDark()"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  a {
    text-decoration: none;

  }
}
.nav-list {
  a {
    color: var(--a-color);
    text-decoration: none;
    line-height: 1;
    &.text {
      margin-top: -2px;
    }
  }
  a:hover {
    color: var(--icon-a-hover-color);
  }
}
</style>
