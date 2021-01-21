import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    meta: {layout: 'main'},
    component: () => import('../views/Main.vue')
  },
  {
    path: '/a/:id',
    name: 'account',
    meta: {layout: 'main'},
    component: () => import('../views/Account.vue')
  },
  {
    path: '/m/:id',
    name: 'media',
    meta: {layout: 'main'},
    component: () => import('../views/Media.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    meta: {layout: 'main'},
    component: () => import('../views/Chat.vue')
  },
  {
    path: '/add-media',
    name: 'addMedia',
    meta: {layout: 'main'},
    component: () => import('../views/AddMedia.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    meta: {layout: 'empty'},
    component: () => import('../views/Auth.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
