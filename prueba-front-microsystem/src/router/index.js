/**
 * router/index.js
 *
 * Configuración simplificada de rutas
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/services/auth'

// Importar layouts y páginas
import DefaultLayout from '@/layouts/default.vue'
import Dashboard from '@/pages/dashboard.vue'
import Pagos from '@/pages/pagos.vue'
import DetallePago from '@/pages/pagos/[id].vue'
import Login from '@/pages/login.vue'
import NotFound from '@/pages/404.vue'

// Definir rutas de manera simple y directa
const routes = [
  // Rutas públicas
  {
    path: '/login',
    component: Login
  },
  
  // Rutas protegidas con layout
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
        props: true // Esto permite pasar el id como prop al componente
      },
    ]
  },
  
  // Ruta para 404 - debe estar al final
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    name: 'NotFound'
  }
]

// Crear router con configuración simple
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

// Navegación guard para verificar autenticación
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
