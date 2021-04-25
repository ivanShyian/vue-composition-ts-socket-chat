import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

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
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: {
      auth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
