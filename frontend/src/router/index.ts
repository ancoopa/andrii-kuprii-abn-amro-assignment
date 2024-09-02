import { createRouter, createWebHistory } from 'vue-router'
import MainDashboard from '@/views/MainDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainDashboard
    },
    {
      path: '/show/:id',
      name: 'show',
      component: () => import('../views/TvShowDetails.vue')
    }
  ]
})

export default router
