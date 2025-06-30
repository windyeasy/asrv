<script setup lang="ts">
const { toggleDark } = useTheme()
</script>

<template>
  <div class="main-nav flex wrapper justify-between py-4 items-center">
    <div class="logo text-2xl font-bold theme-color">
      asrv
    </div>
    <div class="nav-list flex">
      <a
        href="https://github.com/windyeasy/asrv"
        icon-btn
        class="i-carbon-logo-github text-lg"
        rel="noreferrer"
      />
      <a
        rel="noreferrer"
        icon-btn
        class="i-carbon-sun dark:i-carbon-moon toggle-theme text-lg ml-2"
        @click="toggleDark()"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-list {
  a {
    color: var(--icon-a-color);
    cursor: pointer;
  }
  a:hover {
    color: var(--icon-a-hover-color);
  }
}
</style>
