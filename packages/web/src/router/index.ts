import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
    },
  ],
  history: createWebHashHistory(),
})
