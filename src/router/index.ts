import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router'
import store from '@/store/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Chats',
    alias: '/chats',
    component: () => import('../views/Chats.vue'),
    meta: {
      auth: true
    },
    children: [
      {
        path: '',
        name: 'ChatEmpty',
        component: () => import('../views/chats/ChatsEmpty.vue')
      },
      {
        path: '/chats/:userID',
        name: 'ChatBox',
        component: () => import('../views/chats/ChatsBox.vue'),
        meta: {
          auth: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      auth: false
    }
  },
  {
    path: '/register',
    name: 'Registration',
    component: () => import('../views/Registration.vue'),
    meta: {
      auth: false
    }
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authed = store.getters['auth/isAuth']
  const authRequired = to.meta.auth
  if (authRequired && !authed) {
    store.dispatch('auth/logoutAndGoToLoginPage')
    return next()
  }
  next()
})

export default router
