import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import ChatView from '@/views/ChatView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ForgotView from '@/views/Auth/ForgotView.vue'
import { checkAuth } from '@/utils/CheckFunc.ts'
import NotFoundView from '@/views/NotFoundView.vue'
import RecoveryView from '@/views/Auth/RecoveryView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/chat/:id?',
    name: 'ChatView',
    component: ChatView,
    beforeEnter: checkAuth,
    meta: { title: "Мои чаты" },
    props: true
  },

  // ? Авторизация
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    meta: { title: "Войти в аккаунт", hideSidebar: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotView',
    component: ForgotView,
    meta: { title: "Забыли пароль?", hideSidebar: true }
  },
  {
    path: '/register',
    name: 'RegisterView',
    component: RegisterView,
    meta: { title: "Регистрация", hideSidebar: true }
  },
  {
    path: '/recovery',
    name: 'RecoveryView',
    component: RecoveryView,
    meta: { title: "Восстановление доступа", hideSidebar: true },
  },

  // ? 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: "Не найдено", hideSidebar: true },
  },
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