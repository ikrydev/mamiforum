import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "notfound" */ '@/views/PageNotFound.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/PageHome.vue')
  },
  {
    path: '/thread/create/:id',
    name: 'ThreadCreate',
    props: true,
    component: () => import(/* webpackChunkName: "thread-create" */ '@/views/PageThreadCreate.vue')
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    props: true,
    component: () => import(/* webpackChunkName: "thread-show" */ '@/views/PageThreadShow.vue')
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    props: true,
    component: () => import(/* webpackChunkName: "thread-edit" */ '@/views/PageThreadEdit.vue')
  },
  {
    path: '/forum/:id',
    name: 'Forum',
    props: true,
    component: () => import(/* webpackChunkName: "forum" */ '@/views/PageForum.vue')
  },
  {
    path: '/category/:id',
    name: 'Category',
    props: true,
    component: () => import(/* webpackChunkName: "category" */ '@/views/PageCategory.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  },
  {
    path: '/profile/edit',
    name: 'ProfileEdit',
    props: { edit: true },
    component: () => import(/* webpackChunkName: "profile" */ '@/views/PageProfile.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '@/views/PageRegister.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
