import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ForgotView from '@/views/Auth/ForgotView.vue'
import { checkAuth, checkResetToken } from '@/utils/CheckFunc.ts'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: checkAuth,
    meta: { title: "Чаты" }
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: { title: "Войти в аккаунт" }
  },
  {
    path: '/forgot-password',
    name: 'ForgotView',
    component: ForgotView,
    meta: { title: "Забыли пароль?" }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
    meta: { title: "Регистрация" }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title as string || "Лайв"
  next()
})

export default router