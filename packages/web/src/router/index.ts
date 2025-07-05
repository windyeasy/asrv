import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/home/index.vue'),
    },
    {
      path: '/history',
      component: () => import('@/views/history/index.vue'),
    },
    {
      path: '/history-detail/:id',
      component: () => import('@/views/history/detail.vue'),
    },
  ],
  history: createWebHashHistory(),
})
