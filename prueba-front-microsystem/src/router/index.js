
import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

import DefaultLayout from '@/layouts/default.vue'
import Dashboard from '@/pages/dashboard.vue'
import Pagos from '@/pages/pagos.vue'
import DetallePago from '@/pages/pagos/[id].vue'
import Login from '@/pages/login.vue'
import NotFound from '@/pages/404.vue'

const routes = [
  // Rutas públicas
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: '/dashboard',
        component: Dashboard,
        name: 'Dashboard'
      },
      {
        path: '/pagos',
        component: Pagos,
        name: 'Pagos'
      },
      {
        path: '/pagos/:id',
        component: DetallePago,
        name: 'DetallePago',
        props: true 
      },
    ]
  },
  
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound'
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && isAuthenticated) {
    next({ path: '/dashboard' })
  } else {
    next()
  }
})

export default router
